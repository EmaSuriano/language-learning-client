"use client";

import {
  Box,
  Button,
  Text,
  Flex,
  Card,
  Heading,
  Separator,
  Theme,
  TextField,
} from "@radix-ui/themes";
import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import { capitalize } from "@/lib/helpers";
import { Situation, useSituations } from "@/hooks/useSituations";
import { useSelectedSituationStore } from "@/hooks/useLearningSession";
import { SituationProgressGoalList } from "./SituationProgressGoalList";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import clsx from "clsx";

// Define classNames outside of component to keep it clean
const classes = {
  situationList: "w-1/2 overflow-y-auto border-r border-gray-200 pr-4",
  situationButton: "w-full text-left py-2 px-3 h-auto block",
  situationName: "block mb-1 truncate",
  situationDescription: "line-clamp-2 text-left text-wrap break-words",
  detailsPanel: "w-1/2 overflow-y-auto pl-2",
  contentPanel: "h-[450px]",
};

const SituationSettings = () => {
  const { setSelectedSituation } = useSelectedSituationStore();
  const [currentSituation, setCurrentSituation] = useState<Situation | null>(
    null
  );
  const { data: situations = [] } = useSituations();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSituations, setFilteredSituations] = useState<Situation[]>([]);

  // Filter situations based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSituations(situations);
    } else {
      const searchTermLower = searchTerm.toLowerCase();
      const filtered = situations.filter((situation) => {
        const { name, scenario_description } = situation;
        return (
          name.toLowerCase().includes(searchTermLower) ||
          scenario_description.toLowerCase().includes(searchTermLower)
        );
      });
      setFilteredSituations(filtered);
    }
  }, [searchTerm, situations]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentSituation) return;
    setSelectedSituation(currentSituation);
  };

  return (
    <Dialog.Root open>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/25 animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-gray-50 shadow-lg">
          <Theme accentColor="indigo" grayColor="slate">
            <Card size="3">
              <Flex direction="column" gap="3">
                <Dialog.Title asChild>
                  <Heading size="5">Available Situations</Heading>
                </Dialog.Title>
                <Dialog.Description asChild>
                  <Text size="2" color="gray">
                    Select a situation to practice your conversation skills.
                  </Text>
                </Dialog.Description>

                <form onSubmit={handleSubmit}>
                  <Box mb="3">
                    <TextField.Root
                      size="2"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search situations..."
                    >
                      <TextField.Slot>
                        <MagnifyingGlassIcon height={16} width={16} />
                      </TextField.Slot>
                    </TextField.Root>
                  </Box>

                  <Flex gap="4" className={classes.contentPanel}>
                    {/* Situations List */}
                    <Box className={classes.situationList}>
                      {filteredSituations.length > 0 ? (
                        filteredSituations.map((situation) => (
                          <Box key={situation.id} mb="2" width="100%">
                            <Button
                              type="button"
                              onClick={() => setCurrentSituation(situation)}
                              variant="ghost"
                              color={
                                currentSituation?.id === situation.id
                                  ? "indigo"
                                  : "gray"
                              }
                              className={clsx(
                                classes.situationButton,
                                currentSituation?.id === situation.id &&
                                  "bg-indigo-500"
                              )}
                            >
                              <Flex direction="column" align="start" p="2">
                                <Text
                                  size="2"
                                  weight="medium"
                                  className={classes.situationName}
                                >
                                  {situation.name}
                                </Text>
                                <Text
                                  size="1"
                                  color="gray"
                                  className={classes.situationDescription}
                                >
                                  {situation.scenario_description}
                                </Text>
                              </Flex>
                            </Button>
                          </Box>
                        ))
                      ) : (
                        <Flex align="center" justify="center" height="100%">
                          <Text size="2" color="gray">
                            No situations found
                          </Text>
                        </Flex>
                      )}
                    </Box>

                    {/* Selected Situation Details */}
                    <Box className={classes.detailsPanel}>
                      {currentSituation ? (
                        <SituationViewer situation={currentSituation} />
                      ) : (
                        <Flex align="center" justify="center" height="100%">
                          <Text size="2" color="gray">
                            Select a situation to view details
                          </Text>
                        </Flex>
                      )}
                    </Box>
                  </Flex>

                  <Separator size="4" my="4" />

                  <Flex justify="end" gap="3" mt="4">
                    <Dialog.Close asChild>
                      <Button variant="soft" color="gray">
                        Cancel
                      </Button>
                    </Dialog.Close>
                    <Button
                      disabled={!currentSituation}
                      type="submit"
                      color="indigo"
                    >
                      Save changes
                    </Button>
                  </Flex>
                </form>
              </Flex>
            </Card>
          </Theme>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const SituationViewer = ({ situation }: { situation: Situation }) => {
  const { name, scenario_description, difficulty, user_goals } = situation;

  return (
    <Box p="3">
      <Heading size="4" mb="3">
        {name}
      </Heading>
      <Text size="2" color="gray" mb="4">
        {scenario_description}
      </Text>

      <Flex gap="2" my="2" align="center">
        <Text size="2" weight="medium" color="indigo">
          Difficulty:
        </Text>
        <Text size="2" color="gray" weight="medium">
          {capitalize(difficulty)}
        </Text>
      </Flex>

      <Text size="2" weight="medium" color="indigo" mb="2">
        User Goals:
      </Text>

      <SituationProgressGoalList
        goals={user_goals.map((name) => ({ name, done: false }))}
      />
    </Box>
  );
};

export default SituationSettings;
