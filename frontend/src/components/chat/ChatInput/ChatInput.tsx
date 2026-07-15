"use client";
import { useRef, useState } from "react";
import { Paperclip, ArrowUp } from "lucide-react";

export default function ChatInput() {
    const [description, setDescription] = useState("");
    const [zipFile, setZipFile] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

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

                <div className="mt-4 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-zinc-800 hover:text-white">
                        <Paperclip size={18} />
                        {/* Upload ZIP */}
                        <span className="max-w-48 truncate">
                            {zipFile ? zipFile.name : "Upload ZIP"}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            if (!description.trim()) {
                                alert("Please enter a project description.");
                                return;
                            }

                            if (!zipFile) {
                                alert("Please upload a ZIP repository.");
                                return;
                            }

                            console.log("Description:", description);
                            console.log("ZIP:", zipFile);
                        }}
                        className="rounded-full bg-black p-3 text-white transition hover:bg-gray-800">
                        <ArrowUp size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}