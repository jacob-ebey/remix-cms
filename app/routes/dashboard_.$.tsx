import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldReloadFunction } from "@remix-run/react";
import { Link, useCatch } from "@remix-run/react";

import { authenticate } from "~/auth.server";

export async function loader({ request }: LoaderArgs) {
  await authenticate(request);
  return json(null, 404);
}

export const unstable_shouldReload: ShouldReloadFunction = ({ submission }) => {
  if (submission) {
    return true;
  }

  return false;
};

export function CatchBoundary() {
  const { status } = useCatch();

  return (
    <div className="flex-1">
      <div className="min-h-screen w-full flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-xl">{status}</h1>
          <div className="pt-2 text-xs">
            <Link to="/dashboard">Go to the dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardIndex() {
  return (
    <div className="flex-1 hidden lg:block">
      <div className="min-h-screen w-full flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-xl">404</h1>
          <div className="pt-2 text-xs">
            <Link to="/dashboard">Go to the dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
