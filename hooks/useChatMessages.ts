import { ThreadMessage, useThreadRuntime } from "@assistant-ui/react";
import { useEffect, useRef, useState } from "react";

export const useChatMessages = () => {
  const [messages, setMessages] = useState<readonly ThreadMessage[]>([]);
  const threadRuntime = useThreadRuntime();
  const messageRef = useRef<ThreadMessage | null>(null);

  useEffect(() => {
    threadRuntime.subscribe(async () => {
      const { messages } = threadRuntime.getState();
      const lastMessage = messages[messages.length - 1];
      const isLastMessageDone = lastMessage?.status?.type === "complete";

      if (messageRef.current === lastMessage || !isLastMessageDone) {
        return;
      }

      messageRef.current = lastMessage;
      setMessages(messages);
    });
  }, [threadRuntime, setMessages]);

  return messages;
};
