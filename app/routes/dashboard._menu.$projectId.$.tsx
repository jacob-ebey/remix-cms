import * as React from "react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldReloadFunction } from "@remix-run/react";
import { Link, useCatch, useLocation } from "@remix-run/react";

import { authenticate } from "~/auth.server";

import spritesHref from "~/sprites.svg";

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
            <Link to=".">Go to the project</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardIndex() {
  const location = useLocation();

  const openMenuLocation = React.useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("open", "menu");
    return {
      pathname: location.pathname,
      search: `?${searchParams.toString()}`,
    };
  }, [location]);

  return (
    <main className="flex-1">
      <div className="flex flex-row">
        <div className="w-full">
          <section className="flex flex-col w-full lg:max-h-screen min-h-screen lg:overflow-y-auto">
            <header className="border-b lg:border-none z-10 px-2.5 xl:px-5 bg-white">
              <div className="h-16 flex flex-row items-center gap-4 px-3">
                <Link
                  className="flex items-center justify-center w-8 h-8 lg:w-6 lg:h-6 xl:hidden"
                  to={openMenuLocation}
                >
                  <svg
                    aria-hidden="true"
                    role="img"
                    className="w-4 h-4 lg:w-3 lg:h-3"
                  >
                    <use href={`${spritesHref}#menu`} />
                  </svg>
                </Link>
                <h1 className="flex-1 line-clamp-1 text-center lg:text-left">
                  <Link to=".">Dashboard</Link>
                </h1>
              </div>
            </header>
            <div className="flex-1">
              <div className="min-h-screen w-full flex flex-col">
                <div className="flex-1 flex flex-col items-center justify-center">
                  <h1 className="text-xl">404</h1>
                  <div className="pt-2 text-xs">
                    <Link to=".">Go to the project</Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
