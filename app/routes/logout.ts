import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { sessionStorage } from "~/session.server";

export function loader() {
  return redirect("/login");
}

export async function action({ request }: ActionArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export default () => null;
