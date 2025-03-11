import * as React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useUserLearningProgression } from "@/hooks/useUserLearningHistory";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useUpdateUser } from "@/hooks/useUser";
import { useAuthUser } from "@/hooks/useLearningSession";
import { Button, Card, Flex, Text } from "@radix-ui/themes";
import { formatLevelToText } from "@/lib/helpers";

export const UserLevelProgression = () => {
  const isMounted = useIsMounted();
  const { user } = useAuthUser();
  const { data: levelChange, refetch } = useUserLearningProgression(user!.id);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);

  const isIncrease = levelChange === "INCREASE";
  const updateUserMutation = useUpdateUser();

  if (!user) {
    throw new Error("User is not authenticated");
  }

  const handleLevelChange = () => {
    const newLevel = isIncrease
      ? Math.min(user.language_level + 1, 5)
      : Math.max(user.language_level - 1, 1);

    updateUserMutation.mutate(
      {
        id: user.id.toString(),
        userData: { language_level: newLevel },
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
          refetch();
        },
        onError: (error) => {
          console.error("Failed to update level:", error);
          // Here you could add error handling UI
        },
      }
    );
  };

  if (!isMounted || levelChange === undefined || levelChange === "MAINTAIN") {
    return null;
  }

  return (
    <>
      <Card className={isIncrease ? "bg-green-50" : "bg-blue-50"}>
        <Flex direction="column" gap="3">
          <Text size="2" weight="bold" color={isIncrease ? "green" : "blue"}>
            {isIncrease ? "Level Up Opportunity" : "Level Adjustment Suggested"}
          </Text>

          <Text size="3">
            {isIncrease
              ? "Based on your recent performance, you're ready to take on more challenging content!"
              : "We've noticed you might benefit from reinforcing some foundational concepts."}
          </Text>

          <Text size="2" className="ml-2">
            {formatLevelToText(user.language_level)} →{" "}
            {formatLevelToText(
              isIncrease ? user.language_level + 1 : user.language_level - 1
            )}
          </Text>

          <Button
            onClick={() => setDismissed(false)}
            className={`mt-2 ${
              isIncrease
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isIncrease ? "Level Up Now" : "Adjust My Level"}
          </Button>
        </Flex>
      </Card>

      <AlertDialog.Root
        open={!dismissed}
        onOpenChange={() => setDismissed(true)}
      >
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-black/25 data-[state=open]:animate-overlayShow" />
          <AlertDialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg focus:outline-none data-[state=open]:animate-contentShow">
            <AlertDialog.Title className="m-0 text-xl font-medium text-gray-900">
              {isIncrease
                ? "Ready to Level Up Your Language Skills?"
                : "Adjusting Your Learning Path"}
            </AlertDialog.Title>

            <AlertDialog.Description className="mb-5 mt-4 text-base flex flex-col leading-normal text-gray-600 gap-3">
              {isIncrease ? (
                <>
                  <span>
                    Based on your excellent performance in recent sessions,
                    we've noticed you're consistently excelling at your current
                    level!
                  </span>
                  <span>
                    Increasing your level will introduce more challenging
                    vocabulary, complex grammar, and advanced conversations to
                    help you progress faster.
                  </span>
                </>
              ) : (
                <>
                  <span>
                    We've analyzed your recent learning sessions and noticed you
                    might benefit from reinforcing some foundational concepts.
                  </span>
                  <span>
                    Adjusting to a more suitable level will help strengthen your
                    understanding and build confidence before tackling more
                    advanced material.
                  </span>
                </>
              )}
            </AlertDialog.Description>

            {showSuccess ? (
              <div className="text-center">
                <div className="mb-4 mt-2 text-green-600 font-medium">
                  Your language level has been successfully{" "}
                  {isIncrease ? "increased" : "adjusted"}!
                </div>
                <button
                  onClick={() => {
                    setShowSuccess(false);
                    setDismissed(true);
                  }}
                  className="inline-flex h-10 items-center justify-center rounded bg-gray-100 px-4 font-medium leading-none text-gray-700 outline-none hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 select-none"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div className="flex justify-end gap-4">
                <AlertDialog.Cancel asChild>
                  <button
                    className="inline-flex h-10 items-center justify-center rounded bg-gray-100 px-4 font-medium leading-none text-gray-700 outline-none hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 select-none"
                    disabled={updateUserMutation.isPending}
                  >
                    Not now
                  </button>
                </AlertDialog.Cancel>

                <button
                  onClick={handleLevelChange}
                  disabled={updateUserMutation.isPending}
                  className={`inline-flex h-10 items-center justify-center rounded px-4 font-medium leading-none outline-none focus-visible:ring-2 focus-visible:ring-offset-2 select-none ${
                    updateUserMutation.isPending
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : isIncrease
                      ? "bg-green-100 text-green-700 hover:bg-green-200 focus-visible:ring-green-500"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200 focus-visible:ring-blue-500"
                  }`}
                >
                  {updateUserMutation.isPending ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : isIncrease ? (
                    "Level Up"
                  ) : (
                    "Adjust Level"
                  )}
                </button>
              </div>
            )}
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  );
};
