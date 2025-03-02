import { useLearningSession } from "@/hooks/useLearningSession";
import { ThreadWelcome } from "@assistant-ui/react";
import { SituationProgressGoalList } from "./SituationProgressGoalList";

export const MyThreadWelcome = () => {
  const { selectedSituation } = useLearningSession();

  const { name, user_goals } = selectedSituation;

  return (
    <ThreadWelcome.Root>
      <ThreadWelcome.Center>
        <div className="flex flex-col gap-2.5">
          <h2 className="text-lg mb-2 text-center font-medium leading-[19px] text-black">
            Scenario: {name}
          </h2>

          <SituationProgressGoalList
            goals={user_goals.map((name) => ({ name, done: false }))}
          />
        </div>
      </ThreadWelcome.Center>
      <ThreadWelcome.Suggestions />
    </ThreadWelcome.Root>
  );
};
