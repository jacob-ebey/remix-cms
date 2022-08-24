import { prisma } from "~/prisma.server";

export async function createProject({
  userId,
  name,
  description,
}: {
  userId: string;
  name: string;
  description?: string;
}) {
  const project = await prisma.project.create({
    data: {
      name,
      description,
      users: {
        connect: [{ id: userId }],
      },
    },
  });

  return { id: project.id };
}

export async function projectExists({
  userId,
  projectId,
}: {
  userId: string;
  projectId: string;
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

  return !!project;
}

export async function getProjects({ userId }: { userId: string }) {
  const projects = await prisma.project.findMany({
    where: {
      users: {
        some: {
          id: userId,
        },
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });

  return projects.map(({ id, name, description }) => ({
    id,
    name,
    description: description || undefined,
  }));
}
