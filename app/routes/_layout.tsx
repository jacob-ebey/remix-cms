import { Link, Outlet } from "@remix-run/react";

import * as appConfig from "~/app.config";

export default function Layout() {
  return (
    <main className="flex-1">
      <div className="flex flex-row">
        <div className="w-full">
          <section className="flex flex-col w-full lg:max-h-screen min-h-screen lg:overflow-y-auto">
            <header className="border-b lg:border-none z-10 px-2.5 xl:px-5 bg-white">
              <div className="h-16 flex flex-row items-center gap-4 px-3">
                <h1 className="flex-1 line-clamp-1 text-center lg:text-left">
                  <Link to="/">{appConfig.appName}</Link>
                </h1>
              </div>
            </header>
            <Outlet />
          </section>
        </div>
      </div>
    </main>
  );
}
