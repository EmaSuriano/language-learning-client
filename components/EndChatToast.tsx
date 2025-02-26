"use client";

import * as React from "react";
import * as Toast from "@radix-ui/react-toast";
import { useThreadRuntime } from "@assistant-ui/react";
import { useMetricsStore } from "@/hooks/useMetricsStore";
import { useSituationStore } from "@/hooks/useSituationStore";
import { mapToChatMessage } from "@/lib/ChatMessage";
import { Dialog } from "radix-ui";
import ReactMarkdown from "react-markdown";
import {
  CodeHeader,
  MakeMarkdownTextProps,
} from "@assistant-ui/react-markdown";
import classNames from "classnames";
import { useLearningSession } from "@/hooks/useLearningSession";

const MESSAGE_LIMIT = 20;

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

const MessageLimitToast = () => {
  const [toastOpen, setToastOpen] = React.useState(false);
  const [reportOpen, setReportOpen] = React.useState(false);

  const threadRuntime = useThreadRuntime();
  const { report, isStreaming, fetchReport } = useMetricsStore();
  const { user } = useLearningSession();
  const { selectedSituation } = useSituationStore();

  // Check if message count exceeds limit
  React.useEffect(() => {
    const unsub = threadRuntime.subscribe(() => {
      const { messages } = threadRuntime.getState();
      const hasReachedLimit = messages.length >= MESSAGE_LIMIT;
      setToastOpen(hasReachedLimit);
    });

    return unsub;
  }, [threadRuntime]);

  const onMetricsClick = async () => {
    const { messages } = threadRuntime.getState();
    if (!user || !selectedSituation) return;

    fetchReport({
      messages: messages.map(mapToChatMessage),
      user_id: user.id,
      situation_id: selectedSituation.id,
    }).then(() => {
      setReportOpen(true);
    });
  };

  return (
    <>
      <Toast.Provider swipeDirection="up" duration={Infinity}>
        <Toast.Root
          className="grid grid-cols-[auto_max-content] items-center gap-x-[15px] rounded-md bg-white p-[15px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] [grid-template-areas:_'title_action'_'description_action'] data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut data-[swipe=cancel]:transition-[transform_200ms_ease-out]"
          open={toastOpen && !reportOpen}
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
              onClick={onMetricsClick}
              className="inline-flex h-[25px] items-center justify-center rounded bg-green2 px-2.5 text-xs font-medium leading-[25px] text-green11 shadow-[inset_0_0_0_1px] shadow-green7 hover:shadow-[inset_0_0_0_1px] hover:shadow-green8 focus:shadow-[0_0_0_2px] focus:shadow-green8"
            >
              Results
            </button>
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport className="fixed top-4 left-1/2 -translate-x-1/2 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-2.5 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
      </Toast.Provider>

      <Dialog.Root open={reportOpen} modal>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content
            className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <div className="overflow-y-auto max-h-[60vh] prose prose-sm">
              <ReactMarkdown components={defaultComponents}>
                {report}
              </ReactMarkdown>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {isStreaming ? "Loading..." : "Start New Conversation"}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default MessageLimitToast;
