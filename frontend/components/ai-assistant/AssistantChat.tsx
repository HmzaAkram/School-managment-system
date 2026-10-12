"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Bot, LoaderCircle, MessageCircle, Plus, Send, Sparkles, UserRound } from "lucide-react";
import { api } from "@/lib/api";

type AssistantRole = "super_admin" | "school_admin" | "teacher" | "student";
type ChatMessage = { role: "user" | "assistant"; content: string };

const suggestedQuestions: Record<AssistantRole, string[]> = {
  super_admin: [
    "How much platform revenue did we receive this month?",
    "How many schools are currently active?",
    "Which schools have pending contract payments?",
    "Show me the recent transactions.",
  ],
  school_admin: [
    "How many students are enrolled in my school?",
    "How many students were absent today?",
    "How much fee did we collect this month?",
    "What are our total school expenses this month?",
  ],
  teacher: [
    "Which classes are assigned to me?",
    "How many students were absent today in my assigned classes?",
    "What homework have I assigned?",
    "Show my timetable.",
  ],
  student: [
    "What is my attendance percentage?",
    "How much school fee is still pending?",
    "What homework do I have?",
    "Show my recent exam results.",
  ],
};

const roleTitles: Record<AssistantRole, string> = {
  super_admin: "Platform insights",
  school_admin: "Your school's assistant",
  teacher: "Your teaching assistant",
  student: "Your learning assistant",
};

export default function AssistantChat({ role }: { role: AssistantRole }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  async function sendMessage(event?: FormEvent, suggestion?: string) {
    event?.preventDefault();
    const content = (suggestion ?? draft).trim();
    if (!content || loading) return;

    const previousMessages = messages;
    setMessages((current) => [...current, { role: "user", content }]);
    setDraft("");
    setError("");
    setLoading(true);

    try {
      const response = await api.post<{ answer: string }>("/ai-assistant/chat", {
        message: content,
        history: previousMessages.slice(-8),
      });
      setMessages((current) => [...current, { role: "assistant", content: response.answer }]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The assistant could not answer. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function onComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  function startNewChat() {
    setMessages([]);
    setDraft("");
    setError("");
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[#EBE8E2] bg-white shadow-sm">
      <header className="flex items-center justify-between gap-3 border-b border-[#EBE8E2] px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#C4993C]/10 text-[#A37C27]">
            <Sparkles size={20} />
          </div>
          <div className="min-w-0">
            <h1 className="truncate font-sora text-base font-bold text-[#23201B]">AI Assistant</h1>
            <p className="text-xs text-[#8C877D]">{roleTitles[role]} · answers from your SchoolMS records</p>
          </div>
        </div>
        <button
          type="button"
          onClick={startNewChat}
          disabled={loading}
          className="inline-flex flex-shrink-0 items-center gap-2 rounded-xl border border-[#EBE8E2] px-3 py-2 text-xs font-semibold text-[#706B62] transition hover:bg-[#FAF8F5] disabled:opacity-50"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">New chat</span>
        </button>
      </header>

      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-5 sm:px-6">
        {messages.length === 0 ? (
          <div className="m-auto w-full max-w-2xl py-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C4993C]/10 text-[#A37C27]">
              <Bot size={27} />
            </div>
            <h2 className="text-center font-sora text-xl font-bold text-[#23201B]">How can I help you today?</h2>
            <p className="mx-auto mt-2 max-w-md text-center text-sm leading-6 text-[#8C877D]">
              Ask about the SchoolMS information available to your account. Answers are based on authorized school records.
            </p>
            <div className="mt-7 grid gap-2 sm:grid-cols-2">
              {suggestedQuestions[role].map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => void sendMessage(undefined, question)}
                  disabled={loading}
                  className="rounded-xl border border-[#EBE8E2] p-3 text-left text-sm text-[#504B42] transition hover:border-[#C4993C]/50 hover:bg-[#FAF8F5] disabled:opacity-50"
                >
                  <MessageCircle size={15} className="mb-2 text-[#A37C27]" />
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
            {messages.map((message, index) => (
              <article key={`${index}-${message.role}`} className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${message.role === "user" ? "bg-[#23201B] text-white" : "bg-[#C4993C]/10 text-[#A37C27]"}`}>
                  {message.role === "user" ? <UserRound size={16} /> : <Bot size={17} />}
                </div>
                <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[78%] ${message.role === "user" ? "rounded-tr-md bg-[#C4993C] text-white" : "rounded-tl-md bg-[#FAF8F5] text-[#37332C]"}`}>
                  {message.content}
                </div>
              </article>
            ))}
            {loading && (
              <div className="flex items-center gap-3 text-sm text-[#8C877D]" role="status" aria-live="polite">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C4993C]/10 text-[#A37C27]"><Bot size={17} /></div>
                <div className="flex items-center gap-2 rounded-2xl rounded-tl-md bg-[#FAF8F5] px-4 py-3">
                  <LoaderCircle size={16} className="animate-spin" /> Checking authorized records…
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        )}
      </div>

      <div className="border-t border-[#EBE8E2] bg-white px-4 py-4 sm:px-6">
        {error && (
          <div role="alert" className="mx-auto mb-3 flex max-w-3xl items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            <span>{error}</span>
            <button type="button" onClick={() => void sendMessage(undefined, messages.at(-1)?.content)} className="flex-shrink-0 font-semibold underline">
              Retry
            </button>
          </div>
        )}
        <form onSubmit={sendMessage} className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-[#EBE8E2] bg-[#FAF8F5] p-2 focus-within:border-[#C4993C]/60">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onComposerKeyDown}
            placeholder="Ask a question about your SchoolMS records…"
            aria-label="Message the AI assistant"
            rows={1}
            maxLength={2000}
            disabled={loading}
            className="max-h-32 min-h-10 flex-1 resize-y bg-transparent px-2 py-2 text-sm text-[#23201B] outline-none placeholder:text-[#A8A298] disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading || !draft.trim()}
            aria-label="Send message"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#C4993C] text-white transition hover:bg-[#A37C27] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {loading ? <LoaderCircle size={17} className="animate-spin" /> : <Send size={17} />}
          </button>
        </form>
        <p className="mx-auto mt-2 max-w-3xl text-center text-[10px] text-[#A8A298]">
          The assistant only receives information your account is allowed to access. Avoid entering sensitive personal details.
        </p>
      </div>
    </section>
  );
}
