import { RemixBrowser } from "@remix-run/react";
import { hydrateRoot } from "react-dom/client";

hydrateRoot(document, <RemixBrowser />);

if (typeof document.createElement("dialog").showModal !== "function") {
  import("a11y-dialog");
}
