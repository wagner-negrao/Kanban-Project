import { useState, useRef, useEffect } from "react";
import type { BoardData } from "@/lib/kanban";

type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
};

export const ChatWidget = ({
  board,
  onBoardUpdate,
}: {
  board: BoardData;
  onBoardUpdate: (updater: (prev: BoardData) => BoardData) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "msg-1", role: "ai", text: "Hi! I'm your Kanban AI. How can I help?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput("");
    
    const newUserMsg: Message = { id: Date.now().toString(), role: "user", text: userText };
    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, board: board })
      });
      const data = await res.json();
      
      const aiText = data.reply || "I encountered an error processing your request.";
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "ai", text: aiText }]);
      
      if (data.board_update) {
        onBoardUpdate(() => data.board_update);
      }
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "ai", text: "Network error occurred." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary-blue)] text-white shadow-lg transition-transform hover:scale-105 ${isOpen ? 'scale-0' : 'scale-100'}`}
        aria-label="Open AI Chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex w-[380px] flex-col overflow-hidden rounded-2xl border border-[var(--stroke)] bg-white/90 shadow-2xl backdrop-blur-xl sm:w-[420px]" style={{ height: "600px", maxHeight: "calc(100vh - 48px)" }}>
          <div className="flex items-center justify-between border-b border-[var(--stroke)] bg-[var(--navy-dark)] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
              <h3 className="font-semibold tracking-wide">Kanban AI Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} aria-label="Close AI Chat" className="rounded p-1 hover:bg-white/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-[var(--primary-blue)] text-white rounded-br-none' : 'bg-gray-100 text-[var(--navy-dark)] rounded-bl-none border border-gray-200'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex max-w-[80%] items-center gap-1 rounded-2xl rounded-bl-none border border-gray-200 bg-gray-100 px-4 py-3">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0.2s" }}></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="border-t border-[var(--stroke)] bg-white p-3">
            <div className="flex items-center gap-2 rounded-full border border-[var(--stroke)] bg-gray-50 pr-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI to modify your board..."
                className="flex-1 bg-transparent px-4 py-2 text-sm text-[var(--navy-dark)] outline-none placeholder:text-gray-400"
                disabled={isLoading}
              />
              <button
                type="submit"
                aria-label="Send Message"
                disabled={isLoading || !input.trim()}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary-blue)] text-white transition hover:bg-blue-600 disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
