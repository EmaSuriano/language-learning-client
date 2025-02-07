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

export const MyComposer = () => {
  return (
    <Composer.Root>
      <ComposerRecord />
      <Composer.Input autoFocus />
      <div className="flex gap-2">
        <Composer.Send />
      </div>
    </Composer.Root>
  );
};

const ComposerRecord = () => {
  const runtime = useComposerRuntime();

  const onRecordedComplete = (text: string) => {
    runtime.setText(text.trim());
    runtime.send();
  };

  return (
    <AudioRecord onComplete={onRecordedComplete} language={Settings.LANGUAGE} />
  );
};
