import * as React from "react";
import type { LoaderArgs } from "@remix-run/node";
import { defer, json } from "@remix-run/node";
import {
  Await,
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from "@remix-run/react";

import { authenticate } from "~/auth.server";
import { getField } from "~/models.server";

import spritesHref from "~/sprites.svg";

export async function loader({ request, params }: LoaderArgs) {
  const user = await authenticate(request);
  const { "*": slug } = params;

  const { sections } = getSections(slug);

  if (!sections.length) {
    throw json({}, 404);
  }

  const trimmedSections: { id: string; type: "field"; to: string }[] = [];
  type SectionWithData = typeof sections[number] & {
    data: Promise<ReturnType<typeof getField>>;
  };
  const sectionPromises = sections
    .map(({ type, id }, index) => {
      const to =
        `/dashboard/${params.projectId}/models/${params.modelId}/` +
        sections
          .slice(0, index + 1)
          .map((section) => `${section.type}/${section.id}`)
          .join("/");
      if (type === "field") {
        trimmedSections.push({ id, type, to });
        return {
          type: type,
          id,
          data: getField({ fieldId: id, userId: user.id }),
        };
      }
      return false as any;
    })
    .filter(Boolean) as SectionWithData[];

  return defer({
    sections: trimmedSections.reverse(),
    ...Object.fromEntries(
      sectionPromises.map(({ id, data }) => [`section_${id}` as const, data])
    ),
  } as Record<string, Promise<ReturnType<typeof getField>>> & {
    sections: typeof trimmedSections;
  });
}

function getSections(splat?: string) {
  const splitSplat = (splat || "").split("/");
  let type = "";
  let returnToFieldId = undefined;
  const sections = [];
  for (const section of splitSplat) {
    if (section === "field") {
      type = section;
      continue;
    }

    if (!returnToFieldId && type === "field") {
      returnToFieldId = section;
    }

    if (type) {
      sections.push({ type, id: section });
      type = "";
    }
  }
  return { returnToFieldId, sections };
}

export default function FieldDashboard() {
  const loaderData = useLoaderData<typeof loader>();
  const location = useLocation();
  const navigate = useNavigate();
  const { "*": splat, projectId, modelId } = useParams();

  const sectionData = React.useMemo(
    () =>
      loaderData.sections.reduce((acc, section) => {
        acc[section.id] = loaderData[`section_${section.id}`];
        return acc;
      }, {} as Record<keyof typeof loaderData extends `section_${infer ID}` ? ID : string, typeof loaderData[`section_${string}`]>),
    [loaderData]
  );

  const { returnToFieldId } = React.useMemo(() => getSections(splat), [splat]);

  // This is here to trap focus in the dialog. The "open"
  // attribute doesn't do this for some stupid reason.
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  React.useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.close("focus");
      dialogRef.current.showModal();
    }
  }, [dialogRef, location.key]);

  const focusedSection = sectionData[loaderData.sections[0].id];

  return (
    <>
      <dialog
        open
        id="model-detail-dialog"
        aria-modal="true"
        ref={dialogRef}
        className="z-30 m-0 p-0 fixed w-fit h-fit flex bg-transparent"
        onClick={(e) => {
          e.stopPropagation();
        }}
        onClose={(e) => {
          if (e.currentTarget.returnValue !== "focus") {
            navigate("..", { state: { fieldId: returnToFieldId } });
          } else {
            e.currentTarget.returnValue = "";
          }
        }}
      >
        <div className="fixed w-screen h-screen flex-1 flex items-center justify-center bg-[rgba(0,0,0,0.2)]">
          <div className="w-full h-full lg:h-[90%] lg:w-[90%] border z-50 flex bg-white">
            <main className="flex-1">
              <header className="flex p-4">
                <Link
                  to=".."
                  state={{ fieldId: returnToFieldId }}
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 focus:bg-gray-100"
                >
                  <svg aria-hidden="true" role="img" className="w-4 h-4">
                    <use href={`${spritesHref}#close`} />
                  </svg>
                </Link>
              </header>
              <div className="p-4">
                <Await resolve={focusedSection}>
                  {(section) => (
                    <>
                      <p>{section.name}</p>
                      <button>Test</button>
                    </>
                  )}
                </Await>
              </div>
            </main>
            {loaderData.sections.length > 1 && (
              <aside className="flex flex-col">
                <ul className="flex-1 flex flex-row">
                  <React.SuspenseList revealOrder="together">
                    {loaderData.sections.slice(1).map((section) => (
                      <React.Suspense key={section.id}>
                        <Await resolve={sectionData[section.id]}>
                          {(sectionData) =>
                            !sectionData ? null : (
                              <li className="flex flex-1">
                                <Link
                                  to={section.to}
                                  className="vtbl flex-1 flex justify-center border-l hover:bg-gray-50 focus:bg-gray-50"
                                >
                                  <span>
                                    <span className="text-sm">
                                      {section.type}{" "}
                                    </span>
                                    {sectionData.name}
                                  </span>
                                </Link>
                              </li>
                            )
                          }
                        </Await>
                      </React.Suspense>
                    ))}
                  </React.SuspenseList>
                </ul>
              </aside>
            )}
          </div>
        </div>
      </dialog>
      <script
        dangerouslySetInnerHTML={{
          __html: `(()=>{let d=document.getElementById("model-detail-dialog");d.close("focus");d.showModal();})()`,
        }}
      />
    </>
  );
}
