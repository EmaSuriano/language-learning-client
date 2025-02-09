"use client";

import { MouseEventHandler, use, useEffect, useState } from "react";
import {
  Composer,
  ThreadWelcome,
  useComposerRuntime,
  useThreadRuntime,
} from "@assistant-ui/react";

import AudioRecord from "./AudioRecorder";
import { useLocaleStore } from "@/hooks/useLocaleStore";
import ChatHint from "./ChatHint";
import { useSituationStore } from "@/hooks/useSituationStore";

export const MyComposer = () => {
  return (
    <Composer.Root>
      <ComposerRecord />
      <Composer.Input autoFocus />
      <div className="flex gap-2">
        <ChatHint />
        <Composer.Send />
      </div>
    </Composer.Root>
  );
};

const ComposerRecord = () => {
  const { locale } = useLocaleStore();
  const runtime = useComposerRuntime();

  const onRecordedComplete = (text: string) => {
    runtime.setText(text.trim());
    runtime.send();
  };

  return <AudioRecord onComplete={onRecordedComplete} language={locale} />;
};
