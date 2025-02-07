"use client";
import { useEffect, useRef, useState } from "react";
import { useLangGraphRuntime } from "@assistant-ui/react-langgraph";
import { makeMarkdownText } from "@assistant-ui/react-markdown";
import {
  Thread,
  Composer,
  AssistantMessage,
  useMessageRuntime,
  AssistantActionBar,
  useComposerRuntime,
  BranchPicker,
  useMessage,
  ThreadList,
} from "@assistant-ui/react";

import AudioRecord from "./AudioRecorder";
import Settings from "@/lib/Settings";
import { MyComposer } from "./MyComposer";
import { MyAssistantMessage } from "./MyAssistanceMessage";
import { useTranslations } from "next-intl";

export function MyAssistant() {
  const t = useTranslations();

  return (
    <>
      <div className="flex h-full">
        <div className="max-w-md">
          <ThreadList />
        </div>
        <div className="flex-grow">
          <Thread
            strings={{
              welcome: {
                message: t("welcome", { name: "Ema" }),
              },
            }}
            welcome={{
              suggestions: [
                { prompt: "Hi" },
                { prompt: "tell me a one line joke" },
                { prompt: "Can you teach me something new?" },
                {
                  prompt:
                    "Can you provide feedback from our last conversation?",
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
        </div>
      </div>
    </>
  );
}
