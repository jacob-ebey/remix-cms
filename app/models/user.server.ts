import { compare, hash } from "bcrypt";

import type { AuthenticatedUser } from "~/auth.server";
import { prisma } from "~/prisma.server";

export async function findOrCreateUser({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<AuthenticatedUser | undefined> {
  const hashedPassword = await hash(password, 10);

  const foundUser = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      hashedPassword: true,
    },
  });

  if (foundUser) {
    if (await compare(password, foundUser.hashedPassword)) {
      return {
        id: foundUser.id,
      };
    }
    return undefined;
  }

  const newUser = await prisma.user.create({
    data: {
      username,
      hashedPassword,
    },
    select: {
      id: true,
    },
  });

  return {
    id: newUser.id,
  };
}
