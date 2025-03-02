"use client";

import { MyAssistant } from "@/components/MyAssistant";
import { ProgressTracker } from "@/components/ProgressTracker";
import SituationSettings from "@/components/SituationSettings";
import UserSettings from "@/components/UserSettings";
import { MyRuntimeProvider } from "@/components/MyRuntimeProvider";
import { AuthGuard } from "@/components/auth/AuthGuard";
import IntlProvider from "@/components/IntlProvider";
import {
  useLearningSession,
  useSelectedSituationStore,
} from "@/hooks/useLearningSession";

export default function Chat() {
  return (
    <AuthGuard>
      <IntlProvider>
        <InnerChat />
      </IntlProvider>
    </AuthGuard>
  );
}

const InnerChat = () => {
  const { selectedSituation } = useSelectedSituationStore();

  if (!selectedSituation) {
    return <SituationSettings />;
  }

  return (
    <MyRuntimeProvider>
      <main className="h-dvh">
        <MyAssistant />
        <UserSettings />
        <ProgressTracker />
      </main>
    </MyRuntimeProvider>
  );
};
