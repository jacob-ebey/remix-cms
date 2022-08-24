import * as React from "react";
import { Link, useLocation } from "@remix-run/react";

export default function FieldDashboard() {
  const location = useLocation();
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  React.useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.close();
      dialogRef.current.showModal();
    }
  }, [dialogRef, location.key]);
  return (
    <dialog
      ref={dialogRef}
      open
      className="z-30 m-0 p-0 fixed w-fit h-fit flex bg-[rgba(255,255,255,0.5)]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="fixed w-screen h-screen flex-1 flex items-center justify-center">
        <Link
          title="Back to project"
          to=".."
          className="absolute w-full h-full inset-0 z-40"
        >
          <span className="sr-only">Back to project</span>
        </Link>
        <div className="max-w-lg w-full border z-50 p-4 bg-white">
          <div>
            <p>Hello, Dialog!</p>
            <button>Test</button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
