"use client";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { useLangGraphRuntime } from "@assistant-ui/react-langgraph";
import { makeMarkdownText } from "@assistant-ui/react-markdown";
import {
  ThreadList,
  Thread,
  Composer,
  AssistantMessage,
  useThreadConfig,
  ComposerPrimitive,
  useComposer,
  useMessageRuntime,
  AssistantActionBar,
  useComposerRuntime,
  BranchPicker,
  useContentPartText,
  useMessage,
  useRuntimeState,
  useThreadRuntime,
} from "@assistant-ui/react";
import { WebSpeechSynthesisAdapter } from "@assistant-ui/react";

import { Progress } from "radix-ui";
import { useActionBarSpeak } from "@assistant-ui/react/src/primitive-hooks/actionBar/useActionBarSpeak";

import { createThread, getThreadState, sendMessage } from "@/lib/chatApi";
import AudioRecorder from "./AudioRecorder";
import { useTranscriber } from "@/hooks/useTranscriber";
import Constants from "@/lib/Constants";
import { ApiSpeechSynthesisAdapter } from "./ApiSpeechSynthesisAdapter";
import AudioRecord from "./AudioRecorder";

export function MyAssistant() {
  const threadIdRef = useRef<string | undefined>(undefined);

  const runtime = useLangGraphRuntime({
    threadId: threadIdRef.current,
    stream: async (messages, { command }) => {
      if (!threadIdRef.current) {
        const { thread_id } = await createThread();
        threadIdRef.current = thread_id;
      }
      const threadId = threadIdRef.current;
      return sendMessage({
        threadId,
        messages,
        command,
      });
    },
    onSwitchToNewThread: async () => {
      const { thread_id } = await createThread();
      threadIdRef.current = thread_id;
    },
    onSwitchToThread: async (threadId) => {
      const state = await getThreadState(threadId);
      threadIdRef.current = threadId;
      return { messages: state.values.messages };
    },
    adapters: { speech: new ApiSpeechSynthesisAdapter() },
  });

  return (
    <>
      <Thread
        runtime={runtime}
        strings={{
          welcome: {
            message: "Ready to start learning?",
          },
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
    </>
  );
}

const MyAssistantMessage = () => {
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

const MyComposer = () => {
  return (
    <Composer.Root>
      <Composer.Input autoFocus />
      <div className="flex gap-2">
        <ComposerRecord />
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

  return <AudioRecord onComplete={onRecordedComplete} />;
};
