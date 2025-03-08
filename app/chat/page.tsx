"use client";

import { MyAssistant } from "@/components/MyAssistant";
import { ProgressTracker } from "@/components/ProgressTracker";
import SituationSettings from "@/components/SituationSettings";
import { MyRuntimeProvider } from "@/components/MyRuntimeProvider";
import { AuthGuard } from "@/components/auth/AuthGuard";
import IntlProvider from "@/components/IntlProvider";
import { useSelectedSituationStore } from "@/hooks/useLearningSession";
import SidebarLayout from "@/components/SidebarLayout";

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
    <SidebarLayout>
      <MyRuntimeProvider>
        <main className="h-dvh">
          <MyAssistant />
          <ProgressTracker />
        </main>
      </MyRuntimeProvider>
    </SidebarLayout>
  );
};
