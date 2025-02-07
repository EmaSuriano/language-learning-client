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

export const MyAssistantMessage = () => {
  return (
    <AssistantMessage.Root>
      <AssistantMessage.Avatar />
      <AssistantMessage.Content />
      <BranchPicker />
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
