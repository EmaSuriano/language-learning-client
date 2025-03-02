"use client";

import React, { useEffect } from "react";
import { mapToChatMessage } from "@/lib/ChatMessage";
import debounce from "debounce";

import { Popover, Toast } from "radix-ui";
import { StarIcon } from "@radix-ui/react-icons";
import { useLearningSession } from "@/hooks/useLearningSession";
import {
  Situation,
  SituationProgress,
  useSituationProgress,
} from "@/hooks/useSituations";
import { useChatMessages } from "@/hooks/useChatMessages";
import { ReportDialog } from "./ReportDialog";
import { SituationProgressGoalList } from "./SituationProgressGoalList";

const PROGRESS_REPORT_DELAY = 2000;

export const ProgressTracker = () => {
  const { user, selectedSituation } = useLearningSession();

  const [reportOpen, setReportOpen] = React.useState(false);
  const messages = useChatMessages();
  const { data: progress, refetch } = useSituationProgress({
    messages: messages.map(mapToChatMessage),
    user_id: user.id,
    situation_id: selectedSituation.id,
  });

  useEffect(() => {
    // We start checking the report only after the first message
    if (messages.length > 1) {
      debounce(refetch, PROGRESS_REPORT_DELAY)();
    }
  }, [messages, refetch]);

  if (!progress) {
    return null;
  }

  if (reportOpen) {
    return <ReportDialog progress={progress} />;
  }

  return (
    <>
      <GoalsOverview situation={selectedSituation} goals={progress.goals} />
      <EndChatToast
        open={progress.conversation_over}
        onResultClick={() => setReportOpen(true)}
      />
    </>
  );
};

const GoalsOverview = ({
  situation,
  goals,
}: {
  situation: Situation;
  goals: SituationProgress["goals"];
}) => {
  const completedGoals = goals.filter((goal) => goal.done).length;
  const totalGoals = goals.length;
  const completionPercentage =
    totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <div className="fixed top-4 right-8 z-50">
      <Popover.Root>
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
                  Progress - {situation.name}
                </p>
                <span className="text-sm text-violet11 font-medium">
                  {completionPercentage}%
                </span>
              </div>

              <SituationProgressGoalList goals={goals} />

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

const EndChatToast = ({
  open,
  onResultClick,
}: {
  open: boolean;
  onResultClick: VoidFunction;
}) => {
  return (
    <Toast.Provider swipeDirection="up" duration={Infinity}>
      <Toast.Root
        className="grid grid-cols-[auto_max-content] items-center gap-x-[15px] rounded-md bg-white p-[15px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] [grid-template-areas:_'title_action'_'description_action'] data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut data-[swipe=cancel]:transition-[transform_200ms_ease-out]"
        open={open}
        duration={Infinity}
      >
        <Toast.Title className="mb-[5px] text-[15px] font-medium text-slate12 [grid-area:_title]">
          What a wonderful conversation!
        </Toast.Title>
        <Toast.Description className="m-0 text-[13px] leading-[1.3] text-slate11 [grid-area:_description]">
          Click here to get your results and end the chat.
        </Toast.Description>
        <Toast.Action
          className="[grid-area:_action]"
          asChild
          altText="Dismiss notification"
        >
          <button
            onClick={onResultClick}
            className="inline-flex h-[25px] items-center justify-center rounded bg-green2 px-2.5 text-xs font-medium leading-[25px] text-green11 shadow-[inset_0_0_0_1px] shadow-green7 hover:shadow-[inset_0_0_0_1px] hover:shadow-green8 focus:shadow-[0_0_0_2px] focus:shadow-green8"
          >
            Results
          </button>
        </Toast.Action>
      </Toast.Root>
      <Toast.Viewport className="fixed top-4 left-1/2 -translate-x-1/2 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-2.5 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
    </Toast.Provider>
  );
};
