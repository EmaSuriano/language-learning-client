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
import { useEvaluatorOverview, useMetricsReport } from "@/hooks/useEvaluator";
import { EvaluatorOverviewChart } from "./EvaluatorOverviewChart";
import { ThreadMessage } from "@assistant-ui/react";
import { useAddLearningSession } from "@/hooks/useUserLearningHistory";
import { useRouter } from "next/navigation";

export const ReportDialog = ({
  progress,
  messages,
}: {
  progress: SituationProgress;
  messages: ThreadMessage[];
}) => {
  const router = useRouter();
  const { user, selectedSituation } = useLearningSession();
  const {
    data: overview,
    isPending: isOverviewPending,
    isError: isOverviewError,
    mutateAsync: fetchOverview,
  } = useEvaluatorOverview();
  const initialFetchRef = React.useRef(false);
  const { mutateAsync: addLearningSession } = useAddLearningSession();
  const {
    data: report,
    isError: isReportError,
    isPending: isReportPending,
    mutateAsync: fetchReport,
  } = useMetricsReport();

  const params = React.useMemo(() => {
    return {
      messages: messages.map(mapToChatMessage),
      user_id: user.id,
      situation_id: selectedSituation.id,
    };
  }, [messages, user.id, selectedSituation.id]);

  React.useEffect(() => {
    if (!initialFetchRef.current) {
      fetchOverview(params);
      fetchReport(params);

      initialFetchRef.current = true;
    }
  }, [params]);

  const onSaveConversation = () => {
    if (!overview) return;

    const goalsScore =
      (progress.goals.reduce((acc, goal) => acc + (goal.done ? 1 : 0), 0) /
        progress.goals.length) *
      100;

    addLearningSession({
      user_id: user.id,
      situation_id: selectedSituation.id,
      language_id: 1,
      level: 1,
      date: new Date().toISOString(),
      grammar_score: overview.grammar,
      vocabulary_score: overview.vocabulary,
      fluency_score: overview.fluency,
      goals_score: goalsScore,
    }).then(() => router.push("/history"));
  };

  return (
    <>
      <Dialog.Root open modal>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content
            className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] overflow-auto max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <Dialog.Title className="my-2 text-xl font-medium text-black">
              Chat overview
            </Dialog.Title>

            <Dialog.Description className="mb-4 text-lg font-medium text-black">
              Scenario: {selectedSituation.name}
            </Dialog.Description>

            <div className="flex justify-between">
              <div className="w-1/2">
                <h3 className="text-md mb-6 font-medium leading-[19px] text-black">
                  Goals summary
                </h3>

                <SituationProgressGoalList goals={progress.goals} />
              </div>

              <div className="w-1/2">
                <div className="flex justify-between gap-4">
                  <h3 className="text-md font-medium leading-[19px] text-black">
                    Overview summary
                  </h3>

                  <button onClick={() => fetchOverview(params)}>
                    Try again
                  </button>
                </div>

                <div className="overflow-y-auto max-h-[60vh] prose prose-sm">
                  {isOverviewPending
                    ? "Loading ..."
                    : isOverviewError
                    ? "Error loading overview. Please try again."
                    : overview && <EvaluatorOverviewChart data={overview} />}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <h3 className="text-md font-medium leading-[19px] text-black">
                Feedback report
              </h3>

              <button
                onClick={() => fetchReport(params)}
                className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
              >
                Refresh report
              </button>
            </div>

            <div className="prose prose-sm">
              {isReportPending && !report && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-80">
                  <span>Generating report...</span>
                </div>
              )}

              {isReportError && (
                <div className="text-red-500">
                  Error loading report. Please try again.
                </div>
              )}

              {report && (
                <ReactMarkdown components={defaultComponents}>
                  {report}
                </ReactMarkdown>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                disabled={isOverviewError || isOverviewPending}
                onClick={onSaveConversation}
                className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Save Conversation
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

const defaultComponents: MakeMarkdownTextProps["components"] = {
  h1: ({ node, className, ...props }) => (
    <h6 className={classNames("aui-md-h6", className)} {...props} />
  ),
  h2: ({ node, className, ...props }) => (
    <h6 className={classNames("aui-md-h6", className)} {...props} />
  ),
  h3: ({ node, className, ...props }) => (
    <h6 className={classNames("aui-md-h6", className)} {...props} />
  ),
  h4: ({ node, className, ...props }) => (
    <h6 className={classNames("aui-md-h6", className)} {...props} />
  ),
  h5: ({ node, className, ...props }) => (
    <h6 className={classNames("aui-md-h6", className)} {...props} />
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
