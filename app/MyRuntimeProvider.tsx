"use client";

import type { ReactNode } from "react";
import {
  AssistantRuntimeProvider,
  ChatModelRunResult,
  ThreadMessage,
  useLocalRuntime,
  type ChatModelAdapter,
} from "@assistant-ui/react";
import { ApiSpeechSynthesisAdapter } from "@/components/ApiSpeechSynthesisAdapter";
import { handleStreamResponse } from "@/lib/createModelStream";

interface OutputMessage {
  role: string;
  content: string;
}

const mapMessages = (messages: ThreadMessage[]): OutputMessage[] => {
  return messages.map((msg) => ({
    role: msg.role,
    content: msg.content
      .filter((c) => c.type === "text")
      .map((c) => c.text)
      .join(" "),
  }));
};

const MyModelAdapter: ChatModelAdapter = {
  run({ messages, abortSignal }) {
    // TODO replace with your own API

    // Log the stream in parallel
    return (async function* () {
      const response = await fetch(
        process.env["NEXT_PUBLIC_ASSISTANT_URL"]! + "/v1/assistant/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          body: JSON.stringify({ messages: mapMessages([...messages]) }),
          signal: abortSignal,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Response body is null");
      }

      const decoder = new TextDecoder();
      let accumulatedText = "";

      // Initial yield with running status
      yield {
        status: { type: "running" },
        content: [
          {
            type: "text",
            text: accumulatedText,
          },
        ],
      };

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            // Final yield with complete status
            yield {
              status: {
                type: "complete",
                reason: "stop",
              },
              content: [
                {
                  type: "text",
                  text: accumulatedText,
                },
              ],
            };
            break;
          }

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(5).trim();

              if (data === "[DONE]") {
                return;
              }

              try {
                const { content } = JSON.parse(data);
                accumulatedText += content;

                yield {
                  status: { type: "running" },
                  content: [
                    {
                      type: "text",
                      text: accumulatedText,
                    },
                  ],
                };
              } catch (e) {
                yield {
                  status: {
                    type: "incomplete",
                    reason: "error",
                    error: String(e),
                  },
                  content: [
                    {
                      type: "text",
                      text: accumulatedText,
                    },
                  ],
                };
              }
            }
          }
        }
      } catch (error) {
        yield {
          status: {
            type: "incomplete",
            reason: "error",
            error: String(error),
          },
          content: [
            {
              type: "text",
              text: accumulatedText,
            },
          ],
        };
      } finally {
        reader.releaseLock();
      }
    })();
  },
};

export function MyRuntimeProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const runtime = useLocalRuntime(MyModelAdapter, {
    adapters: { speech: new ApiSpeechSynthesisAdapter() },
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
