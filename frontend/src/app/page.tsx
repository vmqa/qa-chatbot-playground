"use client";

import { useState, useRef, useEffect, useCallback, FormEvent, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { config, MAX_MESSAGE_LENGTH } from "@/lib/config";
import { Message, StreamChunk } from "@/types/chat";
import Header from "@/components/Header";
import ExampleQuestions from "@/components/ExampleQuestions";

/**
 * Renders user message with clickable links and emails.
 */
function renderUserMessage(content: string): ReactNode {
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<]+)|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIndex = 0;

  while ((match = linkRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index));
    }

    const linkClass = "underline hover:opacity-80";

    if (match[1] && match[2]) {
      parts.push(
        <a key={keyIndex++} href={match[2]} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {match[1]}
        </a>
      );
    } else if (match[3]) {
      parts.push(
        <a key={keyIndex++} href={match[3]} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {match[3]}
        </a>
      );
    } else if (match[4]) {
      parts.push(
        <a key={keyIndex++} href={`mailto:${match[4]}`} className={linkClass}>
          {match[4]}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }

  return parts.length > 0 ? parts : content;
}

/**
 * Renders assistant message with full markdown support.
 */
function renderAssistantMessage(content: string): ReactNode {
  const normalizePortfolioBullets = (text: string) => {
    const lines = text.split("\n");
    const output: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      const isCompanyHeader = /^-\s*\*\*.+\)\*\*:/.test(trimmed);
      const isBullet = /^-\s+/.test(trimmed);

      if (isCompanyHeader) {
        const header = trimmed.replace(/^-\s*/, "");
        if (output.length > 0 && output[output.length - 1] !== "") {
          output.push("");
        }
        output.push(header);
        continue;
      }

      if (isBullet) {
        if (output.length > 0 && output[output.length - 1] !== "" && !/^[-*]\s+/.test(output[output.length - 1])) {
          output.push("");
        }
        output.push(trimmed);
        continue;
      }

      output.push(line);
    }

    return output.join("\n");
  };

  let fixedContent = normalizePortfolioBullets(content)
    // Fix numbered lists with newline after number
    .replace(/^(\d+)\.\s*\n+/gm, "$1. ")
    .replace(/\n(\d+)\.\s*\n+/g, "\n$1. ")
    // Fix bullets at start of line with newline after
    .replace(/^([-*])\s*\n+/gm, "$1 ")
    // Fix bullets after newline with newline after
    .replace(/\n([-*])\s*\n+/g, "\n$1 ")
    // Fix indented bullets (nested lists) with newline after
    .replace(/\n(\s+)([-*])\s*\n+/g, "\n$1$2 ")
    // Normalize multiple spaces before bullets to proper indentation
    .replace(/\n\s+([-*])\s/g, "\n  $1 ");

  return (
    <ReactMarkdown
      components={{
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--primary)] underline hover:text-[var(--primary-hover)]"
          >
            {children}
          </a>
        ),
        p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
        ul: ({ children }) => <ul className="list-disc list-inside mb-1 last:mb-0">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside mb-1 last:mb-0">{children}</ol>,
        li: ({ children }) => <li>{children}</li>,
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
      }}
    >
      {fixedContent}
    </ReactMarkdown>
  );
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const generateId = () => Math.random().toString(36).substring(2, 15);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const history = messages
      .filter((msg) => msg.content.trim().length > 0)
      .slice(-12)
      .map((msg) => ({ role: msg.role, content: msg.content }));

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    const assistantMessageId = generateId();
    setMessages((prev) => [
      ...prev,
      { id: assistantMessageId, role: "assistant", content: "" },
    ]);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`${config.apiUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.content, history }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 429) {
        throw new Error("You've hit the chat limit for this hour. Please try again later.");
      }

      if (!response.ok) {
        throw new Error("Failed to get response. Please try again.");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Unable to read response stream.");
      }

      const decoder = new TextDecoder();
      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]" || data === "") continue;

            let chunk: StreamChunk;
            try {
              chunk = JSON.parse(data);
            } catch {
              continue;
            }

            if (chunk.error) {
              throw new Error("Service temporarily unavailable. Please try again later.");
            }
            if (chunk.content) {
              accumulatedContent += chunk.content;
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessageId
                    ? { ...msg, content: accumulatedContent }
                    : msg
                )
              );
            }
          }
        }
      }
    } catch (err) {
      let errorMessage = "An unexpected error occurred.";
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          errorMessage = "Request timed out. Please try again.";
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== assistantMessageId)
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  };

  const handleExampleQuestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <Header />

      <main className={`flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 ${!hasMessages ? "justify-center" : ""}`}>
        {/* Welcome section - shown when no messages */}
        {!hasMessages && (
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Hi! I'm Marco, your <span className="line-through">plumber</span> AI QA assistant.
            </h1>
          </div>
        )}

        {/* Messages area - shown when there are messages */}
        {hasMessages && (
          <div className="flex-1 overflow-y-auto py-6 space-y-6 chat-scrollbar">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                data-testid={message.role === "user" ? "message-user" : "message-assistant"}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    message.role === "user"
                      ? "bg-[var(--user-message-bg)] text-white rounded-br-md"
                      : "bg-[var(--assistant-message-bg)] text-[var(--text-primary)] rounded-bl-md"
                  }`}
                >
                  {message.content ? (
                    message.role === "user"
                      ? renderUserMessage(message.content)
                      : renderAssistantMessage(message.content)
                  ) : (
                    <span className="inline-flex items-center" data-testid="loading-indicator">
                      <span className="w-2 h-2 bg-[var(--secondary)] rounded-full animate-bounce mr-1"></span>
                      <span className="w-2 h-2 bg-[var(--secondary)] rounded-full animate-bounce mr-1" style={{ animationDelay: "0.1s" }}></span>
                      <span className="w-2 h-2 bg-[var(--secondary)] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                    </span>
                  )}
                </div>
              </div>
            ))}

            {error && (
              <div className="flex justify-center" data-testid="error-message">
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg max-w-[80%] dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input area */}
        <div className="py-4 sm:py-6">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={!hasMessages ? "Ask me about Quality Assurance..." : ""}
                disabled={isLoading}
                maxLength={MAX_MESSAGE_LENGTH}
                rows={3}
                data-testid="chat-input"
                className="w-full px-4 py-4 pr-14 bg-transparent resize-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
                style={{ minHeight: "80px", maxHeight: "200px" }}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                data-testid="chat-submit"
                className="absolute right-3 bottom-3 w-10 h-10 flex items-center justify-center bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-full transition-all duration-200 disabled:bg-[var(--border)] disabled:cursor-not-allowed cursor-pointer"
                aria-label="Send message"
              >
                {isLoading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                )}
              </button>
            </div>
          </form>

          {/* Example questions - only shown when no messages */}
          {!hasMessages && (
            <div className="mt-4">
              <ExampleQuestions onQuestionClick={handleExampleQuestion} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
