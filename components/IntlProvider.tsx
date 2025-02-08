"use client";

import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { useUserStore } from "@/hooks/useUserStore";
import { useEffect, useState } from "react";
import locales from "@/locales.json";
import { useLocaleStore } from "@/hooks/useLocaleStore";

const INTL_MESSAGES: Record<string, AbstractIntlMessages> = locales;

export default function IntlProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale, defaultLocale } = useLocaleStore();
  const [messages, setMessages] = useState(INTL_MESSAGES[defaultLocale]);

  useEffect(() => {
    setMessages(
      locale in INTL_MESSAGES
        ? INTL_MESSAGES[locale]
        : INTL_MESSAGES[defaultLocale]
    );
  }, [locale]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
