import { useLearningSession } from "./useLearningSession";

const DEFAULT_LANG = "en";

export const useLocaleStore = () => {
  const { user } = useLearningSession();
  const locale = user?.current_language.code || DEFAULT_LANG;
  const voice = user?.voice_id || null;

  return { locale, defaultLocale: DEFAULT_LANG, voice };
};
