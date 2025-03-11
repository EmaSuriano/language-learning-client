export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const GENDER_TO_ICON = {
  f: "👩",
  m: "👨",
};

// Example: ef_dora
export const formatVoiceTitle = (voice: string) => {
  const [code, name] = voice.split("_");
  const [_, gender] = code.split("") as [string, keyof typeof GENDER_TO_ICON];

  return `${capitalize(name)} ${GENDER_TO_ICON[gender]}`;
};

const CEFR_LEVELS = [
  "A1 - Beginner",
  "A2 - Elementary",
  "B1 - Intermediate",
  "B2 - Upper Intermediate",
  "C1 - Advanced",
  "C2 - Proficient",
];

export const formatLevelToText = (level: number) => {
  return CEFR_LEVELS[level - 1];
};
