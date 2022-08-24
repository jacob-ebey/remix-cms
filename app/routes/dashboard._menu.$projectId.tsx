import * as React from "react";
import type { LoaderArgs } from "@remix-run/node";
import { defer, json } from "@remix-run/node";
import type { ShouldReloadFunction } from "@remix-run/react";
import { Await, Link, Outlet, useCatch, useLoaderData } from "@remix-run/react";

import * as appConfig from "~/app.config";
import { authenticate } from "~/auth.server";
import { DashboardMenu } from "~/components/dashboard";
import { countContent, countModels, projectExists } from "~/models.server";

import spritesHref from "~/sprites.svg";

export async function loader({ request, params }: LoaderArgs) {
  const user = await authenticate(request);

  if (
    !(await projectExists({ projectId: params.projectId!, userId: user.id }))
  ) {
    throw json(null, 404);
  }

  const contentCountPromise = countContent({
    projectId: params.projectId!,
    userId: user.id,
  });
  const modelsCountPromise = countModels({
    projectId: params.projectId!,
    userId: user.id,
  });

  return defer({
    contentCount: contentCountPromise,
    modelsCount: modelsCountPromise,
  });
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

export default function DashboardMenuLayout() {
  const { contentCount, modelsCount } = useLoaderData<typeof loader>();

  const menuContents = (
    <ul className="space-y-1">
      <li>
        <Link
          className="px-3 py-1.5 flex items-center gap-4 transition-colors group hover:bg-gray-100 focus:bg-gray-100"
          to="models"
        >
          <svg aria-hidden="true" role="img" className="w-4 h-4">
            <use href={`${spritesHref}#menu`} />
          </svg>{" "}
          <div className="flex-1">Models</div>
          <React.Suspense>
            <Await resolve={modelsCount}>
              {(count) => <span className="px-1 py-0.5 text-xs"> {count}</span>}
            </Await>
          </React.Suspense>
        </Link>
      </li>
      <li>
        <Link
          className="px-3 py-1.5 flex items-center gap-4 transition-colors group hover:bg-gray-100 focus:bg-gray-100"
          to="content"
        >
          <svg aria-hidden="true" role="img" className="w-4 h-4">
            <use href={`${spritesHref}#menu`} />
          </svg>{" "}
          <div className="flex-1">Content</div>
          <React.Suspense>
            <Await resolve={contentCount}>
              {(count) => <span className="px-1 py-0.5 text-xs"> {count}</span>}
            </Await>
          </React.Suspense>
        </Link>
      </li>
    </ul>
  );

  return (
    <>
      <DashboardMenu openIndicator="menu" title={appConfig.appName}>
        <div className="flex flex-col flex-1 px-2.5 xl:px-5">
          <div className="flex flex-col flex-1 py-2">
            <div className="lg:flex-1 divide-y">
              <div className="text-sm">
                <div className="sticky top-16 py-2">
                  <div className="flex flex-row items-center px-3 py-1.5 gap-4">
                    <div className="flex-1 line-clamp-1">Project</div>
                  </div>
                </div>
                <div className="pb-4">{menuContents}</div>
              </div>
            </div>
            <div className="border-t">
              <div className="text-sm">
                <div className="py-4">
                  <ul className="space-y-1">
                    <li>
                      <Link
                        className="px-3 py-1.5 flex items-center gap-4 transition-colors hover:bg-gray-100 focus:bg-gray-100"
                        to="/docs"
                      >
                        <svg aria-hidden="true" role="img" className="w-4 h-4">
                          <use href={`${spritesHref}#menu`} />
                        </svg>{" "}
                        Docs
                      </Link>
                    </li>
                    <li>
                      <button
                        className="px-3 py-1.5 flex w-full items-center gap-4 transition-colors hover:bg-gray-100 focus:bg-gray-100"
                        type="submit"
                        form="logout-form"
                      >
                        <svg aria-hidden="true" role="img" className="w-4 h-4">
                          <use href={`${spritesHref}#menu`} />
                        </svg>{" "}
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardMenu>
      <Outlet context={menuContents} />
    </>
  );
}
