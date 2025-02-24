"use client";

import { useTheme } from "next-themes";
import nightwind from "nightwind/helper";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { Switch } from "radix-ui";
import { User, UserUpdate, useUserStore } from "@/hooks/useUserStore";
import { useEffect, useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon, GearIcon } from "@radix-ui/react-icons";
import { useLanguageStore } from "@/hooks/useLanguageStore";
import { useTTSStore } from "@/hooks/useTTSStore";
import { formatVoiceTitle } from "@/lib/helpers";
import { useAppConfigStore } from "@/hooks/useAppConfigStore";
import { useAuthUser } from "@/hooks/useAuthUser";

export default function UserSettings() {
  const { user, updateUser } = useAuthUser();

  const onUpdate = async (update: UserUpdate) =>
    updateUser(update).then(() => {
      if (update.language_code !== user.current_language.code) {
        window.location.reload();
      }
    });

  return <UserSettingsDialog user={user} onUpdate={onUpdate} />;
}

const UserSettingsDialog = ({
  user,
  onUpdate,
}: {
  user: User;
  onUpdate: (user: UserUpdate) => Promise<void>;
}) => {
  const { languages, fetchLanguages } = useLanguageStore();
  const { enableAutoPlay, theme, setTheme, setEnableAutoPlay } =
    useAppConfigStore();
  const { supportedLanguages, voices, fetchSupportedLanguages, fetchVoices } =
    useTTSStore();
  const [selectedLanguage, setSelectedLanguage] = useState(
    user.current_language
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (supportedLanguages.length === 0 || voices.length === 0) {
      fetchLanguages();
      fetchSupportedLanguages();
    }
  }, []);

  useEffect(() => {
    if (selectedLanguage.has_tts) {
      const ttsCode = supportedLanguages.find((l) =>
        l.startsWith(selectedLanguage.code)
      );
      if (ttsCode) {
        fetchVoices(ttsCode);
      }
    }
  }, [selectedLanguage, languages, supportedLanguages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setEnableAutoPlay(Boolean(formData.get("autoplay")));
    setTheme(Boolean(formData.get("theme")) ? "dark" : "light");

    onUpdate({
      language_level: Number(formData.get("language_level")),
      language_code: selectedLanguage.code,
      interests: (formData.get("interests") as string)
        .split(",")
        .map((i) => i.trim()),
      voice_id: selectedLanguage.has_tts
        ? (formData.get("voice_id") as string)
        : null,
    }).then(() => setOpen(false));
  };

  const onOpenChange = (open: boolean) => {
    if (open === true) {
      setSelectedLanguage(user.current_language);
    }

    setOpen(open);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <div className="fixed top-6 left-6">
          <button className="inline-flex h-9 items-center justify-center rounded bg-violet-100 px-4 font-medium">
            <GearIcon />
          </button>
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg">
          <Dialog.Title className="m-0 text-[17px] font-medium text-mauve12">
            User settings
          </Dialog.Title>
          {selectedLanguage.code !== user.current_language.code && (
            <Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal text-red-500">
              Changing the language will reset your chat.
            </Dialog.Description>
          )}

          <form onSubmit={handleSubmit}>
            <fieldset className="mb-4 flex items-center gap-4">
              <label className="w-24 text-right text-sm" htmlFor="language">
                Language
              </label>
              <div className="flex flex-1 items-center gap-2">
                <select
                  className="h-9 w-full rounded border px-2"
                  id="language_code"
                  name="language_code"
                  defaultValue={user.current_language.code}
                  value={selectedLanguage.code}
                  onChange={(e) =>
                    setSelectedLanguage(
                      languages.find((l) => l.code === e.target.value)!
                    )
                  }
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name} ({lang.code}) {lang.has_tts && "🗣️"}
                    </option>
                  ))}
                </select>
              </div>
            </fieldset>

            <fieldset className="mb-4 flex items-center gap-4">
              <label className="w-24 text-right text-sm" htmlFor="voice">
                Voice
              </label>

              {selectedLanguage.has_tts ? (
                <select
                  className="h-9 w-full rounded border px-2"
                  id="voice_id"
                  name="voice_id"
                  defaultValue={user.voice_id || undefined}
                >
                  {voices.map((voice) => (
                    <option key={voice} value={voice}>
                      {formatVoiceTitle(voice)}
                    </option>
                  ))}
                </select>
              ) : (
                "No voice for this language"
              )}
            </fieldset>

            <fieldset className="mb-4 flex items-center gap-4">
              <label className="w-24 text-right text-sm" htmlFor="level">
                Level
              </label>
              <select
                className="h-9 w-full rounded border px-2"
                id="language_level"
                name="language_level"
                defaultValue={user.language_level}
              >
                <option value="1">A1</option>
                <option value="2">A2</option>
                <option value="3">B1</option>
                <option value="4">B2</option>
                <option value="5">C1</option>
                <option value="6">C2</option>
              </select>
            </fieldset>

            <fieldset className="mb-4 flex items-center gap-4">
              <label className="w-24 text-right text-sm" htmlFor="interests">
                Interests
              </label>
              <input
                className="h-9 w-full rounded border px-2"
                id="interests"
                name="interests"
                defaultValue={user.interests.join(", ")}
              />
            </fieldset>

            <fieldset className="mb-4 flex items-center gap-4">
              <label className="" htmlFor="autoplay">
                Enable autoplay
              </label>
              <Switch.Root
                className="relative h-[25px] w-[42px] cursor-default rounded-full bg-blackA6 shadow-[0_2px_10px] shadow-blackA4 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-black"
                id="autoplay"
                name="autoplay"
                defaultChecked={enableAutoPlay}
              >
                <Switch.Thumb className="block size-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] shadow-blackA4 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
              </Switch.Root>
            </fieldset>

            <fieldset className="mb-4 flex items-center gap-4">
              <label className="" htmlFor="theme">
                Dark mode
              </label>
              <Switch.Root
                className="relative h-[25px] w-[42px] cursor-default rounded-full bg-blackA6 shadow-[0_2px_10px] shadow-blackA4 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-black"
                id="theme"
                name="theme"
                defaultChecked={theme === "dark"}
              >
                <Switch.Thumb className="block size-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] shadow-blackA4 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
              </Switch.Root>
            </fieldset>

            <div className="mt-6 flex justify-end gap-2">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="h-9 rounded px-4 text-gray-600"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button type="submit" className="h-9 rounded bg-violet-100 px-4">
                Save changes
              </button>
            </div>
          </form>

          <Dialog.Close asChild>
            <button
              className="absolute right-3 top-3 rounded-full p-1 hover:bg-gray-100"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
