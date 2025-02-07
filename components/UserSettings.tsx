"use client";

import { useTheme } from "next-themes";
import nightwind from "nightwind/helper";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { NavigationMenu } from "radix-ui";
import { User, UserUpdate, useUserStore } from "@/hooks/useUserStore";
import { useEffect, useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon, SpeakerLoudIcon } from "@radix-ui/react-icons";
import { useLanguageStore } from "@/hooks/useLanguageStore";

export default function UserSettings() {
  const { user, createUser, fetchUser, updateUser } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) {
    return (
      <button onClick={() => createUser("email@example.com")}>
        Create User
      </button>
    );
  }

  return <UserSettingsDialog user={user} onUpdate={updateUser} />;
}

const UserSettingsDialog = ({
  user,
  onUpdate,
}: {
  user: User;
  onUpdate: (user: UserUpdate) => Promise<void>;
}) => {
  const { languages, fetchLanguages, isLoading } = useLanguageStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchLanguages();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    onUpdate({
      language_level: Number(formData.get("language_level")),
      language_code: String(formData.get("language_code")),
      interests: (formData.get("interests") as string)
        .split(",")
        .map((i) => i.trim()),
    }).then(() => setOpen(false));
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="inline-flex h-9 items-center justify-center rounded bg-violet-100 px-4 font-medium">
          User Settings
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg">
          <Dialog.Title className="text-lg font-medium">
            User Settings
          </Dialog.Title>
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
