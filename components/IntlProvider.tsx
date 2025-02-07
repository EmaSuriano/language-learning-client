"use client";

import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { useUserStore } from "@/hooks/useUserStore";
import { useEffect, useState } from "react";
import locales from "@/locales.json";

const DEFAULT_LANG = "en";

const INTL_MESSAGES: Record<string, AbstractIntlMessages> = locales;

export default function IntlProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUserStore();
  const [messages, setMessages] = useState<AbstractIntlMessages>({});

  const locale = user?.current_language.code || DEFAULT_LANG;

  useEffect(() => {
    setMessages(
      locale in INTL_MESSAGES ? INTL_MESSAGES[locale] : locales[DEFAULT_LANG]
    );
  }, [locale]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
