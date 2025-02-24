"use client";

import React, { useEffect, useRef } from "react";
import {
  SituationProgressRequest,
  useSituationStore,
} from "@/hooks/useSituationStore";
import {
  ThreadMessage,
  useMessage,
  useThreadRuntime,
} from "@assistant-ui/react";
import { mapToChatMessage } from "@/lib/ChatMessage";
import { useUserStore } from "@/hooks/useUserStore";
import debounce from "debounce";

import { Popover } from "radix-ui";
import {
  BarChartIcon,
  CheckCircledIcon,
  CircleIcon,
  StarIcon,
} from "@radix-ui/react-icons";
import { useMetricsStore } from "@/hooks/useMetricsStore";
import { useAuthUser } from "@/hooks/useAuthUser";

const PROGRESS_REPORT_DELAY = 2000;

const SituationProgress = () => {
  const { report } = useMetricsStore();
  const { progress, fetchProgress } = useSituationStore();
  const { user } = useAuthUser();
  const { selectedSituation } = useSituationStore();
  const threadRuntime = useThreadRuntime();
  const messageRef = React.useRef<ThreadMessage | null>(null);

  useEffect(() => {
    threadRuntime.subscribe(async () => {
      const { messages } = threadRuntime.getState();
      const lastMessage = messages[messages.length - 1];
      const isLastMessageDone = lastMessage?.status?.type === "complete";

      if (
        !selectedSituation ||
        !user ||
        messageRef.current === lastMessage ||
        !isLastMessageDone
      ) {
        return;
      }

      messageRef.current = lastMessage;

      const call = async () => {
        try {
          await fetchProgress({
            messages: messages.map(mapToChatMessage),
            user_id: user.id,
            situation_id: selectedSituation.id,
          });
        } catch (error) {
          // Error handling is already done in the store
          console.error("Failed to fetch hint:", error);
        }
      };

      debounce(call, PROGRESS_REPORT_DELAY)();
    });
  }, [threadRuntime, selectedSituation, user, fetchProgress]);

  const completedGoals = progress.filter((goal) => goal.done).length;
  const totalGoals = progress.length;
  const completionPercentage =
    totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  if (!selectedSituation || report.length > 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Popover.Root defaultOpen>
        <Popover.Trigger asChild>
          <button
            className="inline-flex size-[45px] items-center justify-center rounded-full bg-white text-violet11 shadow-[0_2px_10px] shadow-blackA4 outline-none hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black"
            aria-label="View Progress"
          >
            <div className="relative">
              <StarIcon />
              <div className="absolute -top-4 -right-4 bg-violet9 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {completedGoals}
              </div>
            </div>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="w-[300px] mr-5 rounded bg-white p-5 shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] will-change-[transform,opacity] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.violet7)]"
            sideOffset={5}
          >
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[15px] font-medium leading-[19px] text-mauve12">
                  Progress - {selectedSituation?.name}
                </p>
                <span className="text-sm text-violet11 font-medium">
                  {completionPercentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-violet9 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>

              {/* Goals List */}
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {progress.map((goal, index) => (
                  <div key={index} className="flex items-start gap-2 py-1">
                    {goal.done ? (
                      <CheckCircledIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <CircleIcon className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    )}
                    <span
                      className={`text-[13px] ${
                        goal.done ? "text-gray-700" : "text-gray-500"
                      }`}
                    >
                      {goal.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-[13px] text-violet11">
                  {completedGoals} of {totalGoals} goals completed
                </p>
              </div>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};

export default SituationProgress;
