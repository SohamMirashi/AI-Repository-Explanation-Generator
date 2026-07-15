import ChatInput from "@/components/chat/ChatInput";
import MessageList from "@/components/chat/MessageList";

export default function AppShell() {
  return (
    <main className="flex h-screen flex-col bg-[#F7F7F8]">
      <MessageList />

      <ChatInput />
    </main>
  );
}