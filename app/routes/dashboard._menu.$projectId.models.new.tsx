import * as React from "react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import type { ShouldReloadFunction } from "@remix-run/react";
import { useActionData } from "@remix-run/react";
import { InputError, InputErrors, makeDomainFunction } from "remix-domains";
import { Form, formAction } from "remix-forms";
import { useFieldArray } from "react-hook-form";
import { z } from "zod";
import clsx from "clsx";

import * as appConfig from "~/app.config";
import { authenticate } from "~/auth.server";
import { DashboardDetailLayout } from "~/components/dashboard";
import { createModelForProject } from "~/models.server";

import spritesHref from "~/sprites.svg";

export async function loader({ request }: LoaderArgs) {
  await authenticate(request);
  return null;
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

function TmpErrors({
  formState,
  id,
  field,
}: {
  formState: any;
  id: string;
  field: (string | number)[];
}) {
  const errors: string[] | undefined = React.useMemo(
    () => getError(formState, field),
    [formState, field]
  );
  return errors?.length ? (
    <div id={`errors-for-${id}`} role="alert">
      {errors.map((error, index) => (
        <div key={`${index}:${error}`}>{error}</div>
      ))}
    </div>
  ) : null;
}

function getError(formState: any, field: (string | number)[]) {
  let value = field.length > 0 ? formState?.errors : null;
  for (let i = 0; i < field.length && value; i++) {
    value = value[field[i]] || value[String(field[i])];
  }
  return value;
}

function FieldsForm({
  Field,
  control,
  register,
}: {
  Field: any;
  control: any;
  register: any;
}) {
  const actionData = useActionData();
  const { fields, append, remove } = useFieldArray({ control, name: "fields" });

  return (
    <>
      <p className="flex mt-4">
        <span className="flex-1">Fields </span>
        <button
          onClick={() => append({})}
          className="inline-flex items-center justify-center w-8 h-8 lg:w-6 lg:h-6"
          title="Add field"
          type="button"
        >
          <svg aria-hidden="true" role="img" className="w-4 h-4 lg:w-3 lg:h-3">
            <use href={`${spritesHref}#add`} />
          </svg>
        </button>
      </p>
      {fields.map((field, index) => {
        return (
          <fieldset
            className={clsx("border p-2", index > 0 && "mt-4")}
            key={field.id}
          >
            <Field
              name={`fields[${index}][name]`}
              label="Field name"
              type="text"
            >
              {({ Label }: any) => (
                <>
                  <Label className="block" />
                  <input
                    {...register(`fields[${index}][name]`)}
                    autoComplete="off"
                    className="px-2.5 py-2 w-full border"
                    {...(getError(actionData, ["fields", index, "name"])
                      ? {
                          "aria-describedby": `errors-for-${`fields[${index}][name]`}`,
                          "aria-invalid": "true",
                        }
                      : {})}
                  />
                  <TmpErrors
                    field={["fields", index, "name"]}
                    formState={actionData}
                    id={`fields[${index}][name]`}
                  />
                </>
              )}
            </Field>

            <label className="block mt-4" htmlFor={`fields[${index}][name]`}>
              Type
            </label>
            <select
              {...register(`fields[${index}][type]`)}
              autoComplete="off"
              className="px-2.5 py-2 w-full border"
            >
              {appConfig.dataTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <Field name={`fields[${index}][array]`} label="Array?" type="text">
              {({ Label }: any) => (
                <>
                  <Label className="flex items-center mt-4">
                    <input
                      {...register(`fields[${index}][array]`)}
                      type="checkbox"
                      autoComplete="off"
                      className="mr-2.5"
                      {...(getError(actionData, ["fields", index, "array"])
                        ? {
                            "aria-describedby": `errors-for-${`fields[${index}][array]`}`,
                            "aria-invalid": "true",
                          }
                        : {})}
                    />
                    Array?
                  </Label>
                  <TmpErrors
                    field={["fields", index, "array"]}
                    formState={actionData}
                    id={`fields[${index}][array]`}
                  />
                </>
              )}
            </Field>

            <Field
              name={`fields[${index}][required]`}
              label="Required?"
              type="text"
            >
              {({ Label }: any) => (
                <>
                  <Label className="flex items-center mt-4">
                    <input
                      {...register(`fields[${index}][required]`)}
                      type="checkbox"
                      autoComplete="off"
                      className="mr-2.5"
                      {...(getError(actionData, ["fields", index, "required"])
                        ? {
                            "aria-describedby": `errors-for-${`fields[${index}][required]`}`,
                            "aria-invalid": "true",
                          }
                        : {})}
                    />
                    Required?
                  </Label>
                  <TmpErrors
                    field={["fields", index, "required"]}
                    formState={actionData}
                    id={`fields[${index}][required]`}
                  />
                </>
              )}
            </Field>

            <button
              type="button"
              onClick={() => remove(index)}
              className="mt-4 px-2.5 py-2 border"
            >
              Remove
            </button>
          </fieldset>
        );
      })}
    </>
  );
}

export default function DashboardTest() {
  return (
    <DashboardDetailLayout title="New Model">
      <div className="p-5">
        <Form method="post" schema={schema}>
          {({ control, Errors, Field, Button, register, formState }) => (
            <>
              <Field name="name" label="Model Name" type="text">
                {({ Label, Errors }) => (
                  <>
                    <Label className="block" />
                    <input
                      {...register("name")}
                      autoComplete="off"
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
                      className="px-2.5 py-2 w-full border"
                    />
                    <Errors />
                  </>
                )}
              </Field>

              <FieldsForm Field={Field} control={control} register={register} />

              <Errors />
              <Button type="submit" className="mt-4 px-2.5 py-2 border">
                Create
              </Button>
            </>
          )}
        </Form>
      </div>
    </DashboardDetailLayout>
  );
}

const fieldsSchema = z
  .array(
    z.object({
      name: z.string().trim().min(1),
      type: z.enum<appConfig.DataTypes, typeof appConfig.dataTypes>(
        appConfig.dataTypes
      ),
      array: z.preprocess((v) => v !== "on", z.boolean()),
      required: z.preprocess((v) => v !== "on", z.boolean()),
    })
  )
  .optional();

const schema = z.object({
  name: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  description: z.string().trim().optional(),
  fields: z.any().optional(),
});

export async function action({ request, params }: ActionArgs) {
  const user = await authenticate(request);

  return formAction({
    request,
    schema,
    successPath: (data: { id: string }) =>
      `/dashboard/${params.projectId}/models/${data.id}`,
    mutation: makeDomainFunction(schema)(async (input) => {
      const fields = await fieldsSchema.safeParseAsync(input.fields);
      if (!fields.success) {
        throw new InputErrors(
          fields.error.issues.map((issue) => ({
            path: issue.path.reduce<string>((acc, key, index) => {
              if (index === 0) {
                return `fields.${key}`;
              }
              if (typeof key === "number") {
                return `${acc}[${key}]`;
              }
              return `${acc}.${key}`;
            }, ""),
            message: issue.message,
          }))
        );
      }

      const model = await createModelForProject({
        userId: user.id,
        projectId: params.projectId!,
        slug: input.slug,
        name: input.name,
        description: input.description,
        fields: fields.data,
      });

      if (!model) throw new InputError("Failed to create a model", "name");

      return { id: model.id };
    }),
  });
}
