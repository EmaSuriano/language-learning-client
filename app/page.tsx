import { MyAssistant } from "@/components/MyAssistant";
import Toggle from "@/components/Toggle";
import UserSettings from "@/components/UserSettings";

export default function Home() {
  return (
    <main className="h-dvh">
      <Toggle />
      <MyAssistant />
      <UserSettings />
    </main>
  );
}
