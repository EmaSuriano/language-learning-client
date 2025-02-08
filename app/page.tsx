import { MyAssistant } from "@/components/MyAssistant";
import SituationSettings from "@/components/SituationSettings";
import Toggle from "@/components/Toggle";
import UserSettings from "@/components/UserSettings";

export default function Home() {
  return (
    <main className="h-dvh">
      <Toggle />
      <MyAssistant />
      <UserSettings />
      <SituationSettings />
    </main>
  );
}
