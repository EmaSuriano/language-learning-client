"use client";

import { Dialog } from "radix-ui";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useSituationStore } from "@/hooks/useSituationStore";
import { useEffect, useState } from "react";
import { capitalize } from "@/lib/helpers";

const SituationSettings = () => {
  const { situations, selectedSituation, selectSituation, fetchSituations } =
    useSituationStore();
  const [currentSituation, setCurrentSituation] = useState(selectedSituation);
  const [open, setOpen] = useState(selectedSituation === null);

  useEffect(() => {
    fetchSituations();
  }, [fetchSituations]);

  const onOpenChange = (open: boolean) => {
    if (open === true) {
      setCurrentSituation(selectedSituation);
    }

    setOpen(open);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (currentSituation === null) {
      return;
    }

    selectSituation(currentSituation.id);
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-blackA6 data-[state=open]:animate-overlayShow" />
        <Dialog.Content
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="fixed left-1/2 top-1/2 max-h-[85vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg"
        >
          <Dialog.Title className="m-0 text-[17px] font-medium text-mauve12">
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
                  <div className="p-2">
                    <h3 className="font-medium text-[16px] mb-3">
                      {currentSituation.name}
                    </h3>
                    <p className="text-[14px] text-mauve11 mb-4">
                      {currentSituation.scenario_description}
                    </p>
                    <div className="flex gap-2 my-2">
                      <h4 className="font-medium text-[14px] text-violet11">
                        Difficulty:
                      </h4>

                      <p className="font-medium text-[14px] text-mauve11">
                        {capitalize(currentSituation.difficulty)}
                      </p>
                    </div>

                    <h4 className="font-medium text-[14px] mb-2 text-violet11">
                      User Goals:
                    </h4>
                    <ul className="space-y-2">
                      {currentSituation.user_goals.map((goal, index) => (
                        <li
                          key={index}
                          className="text-[13px] text-mauve11 flex items-start"
                        >
                          <span className="mr-2">•</span>
                          <span>{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
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

export default SituationSettings;
