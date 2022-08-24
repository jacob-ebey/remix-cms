export default function DashboardIndex() {
  return (
    <div className="flex-1 hidden lg:block">
      <div className="min-h-screen w-full flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-xl">Select or create a model to get started.</h1>
          <div className="pt-2 text-xs">
            Models define the structure of your data and API.
          </div>
        </div>
      </div>
    </div>
  );
}
