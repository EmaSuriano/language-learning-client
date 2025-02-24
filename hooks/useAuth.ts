import { UserSession, UserSessionSchema } from "@/schemas/userSession";
import { useSession } from "react-use-session";

export const useAuth = () => {
  const { session, save, clear } = useSession("user-session");

  const userSession = session && UserSessionSchema.parse(session);

  const login = (newSession: UserSession) => {
    save(newSession);
  };

  const logout = () => {
    clear();
  };

  return {
    userSession,
    login,
    logout,
    isAuthenticated: userSession ? !!userSession.userId : false,
  };
};
