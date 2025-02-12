import { MyAssistant } from "@/components/MyAssistant";
import SituationProgress from "@/components/ProgressTracker";
import SituationSettings from "@/components/SituationSettings";
import Toggle from "@/components/Toggle";
import UserSettings from "@/components/UserSettings";
import EndChatToast from "@/components/EndChatToast";

export default function Home() {
  return (
    <main className="h-dvh">
      {/* <Toggle /> */}
      <MyAssistant />
      <UserSettings />
      <SituationSettings />
      <SituationProgress />
      <EndChatToast />
    </main>
  );
}
