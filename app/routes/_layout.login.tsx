import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { makeDomainFunction } from "remix-domains";
import { Form, formAction } from "remix-forms";
import { z } from "zod";

import type { AuthenticatedUser } from "~/auth.server";
import { authenticate, setUser } from "~/auth.server";
import { sessionStorage } from "~/session.server";
import { findOrCreateUser } from "~/models.server";

export async function loader({ request }: LoaderArgs) {
  return authenticate(request, { successRedirect: "/dashboard" });
}

export default function Login() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <h1 className="text-xl">Login</h1>
      <Form method="post" schema={schema} className="w-full max-w-sm">
        {({ Errors, Field, Button, register }) => (
          <>
            <Field
              name="username"
              label="Username"
              type="t ext"
              autoCapitalize="off"
            >
              {({ Label, Errors }) => (
                <>
                  <Label className="block" />
                  <input
                    {...register("username")}
                    autoComplete="username"
                    className="px-2.5 py-2 w-full border"
                  />
                  <Errors />
                </>
              )}
            </Field>
            <Field
              name="password"
              label="Password"
              type="password"
              className="mt-4"
            >
              {({ Label, Errors }) => (
                <>
                  <Label className="block" />
                  <input
                    {...register("password")}
                    autoComplete="current-password"
                    className="px-2.5 py-2 w-full border"
                  />
                  <Errors />
                </>
              )}
            </Field>
            <Errors />
            <Button className="mt-4 px-2.5 py-2 border">Login / Signup</Button>
          </>
        )}
      </Form>
    </div>
  );
}

const schema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(6),
});

export async function action({ request }: ActionArgs) {
  let user: AuthenticatedUser;
  return formAction({
    request,
    schema,
    mutation: makeDomainFunction(schema)(async ({ password, username }) => {
      const foundUser = await findOrCreateUser({ username, password });
      if (!foundUser) throw new Error("Invalid username or password.");
      user = foundUser;
      return foundUser;
    }),
    // This is to get around the lack of ability to set a cookie from a domain func.
    beforeSuccess: async (request) => {
      const session = await sessionStorage.getSession(
        request.headers.get("Cookie")
      );
      setUser(session, user);

      return redirect("/dashboard", {
        headers: {
          "Set-Cookie": await sessionStorage.commitSession(session),
        },
      });
    },
  });
}
