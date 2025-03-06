"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import IntlProvider from "@/components/IntlProvider";
import SidebarLayout from "@/components/SidebarLayout";
import UserProfile from "@/components/UserProfile";

export default function History() {
  return (
    <AuthGuard>
      <IntlProvider>
        <SidebarLayout>
          <UserProfile />
        </SidebarLayout>
      </IntlProvider>
    </AuthGuard>
  );
}
