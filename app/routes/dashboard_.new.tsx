import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import type { ShouldReloadFunction } from "@remix-run/react";
import { makeDomainFunction } from "remix-domains";
import { Form, formAction } from "remix-forms";
import { z } from "zod";

import { authenticate } from "~/auth.server";
import { DashboardDetailLayout } from "~/components/dashboard";
import { createProject } from "~/models.server";

export async function loader({ request }: LoaderArgs) {
  await authenticate(request);
  return null;
}

export const unstable_shouldReload: ShouldReloadFunction = ({
  submission,
  prevUrl,
  url,
}) => {
  if (submission) {
    return true;
  }

  return prevUrl.pathname !== url.pathname;
};

export default function DashboardTest() {
  return (
    <DashboardDetailLayout title="New Project">
      <div className="p-5">
        <Form method="post" schema={schema}>
          {({ Errors, Field, Button, register }) => (
            <>
              <Field name="name" label="Name" type="text">
                {({ Label, Errors }) => (
                  <>
                    <Label className="block" />
                    <input
                      {...register("name")}
                      autoComplete="off"
                      autoCapitalize="yes"
                      className="px-2.5 py-2 w-full border"
                    />
                    <Errors />
                  </>
                )}
              </Field>
              <Field
                name="description"
                label="Description"
                type="text"
                className="mt-4"
              >
                {({ Label, Errors }) => (
                  <>
                    <Label className="block" />
                    <input
                      {...register("description")}
                      autoComplete="off"
                      className="px-2.5 py-2 w-full border"
                    />
                    <Errors />
                  </>
                )}
              </Field>

              <Errors />
              <Button type="submit" className="mt-4 px-2.5 py-2 border">
                Create
              </Button>
            </>
          )}
        </Form>
      </div>
    </DashboardDetailLayout>
  );
}

const schema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().optional(),
});

export async function action({ request }: ActionArgs) {
  const user = await authenticate(request);

  return formAction({
    request,
    schema,
    successPath: (data: { id: string }) => `/dashboard/${data.id}`,
    mutation: makeDomainFunction(schema)(async (input) => {
      const project = await createProject({
        userId: user.id,
        name: input.name,
        description: input.description,
      });

      return { id: project.id };
    }),
  });
}
