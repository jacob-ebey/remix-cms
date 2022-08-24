import type { LoaderArgs } from "@remix-run/node";
import { defer } from "@remix-run/node";
import type { ShouldReloadFunction } from "@remix-run/react";
import {
  Await,
  Link,
  useCatch,
  useLoaderData,
  useParams,
} from "@remix-run/react";

import { authenticate } from "~/auth.server";
import { DashboardListLayout, DashboardListItem } from "~/components/dashboard";
import { getModelsForProject } from "~/models.server";

import spritesHref from "~/sprites.svg";

import { Layout } from "./dashboard._menu.$projectId.index";

export async function loader({ request, params }: LoaderArgs) {
  const user = await authenticate(request);

  const modelsPromise = getModelsForProject({
    projectId: params.projectId!,
    userId: user.id,
  });

  return defer({
    models: modelsPromise,
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
    <Layout>
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-xl">{status}</h1>
        <div className="pt-2 text-xs">
          <Link to=".">Go to the project models</Link>
        </div>
      </div>
    </Layout>
  );
}

export default function ModelsLayout() {
  const { models } = useLoaderData<typeof loader>();
  const { modelId } = useParams();

  return (
    <DashboardListLayout
      routeId="routes/dashboard._menu.$projectId.models"
      openIndicator="menu"
      title="Models"
      header={
        <>
          <Link
            className="flex items-center justify-center w-8 h-8 lg:w-6 lg:h-6 rounded-full hover:bg-gray-100 focus:bg-gray-100"
            to="new"
            title="Create a new model"
          >
            <svg
              aria-hidden="true"
              role="img"
              className="w-4 h-4 lg:w-3 lg:h-3"
            >
              <use href={`${spritesHref}#add`} />
            </svg>
          </Link>
        </>
      }
    >
      <Await resolve={models}>
        {(models) =>
          models.map(({ id, slug, name, description }) => (
            <DashboardListItem
              key={id}
              to={id}
              title={name}
              description={description}
              header={slug}
              selected={id === modelId}
            />
          ))
        }
      </Await>
    </DashboardListLayout>
  );
}
