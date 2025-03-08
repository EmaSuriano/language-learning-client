"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Text,
  Heading,
  Flex,
  Box,
  Container,
  Separator,
  Button,
  Tooltip,
  Avatar,
} from "@radix-ui/themes";

import {
  CheckCircledIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import { Switch } from "radix-ui";
import { Save, User, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatVoiceTitle } from "@/lib/helpers";
import { useAppConfigStore } from "@/hooks/useAppConfigStore";
import { useAuthUser } from "@/hooks/useLearningSession";
import { UserUpdate } from "@/hooks/useUser";
import { useLanguages } from "@/hooks/useLanguages";
import { useTTSVoices } from "@/hooks/useTTS";
import { useUpdateUser } from "@/hooks/useUser";

const CEFR_LEVELS = [
  "A1 - Beginner",
  "A2 - Elementary",
  "B1 - Intermediate",
  "B2 - Upper Intermediate",
  "C1 - Advanced",
  "C2 - Proficient",
];

export default function UserProfilePage() {
  const router = useRouter();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
  const { user } = useAuthUser();

  const {
    data: languages = [],
    isLoading: languagesLoading,
    error: languagesError,
  } = useLanguages();
  const { enableAutoPlay, theme, setTheme, setEnableAutoPlay } =
    useAppConfigStore();

  const [selectedLanguage, setSelectedLanguage] = useState(
    user?.current_language
  );

  const {
    data: voices = [],
    isLoading: voicesLoading,
    error: voicesError,
  } = useTTSVoices(selectedLanguage?.has_tts ? selectedLanguage.code : null);

  // Success message state
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle form submission
  const onUpdate = async (update: UserUpdate) => {
    try {
      await updateUser({ id: user.id.toString(), userData: update });
      return true;
    } catch (error) {
      console.error("Failed to update user:", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);

    setEnableAutoPlay(Boolean(formData.get("autoplay")));
    setTheme(Boolean(formData.get("theme")) ? "dark" : "light");

    const success = await onUpdate({
      name: formData.get("name") as string,
      language_code: selectedLanguage.code,
      voice_id: selectedLanguage.has_tts
        ? (formData.get("voice_id") as string)
        : null,
    });

    if (success) {
      setShowSuccess(true);
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } else {
      setErrorMessage("Failed to update profile. Please try again.");
    }
  };

  // Reset error message when component unmounts
  useEffect(() => {
    return () => {
      setErrorMessage(null);
      setShowSuccess(false);
    };
  }, []);

  // Format date if available
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Handle loading and error states
  if (languagesLoading || !user) {
    return (
      <Box className="min-h-screen bg-slate-50">
        <Container size="2" pt="6">
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

  // Handle error states
  if (languagesError || voicesError) {
    return (
      <Box className="min-h-screen bg-slate-50">
        <Container size="2" pt="6">
          <Card size="3" className="shadow-md">
            <Flex
              direction="column"
              gap="4"
              p="4"
              align="center"
              justify="center"
            >
              <ExclamationTriangleIcon color="red" width={40} height={40} />
              <Heading size="4" color="red">
                Error Loading Data
              </Heading>
              <Text size="2">
                {languagesError?.message ||
                  voicesError?.message ||
                  "An error occurred while loading your profile data. Please try again."}
              </Text>
              <Button onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            </Flex>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-slate-50">
      <Container size="2" p="6">
        {/* Success message tooltip */}
        {showSuccess && (
          <Box
            className="fixed top-6 right-6 bg-green-100 border border-green-200 rounded-md p-3 shadow-md animate-fade-in-out z-50"
            style={{ zIndex: 1000 }}
          >
            <Flex gap="2" align="center">
              <CheckCircledIcon
                className="text-green-600"
                width={20}
                height={20}
              />
              <Text size="2" weight="medium" className="text-green-800">
                Profile updated successfully!
              </Text>
            </Flex>
          </Box>
        )}

        <Card size="3" className="shadow-md">
          {/* Header */}
          <Flex
            justify="between"
            align={{ initial: "start", sm: "center" }}
            direction={{ initial: "column", sm: "row" }}
            gap="4"
          >
            <Flex direction="column" mb="4">
              <Flex gap="2" align="center">
                <User size={20} />
                <Heading size="6">User Profile</Heading>
              </Flex>

              <Text size="2" color="gray">
                Manage your account settings and preferences
              </Text>
            </Flex>
          </Flex>

          {/* Error message */}
          {errorMessage && (
            <Box className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <Flex gap="2" align="center">
                <ExclamationTriangleIcon
                  className="text-red-600"
                  width={16}
                  height={16}
                />
                <Text size="2" color="red">
                  {errorMessage}
                </Text>
              </Flex>
            </Box>
          )}

          {/* Loading indicator for updates */}
          {isUpdating && (
            <Box className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <Flex gap="2" align="center" justify="center">
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                <Text size="2" color="blue">
                  Saving changes...
                </Text>
              </Flex>
            </Box>
          )}

          <Card variant="classic" className="p-4">
            <Flex gap="4" align="center">
              <Avatar
                size="4"
                radius="full"
                fallback={user.name ? user.name.charAt(0).toUpperCase() : "U"}
                color="indigo"
              />
              <Flex direction="column" gap="1">
                <Text weight="bold" size="3">
                  {user.name || "User"}
                </Text>
                <Flex align="center" gap="2">
                  <Mail size={14} className="text-gray-500" />
                  <Text size="2" color="gray">
                    {user.email || "No email provided"}
                  </Text>
                </Flex>
              </Flex>

              <Box className="w-full" />

              <Tooltip content="Log out of your account">
                <Button
                  type="button"
                  variant="soft"
                  color="red"
                  onClick={() => router.push("/logout")}
                >
                  Logout
                </Button>
              </Tooltip>
            </Flex>
          </Card>

          <Separator size="4" my="4" />

          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="6">
              <Box className="space-y-4">
                <Heading size="3">Personal Information</Heading>

                <Flex direction="column" gap="4">
                  <Flex align="center" justify="between">
                    <Text size="2" weight="medium">
                      Name
                    </Text>
                    <Box className="w-2/3">
                      <input
                        type="text"
                        className="h-9 w-full rounded border px-2"
                        id="name"
                        name="name"
                        defaultValue={user.name || ""}
                        placeholder="Enter your name"
                      />
                    </Box>
                  </Flex>
                </Flex>

                <Flex align="center" justify="between">
                  <Text size="2" weight="medium">
                    Current Level
                  </Text>
                  <Box className="w-2/3">
                    <Tooltip content="Your level will be adjusted by practicing!">
                      <input
                        type="text"
                        className="h-9 w-full rounded border px-2"
                        defaultValue={CEFR_LEVELS[user.language_level - 1]}
                        disabled
                      />
                    </Tooltip>
                  </Box>
                </Flex>
              </Box>

              <Separator size="4" />

              <Box className="space-y-4">
                <Heading size="3">Language Settings</Heading>

                <Flex direction="column" gap="4">
                  <Flex align="center" justify="between">
                    <Text size="2" weight="medium">
                      Language
                    </Text>
                    <Box className="w-2/3">
                      <select
                        className="h-9 w-full rounded border px-2"
                        id="language_code"
                        name="language_code"
                        value={selectedLanguage?.code}
                        onChange={(e) =>
                          setSelectedLanguage(
                            languages.find((l) => l.code === e.target.value)!
                          )
                        }
                      >
                        {languages.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.name} ({lang.code}) {lang.has_tts && "🗣️"}
                          </option>
                        ))}
                      </select>
                    </Box>
                  </Flex>

                  <Flex align="center" justify="between">
                    <Text size="2" weight="medium">
                      Voice
                    </Text>
                    <Box className="w-2/3">
                      {selectedLanguage?.has_tts ? (
                        <select
                          className="h-9 w-full rounded border px-2"
                          id="voice_id"
                          name="voice_id"
                          defaultValue={user.voice_id || undefined}
                        >
                          {voices.map((voice) => (
                            <option key={voice} value={voice}>
                              {formatVoiceTitle(voice)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <Text size="2" color="gray">
                          No voice for this language
                        </Text>
                      )}
                    </Box>
                  </Flex>
                </Flex>
              </Box>

              <Separator size="4" />

              <Box className="space-y-4">
                <Heading size="3">Appearance & Preferences</Heading>

                <Flex direction="column" gap="4">
                  <Flex align="center" justify="between">
                    <Text size="2" weight="medium">
                      Enable autoplay for audio
                    </Text>
                    <Switch.Root
                      className="relative h-[25px] w-[42px] cursor-default rounded-full bg-blackA6 shadow-[0_2px_10px] shadow-blackA4 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-black"
                      id="autoplay"
                      name="autoplay"
                      defaultChecked={enableAutoPlay}
                    >
                      <Switch.Thumb className="block size-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] shadow-blackA4 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
                    </Switch.Root>
                  </Flex>

                  <Flex align="center" justify="between">
                    <Text size="2" weight="medium">
                      Dark mode
                    </Text>
                    <Switch.Root
                      className="relative h-[25px] w-[42px] cursor-default rounded-full bg-blackA6 shadow-[0_2px_10px] shadow-blackA4 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-black"
                      id="theme"
                      name="theme"
                      defaultChecked={theme === "dark"}
                    >
                      <Switch.Thumb className="block size-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] shadow-blackA4 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
                    </Switch.Root>
                  </Flex>
                </Flex>
              </Box>

              <Separator size="4" />

              <Flex justify="end" gap="4">
                <Tooltip content="Save your profile changes">
                  <Button
                    type="submit"
                    className="bg-indigo-600 text-white"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <div className="spinner mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Changes
                      </>
                    )}
                  </Button>
                </Tooltip>
              </Flex>
            </Flex>
          </form>
        </Card>
      </Container>
    </Box>
  );
}
