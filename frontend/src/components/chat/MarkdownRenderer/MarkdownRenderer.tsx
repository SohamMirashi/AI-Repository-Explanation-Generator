import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import mermaid from "mermaid";

interface MarkdownRendererProps {
    content: string;
}

function MermaidBlock({
    chart,
}: {
    chart: string;
}) {

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {

        mermaid.initialize({

            startOnLoad: false,

            theme: "default",

            securityLevel: "loose",

        });

        const renderDiagram = async () => {

            if (!ref.current) return;

            try {

                const id = "mermaid-" + Math.random().toString(36).slice(2);

                const cleanedChart = chart

                    .replace(/"/g, "")
                    .replace(/'/g, "")
                    .replace(/\(/g, "")
                    .replace(/\)/g, "");

                const { svg } = await mermaid.render(
                    id,
                    cleanedChart
                );

                ref.current.innerHTML = svg;

            }

            catch (err) {

                ref.current.innerHTML = `
<div class="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
    <strong>Mermaid diagram could not be rendered.</strong><br/>
    The generated Mermaid syntax is invalid.
</div>
`;

                console.error(err);

            }

        };

        renderDiagram();

    }, [chart]);

    return (

        <div className="my-8 overflow-x-auto rounded-xl border bg-white p-4">

            <div ref={ref} />

        </div>

    );

}

export default function MarkdownRenderer({
    content,
}: MarkdownRendererProps) {
    return (
        <div
            className="
                prose prose-neutral max-w-none

                prose-headings:font-bold
                prose-h1:text-3xl
                prose-h2:text-2xl
                prose-h3:text-xl

                prose-p:leading-7
                prose-p:my-4

                prose-ul:my-4
                prose-ol:my-4

                prose-pre:rounded-xl
                prose-pre:p-4

                prose-hr:my-10
            "
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    table: ({ children }) => (
                        <div className="my-8 overflow-x-auto rounded-xl border">
                            <table className="min-w-full border-collapse">
                                {children}
                            </table>
                        </div>
                    ),

                    thead: ({ children }) => (
                        <thead className="bg-gray-100">
                            {children}
                        </thead>
                    ),

                    th: ({ children }) => (
                        <th className="border px-4 py-3 text-left font-semibold">
                            {children}
                        </th>
                    ),

                    td: ({ children }) => (
                        <td className="border px-4 py-3 align-top">
                            {children}
                        </td>
                    ),

                    code({ className, children, ...props }) {

                        const match = /language-(\w+)/.exec(className || "");

                        if (match?.[1] === "mermaid") {

                            return (
                                <MermaidBlock
                                    chart={String(children).replace(/\n$/, "")}
                                />
                            );
                        }

                        return (
                            <code
                                className={className}
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}