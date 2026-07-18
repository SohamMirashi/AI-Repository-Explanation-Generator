"use client";

import { useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Paperclip, ArrowUp } from "lucide-react";

import type { Message } from "@/components/layout/AppShell";

import {
    uploadRepository,
    analyzeRepository,
    generateDocumentation,
} from "@/services/repositoryApi";

interface ChatInputProps {
    setMessages: Dispatch<SetStateAction<Message[]>>;
}

export default function ChatInput({
    setMessages,
}: ChatInputProps) {

    const [description, setDescription] = useState("");
    const [zipFile, setZipFile] = useState<File | null>(null);
    const [technicalLevel, setTechnicalLevel] = useState<
        "beginner" | "product" | "developer">("beginner");
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    async function handleGenerate() {

        if (!description.trim()) {
            alert("Please enter a project description.");
            return;
        }

        if (!zipFile) {
            alert("Please upload a ZIP repository.");
            return;
        }

        try {

            setLoading(true);
            setMessages([]);

            // ---------------- Upload ----------------

            const upload = await uploadRepository(zipFile);

            setMessages(previous => [
                ...previous,
                {
                    id: crypto.randomUUID(),
                    title: "Repository Uploaded",
                    content: upload.repository_name,
                },
            ]);

            // ---------------- Analyze ----------------

            //         const analysis = await analyzeRepository(upload.project_id);

            //         const technologySummary = Object.entries(analysis.technologies)
            //             .filter(([, technologies]) => technologies.length > 0)
            //             .map(([category, technologies]) =>
            //                 `${category}: ${technologies.join(", ")}`
            //             )
            //             .join("\n");

            //         setMessages(previous => [
            //             ...previous,
            //             {
            //                 id: crypto.randomUUID(),
            //                 title: "Repository Analysis",
            //                 content: `Files: ${analysis.total_files}

            // Technologies:
            // ${technologySummary || "None"}

            // Important Files: ${analysis.important_files}
            // Relationships: ${analysis.relationships}
            // Summaries: ${analysis.summaries}`,
            //             },
            //         ]);

            // ---------------- Analyze ----------------

            await analyzeRepository(upload.project_id);

            // ---------------- Generate ----------------

            await generateDocumentation(

                upload.project_id,

                // "developer",
                technicalLevel,

                description,

                (progress) => {

                    setMessages(previous => [
                        ...previous,
                        {
                            id: crypto.randomUUID(),
                            title: "Progress",
                            content:
                                progress.message ??
                                progress.stage ??
                                JSON.stringify(progress, null, 2),
                        },
                    ]);

                },

                (section) => {

                    setMessages(previous => [
                        ...previous,
                        {
                            id: crypto.randomUUID(),
                            title: section.title,
                            content: section.content,
                        },
                    ]);

                },

                () => {

                    setMessages(previous => [
                        ...previous,
                        {
                            id: crypto.randomUUID(),
                            title: "Completed",
                            content: "Documentation generated successfully.",
                        },
                    ]);

                },

                (error) => {

                    setMessages(previous => [
                        ...previous,
                        {
                            id: crypto.randomUUID(),
                            title: "Error",
                            content: error,
                        },
                    ]);

                }

            );

        }

        catch (error) {

            setMessages(previous => [
                ...previous,
                {
                    id: crypto.randomUUID(),
                    title: "Error",
                    content:
                        error instanceof Error
                            ? error.message
                            : "Unknown error.",
                },
            ]);

        }

        finally {

            setLoading(false);
            setDescription("");

        }

    }

    return (

        <div className="border-t border-gray-300 bg-[#F7F7F8] px-6 py-5">

            <div className="mx-auto max-w-5xl rounded-3xl border border-gray-300 bg-white p-4 shadow-sm">

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".zip"
                    hidden
                    onChange={(e) => {

                        if (e.target.files?.length) {

                            setZipFile(e.target.files[0]);

                        }

                        e.target.value = "";

                    }}
                />

                <textarea
                    placeholder="Upload the ZIP file and describe your repository..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full resize-none bg-transparent text-gray-900 outline-none placeholder:text-gray-500"
                />

                <div className="mt-4 flex gap-3">

                    {[
                        { label: "Beginner", value: "beginner" },
                        { label: "Product", value: "product" },
                        { label: "Developer", value: "developer" },
                    ].map((level) => (

                        <button
                            key={level.value}
                            type="button"
                            onClick={() =>
                                setTechnicalLevel(
                                    level.value as
                                    | "beginner"
                                    | "product"
                                    | "developer"
                                )
                            }
                            className={`rounded-full border px-4 py-2 text-sm transition ${technicalLevel === level.value
                                ? "bg-black text-white"
                                : "border-gray-300 text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            {level.label}
                        </button>

                    ))}

                </div>

                <div className="mt-4 flex items-center justify-between">

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-zinc-800 hover:text-white"
                    >

                        <Paperclip size={18} />

                        <span className="max-w-48 truncate">

                            {zipFile ? zipFile.name : "Upload ZIP"}

                        </span>

                    </button>

                    <button
                        disabled={loading}
                        type="button"
                        onClick={handleGenerate}
                        className="rounded-full bg-black p-3 text-white transition hover:bg-gray-800 disabled:opacity-50"
                    >

                        <ArrowUp size={18} />

                    </button>

                </div>

            </div>

        </div>

    );

}