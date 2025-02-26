"use client";

import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { Box, Button, Container, Theme } from "@radix-ui/themes";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const MOCK_USER_ID = "1";

export default function Login() {
  const { session, login } = useAuth();
  const [userId, setUserId] = useState(session ? session.userId : null);
  const { data: user, error, isLoading } = useUser(userId);

  const onClick = () => {
    setUserId(MOCK_USER_ID);
  };

  useEffect(() => {
    if (user) {
      login({ userId: user.id.toString(), email: user.email });
      redirect("/chat");
    }
  }, [user]);

  return (
    <Theme accentColor="blue" grayColor="slate">
      <Box className="min-h-screen bg-[#0A0A0A]">
        <Container size="4" p="6">
          {/* Hero Section */}
          <h1>Login</h1>

          <Button size="4" variant="solid" onClick={onClick}>
            Login
          </Button>

          {isLoading && <p>Loading...</p>}

          {error && <p>Error!</p>}
        </Container>
      </Box>
    </Theme>
  );
}
