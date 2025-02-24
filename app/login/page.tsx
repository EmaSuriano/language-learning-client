"use client";

import { useAuth } from "@/hooks/useAuth";
import { useUserStore } from "@/hooks/useUserStore";
import { Box, Button, Container, Theme } from "@radix-ui/themes";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const MOCK_USER_ID = "1";

export default function Login() {
  const { userSession, login } = useAuth();
  const { error, isLoading, fetchUser } = useUserStore();

  const onClick = () => {
    fetchUser(MOCK_USER_ID).then((user) =>
      login({ userId: user.id.toString(), email: user.email })
    );
  };

  useEffect(() => {
    if (userSession) {
      redirect("/chat");
    }
  }, [userSession]);

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

          {error && <p>{error}</p>}
        </Container>
      </Box>
    </Theme>
  );
}
