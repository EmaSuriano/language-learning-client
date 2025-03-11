"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
  ReferenceLine,
  Bar,
  BarChart,
} from "recharts";
import _ from "lodash";
import {
  Card,
  Text,
  Heading,
  Flex,
  Box,
  Tabs,
  Grid,
  Container,
  Separator,
  Button,
} from "@radix-ui/themes";
import {
  UserLearningHistory,
  useUserLearningHistory,
} from "@/hooks/useUserLearningHistory";
import { useAuthUser } from "@/hooks/useLearningSession";
import { ChartArea } from "lucide-react";
import { LoopIcon } from "@radix-ui/react-icons";
import { UserLevelProgression } from "./UserLevelProgression";
import { capitalize, formatLevelToText } from "@/lib/helpers";

const TABS = ["detailed", "trend", "progression"] as const;

type Tab = (typeof TABS)[number];

export const LearningHistory = () => {
  const { user } = useAuthUser();
  const [tab, setTab] = useState<Tab>(TABS[0]);
  const {
    data: learningHistory = [],
    isPending: loading,
    error,
    refetch,
  } = useUserLearningHistory(user!.id);

  // Handle loading and error states
  if (loading) {
    return (
      <Box className="min-h-screen bg-slate-50">
        <Container size="1" pt="6">
          <Card size="3" className="shadow-md">
            <Flex height="16" align="center" justify="center">
              <Box className="animate-pulse flex space-x-4 w-1/2">
                <Box className="rounded-full bg-slate-200 h-10 w-10"></Box>
                <Box className="flex-1 space-y-6 py-1">
                  <Box className="h-2 bg-slate-200 rounded"></Box>
                  <Box className="space-y-3">
                    <Box className="grid grid-cols-3 gap-4">
                      <Box className="h-2 bg-slate-200 rounded col-span-2"></Box>
                      <Box className="h-2 bg-slate-200 rounded col-span-1"></Box>
                    </Box>
                    <Box className="h-2 bg-slate-200 rounded"></Box>
                  </Box>
                </Box>
              </Box>
            </Flex>
          </Card>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="min-h-screen bg-slate-50">
        <Container size="1" pt="6">
          <Card size="3" className="shadow-md">
            <Flex height="16" align="center" justify="center">
              <Text color="red" size="3">
                {error.message}
              </Text>
            </Flex>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-slate-50">
      <Container size="4" p="6">
        <Card size="3" className="shadow-md">
          <Flex direction="column" mb="4">
            <Flex gap="2" align="center">
              <ChartArea size={20} />
              <Heading size="6">Learning Progress</Heading>
            </Flex>

            <Text size="2" color="gray">
              Track your language learning journey with detailed analytics
            </Text>
          </Flex>

          <Flex
            justify="between"
            align={{ initial: "start", sm: "center" }}
            direction={{ initial: "column", sm: "row" }}
            gap="4"
          >
            <Text size="4" weight="bold">
              Level: {formatLevelToText(user!.language_level)}
            </Text>

            <Tabs.Root
              defaultValue="detailed"
              value={tab}
              onValueChange={(str) => setTab(str as Tab)}
            >
              <Tabs.List className="flex border-b">
                {TABS.map((tab) => (
                  <Tabs.Trigger
                    key={tab}
                    className="px-4 py-2 focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-500"
                    value={tab}
                  >
                    {capitalize(tab)}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
            </Tabs.Root>
          </Flex>

          <LearningHistoryChart tab={tab} learningHistory={learningHistory} />

          <Flex className="flex-col items-end">
            <Button onClick={() => refetch()} variant="ghost" size="2">
              <LoopIcon />
              Refresh values
            </Button>
          </Flex>

          <Separator size="4" my="4" />

          <UserLevelProgression />

          <Box my="4" />

          <Grid columns={{ initial: "1", sm: "2", md: "4" }} gap="4">
            <Card className="bg-violet-100">
              <Flex direction="column" gap="1">
                <Text size="2" weight="bold" color="violet">
                  Grammar
                </Text>
                <Text size="6" weight="bold">
                  {Math.round(_.meanBy(learningHistory, "grammar_score") || 0)}
                  <Text size="2" weight="regular" color="violet">
                    /100
                  </Text>
                </Text>
              </Flex>
            </Card>

            <Card className="bg-green-100">
              <Flex direction="column" gap="1">
                <Text size="2" weight="bold" color="green">
                  Vocabulary
                </Text>
                <Text size="6" weight="bold">
                  {Math.round(
                    _.meanBy(learningHistory, "vocabulary_score") || 0
                  )}
                  <Text size="2" weight="regular" color="green">
                    /100
                  </Text>
                </Text>
              </Flex>
            </Card>

            <Card className="bg-amber-100">
              <Flex direction="column" gap="1">
                <Text size="2" weight="bold" color="amber">
                  Fluency
                </Text>
                <Text size="6" weight="bold">
                  {Math.round(_.meanBy(learningHistory, "fluency_score")) || 0}
                  <Text size="2" weight="regular" color="amber">
                    /100
                  </Text>
                </Text>
              </Flex>
            </Card>

            <Card className="bg-orange-100">
              <Flex direction="column" gap="1">
                <Text size="2" weight="bold" color="orange">
                  Goals
                </Text>
                <Text size="6" weight="bold">
                  {Math.round(_.meanBy(learningHistory, "goals_score")) || 0}
                  <Text size="2" weight="regular" color="orange">
                    /100
                  </Text>
                </Text>
              </Flex>
            </Card>
          </Grid>
        </Card>
      </Container>
    </Box>
  );
};

const CustomTooltip = ({
  active,
  payload,
  label,
  tab,
}: {
  tab: Tab;
  active?: boolean;
  payload?: any[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <Card size="1" style={{ maxWidth: "220px" }}>
        <Flex direction="column" gap="1">
          <Text weight="bold">
            {tab === "trend" ? `Sessions ${label}` : `Session ${label}`}
          </Text>
          {payload.map((entry, index) => (
            <Text key={index} size="2" style={{ color: entry.color }}>
              {entry.name}: {Math.round(entry.value * 100) / 100}
            </Text>
          ))}
        </Flex>
      </Card>
    );
  }
  return null;
};

const LearningHistoryChart = ({
  learningHistory,
  tab,
}: {
  learningHistory: UserLearningHistory;
  tab: Tab;
}) => {
  const formattedData = learningHistory.map((item, index) => ({
    session: index + 1,
    id: item.id,
    grammar: item.grammar_score,
    vocabulary: item.vocabulary_score,
    fluency: item.fluency_score,
    goals: item.goals_score,
    level: item.level,
    level_change: item.level_change,
    date: new Date(item.date).toLocaleDateString(),
  }));

  // Calculate 5-session averages for trend view
  const chunkSize = 5;
  const chunks = _.chunk(formattedData, chunkSize);
  const avgData = chunks.map((chunk, i) => ({
    sessionGroup: `${i * chunkSize + 1}-${Math.min(
      (i + 1) * chunkSize,
      formattedData.length
    )}`,
    avgGrammar: _.meanBy(chunk, "grammar"),
    avgVocabulary: _.meanBy(chunk, "vocabulary"),
    avgFluency: _.meanBy(chunk, "fluency"),
    avgGoals: _.meanBy(chunk, "goals"),
  }));

  const chartData = formattedData;
  const averageData = avgData;

  return (
    <Box
      style={{ height: "400px", width: "100%" }}
      className="chart-container"
      mb="6"
    >
      <Tabs.Root value={tab} style={{ height: "100%", width: "100%" }}>
        <Tabs.Content
          value="detailed"
          style={{ height: "100%", width: "100%" }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="session"
                label={{
                  value: "Session Number",
                  position: "insideBottom",
                  offset: -50,
                }}
              />
              <YAxis
                domain={[0, 100]}
                label={{
                  value: "Score",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip content={<CustomTooltip tab={tab} />} />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="grammar"
                name="Grammar"
                stroke="#8884d8"
                dot={{ r: 2 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="vocabulary"
                name="Vocabulary"
                stroke="#82ca9d"
                dot={{ r: 2 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="fluency"
                name="Fluency"
                stroke="#ffc658"
                dot={{ r: 2 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="goals"
                name="Goals"
                stroke="#ff8042"
                dot={{ r: 2 }}
                activeDot={{ r: 5 }}
              />
              <Brush dataKey="session" height={30} stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Tabs.Content>

        <Tabs.Content value="trend" style={{ height: "100%", width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={averageData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sessionGroup" />
              <YAxis domain={[0, 100]} />
              <Tooltip content={<CustomTooltip tab={tab} />} />
              <Legend verticalAlign="top" height={36} />
              <Area
                type="monotone"
                dataKey="avgGrammar"
                name="Grammar"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="avgVocabulary"
                name="Vocabulary"
                stackId="2"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="avgFluency"
                name="Fluency"
                stackId="3"
                stroke="#ffc658"
                fill="#ffc658"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="avgGoals"
                name="Goals"
                stackId="4"
                stroke="#ff8042"
                fill="#ff8042"
                fillOpacity={0.6}
              />
              <ReferenceLine
                y={70}
                label="Target"
                stroke="red"
                strokeDasharray="3 3"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Tabs.Content>

        <Tabs.Content
          value="progression"
          style={{ height: "100%", width: "100%" }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="session"
                label={{
                  value: "Session Number",
                  position: "insideBottom",
                  offset: -50,
                }}
              />
              <YAxis
                label={{
                  value: "User Level",
                  angle: -90,
                  position: "insideLeft",
                }}
                tickCount={6}
                domain={[0, 6]}
                ticks={[1, 2, 3, 4, 5, 6]}
              />
              <Tooltip content={<ProgressionTooltip />} />
              <Legend verticalAlign="top" height={36} />
              <Bar
                dataKey="level"
                name="User Level"
                fill="#4CAF50"
                barSize={30}
              />
              <Brush dataKey="session" height={30} stroke="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};

// Custom tooltip for the progression tab
const ProgressionTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Card size="1" style={{ maxWidth: "220px" }}>
        <Flex direction="column" gap="1">
          <Text weight="bold">{`Session ${label}`}</Text>
          <Text>{`User Level: ${formatLevelToText(payload[0]?.value)}`}</Text>
          <Text>{`Date: ${payload[0]?.payload.date}`}</Text>
        </Flex>
      </Card>
    );
  }

  return null;
};
