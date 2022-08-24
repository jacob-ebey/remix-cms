import * as React from "react";
import type { To } from "react-router-dom";
import {
  Link,
  Outlet,
  useLocation,
  useMatches,
  useSearchParams,
} from "@remix-run/react";
import clsx from "clsx";

import spritesHref from "~/sprites.svg";

interface DashboardMenuProps {
  children: React.ReactNode;
  title: React.ReactNode;
  openIndicator: string;
}

export function DashboardMenu({
  children,
  title,
  openIndicator,
}: DashboardMenuProps) {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const menuOpen = searchParams.get("open") === openIndicator;

  const closeMenuLocation = React.useMemo<To>(() => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete("open");
    return {
      pathname: location.pathname,
      search: `?${searchParams.toString()}`,
    };
  }, [location]);

  return (
    <nav
      className={clsx(
        "z-30 xl:block w-full lg:w-96 xl:w-64 border-r bg-white",
        menuOpen ? "absolute xl:relative" : "hidden"
      )}
    >
      <section className="flex flex-col flex-1 w-full lg:max-h-screen min-h-screen lg:overflow-y-auto">
        <header className="sticky top-0 border-b lg:border-none z-10 px-2.5 xl:px-5 bg-white">
          <div className="h-16 flex flex-row items-center gap-4 px-3">
            <h1 className="flex flex-1 flex-row items-center gap-4 text-lg">
              <Link
                className="w-full flex flex-row items-center gap-4"
                to="/dashboard"
              >
                {title}
              </Link>
            </h1>
            <Link
              className="flex items-center justify-center w-8 h-8 lg:w-6 lg:h-6 xl:hidden rounded-full hover:bg-gray-100 focus:bg-gray-100"
              to={closeMenuLocation}
            >
              <svg
                aria-hidden="true"
                role="img"
                className="w-4 h-4 lg:w-3 lg:h-3"
              >
                <use href={`${spritesHref}#close`} />
              </svg>
            </Link>
          </div>
        </header>
        {children}
      </section>
    </nav>
  );
}

interface DashboardListLayoutProps {
  children: React.ReactNode;
  title: React.ReactNode;
  openIndicator: string;
  routeId: string;
  header?: React.ReactNode;
}

export function DashboardListLayout({
  children,
  title,
  openIndicator,
  routeId,
  header,
}: DashboardListLayoutProps) {
  const location = useLocation();
  const matches = useMatches();

  const openMenuLocation = React.useMemo<To>(() => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("open", openIndicator);
    return {
      pathname: location.pathname,
      search: `?${searchParams.toString()}`,
    };
  }, [location, openIndicator]);

  const showRouteAsCritical = React.useMemo(() => {
    const selfIndex = matches.findIndex(({ id }) => id === routeId);
    const nextMatch = matches[selfIndex + 1];
    return (
      nextMatch?.id.endsWith("index") || nextMatch?.id.endsWith("$") || false
    );
  }, [matches, routeId]);

  return (
    <main className="flex-1">
      <div className="flex flex-row">
        <div
          className={clsx(
            "lg:border-r w-full lg:w-96",
            !showRouteAsCritical && "hidden lg:block"
          )}
        >
          <section className="flex flex-col w-full lg:max-h-screen min-h-screen lg:overflow-y-auto">
            <header className="sticky top-0 border-b lg:border-none z-10 px-2.5 xl:px-5 bg-white">
              <div className="h-16 flex flex-row items-center gap-4 px-3">
                <Link
                  className="flex items-center justify-center w-8 h-8 lg:w-6 lg:h-6 xl:hidden rounded-full hover:bg-gray-100 focus:bg-gray-100"
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
                <div className="flex-1 line-clamp-1 text-center lg:text-left">
                  {title}
                </div>
                {header}
              </div>
            </header>
            <div className="flex flex-col flex-1 px-2.5 xl:px-5">
              <div className="flex flex-col flex-1 py-2">
                <React.Suspense
                  fallback={
                    <div
                      role="status"
                      className="flex items-center justify-center flex-1"
                    >
                      <svg
                        aria-hidden="true"
                        className="inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  }
                >
                  {children}
                </React.Suspense>
              </div>
            </div>
          </section>
        </div>
        <Outlet />
      </div>
    </main>
  );
}

export interface DashboardListItemProps {
  to: To;
  title: string;
  description?: string;
  header?: React.ReactNode;
  selected?: boolean;
}

export function DashboardListItem({
  to,
  title,
  description,
  header,
  selected,
}: DashboardListItemProps) {
  return (
    <article className="py-1">
      <Link
        className={clsx(
          "block no-underline hover:bg-gray-100 focus:bg-gray-100",
          selected && "bg-gray-100"
        )}
        title={title}
        to={to}
      >
        <section className="px-2.5 py-2.5 text-sm">
          <div className="text-xs pb-1.5 flex flex-row gap-4">{header}</div>

          <h2 className="break-words line-clamp-2">{title}</h2>
          {description && (
            <p className="line-clamp-1 break-all">{description}</p>
          )}
        </section>
      </Link>
    </article>
  );
}

interface DashboardDetailLayoutProps {
  children: React.ReactNode;
  title?: React.ReactNode;
}

export function DashboardDetailLayout({
  children,
  title,
}: DashboardDetailLayoutProps) {
  return (
    <main className="flex-1">
      <div className="flex flex-row">
        <div className="w-full">
          <section className="flex flex-col flex-1 w-full lg:max-h-screen min-h-screen lg:overflow-y-auto">
            <header className="sticky top-0 border-b lg:border-none z-10 px-2.5 xl:px-5 bg-white">
              <div className="h-16 flex flex-row items-center gap-4 px-3">
                <Link
                  className="flex items-center justify-center w-8 h-8 lg:w-6 lg:h-6"
                  to=".."
                  aria-label="Go back"
                >
                  <svg
                    aria-hidden="true"
                    role="img"
                    className="w-4 h-4 lg:w-3 lg:h-3"
                  >
                    <use href={`${spritesHref}#back`} />
                  </svg>
                </Link>
                {title && (
                  <h1 className="flex-1 line-clamp-1 text-center lg:text-left">
                    {title}
                  </h1>
                )}
              </div>
            </header>
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
