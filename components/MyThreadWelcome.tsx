import { useLearningSession } from "@/hooks/useLearningSession";
import { Thread, ThreadWelcome } from "@assistant-ui/react";
import { CircleIcon } from "lucide-react";

export const MyThreadWelcome = () => {
  const { selectedSituation } = useLearningSession();

  if (!selectedSituation) {
    return <ThreadWelcome />;
  }

  return (
    <ThreadWelcome.Root>
      <ThreadWelcome.Center>
        <div className="flex flex-col gap-2.5">
          <h2 className="text-lg mb-2 text-center font-medium leading-[19px] text-mauve12">
            Scenario: {selectedSituation.name}
          </h2>

          {/* Goals List */}
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {selectedSituation.user_goals.map((goal, index) => (
              <div key={index} className="flex items-start gap-2 py-1">
                <CircleIcon className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className={`text-[13px] text-gray-500`}>{goal}</span>
              </div>
            ))}
          </div>
        </div>
      </ThreadWelcome.Center>
      <ThreadWelcome.Suggestions />
    </ThreadWelcome.Root>
  );
};
