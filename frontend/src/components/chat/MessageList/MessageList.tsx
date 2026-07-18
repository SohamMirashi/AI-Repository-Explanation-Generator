import type { Message } from "@/components/layout/AppShell";
import MarkdownRenderer from "../MarkdownRenderer/MarkdownRenderer";

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({
  messages,
}: MessageListProps) {

  if (messages.length === 0) {

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

  return (

    <section className="flex-1 overflow-y-auto px-8 py-8">

      <div className="mx-auto max-w-5xl space-y-6">

        {messages.map((message) => (

          <div
            key={message.id}
            className="rounded-xl border bg-white p-6 shadow-sm"
          >

            <h2 className="mb-3 text-xl font-semibold">

              {message.title}

            </h2>

            <div className="max-w-none text-gray-800">
              <MarkdownRenderer
                content={message.content}
              />
            </div>

          </div>

        ))}

      </div>

    </section>

  );

}