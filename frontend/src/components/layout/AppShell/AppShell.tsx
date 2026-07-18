"use client";

import { useState } from "react";

import ChatInput from "@/components/chat/ChatInput";
import MessageList from "@/components/chat/MessageList";

// export interface Message {
//     id: string;
//     title: string;
//     content: string;
// }

export interface Message {
    id: string;
    title: string;
    content: string;
    downloadUrl?: string;
}

export default function AppShell() {

    const [messages, setMessages] = useState<Message[]>([]);

    return (
        <main className="flex h-screen flex-col bg-[#F7F7F8]">

            <MessageList
                messages={messages}
            />

            <ChatInput
                setMessages={setMessages}
            />

        </main>
    );
}