import { prisma } from "~/prisma.server";

export async function getField({
  fieldId,
  userId,
}: {
  fieldId: string;
  userId: string;
}) {
  const field = await prisma.modelField.findFirst({
    where: {
      id: fieldId,
      model: {
        project: {
          users: {
            some: {
              id: userId,
            },
          },
        },
      },
    },
    select: {
      id: true,
      createdAt: true,
      array: true,
      type: true,
      required: true,
      name: true,
      typeReference: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!field) return undefined;

  return {
    id: field.id,
    createdAt: field.createdAt,
    array: field.array,
    type: field.type,
    required: field.required,
    name: field.name,
    typeReferenceId: field.typeReference?.id,
    typeReferenceName: field.typeReference?.name,
  };
}
