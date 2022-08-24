import * as React from "react";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type {
  ShouldReloadFunction,
  UseDataFunctionReturn,
} from "@remix-run/react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useMatches,
} from "@remix-run/react";

import { authenticate } from "~/auth.server";
import stylesHref from "~/_generated/styles.css";

export const links = () => [{ rel: "stylesheet", href: stylesHref }];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  const user = await authenticate(request, {});

  return json({
    authenticated: !!user,
  });
}

export const unstable_shouldReload: ShouldReloadFunction = ({ submission }) => {
  if (submission) {
    return true;
  }

  return false;
};

function Document({ children }: { children: React.ReactNode }) {
  const matches = useMatches();
  const rootMatch = matches.find((match) => match.id === "root");
  const { authenticated } = (rootMatch?.data || {}) as Partial<
    UseDataFunctionReturn<typeof loader>
  >;

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="relative w-full min-h-screen flex">
        {authenticated && (
          <form id="logout-form" method="post" action="/logout" />
        )}
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function CatchBoundary() {
  const { data, status } = useCatch();

  const message =
    typeof data === "string" && data ? data : messageFromStatus(status);
  // const icon = iconFromStatus(status);

  return (
    <Document>
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-xl mt-6">{status}</h1>
        <div className="pt-2 text-xs">{message}</div>
      </div>
    </Document>
  );
}

function messageFromStatus(status: number) {
  switch (status) {
    case 400:
      return "Bad Request";
    case 401:
      return "Unauthorized";
    case 403:
      return "Forbidden";
    case 404:
      return "Page not found";
    case 500:
      return "Something went wrong";
  }
}
