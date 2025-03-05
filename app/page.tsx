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
  Separator,
  Grid,
} from "@radix-ui/themes";
import {
  Brain,
  Languages,
  Mic,
  MessageSquare,
  Github,
  Book,
  Users,
} from "lucide-react";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { redirect, RedirectType } from "next/navigation";
import Link from "next/link";

const GH_USER = "https://github.com/emasuriano";
const GH_PAPER = `${GH_USER}/language-learning-paper`;
const GH_CLIENT = `${GH_USER}/language-learning-client`;
const GH_SERVER = `${GH_USER}/language-learning-server`;
const PAPER_LINK = `https://docs.google.com/viewer?url=${GH_PAPER}/memoria.pdf?raw=true`;

const LandingPage = () => {
  return (
    <Theme accentColor="indigo" grayColor="slate">
      <Box className="min-h-screen">
        <Container size="4" p="6">
          {/* Navigation */}
          <Flex justify="between" align="center" mb="6">
            <Heading size="6">AI Language Learning</Heading>
            <Flex gap="4">
              <Link href="/login" passHref>
                <Button variant="soft" size="2">
                  Login
                </Button>
              </Link>
            </Flex>
          </Flex>

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
            <Flex gap="4">
              <Button
                size="4"
                variant="solid"
                onClick={() => redirect("/login", RedirectType.push)}
              >
                Get Started
              </Button>
              <Link href={GH_CLIENT} passHref>
                <Button size="4" variant="outline">
                  <Github className="mr-2" size={18} />
                  View on GitHub
                </Button>
              </Link>
            </Flex>
          </Flex>

          {/* Stats Section */}
          <Flex justify="center" gap="8" wrap="wrap">
            <StatBox number="20+" label="Supported Languages" />
            <StatBox number="Free" label="Open Source" />
            <StatBox number="100%" label="Personalized" />
          </Flex>

          {/* Video Preview Section */}
          <Box my="9">
            <Card size="3" style={{ maxWidth: "800px", margin: "0 auto" }}>
              <LiteYouTubeEmbed id="YviWsypJF9c" title="Demo Video" />
            </Card>
          </Box>

          {/* Features Grid */}
          <Heading size="6" align="center" mb="6">
            Key Features
          </Heading>
          <Flex gap="6" wrap="wrap" justify="center" mb="9">
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
              icon={<Users size={32} />}
              title="Progress Tracking"
              description="Detailed analytics and learning history"
            />
          </Flex>

          {/* Research Paper Section */}
          <Card size="3" style={{ maxWidth: "800px", margin: "0 auto" }} my="9">
            <Flex direction="column" gap="4" p="4">
              <Heading size="6">Research Paper</Heading>
              <Text>
                This project is the implementation of the research presented in
                our paper on adaptive language learning systems. The paper
                details the methodology, algorithms, and evaluation results.
              </Text>
              <Link href={PAPER_LINK} passHref>
                <Button variant="outline">
                  <Book size={16} />
                  Read the Paper
                </Button>
              </Link>
            </Flex>
          </Card>

          {/* GitHub Repositories Section */}
          <Box my="9">
            <Heading size="6" align="center" mb="6">
              Open Source
            </Heading>
            <Grid columns={{ initial: "1", sm: "2" }} gap="6">
              <Card>
                <Flex direction="column" gap="3">
                  <Flex align="center" gap="2">
                    <Github size={24} />
                    <Heading size="4">Frontend Repository</Heading>
                  </Flex>
                  <Text>
                    This client-side repository contains the React/Next.js
                    implementation of our language learning platform.
                  </Text>
                  <Link href={GH_CLIENT} passHref>
                    <Button variant="soft" size="2">
                      View Frontend Code
                    </Button>
                  </Link>
                </Flex>
              </Card>

              <Card>
                <Flex direction="column" gap="3">
                  <Flex align="center" gap="2">
                    <Github size={24} />
                    <Heading size="4">Backend Repository</Heading>
                  </Flex>
                  <Text>
                    Our backend repository houses the AI models, language
                    processing systems, and API implementation.
                  </Text>
                  <Link href={GH_SERVER} passHref>
                    <Button variant="soft" size="2">
                      View Backend Code
                    </Button>
                  </Link>
                </Flex>
              </Card>
            </Grid>
          </Box>

          {/* How It Works Section */}
          <Box my="9">
            <Heading size="6" align="center" mb="6">
              How It Works
            </Heading>
            <Flex direction="column" gap="6">
              <StepCard
                number="1"
                title="Choose a Language & Scenario"
                description="Select from multiple languages and practical conversation scenarios"
              />
              <StepCard
                number="2"
                title="Practice with AI"
                description="Engage in natural conversations with our AI, which adapts to your proficiency level"
              />
              <StepCard
                number="3"
                title="Get Real-time Feedback"
                description="Receive instant feedback on grammar, vocabulary, and pronunciation"
              />
              <StepCard
                number="4"
                title="Track Your Progress"
                description="View detailed analytics and progress over time with comprehensive reports"
              />
            </Flex>
          </Box>
        </Container>

        {/* Footer */}
        <Separator size="4" />
        <Box py="6">
          <Container size="4">
            <Flex justify="between" wrap="wrap" gap="4">
              <Flex direction="column" gap="2">
                <Heading size="4">AI Language Learning</Heading>
                <Text size="2" color="gray">
                  An adaptive language learning platform
                </Text>
              </Flex>

              <Flex gap="6" wrap="wrap">
                <Flex direction="column" gap="2">
                  <Text weight="bold" size="2">
                    Resources
                  </Text>
                  <Link href={GH_CLIENT} passHref>
                    <Text size="2" color="gray">
                      Documentation
                    </Text>
                  </Link>
                  <Link href="#" passHref>
                    <Text size="2" color="gray">
                      Research Paper
                    </Text>
                  </Link>
                </Flex>
              </Flex>
            </Flex>
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

interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

const StepCard: React.FC<StepCardProps> = ({ number, title, description }) => (
  <Card>
    <Flex align="center" gap="4">
      <Flex
        align="center"
        justify="center"
        className="bg-blue-600 text-white rounded-full w-10 h-10 flex-shrink-0"
      >
        {number}
      </Flex>
      <Flex direction="column">
        <Heading size="3">{title}</Heading>
        <Text size="2" color="gray">
          {description}
        </Text>
      </Flex>
    </Flex>
  </Card>
);

export default LandingPage;
