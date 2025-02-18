"use client";
import { useEffect } from "react";
import {
  AssistantMessage,
  useMessageRuntime,
  AssistantActionBar,
  useMessage,
} from "@assistant-ui/react";
import { useAppConfigStore } from "@/hooks/useAppConfigStore";

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
  const { enableAutoPlay } = useAppConfigStore();
  const { speak } = useMessageRuntime();

  useEffect(() => {
    if (enableAutoPlay && message.status?.type === "complete") {
      speak();
    }
  }, [message.status, speak]);

  return <AssistantActionBar.SpeechControl />;
};
