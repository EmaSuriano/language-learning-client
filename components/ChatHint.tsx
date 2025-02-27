"use client";

import { MouseEventHandler, useState } from "react";
import {
  Composer,
  useComposerRuntime,
  useThreadRuntime,
} from "@assistant-ui/react";

import { ChatBubbleIcon, UpdateIcon } from "@radix-ui/react-icons";
import { mapToChatMessage } from "@/lib/ChatMessage";
import { useHint } from "@/hooks/useHint";
import { useLearningSession } from "@/hooks/useLearningSession";

const ChatHint = () => {
  const [tries, setTries] = useState(3);

  const { user, selectedSituation } = useLearningSession();
  const runtime = useComposerRuntime();
  const threadRuntime = useThreadRuntime();
  const { mutateAsync: fetchHint, isPending } = useHint();

  if (!user || !selectedSituation) {
    return null;
  }

  const onHintClicked: MouseEventHandler = async (e) => {
    e.preventDefault();

    if (tries <= 0) return;

    const { messages } = threadRuntime.getState();

    try {
      const { hint } = await fetchHint({
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
      disabled={isPending || tries == 0}
      onClick={onHintClicked}
      tooltip={`Get hint. Left tries: ${tries}`}
    >
      {isPending ? (
        <UpdateIcon className="w-6 h-6 text-white animate-spin" />
      ) : (
        <ChatBubbleIcon />
      )}
    </Composer.Send>
  );
};

export default ChatHint;
