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
