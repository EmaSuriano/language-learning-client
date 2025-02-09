"use client";
import { useEffect } from "react";
import {
  AssistantMessage,
  useMessageRuntime,
  AssistantActionBar,
  useMessage,
} from "@assistant-ui/react";

export const MyAssistantMessage = () => {
  return (
    <AssistantMessage.Root>
      <AssistantMessage.Avatar />
      <AssistantMessage.Content />
      <AssistantActionBar.Root>
        <AutomaticSpeak />
        <AssistantActionBar.Copy />
      </AssistantActionBar.Root>
    </AssistantMessage.Root>
  );
};

const AutomaticSpeak = () => {
  const message = useMessage();
  const { speak } = useMessageRuntime();

  useEffect(() => {
    if (message.status?.type === "complete") {
      speak();
    }
  }, [message.status, speak]);

  return <AssistantActionBar.SpeechControl />;
};
