import { ThreadMessage } from "@assistant-ui/react";

interface ChatMessage {
  role: "human" | "ai";
  content: string;
}

export const mapToChatMessage = (message: ThreadMessage): ChatMessage => {
  return {
    role: message.role === "user" ? "human" : "ai",
    content: message.content
      .filter((c) => c.type === "text")
      .map((c) => c.text)
      .join(" "),
  };
};
