import { useSession } from "react-use-session";

import { z } from "zod";

const SessionSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
});

type Session = z.infer<typeof SessionSchema>;

export const useAuth = () => {
  const { session: rawSession, save, clear } = useSession("user-session");

  const session = rawSession ? SessionSchema.parse(rawSession) : null;

  const login = (newSession: Session) => {
    save(newSession);
  };

  const logout = () => {
    clear();
  };

  return { session, login, logout };
};
