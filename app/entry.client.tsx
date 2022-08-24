import * as React from "react";
import { RemixBrowser } from "@remix-run/react";
import { hydrateRoot } from "react-dom/client";

React.startTransition(() => {
  hydrateRoot(document, <RemixBrowser />);
});

if (typeof document.createElement("dialog").showModal !== "function") {
  import("a11y-dialog");
}
