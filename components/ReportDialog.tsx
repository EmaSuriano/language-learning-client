"use client";

import * as React from "react";
import { mapToChatMessage } from "@/lib/ChatMessage";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Box,
  Text,
  Flex,
  Card,
  Heading,
  Button,
  Separator,
  Theme,
} from "@radix-ui/themes";
import { useLearningSession } from "@/hooks/useLearningSession";
import { SituationProgress } from "@/hooks/useSituations";
import { SituationProgressGoalList } from "./SituationProgressGoalList";
import { useEvaluatorOverview, useMetricsReport } from "@/hooks/useEvaluator";
import { EvaluatorOverviewChart } from "./EvaluatorOverviewChart";
import { ThreadMessage } from "@assistant-ui/react";
import { useAddLearningSession } from "@/hooks/useUserLearningHistory";
import { useRouter } from "next/navigation";
import { MarkdownPreview } from "./MarkdownPreview";
import { ReloadIcon } from "@radix-ui/react-icons";
import Link from "next/link";

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

  // Use ref instead of state to prevent re-renders triggering multiple fetches
  const fetchStartedRef = React.useRef(false);

  React.useEffect(() => {
    // Only execute this effect once
    if (!fetchStartedRef.current) {
      fetchStartedRef.current = true;

      // Start both fetches
      fetchOverview(params);
      fetchReport(params);
    }
  }, []);

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
    <Dialog.Root open modal>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Theme accentColor="indigo" grayColor="slate">
          <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] overflow-auto max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
            <Card size="3">
              <Flex direction="column" gap="2">
                <Box>
                  <Heading size="5">Chat overview</Heading>
                  <Text size="2" color="gray">
                    Scenario: {selectedSituation.name}
                  </Text>
                </Box>

                <Flex gap="4" justify="between">
                  <Box style={{ width: "48%" }}>
                    <Heading size="3" mb="2">
                      Goals summary
                    </Heading>
                    <SituationProgressGoalList goals={progress.goals} />
                  </Box>

                  <Box style={{ width: "48%" }}>
                    <Flex justify="between" align="center" mb="2">
                      <Heading size="3">Overview summary</Heading>
                      <Button
                        variant="ghost"
                        size="1"
                        onClick={() => fetchOverview(params)}
                      >
                        <ReloadIcon width="14" height="14" className="mr-1" />
                        Refresh
                      </Button>
                    </Flex>

                    <Box className="overflow-y-auto max-h-[40vh]">
                      {isOverviewPending && !overview ? (
                        <Flex justify="center" py="4">
                          <Text size="2">Loading overview...</Text>
                        </Flex>
                      ) : isOverviewError ? (
                        <Flex justify="center" py="4">
                          <Text size="2" color="red">
                            Error loading overview. Please try again.
                          </Text>
                        </Flex>
                      ) : overview ? (
                        <EvaluatorOverviewChart data={overview} />
                      ) : null}
                    </Box>
                  </Box>
                </Flex>

                <Separator size="4" mb="2" />

                <Box>
                  <Flex justify="between" align="center" mb="2">
                    <Heading size="3">Feedback report</Heading>
                    <Button
                      variant="ghost"
                      size="1"
                      onClick={() => fetchReport(params)}
                    >
                      <ReloadIcon width="14" height="14" className="mr-1" />
                      Refresh report
                    </Button>
                  </Flex>

                  <Box
                    className="prose prose-sm relative"
                    style={{ minHeight: "150px" }}
                  >
                    {/* Always render the MarkdownPreview if report exists */}
                    {report && (
                      <Box className={isReportPending ? "opacity-30" : ""}>
                        <MarkdownPreview>{report}</MarkdownPreview>
                      </Box>
                    )}

                    {/* Show loading overlay during pending state */}
                    {isReportPending && (
                      <Flex
                        className="absolute inset-0 bg-slate-50/60 transition-opacity duration-200"
                        justify="center"
                        align="center"
                      >
                        <Text size="2">Generating report...</Text>
                      </Flex>
                    )}

                    {/* Show error message */}
                    {isReportError && !isReportPending && (
                      <Text size="2" color="red">
                        Error loading report. Please try again.
                      </Text>
                    )}

                    {/* Show empty state */}
                    {!report && !isReportPending && !isReportError && (
                      <Flex justify="center" align="center" py="6">
                        <Text size="2" color="gray">
                          No report data available
                        </Text>
                      </Flex>
                    )}
                  </Box>
                </Box>

                <Flex justify="end" gap="2">
                  <Link href="/new-chat">
                    <Button
                      disabled={
                        isOverviewError || isOverviewPending || !overview
                      }
                      size="3"
                      color="red"
                      variant="soft"
                    >
                      New chat
                    </Button>
                  </Link>
                  <Button
                    disabled={isOverviewError || isOverviewPending || !overview}
                    onClick={onSaveConversation}
                    size="3"
                    variant="classic"
                  >
                    Save progress
                  </Button>
                </Flex>
              </Flex>
            </Card>
          </Dialog.Content>
        </Theme>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
