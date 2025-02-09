"use client";

import { MouseEventHandler, useState } from "react";
import {
  Composer,
  useComposerRuntime,
  useThreadRuntime,
} from "@assistant-ui/react";

import { ChatBubbleIcon, UpdateIcon } from "@radix-ui/react-icons";
import { mapToChatMessage } from "@/lib/ChatMessage";
import { useUserStore } from "@/hooks/useUserStore";
import { useHintStore } from "@/hooks/useHintStore";
import { useSituationStore } from "@/hooks/useSituationStore";

const ChatHint = () => {
  const [tries, setTries] = useState(3);

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

export default ChatHint;
