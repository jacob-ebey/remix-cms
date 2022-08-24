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
              <div className="flex flex-col flex-1 py-2">{children}</div>
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
