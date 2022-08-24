import type { Session } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { sessionStorage, USER_KEY } from "~/session.server";

export interface AuthenticatedUser {
  id: string;
}

function getUser(session: Session): AuthenticatedUser | undefined {
  return session.get(USER_KEY) || undefined;
}

export function setUser(session: Session, user: AuthenticatedUser) {
  session.set(USER_KEY, user);
}

export async function authenticate(
  request: Request,
  options?: never
): Promise<AuthenticatedUser>;
export async function authenticate(
  request: Request,
  options: { successRedirect: string }
): Promise<null>;
export async function authenticate(
  request: Request,
  options: { failureRedirect: string }
): Promise<AuthenticatedUser>;
export async function authenticate(
  request: Request,
  options: {}
): Promise<AuthenticatedUser | null>;
export async function authenticate(
  request: Request,
  {
    failureRedirect,
    successRedirect,
  }: { failureRedirect?: string; successRedirect?: string } = {
    failureRedirect: "/login",
  }
): Promise<AuthenticatedUser | null> {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  const user = getUser(session);

  if (user && successRedirect) {
    throw redirect(successRedirect);
  }
  if (!user && failureRedirect) {
    throw redirect(failureRedirect);
  }

  return user || null;
}
