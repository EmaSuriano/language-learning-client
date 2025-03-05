"use client";

import { MyAssistant } from "@/components/MyAssistant";
import { ProgressTracker } from "@/components/ProgressTracker";
import SituationSettings from "@/components/SituationSettings";
import UserSettings from "@/components/UserSettings";
import { MyRuntimeProvider } from "@/components/MyRuntimeProvider";
import { AuthGuard } from "@/components/auth/AuthGuard";
import IntlProvider from "@/components/IntlProvider";
import { useSelectedSituationStore } from "@/hooks/useLearningSession";

export default function Chat() {
  const { selectedSituation } = useSelectedSituationStore();

  return (
    <AuthGuard>
      <IntlProvider>
        {selectedSituation ? <InnerChat /> : <SituationSettings />}
      </IntlProvider>
    </AuthGuard>
  );
}

const InnerChat = () => {
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
