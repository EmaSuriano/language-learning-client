"use client";

import React from "react";
import { Box, Flex, Separator, Text, Avatar, Button } from "@radix-ui/themes";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Languages,
  LogOut,
  MessageSquare,
  User,
  ChartArea,
} from "lucide-react";
import { useAuthUser } from "@/hooks/useLearningSession";

interface SidebarProps {
  collapsed?: boolean;
}

export default function Sidebar({ collapsed = false }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthUser();

  // Navigation items
  const navItems = [
    {
      label: "New chat",
      icon: <MessageSquare size={collapsed ? 24 : 20} />,
      href: "/new-chat",
    },
    {
      label: "User profile",
      icon: <User size={collapsed ? 24 : 20} />,
      href: "/settings",
    },
    {
      label: "Learning Progress",
      icon: <ChartArea size={collapsed ? 24 : 20} />,
      href: "/history",
    },
  ];

  return (
    <Box
      className={`h-screen ${
        collapsed ? "w-20" : "w-64"
      } bg-white border-r border-gray-200 shadow-sm flex flex-col transition-all duration-300 flex flex-1`}
    >
      {/* Logo */}
      <Flex
        align="center"
        justify={collapsed ? "center" : "start"}
        p="4"
        gap="2"
      >
        <Languages size={28} className="text-indigo-600" />
        {!collapsed && (
          <Text size="5" weight="bold">
            Language Learning
          </Text>
        )}
      </Flex>

      <Separator size="4" my="2" />

      {/* Navigation Links - Make this section expand to push profile down */}
      <Flex direction="column" gap="2" p="2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link className="ml-2" href={item.href} passHref key={item.href}>
              <Button
                variant="ghost"
                className={`w-full ${
                  collapsed ? "justify-center" : "justify-start"
                } ${
                  isActive
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-transparent hover:bg-gray-100"
                }`}
              >
                <Flex
                  align="center"
                  gap="3"
                  justify={collapsed ? "center" : "start"}
                  className="w-full"
                >
                  <Box className="text-indigo-600">{item.icon}</Box>
                  {!collapsed && <Text size="2">{item.label}</Text>}
                </Flex>
              </Button>
            </Link>
          );
        })}
      </Flex>

      {/* Separator and User Profile - These stay at the bottom */}
      <Separator size="4" my="2" mt="auto" />

      <Flex
        p="4"
        gap="3"
        align="center"
        justify={collapsed ? "center" : "between"}
      >
        <Flex gap="3" align="center">
          <Avatar
            size={collapsed ? "3" : "2"}
            radius="full"
            fallback={user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            color="indigo"
          />
          {!collapsed && (
            <Flex direction="column" gap="0">
              <Text size="2" weight="bold" className="truncate max-w-32">
                {user?.name || "User"}
              </Text>
              <Text size="1" color="gray" className="truncate max-w-32">
                {user?.email || "No email"}
              </Text>
            </Flex>
          )}
        </Flex>

        {!collapsed && (
          <Button
            variant="ghost"
            size="1"
            onClick={() => router.push("/logout")}
          >
            <LogOut size={18} className="text-gray-500 hover:text-red-500" />
          </Button>
        )}
      </Flex>
    </Box>
  );
}
