"use client";

import { MouseEventHandler, useState } from "react";
import {
  Composer,
  useComposerRuntime,
  useThreadRuntime,
} from "@assistant-ui/react";

import AudioRecord from "./AudioRecorder";
import { useLocaleStore } from "@/hooks/useLocaleStore";
import { ChatBubbleIcon, UpdateIcon } from "@radix-ui/react-icons";
import { mapToChatMessage } from "@/lib/ChatMessage";
import { useUserStore } from "@/hooks/useUserStore";
import { useHintStore } from "@/hooks/useHintStore";
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

const ChatHint = () => {
  const [tries, setTries] = useState(999);

  const { user } = useUserStore();
  const runtime = useComposerRuntime();
  const threadRuntime = useThreadRuntime();
  const { fetchHint, isLoading } = useHintStore();
  const { selectedSituation } = useSituationStore();

  if (!user || !selectedSituation) {
    return null;
  }

  const onHintClicked: MouseEventHandler = async (e) => {
    e.preventDefault();

    const { messages } = threadRuntime.getState();

    try {
      const hint = await fetchHint({
        messages: messages.map(mapToChatMessage),
        user_id: user.id,
        situation_id: selectedSituation.id,
      });

      runtime.setText(hint);
      setTries(tries - 1);
    } catch (error) {
      // Error handling is already done in the store
      console.error("Failed to fetch hint:", error);
    }
  };

  return (
    <Composer.Send
      disabled={isLoading || tries == 0}
      onClick={onHintClicked}
      tooltip={`Get hint. Left tries: ${tries}`}
    >
      {isLoading ? (
        <UpdateIcon className="w-6 h-6 text-white animate-spin" />
      ) : (
        <ChatBubbleIcon />
      )}
    </Composer.Send>
  );
};
