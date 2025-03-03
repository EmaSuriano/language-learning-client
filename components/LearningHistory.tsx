"use client";

import React, { useState, useEffect } from "react";
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
  IconButton,
} from "@radix-ui/themes";
import { useUserLearningHistory } from "@/hooks/useUserLearningHistory";
import { useAuthUser } from "@/hooks/useLearningSession";
import { useRouter } from "next/navigation";
import {
  ButtonIcon,
  LoopIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";

export const LearningHistory = () => {
  const { user } = useAuthUser();
  const router = useRouter();
  const [viewMode, setViewMode] = useState("detailed");
  const {
    data: rawData = [],
    refetch,
    isPending: loading,
    error,
  } = useUserLearningHistory(user!.id);

  // Map and format data for charting
  const formattedData = rawData.map((item, index) => ({
    session: index + 1,
    id: item.id,
    grammar: item.grammar_score,
    vocabulary: item.vocabulary_score,
    fluency: item.fluency_score,
    goals: item.goals_score,
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

  // Handle loading and error states
  if (loading) {
    return (
      <Container size="4">
        <Card size="3" my="4">
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
    );
  }

  if (error) {
    return (
      <Container size="4">
        <Card size="3" my="4">
          <Flex height="16" align="center" justify="center">
            <Text color="red" size="3">
              {error.message}
            </Text>
          </Flex>
        </Card>
      </Container>
    );
  }

  return (
    <Container size="4">
      <Card size="3" my="4">
        <Flex direction="column" gap="4">
          <Flex
            justify="between"
            align={{ initial: "start", sm: "center" }}
            direction={{ initial: "column", sm: "row" }}
            gap="4"
          >
            <Flex gap="2">
              <Heading size="5">Language Learning Progress</Heading>
              <IconButton
                radius="full"
                variant="soft"
                onClick={() => refetch()}
              >
                <LoopIcon width="18" height="18" />
              </IconButton>
            </Flex>

            <Flex gap="4" align="center" justify="center">
              <Tabs.Root
                defaultValue="detailed"
                value={viewMode}
                onValueChange={setViewMode}
              >
                <Tabs.List>
                  <Tabs.Trigger value="detailed">Detailed View</Tabs.Trigger>
                  <Tabs.Trigger value="trend">Trend View</Tabs.Trigger>
                </Tabs.List>
              </Tabs.Root>

              <Button onClick={() => router.push("/chat")}>New chat</Button>
            </Flex>
          </Flex>

          {/* Chart container with explicit height */}
          <Box
            style={{ height: "400px", width: "100%" }}
            className="chart-container"
          >
            <Tabs.Root
              value={viewMode}
              style={{ height: "100%", width: "100%" }}
            >
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
                        position: "insideBottomRight",
                        offset: -10,
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
                    <Tooltip content={<CustomTooltip viewMode={viewMode} />} />
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

              <Tabs.Content
                value="trend"
                style={{ height: "100%", width: "100%" }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={averageData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="sessionGroup" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip viewMode={viewMode} />} />
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
            </Tabs.Root>
          </Box>

          <Separator size="4" />

          <Grid columns={{ initial: "1", sm: "2", md: "4" }} gap="4">
            <Card style={{ backgroundColor: "var(--violet-3)" }}>
              <Flex direction="column" gap="1">
                <Text size="2" weight="bold" color="violet">
                  Grammar
                </Text>
                <Text size="6" weight="bold">
                  {Math.round(_.meanBy(chartData, "grammar"))}
                  <Text size="2" weight="normal" color="violet">
                    /100
                  </Text>
                </Text>
              </Flex>
            </Card>

            <Card style={{ backgroundColor: "var(--green-3)" }}>
              <Flex direction="column" gap="1">
                <Text size="2" weight="bold" color="green">
                  Vocabulary
                </Text>
                <Text size="6" weight="bold">
                  {Math.round(_.meanBy(chartData, "vocabulary"))}
                  <Text size="2" weight="normal" color="green">
                    /100
                  </Text>
                </Text>
              </Flex>
            </Card>

            <Card style={{ backgroundColor: "var(--amber-3)" }}>
              <Flex direction="column" gap="1">
                <Text size="2" weight="bold" color="amber">
                  Fluency
                </Text>
                <Text size="6" weight="bold">
                  {Math.round(_.meanBy(chartData, "fluency"))}
                  <Text size="2" weight="normal" color="amber">
                    /100
                  </Text>
                </Text>
              </Flex>
            </Card>

            <Card style={{ backgroundColor: "var(--orange-3)" }}>
              <Flex direction="column" gap="1">
                <Text size="2" weight="bold" color="orange">
                  Goals
                </Text>
                <Text size="6" weight="bold">
                  {Math.round(_.meanBy(chartData, "goals"))}
                  <Text size="2" weight="normal" color="orange">
                    /100
                  </Text>
                </Text>
              </Flex>
            </Card>
          </Grid>

          <Separator size="4" />

          <Card style={{ backgroundColor: "var(--gray-2)" }}>
            <Flex direction="column" gap="3">
              <Heading size="3">Level Changes Summary</Heading>
              <Grid columns={{ initial: "1", sm: "3" }} gap="4">
                {Object.entries(_.countBy(chartData, "level_change")).map(
                  ([change, count]) => (
                    <Card
                      key={change}
                      style={{
                        backgroundColor:
                          change === "INCREASE"
                            ? "var(--green-2)"
                            : change === "DECREASE"
                            ? "var(--red-2)"
                            : "var(--blue-2)",
                      }}
                    >
                      <Flex direction="column" align="center" gap="2">
                        <Text
                          size="2"
                          weight="bold"
                          color={
                            change === "INCREASE"
                              ? "green"
                              : change === "DECREASE"
                              ? "red"
                              : "blue"
                          }
                        >
                          {change}
                        </Text>
                        <Flex align="baseline" gap="1" justify="center">
                          <Text size="6" weight="bold">
                            {count}
                          </Text>
                          <Text size="1" color="gray">
                            sessions
                          </Text>
                        </Flex>
                      </Flex>
                    </Card>
                  )
                )}
              </Grid>
            </Flex>
          </Card>
        </Flex>
      </Card>
    </Container>
  );
};

const CustomTooltip = ({ active, payload, label, viewMode }) => {
  if (active && payload && payload.length) {
    return (
      <Card size="1" style={{ maxWidth: "220px" }}>
        <Flex direction="column" gap="1">
          <Text weight="bold">
            {viewMode === "detailed" ? `Session ${label}` : `Sessions ${label}`}
          </Text>
          {payload.map((entry, index) => (
            <Text key={index} size="2" style={{ color: entry.color }}>
              {entry.name}: {Math.round(entry.value * 100) / 100}
            </Text>
          ))}
          {viewMode === "detailed" && payload[0].payload.level_change && (
            <Flex gap="2" mt="2">
              <Text size="1">Level change:</Text>
              <Text size="1" weight="bold">
                {payload[0].payload.level_change}
              </Text>
            </Flex>
          )}
        </Flex>
      </Card>
    );
  }
  return null;
};
