"use client";

import * as React from "react";
import { useMetricsStore } from "@/hooks/useMetricsStore";
import { mapToChatMessage } from "@/lib/ChatMessage";
import { Dialog } from "radix-ui";
import ReactMarkdown from "react-markdown";
import { MakeMarkdownTextProps } from "@assistant-ui/react-markdown";
import classNames from "classnames";
import { useLearningSession } from "@/hooks/useLearningSession";
import { useChatMessages } from "@/hooks/useChatMessages";
import { Situation, SituationProgress } from "@/hooks/useSituations";
import { SituationProgressGoalList } from "./SituationProgressGoalList";
import { useEvaluatorOverview } from "@/hooks/useEvaluator";
import { EvaluatorOverviewChart } from "./EvaluatorOverviewChart";

const defaultComponents: MakeMarkdownTextProps["components"] = {
  h1: ({ node, className, ...props }) => (
    <h1 className={classNames("aui-md-h1", className)} {...props} />
  ),
  h2: ({ node, className, ...props }) => (
    <h2 className={classNames("aui-md-h2", className)} {...props} />
  ),
  h3: ({ node, className, ...props }) => (
    <h3 className={classNames("aui-md-h3", className)} {...props} />
  ),
  h4: ({ node, className, ...props }) => (
    <h4 className={classNames("aui-md-h4", className)} {...props} />
  ),
  h5: ({ node, className, ...props }) => (
    <h5 className={classNames("aui-md-h5", className)} {...props} />
  ),
  h6: ({ node, className, ...props }) => (
    <h6 className={classNames("aui-md-h6", className)} {...props} />
  ),
  p: ({ node, className, ...props }) => (
    <p className={classNames("aui-md-p", className)} {...props} />
  ),
  a: ({ node, className, ...props }) => (
    <a className={classNames("aui-md-a", className)} {...props} />
  ),
  blockquote: ({ node, className, ...props }) => (
    <blockquote
      className={classNames("aui-md-blockquote", className)}
      {...props}
    />
  ),
  ul: ({ node, className, ...props }) => (
    <ul className={classNames("aui-md-ul", className)} {...props} />
  ),
  ol: ({ node, className, ...props }) => (
    <ol className={classNames("aui-md-ol", className)} {...props} />
  ),
  hr: ({ node, className, ...props }) => (
    <hr className={classNames("aui-md-hr", className)} {...props} />
  ),
  table: ({ node, className, ...props }) => (
    <table className={classNames("aui-md-table", className)} {...props} />
  ),
  th: ({ node, className, ...props }) => (
    <th className={classNames("aui-md-th", className)} {...props} />
  ),
  td: ({ node, className, ...props }) => (
    <td className={classNames("aui-md-td", className)} {...props} />
  ),
  tr: ({ node, className, ...props }) => (
    <tr className={classNames("aui-md-tr", className)} {...props} />
  ),
  sup: ({ node, className, ...props }) => (
    <sup className={classNames("aui-md-sup", className)} {...props} />
  ),
  pre: ({ node, className, ...props }) => (
    <pre className={classNames("aui-md-pre", className)} {...props} />
  ),
};

export const ReportDialog = ({ progress }: { progress: SituationProgress }) => {
  // const { report, isStreaming, fetchReport } = useMetricsStore();
  const { user, selectedSituation } = useLearningSession();
  const messages = useChatMessages();
  const {
    data: overview,
    isPending,
    isError,
    mutateAsync: fetchOverview,
  } = useEvaluatorOverview();

  // React.useEffect(() => {
  //   if (open) {
  //     fetchReport({
  //       messages: messages.map(mapToChatMessage),
  //       user_id: user.id,
  //       situation_id: situation.id,
  //     });
  //   }
  // }, [open]);

  const getOverview = () =>
    fetchOverview({
      messages: messages.map(mapToChatMessage),
      user_id: user.id,
      situation_id: selectedSituation.id,
    });

  React.useEffect(() => {
    getOverview();
  }, []);

  return (
    <>
      <Dialog.Root open modal>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content
            className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <Dialog.Title className="my-2 text-xl font-medium text-black">
              Chat overview
            </Dialog.Title>

            <Dialog.Description className="mb-8 text-lg font-medium text-black">
              Scenario: {selectedSituation.name}
            </Dialog.Description>

            <h3 className="text-md mb-2 font-medium leading-[19px] text-black">
              Goals summary
            </h3>

            <SituationProgressGoalList goals={progress.goals} />

            <h3 className="text-md mt-6 font-medium leading-[19px] text-black">
              Overview summary
            </h3>

            <div className="overflow-y-auto max-h-[60vh] prose prose-sm">
              {isPending
                ? "Loading ..."
                : isError
                ? "Error"
                : overview && <EvaluatorOverviewChart data={overview} />}
            </div>

            <h3 className="text-md mt-6 font-medium leading-[19px] text-black">
              Feedback report
            </h3>

            {/* <div className="overflow-y-auto max-h-[60vh] prose prose-sm">
              <ReactMarkdown components={defaultComponents}>
                {report}
              </ReactMarkdown>
            </div> */}

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={getOverview}
                className="inline-flex h-10 items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                Try again
              </button>

              <button
                disabled={isPending}
                onClick={() => window.location.reload()}
                className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Start New Conversation
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
