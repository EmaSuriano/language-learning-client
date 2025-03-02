"use client";

import { Dialog } from "radix-ui";
import { useState } from "react";
import { capitalize } from "@/lib/helpers";
import { Situation, useSituations } from "@/hooks/useSituations";
import { useSelectedSituationStore } from "@/hooks/useLearningSession";
import { SituationProgressGoalList } from "./SituationProgressGoalList";

const SituationSettings = () => {
  const { setSelectedSituation } = useSelectedSituationStore();
  const [currentSituation, setCurrentSituation] = useState<Situation>();
  const { data: situations = [] } = useSituations();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentSituation) {
      return;
    }

    setSelectedSituation(currentSituation);
  };

  return (
    <Dialog.Root open>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-blackA6 data-[state=open]:animate-overlayShow" />
        <Dialog.Content
          onInteractOutside={(e) => e.preventDefault()}
          className="fixed left-1/2 top-1/2 max-h-[85vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg"
        >
          <Dialog.Title className="m-0 text-[17px] font-medium text-black">
            Available Situations
          </Dialog.Title>
          <Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal text-mauve11">
            Select a situation to practice your conversation skills.
          </Dialog.Description>

          <form onSubmit={handleSubmit}>
            <div className="flex gap-4 h-[500px]">
              {/* Situations List */}
              <div className="w-1/2 overflow-y-auto pr-4 border-r border-gray-200">
                {situations.map((situation) => (
                  <button
                    type="button"
                    key={situation.id}
                    onClick={() => setCurrentSituation(situation)}
                    className={`w-full text-left p-3 mb-2 rounded-md transition-colors ${
                      currentSituation?.id === situation.id
                        ? "bg-violet4 text-violet11"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <h3 className="font-medium text-[15px]">
                      {situation.name}
                    </h3>
                    <p className="text-[13px] text-mauve11 line-clamp-2">
                      {situation.scenario_description}
                    </p>
                  </button>
                ))}
              </div>

              {/* Selected Situation Details */}
              <div className="w-1/2 overflow-y-auto">
                {currentSituation ? (
                  <SituationViewer situation={currentSituation} />
                ) : (
                  <div className="flex items-center justify-center h-full text-mauve11">
                    Select a situation to view details
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                disabled={currentSituation === null}
                type="submit"
                className="disabled:bg-violet2 disabled:text-violet5 inline-flex h-[35px] items-center justify-center rounded bg-violet4 px-[15px] font-medium leading-none text-violet11 outline-none hover:bg-violet5"
              >
                Save changes
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const SituationViewer = ({ situation }: { situation: Situation }) => {
  const { name, scenario_description, difficulty, user_goals } = situation;

  return (
    <div className="p-2">
      <h3 className="font-medium text-[16px] mb-3">{name}</h3>
      <p className="text-[14px] text-mauve11 mb-4">{scenario_description}</p>

      <div className="flex gap-2 my-2">
        <h4 className="font-medium text-[14px] text-violet11">Difficulty:</h4>

        <p className="font-medium text-[14px] text-mauve11">
          {capitalize(difficulty)}
        </p>
      </div>

      <h4 className="font-medium text-md mb-2 text-violet11">User Goals:</h4>

      <SituationProgressGoalList
        goals={user_goals.map((name) => ({ name, done: false }))}
      />
    </div>
  );
};

export default SituationSettings;
