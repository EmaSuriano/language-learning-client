"use client";
import { MouseEventHandler, useEffect } from "react";
import {
  AssistantMessage,
  useMessageRuntime,
  AssistantActionBar,
  useMessage,
} from "@assistant-ui/react";

import { useAppConfigStore } from "@/hooks/useAppConfigStore";
import { LanguagesIcon, Loader2Icon } from "lucide-react";
import { useTranslator } from "@/hooks/useTranslator";
import { useLearningSession } from "@/hooks/useLearningSession";
import { mapToChatMessage } from "@/lib/ChatMessage";

export const MyAssistantMessage = () => {
  return (
    <AssistantMessage.Root>
      <AssistantMessage.Avatar />
      <AssistantMessage.Content />
      <AssistantActionBar.Root>
        <AutomaticSpeak />
        <AssistantActionBar.Copy />
        <TranslateMessage />
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

const TranslateMessage = () => {
  const { user } = useLearningSession();
  const message = useMessage();

  const {
    data: translationResult,
    mutate: translate,
    isPending: isTranslating,
    error,
  } = useTranslator();

  const handleTranslate: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    const chatMessage = mapToChatMessage(message);

    if (!isTranslating && !translationResult) {
      translate({ user_id: user.id, message: chatMessage.content });
    }
  };

  const tooltipContent = error
    ? `Error: ${error.message || "Failed to translate"}`
    : translationResult
    ? translationResult.translated_text
    : "Click to translate";

  return (
    <AssistantActionBar.Copy tooltip={tooltipContent} onClick={handleTranslate}>
      {isTranslating ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        <LanguagesIcon />
      )}
    </AssistantActionBar.Copy>
  );
};
