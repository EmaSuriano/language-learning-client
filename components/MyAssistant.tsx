"use client";
import { makeMarkdownText } from "@assistant-ui/react-markdown";
import { Thread } from "@assistant-ui/react";

import { MyComposer } from "./MyComposer";
import { MyAssistantMessage } from "./MyAssistanceMessage";
import { useTranslations } from "next-intl";

export function MyAssistant() {
  const t = useTranslations();

  return (
    <Thread
      strings={{
        welcome: {
          message: t("welcome"),
        },
      }}
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
      }}
    />
  );
}
