import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldReloadFunction } from "@remix-run/react";
import { Link, useCatch } from "@remix-run/react";

export async function loader({ request, params }: LoaderArgs) {
  throw json(null, 404);
}

export const unstable_shouldReload: ShouldReloadFunction = ({ submission }) => {
  return false;
};

export function CatchBoundary() {
  const { status } = useCatch();
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h1 className="text-xl">{status}</h1>
      <div className="pt-2 text-xs">
        <Link to="/">Go home</Link>
      </div>
    </div>
  );
}

export default function GlobalCatchAll() {
  return null;
}
