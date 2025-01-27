"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { useLangGraphRuntime } from "@assistant-ui/react-langgraph";
import { makeMarkdownText } from "@assistant-ui/react-markdown";
import {
  Thread,
  Composer,
  useThreadConfig,
  ComposerPrimitive,
  useComposer,
  useMessageRuntime,
  useComposerRuntime,
} from "@assistant-ui/react";
import { WebSpeechSynthesisAdapter } from "@assistant-ui/react";
import { AssistantActionBar } from "@assistant-ui/react";
import {
  BellIcon,
  CodeIcon,
  SpeakerLoudIcon,
  SunIcon,
} from "@radix-ui/react-icons";
import { Progress } from "radix-ui";

import { createThread, getThreadState, sendMessage } from "@/lib/chatApi";
import AudioRecorder from "./AudioRecorder";
import { useTranscriber } from "@/hooks/useTranscriber";
import Constants from "@/lib/Constants";

const MarkdownText = makeMarkdownText();

export function MyAssistant() {
  const threadIdRef = useRef<string | undefined>(undefined);
  const speech = new WebSpeechSynthesisAdapter();

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
    adapters: { speech },
  });

  return (
    <>
      <Thread
        runtime={runtime}
        strings={{
          welcome: { message: "Ready to start learning?" },
        }}
        branchPicker={{
          allowBranchPicker: true,
        }}
        assistantMessage={{
          allowReload: true,
          allowCopy: true,
          allowSpeak: true,
          components: {
            Text: MarkdownText,
          },
        }}
        components={{
          Composer: MyComposer,
        }}
      />
    </>
  );
}

const MyComposer = () => {
  return (
    <Composer.Root>
      <ComposerRecord />
      <Composer.Input />
      <Composer.Send />
    </Composer.Root>
  );
};

const blobToAudioBuffer = async (data: Blob): Promise<AudioBuffer> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onloadend = async () => {
      const audioCTX = new AudioContext({
        sampleRate: Constants.SAMPLING_RATE,
      });

      const arrayBuffer = fileReader.result as ArrayBuffer;
      const decoded = await audioCTX.decodeAudioData(arrayBuffer);

      resolve(decoded);
    };
    fileReader.onerror = reject;
    fileReader.readAsArrayBuffer(data);
  });
};

const ComposerRecord = () => {
  const runtime = useComposerRuntime();
  const { output, start, isModelLoading, isBusy } = useTranscriber();

  const setAudioFromRecording = async (data: Blob) => {
    const decoded = await blobToAudioBuffer(data);
    start(decoded);
  };

  useEffect(() => {
    if (output && output.isBusy === false) {
      runtime.setText(output.text.trim());
      runtime.send();
    }
  }, [output]);

  return (
    <AudioRecorder
      onComplete={setAudioFromRecording}
      disabled={isModelLoading || isBusy}
    />
  );
};
