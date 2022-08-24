import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { authenticate } from "~/auth.server";

export async function loader({ request }: LoaderArgs) {
  const user = await authenticate(request, {});

  return json({
    authenticated: !!user,
  });
}

export default function Index() {
  const { authenticated } = useLoaderData<typeof loader>();

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h1 className="text-xl">Hello, World!</h1>
      <div className="pt-2 text-xs">
        {authenticated ? (
          <Link to="/dashboard">Go to the Dashboard</Link>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </div>
  );
}
