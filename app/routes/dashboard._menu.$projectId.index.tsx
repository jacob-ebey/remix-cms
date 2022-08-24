import * as React from "react";
import { useLocation, useOutletContext } from "@remix-run/react";
import { Link } from "@remix-run/react";
import type { To } from "react-router-dom";

import spritesHref from "~/sprites.svg";

export function Layout({ children }: { children: React.ReactNode }) {
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
                  Dashboard
                </h1>
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

  return <Layout>{menuContents}</Layout>;
}
