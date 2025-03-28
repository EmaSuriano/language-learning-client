"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import IntlProvider from "@/components/IntlProvider";
import { LearningHistory } from "@/components/LearningHistory";
import SidebarLayout from "@/components/SidebarLayout";

export default function History() {
  return (
    <AuthGuard>
      <IntlProvider>
        <SidebarLayout>
          <LearningHistory />
        </SidebarLayout>
      </IntlProvider>
    </AuthGuard>
  );
}
