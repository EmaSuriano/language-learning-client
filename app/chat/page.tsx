"use client";

import { MyAssistant } from "@/components/MyAssistant";
import SituationProgress from "@/components/ProgressTracker";
import SituationSettings from "@/components/SituationSettings";
import UserSettings from "@/components/UserSettings";
import EndChatToast from "@/components/EndChatToast";
import { MyRuntimeProvider } from "@/components/MyRuntimeProvider";
import { AuthGuard } from "@/components/auth/AuthGuard";
import IntlProvider from "@/components/IntlProvider";

export default function Chat() {
  return (
    <AuthGuard>
      <IntlProvider>
        <MyRuntimeProvider>
          <main className="h-dvh">
            <MyAssistant />
            <UserSettings />
            <SituationSettings />
            <SituationProgress />
            <EndChatToast />
          </main>
        </MyRuntimeProvider>
      </IntlProvider>
    </AuthGuard>
  );
}
