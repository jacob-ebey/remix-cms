import * as React from "react";
import type { ShouldReloadFunction } from "@remix-run/react";
import { useLocation, useOutletContext } from "@remix-run/react";
import { Link } from "@remix-run/react";
import type { To } from "react-router-dom";

import spritesHref from "~/sprites.svg";

export const unstable_shouldReload: ShouldReloadFunction = () => {
  return false;
};

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const openMenuLocation = React.useMemo<To>(() => {
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
                  Projects
                </h1>
                <Link
                  className="flex items-center justify-center w-8 h-8 lg:w-6 lg:h-6 rounded-full hover:bg-gray-100 focus:bg-gray-100"
                  to="new"
                  title="Create a new project"
                >
                  <svg
                    aria-hidden="true"
                    role="img"
                    className="w-4 h-4 lg:w-3 lg:h-3"
                  >
                    <use href={`${spritesHref}#add`} />
                  </svg>
                </Link>
              </div>
            </header>
            <div className="flex flex-col flex-1 px-2.5 xl:px-5">
              <div className="flex flex-col flex-1 py-2">{children}</div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function DashboardIndex() {
  const menuContents = useOutletContext() as any;

  return (
    <Layout>
      <div className="hide-inverse flex flex-1 flex-col">{menuContents}</div>
    </Layout>
  );
}
