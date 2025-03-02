import { SituationProgress } from "@/hooks/useSituations";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { CircleIcon } from "lucide-react";

export const SituationProgressGoalList = ({
  goals,
}: {
  goals: SituationProgress["goals"];
}) => {
  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto">
      {goals.map((goal, index) => (
        <div key={index} className="flex items-start gap-2 py-1">
          {goal.done ? (
            <CheckCircledIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
          ) : (
            <CircleIcon className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          )}
          <span
            className={`text-[13px] ${
              goal.done ? "text-gray-700" : "text-gray-500"
            }`}
          >
            {goal.name}
          </span>
        </div>
      ))}
    </div>
  );
};
