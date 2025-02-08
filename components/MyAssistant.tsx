"use client";
import { makeMarkdownText } from "@assistant-ui/react-markdown";
import { Thread, ThreadList } from "@assistant-ui/react";

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
          { prompt: "tell me a one line joke" },
          { prompt: "Can you teach me something new?" },
          {
            prompt: "Can you provide feedback from our last conversation?",
          },
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
