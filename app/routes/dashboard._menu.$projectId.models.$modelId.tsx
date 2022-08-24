import * as React from "react";
import type { LoaderArgs } from "@remix-run/node";
import { defer, json } from "@remix-run/node";
import type { ShouldReloadFunction } from "@remix-run/react";
import { Await, Link, Outlet, useLoaderData } from "@remix-run/react";
import { Form } from "remix-forms";
import { z } from "zod";
import clsx from "clsx";

import { authenticate } from "~/auth.server";
import { DashboardDetailLayout } from "~/components/dashboard";
import { getModelOverview, getFieldsForModel } from "~/models.server";

import spritesHref from "~/sprites.svg";

export async function loader({ request, params }: LoaderArgs) {
  const user = await authenticate(request);

  const model = await getModelOverview({
    modelId: params.modelId!,
    userId: user.id,
  });

  const fieldsPromise = getFieldsForModel({
    modelId: params.modelId!,
    userId: user.id,
  });

  if (!model) {
    throw json(null, 404);
  }

  return defer({ model, fields: fieldsPromise });
}

export const unstable_shouldReload: ShouldReloadFunction = ({
  submission,
  prevUrl,
  url,
}) => {
  if (submission) {
    return true;
  }

  return prevUrl.pathname !== url.pathname;
};

export default function DashboardTest() {
  const { model, fields } = useLoaderData<typeof loader>();

  return (
    <DashboardDetailLayout>
      <div className="p-5 flex flex-col flex-1">
        <Form method="post" schema={schema} key={model.id}>
          {({ control, Errors, Field, Button, register, formState }) => (
            <>
              <Field name="name" label="Model Name" type="text" autoFocus>
                {({ Label, Errors }) => (
                  <>
                    <Label className="block" />
                    <input
                      {...register("name")}
                      autoComplete="off"
                      defaultValue={model.name}
                      key={model.name}
                      className="px-2.5 py-2 w-full border"
                    />
                    <Errors />
                  </>
                )}
              </Field>
              <Field name="slug" label="Slug" type="text" className="mt-4">
                {({ Label, Errors }) => (
                  <>
                    <Label className="block" />
                    <input
                      {...register("slug")}
                      autoComplete="off"
                      autoCapitalize="off"
                      defaultValue={model.slug}
                      key={model.slug}
                      className="px-2.5 py-2 w-full border"
                    />
                    <Errors />
                  </>
                )}
              </Field>
              <Errors />
              <Button type="submit" className="mt-4 px-2.5 py-2 border">
                Update
              </Button>
            </>
          )}
        </Form>

        <p className="flex mt-8">
          <span className="flex-1">Fields </span>
          <button
            className="inline-flex items-center justify-center w-8 h-8 lg:w-6 lg:h-6"
            title="Add field"
            type="button"
          >
            <svg
              aria-hidden="true"
              role="img"
              className="w-4 h-4 lg:w-3 lg:h-3"
            >
              <use href={`${spritesHref}#add`} />
            </svg>
          </button>
        </p>
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
          <Await resolve={fields}>
            {(fields) => (
              <ul className="mt-4">
                {fields.map(
                  ({ id, name, array, required, type, typeReferenceName }) => (
                    <li key={id} className="py-1">
                      <Link
                        className={clsx(
                          "block no-underline hover:bg-gray-100 focus:bg-gray-100",
                          false && "bg-gray-100"
                        )}
                        title={name}
                        to={`field/${id}`}
                      >
                        <section className="px-2.5 py-2.5 text-sm">
                          <div className="text-xs pb-1.5 flex flex-row gap-4">
                            {required ? "required" : "optional"}
                          </div>

                          <h2 className="break-words line-clamp-2">{name}</h2>
                          {typeReferenceName && (
                            <p className="line-clamp-1 break-all">
                              {typeReferenceName || type}
                              {array && "[]"}
                            </p>
                          )}
                        </section>
                      </Link>
                    </li>
                  )
                )}
              </ul>
            )}
          </Await>
        </React.Suspense>
      </div>
      <Outlet />
    </DashboardDetailLayout>
  );
}

const schema = z.object({
  name: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  description: z.string().trim().optional(),
});
