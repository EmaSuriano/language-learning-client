"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import IntlProvider from "@/components/IntlProvider";
import { LearningHistory } from "@/components/LearningHistory";
import { Theme } from "@radix-ui/themes";

export default function History() {
  return (
    <AuthGuard>
      <IntlProvider>
        <Theme accentColor="blue" grayColor="slate">
          <LearningHistory />
        </Theme>
      </IntlProvider>
    </AuthGuard>
  );
}
