import { createCookieSessionStorage } from "@remix-run/node";

if (!process.env.ENCRYPTION_SECRET) {
  throw new Error("ENCRYPTION_SECRET environment variable is not set");
}

export const USER_KEY = "user";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [process.env.ENCRYPTION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});
