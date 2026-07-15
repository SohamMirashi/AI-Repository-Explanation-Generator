export default function MessageList() {
  return (
    <section className="flex-1 overflow-y-auto">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-center px-6">
        <div className="space-y-5 text-center">
          <h1 className="text-6xl font-bold tracking-tight text-gray-900">
            RepoInsight
          </h1>

          <p className="text-4xl text-gray-900">
            An AI Repository Explanation Generator
          </p>
          <p className="text-2xl text-gray-900">
            Upload any software repository and receive an AI-powered explanation of its architecture, components, technologies, important files and user flow.
          </p>
        </div>
      </div>
    </section>
  );
}