"use client";
import { MouseEvent, MouseEventHandler, useEffect } from "react";
import {
  AssistantMessage,
  useMessageRuntime,
  AssistantActionBar,
  useMessage,
} from "@assistant-ui/react";

import { useAppConfigStore } from "@/hooks/useAppConfigStore";
import { Button, Tooltip } from "@radix-ui/themes";
import { CheckIcon, LanguagesIcon, Loader2Icon } from "lucide-react";
import { useTranslator } from "@/hooks/useTranslator";
import { useLearningSession } from "@/hooks/useLearningSession";

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

    // extract to utils
    const msg = message.content
      .filter((c) => c.type === "text")
      .map((c) => c.text)
      .join(" ");

    // Only trigger if not already translating
    if (!isTranslating && !translationResult) {
      translate({ user_id: user.id, message: msg });
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
