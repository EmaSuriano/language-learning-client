"use client";

import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import {
  Box,
  Button,
  Container,
  Text,
  Flex,
  Card,
  Heading,
  TextField,
  Separator,
} from "@radix-ui/themes";
import * as Tabs from "@radix-ui/react-tabs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  EnvelopeClosedIcon,
  LockClosedIcon,
  ArrowLeftIcon,
} from "@radix-ui/react-icons";
import { Languages, Brain, Check } from "lucide-react";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const { session, login } = useAuth();
  const [userId, setUserId] = useState(session ? session.userId : null);
  const { data: user, error, isLoading } = useUser(userId);

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    try {
      // For demo purposes, we'll use mock login
      // In production, replace with actual API call
      if (email && password) {
        // Mock successful login
        await login({ userId: "1", email: email }); // Directly call login here
        router.push("/new-chat"); // Direct navigation
      } else {
        setFormError("Please enter both email and password");
      }
    } catch (err) {
      setFormError("Login failed. Please check your credentials.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    try {
      // For demo purposes, we'll use mock signup
      // In production, replace with actual API call
      if (email && password) {
        // Mock successful signup
        await login({ userId: "1", email: email }); // Directly call login here
        router.push("/new-chat"); // Direct navigation
      } else {
        setFormError("Please enter both email and password");
      }
    } catch (err) {
      setFormError("Signup failed. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (session?.userId) {
      router.push("/new-chat"); // Direct navigation
    }
  }, []);

  return (
    <Box className="min-h-screen bg-slate-50">
      <Container size="1" pt="6">
        {/* Back to Home link */}
        <Link href="/" passHref>
          <Button variant="ghost" size="2" mb="4">
            <ArrowLeftIcon width="16" height="16" className="mr-1" /> Back to
            Home
          </Button>
        </Link>

        <Card size="3" className="shadow-md">
          <Flex direction="column" align="center" mb="4">
            <Flex align="center" gap="2" mb="2">
              <Languages size={28} className="text-indigo-600" />
              <Heading size="6">AI Language Learning</Heading>
            </Flex>
            <Text size="2" color="gray" align="center">
              Your adaptive language learning journey starts here
            </Text>
          </Flex>

          <Tabs.Root defaultValue="login">
            <Tabs.List className="flex border-b mb-4">
              <Tabs.Trigger
                className="px-4 py-2 focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-500"
                value="login"
              >
                Login
              </Tabs.Trigger>
              <Tabs.Trigger
                className="px-4 py-2 focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-500"
                value="signup"
              >
                Create Account
              </Tabs.Trigger>
            </Tabs.List>

            <Box pt="4">
              <Tabs.Content value="login">
                <form onSubmit={handleLogin}>
                  <Flex direction="column" gap="3">
                    <Heading size="5">Welcome back</Heading>
                    <Text size="2" color="gray">
                      Enter your credentials to continue your language learning
                      journey
                    </Text>

                    <Box>
                      <TextField.Root
                        size="3"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      >
                        <TextField.Slot>
                          <EnvelopeClosedIcon height="16" width="16" />
                        </TextField.Slot>
                      </TextField.Root>
                    </Box>

                    <Box>
                      <TextField.Root
                        size="3"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      >
                        <TextField.Slot>
                          <LockClosedIcon height="16" width="16" />
                        </TextField.Slot>
                      </TextField.Root>
                    </Box>

                    {formError && (
                      <Text size="2" color="red" weight="bold">
                        {formError}
                      </Text>
                    )}

                    <Button size="3" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                  </Flex>
                </form>
              </Tabs.Content>

              <Tabs.Content value="signup">
                <form onSubmit={handleSignup}>
                  <Flex direction="column" gap="3">
                    <Heading size="5">Create an account</Heading>
                    <Text size="2" color="gray">
                      Sign up to start your personalized language learning
                      experience
                    </Text>

                    <Box>
                      <TextField.Root
                        size="3"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      >
                        <TextField.Slot>
                          <EnvelopeClosedIcon height="16" width="16" />
                        </TextField.Slot>
                      </TextField.Root>
                    </Box>

                    <Box>
                      <TextField.Root
                        size="3"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      >
                        <TextField.Slot>
                          <LockClosedIcon height="16" width="16" />
                        </TextField.Slot>
                      </TextField.Root>
                    </Box>

                    {formError && (
                      <Text size="2" color="red" weight="bold">
                        {formError}
                      </Text>
                    )}

                    <Button size="3" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Creating account..." : "Create Account"}
                    </Button>
                  </Flex>
                </form>
              </Tabs.Content>
            </Box>
          </Tabs.Root>

          {isLoading && (
            <Text align="center" mt="4">
              Loading...
            </Text>
          )}
          {error && (
            <Text color="red" align="center" mt="4">
              Error loading user data
            </Text>
          )}

          <Separator size="4" my="4" />

          {/* Features highlights */}
          <Box pt="2">
            <Heading size="3" mb="2">
              Join our language learning platform
            </Heading>
            <Flex direction="column" gap="2">
              <Flex align="center" gap="2">
                <Brain size={16} className="text-indigo-600" />
                <Text size="2">Adaptive learning with AI technology</Text>
              </Flex>
              <Flex align="center" gap="2">
                <Languages size={16} className="text-indigo-600" />
                <Text size="2">Practice with 20+ supported languages</Text>
              </Flex>
              <Flex align="center" gap="2">
                <Check size={16} className="text-indigo-600" />

                <Text size="2">
                  Track your progress with detailed analytics
                </Text>
              </Flex>
            </Flex>
          </Box>
        </Card>

        <Text size="1" color="gray" align="center" mt="4">
          AI Language Learning — Powered by advanced reinforcement learning
        </Text>
      </Container>
    </Box>
  );
}
