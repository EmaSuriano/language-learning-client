"use client";
import { makeMarkdownText } from "@assistant-ui/react-markdown";
import { Thread } from "@assistant-ui/react";

import { MyComposer } from "./MyComposer";
import { MyThreadWelcome } from "./MyThreadWelcome";
import { MyAssistantMessage } from "./MyAssistanceMessage";
import { useTranslations } from "next-intl";
import { useLearningSession } from "@/hooks/useLearningSession";

export function MyAssistant() {
  const t = useTranslations();

  const { user } = useLearningSession();
  const { has_tts } = user.current_language;

  return (
    <Thread
      welcome={{
        suggestions: [
          { prompt: t("hello") },
          { prompt: t("excuse-me") },
          { prompt: t("ask-you-something") },
        ],
      }}
      branchPicker={{
        allowBranchPicker: true,
      }}
      assistantMessage={{
        allowCopy: true,
        allowSpeak: has_tts,
        components: {
          Text: makeMarkdownText(),
        },
      }}
      components={{
        Composer: MyComposer,
        AssistantMessage: MyAssistantMessage,
        ThreadWelcome: MyThreadWelcome,
      }}
    />
  );
}
