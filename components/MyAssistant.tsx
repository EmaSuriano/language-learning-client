"use client";
import { makeMarkdownText } from "@assistant-ui/react-markdown";
import { Thread } from "@assistant-ui/react";

import { MyComposer } from "./MyComposer";
import { MyThreadWelcome } from "./MyThreadWelcome";
import { MyAssistantMessage } from "./MyAssistanceMessage";
import { useTranslations } from "next-intl";

export function MyAssistant() {
  const t = useTranslations();

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
        allowReload: true,
        allowCopy: true,
        allowSpeak: true,
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
