"use client";

import React from "react";
import {
  Theme,
  Button,
  Card,
  Text,
  Heading,
  Container,
  Flex,
  Box,
} from "@radix-ui/themes";
import { Brain, Languages, Mic, MessageSquare } from "lucide-react";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { redirect, RedirectType } from "next/navigation";
import { useTheme } from "next-themes";

const LandingPage = () => {
  const { theme } = useTheme();

  console.log("asdasd", theme);

  return (
    <Theme accentColor="blue" grayColor="slate" appearance="dark">
      <Box className="min-h-screen bg-[#0A0A0A]">
        <Container size="4" p="6">
          {/* Hero Section */}
          <Flex direction="column" align="center" gap="6" pb="9">
            <Heading size="9" align="center" mb="4">
              Learn Languages with AI
            </Heading>
            <Text
              size="5"
              align="center"
              color="gray"
              style={{ maxWidth: "65ch" }}
            >
              Adaptive learning system that combines advanced AI with
              Reinforcement Learning techniques for a personalized experience.
            </Text>
            <Button
              size="4"
              variant="solid"
              onClick={() => redirect("/login", RedirectType.push)}
            >
              Get Started
            </Button>
          </Flex>

          {/* Stats Section */}
          <Flex justify="center" gap="8" wrap="wrap">
            <StatBox number="8+" label="Supported Languages" />
            <StatBox number="24/7" label="Availability" />
            <StatBox number="100%" label="Personalized" />
          </Flex>

          {/* Video Preview Section */}
          <Box my="9">
            <Card size="3" style={{ maxWidth: "800px", margin: "0 auto" }}>
              <LiteYouTubeEmbed id="YviWsypJF9c" title="Demo Video" />
            </Card>
          </Box>

          {/* Features Grid */}
          <Flex gap="6" wrap="wrap" justify="center" mt="9">
            <FeatureCard
              icon={<Brain size={32} />}
              title="Adaptive Learning"
              description="Personalized learning paths using RL"
            />
            <FeatureCard
              icon={<MessageSquare size={32} />}
              title="Intelligent Dialogues"
              description="Contextual conversations with LLMs"
            />
            <FeatureCard
              icon={<Mic size={32} />}
              title="Voice Processing"
              description="Pronunciation practice with TTS and STT"
            />
            <FeatureCard
              icon={<Languages size={32} />}
              title="Multiple Languages"
              description="Support for 8 major languages"
            />
            <FeatureCard
              icon={<Languages size={32} />}
              title="Multiple Languages"
              description="Support for 8 major languages"
            />
          </Flex>
        </Container>

        {/* Footer */}
        <Box mt="9" py="6" style={{ borderTop: "1px solid var(--gray-a5)" }}>
          <Container size="4">
            <Text align="center" size="2" color="gray">
              © 2025 AI Language Learning System. All rights reserved.
            </Text>
          </Container>
        </Box>
      </Box>
    </Theme>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => (
  <Card size="3" style={{ width: "280px" }}>
    <Flex direction="column" gap="3">
      <Box style={{ color: "var(--accent-9)" }}>{icon}</Box>
      <Heading size="4">{title}</Heading>
      <Text size="2" color="gray">
        {description}
      </Text>
    </Flex>
  </Card>
);

interface StatBoxProps {
  number: string;
  label: string;
}

const StatBox: React.FC<StatBoxProps> = ({ number, label }) => (
  <Flex direction="column" align="center" gap="1">
    <Heading size="8" style={{ color: "var(--accent-9)" }}>
      {number}
    </Heading>
    <Text size="3" color="gray">
      {label}
    </Text>
  </Flex>
);

export default LandingPage;
