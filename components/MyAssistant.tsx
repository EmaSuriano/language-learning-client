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

export function MyAssistant() {
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
                message: "Ready to start a language exchange?",
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
  const runtime = useComposerRuntime();

  console.log(runtime.getState());
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

  return <AudioRecord onComplete={onRecordedComplete} />;
};
