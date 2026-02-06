/**
 * Type definitions for chat functionality.
 */

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface StreamChunk {
  content?: string;
  error?: string;
}
