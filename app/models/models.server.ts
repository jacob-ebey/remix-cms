import { prisma } from "~/prisma.server";

import type { DataTypes } from "~/app.config";

export async function createModelForProject({
  userId,
  projectId,
  slug,
  name,
  description,
  fields,
}: {
  userId: string;
  projectId: string;
  slug: string;
  name: string;
  description?: string;
  fields?: {
    name: string;
    type: DataTypes;
    required: boolean;
    array: boolean;
  }[];
}) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      users: {
        some: {
          id: userId,
        },
      },
    },
    select: {
      id: true,
    },
  });

  if (!project) return undefined;

  const model = await prisma.model.create({
    data: {
      slug,
      name,
      description,
      projectId,
      fields: fields?.length
        ? {
            create: fields,
          }
        : undefined,
    },
  });

  return { id: model.id };
}

export async function getFieldsForModel({
  modelId,
  userId,
}: {
  modelId: string;
  userId: string;
}) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const model = await prisma.model.findFirst({
    where: {
      id: modelId,
      project: {
        users: {
          some: {
            id: userId,
          },
        },
      },
    },
    select: {
      fields: {
        select: {
          id: true,
          name: true,
          type: true,
          required: true,
          array: true,
          typeReference: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!model) return [];

  return model.fields.map((field) => ({
    id: field.id,
    name: field.name,
    type: field.type,
    required: field.required,
    array: field.array,
    typeReferenceId: field.typeReference?.id,
    typeReferenceName: field.typeReference?.name,
  }));
}

export async function getModelsForProject({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}) {
  // TODO: Remove this artificial delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  const models = await prisma.model.findMany({
    where: {
      project: {
        id: projectId,
        users: {
          some: {
            id: userId,
          },
        },
      },
    },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
    },
  });

  return models.map(({ id, slug, name, description }) => ({
    id,
    slug,
    name,
    description: description || undefined,
  }));
}

export async function getModelOverview({
  modelId,
  userId,
}: {
  modelId: string;
  userId: string;
}) {
  const model = await prisma.model.findFirst({
    where: {
      id: modelId,
      project: {
        users: {
          some: {
            id: userId,
          },
        },
      },
    },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
    },
  });

  if (!model) return undefined;

  return {
    id: model.id,
    slug: model.slug,
    name: model.name,
    description: model.description,
  };
}

export async function countModels({
  userId,
  projectId,
}: {
  userId: string;
  projectId: string;
}): Promise<number> {
  // TODO: Remove this artificial delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      users: {
        some: {
          id: userId,
        },
      },
    },
    select: {
      _count: {
        select: {
          models: true,
        },
      },
    },
  });

  return project?._count.models || 0;
}
