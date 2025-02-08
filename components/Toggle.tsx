"use client";

import { useTheme } from "next-themes";
import nightwind from "nightwind/helper";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { NavigationMenu } from "radix-ui";

export default function Toggle() {
  const { theme, setTheme } = useTheme();

  const toggle = () => {
    nightwind.beforeTransition();
    if (theme !== "dark") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <div className="fixed top-6 right-6">
      <NavigationMenu.Root>
        <NavigationMenu.List className="center m-0 flex list-none rounded-md bg-white p-1 shadow-[0_2px_10px] shadow-blackA4">
          <NavigationMenu.Item>
            <NavigationMenu.Link
              className="block cursor-pointer select-none rounded px-3 py-2 text-[15px] font-medium leading-none no-underline outline-none focus:shadow-[0_0_0_2px]"
              onSelect={toggle}
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </div>
  );
}
