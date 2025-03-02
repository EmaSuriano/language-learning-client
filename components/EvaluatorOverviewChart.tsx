import { EvaluatorOverviewResponse } from "@/hooks/useEvaluator";
import * as Progress from "@radix-ui/react-progress";

// Color scheme for different skills
const COLORS: Record<keyof EvaluatorOverviewResponse, string> = {
  grammar: "#3b82f6", // Blue
  vocabulary: "#10b981", // Green
  fluency: "#8b5cf6", // Purple
};

export const EvaluatorOverviewChart = ({
  data,
}: {
  data: EvaluatorOverviewResponse;
}) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <SkillBar label="Grammar" value={data.grammar} color={COLORS.grammar} />

      <SkillBar
        label="Vocabulary"
        value={data.vocabulary}
        color={COLORS.vocabulary}
      />

      <SkillBar label="Fluency" value={data.fluency} color={COLORS.fluency} />
    </div>
  );
};

const SkillBar = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-medium">{value}%</span>
      </div>
      <Progress.Root
        className="relative overflow-hidden bg-gray-200 rounded-full w-full h-4"
        value={value}
      >
        <Progress.Indicator
          className="h-full transition-transform duration-500 ease-in-out rounded-full"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </Progress.Root>
    </div>
  );
};
