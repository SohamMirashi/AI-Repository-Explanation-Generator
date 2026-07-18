"use client";

import { useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Paperclip, ArrowUp } from "lucide-react";

import type { Message } from "@/components/layout/AppShell";

// import {
//     uploadRepository,
//     analyzeRepository,
//     generateDocumentation,
// } from "@/services/repositoryApi";

import {
    uploadRepository,
    analyzeRepository,
    generateDocumentation,
    getDownloadUrl,
} from "@/services/repositoryApi";

interface ChatInputProps {
    setMessages: Dispatch<SetStateAction<Message[]>>;
}

export default function ChatInput({
    setMessages,
}: ChatInputProps) {

    const [description, setDescription] = useState("");
    const [importantFeature, setImportantFeature] = useState("");
    const [zipFile, setZipFile] = useState<File | null>(null);
    const [technicalLevel, setTechnicalLevel] = useState<
        "beginner" | "product" | "developer">("beginner");
    const [loading, setLoading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState("");

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
            setDownloadUrl("");
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

            await analyzeRepository(upload.project_id);

            // ---------------- Generate ----------------

            await generateDocumentation(

                upload.project_id,

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

                // () => {

                //     setMessages(previous => [
                //         ...previous,
                //         {
                //             id: crypto.randomUUID(),
                //             title: "Completed",
                //             content: "Documentation generated successfully.",
                //         },
                //     ]);

                // },

                () => {

                    setDownloadUrl(
                        getDownloadUrl(upload.project_id)
                    );

                    setMessages(previous => [
                        ...previous,
                        // {
                        //     id: crypto.randomUUID(),
                        //     title: "Completed",
                        //     content: "Documentation generated successfully.",
                        // },
                        {
                            id: crypto.randomUUID(),
                            title: "Completed",
                            content: "Documentation generated successfully.",
                            downloadUrl: getDownloadUrl(upload.project_id),
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

        <div className="bg-[#F7F7F8] px-6 py-5">
            <div className="mx-auto max-w-5xl rounded-3xl border border-gray-300 bg-white px-5 py-4 shadow-sm">
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
                    // rows={2}
                    // className="min-h-[60px] w-full resize-none bg-transparent text-gray-900 outline-none placeholder:text-gray-500"
                    rows={1}
                    className="min-h-[48px] max-h-36 w-full resize-none bg-transparent text-gray-900 outline-none placeholder:text-gray-500"
                />


                <div className="mt-3 flex items-center justify-between">

                    <div className="flex flex-wrap items-center gap-3">

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm transition hover:bg-zinc-100"
                        >
                            <Paperclip size={16} />

                            <span className="max-w-40 truncate">
                                {zipFile ? zipFile.name : "Upload ZIP"}
                            </span>
                        </button>

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
                                className={`rounded-full px-4 py-2 text-sm transition ${technicalLevel === level.value
                                    ? "bg-black text-white"
                                    : "border border-gray-300 bg-white hover:bg-gray-100"
                                    }`}
                            >
                                {level.label}
                            </button>

                        ))}

                    </div>

                    <button
                        type="button"
                        disabled={loading}
                        onClick={handleGenerate}
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 disabled:opacity-50"
                    >
                        <ArrowUp size={18} />
                    </button>

                </div>

                {
                    downloadUrl && (

                        <a
                            href={downloadUrl}
                            download
                            className="
                                    mt-4
                                    flex
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-black
                                    px-4
                                    py-3
                                    text-white
                                    transition
                                    hover:bg-gray-800">
                            Download Documentation ZIP
                        </a>

                    )
                }

            </div>

        </div >

    );

}