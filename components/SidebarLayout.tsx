"use client";

import React, { useState, useEffect } from "react";
import { Box, Flex, Button, Tooltip } from "@radix-ui/themes";
import { ChevronLeft, ChevronRight, Menu, Languages } from "lucide-react";
import Sidebar from "./Sidebar";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener
    window.addEventListener("resize", checkMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Flex className="relative min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Box className="relative">
          <Sidebar collapsed={collapsed} />
        </Box>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && mobileOpen && (
        <Box
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <Box
          className={`fixed top-0 left-0 h-full z-50 transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar collapsed={false} />
        </Box>
      )}

      {/* Main Content */}
      <Box className="flex-1">
        {/* Mobile Header with Menu Button */}
        {isMobile && (
          <Box className="p-4 bg-white border-b border-gray-200 shadow-sm">
            <Flex align="center" justify="between">
              <Flex align="center" gap="2">
                <Button variant="ghost" size="2" onClick={toggleMobileSidebar}>
                  <Menu size={24} />
                </Button>
                <Languages size={24} className="text-indigo-600" />
                <Box as="span" className="font-bold text-lg">
                  AI Language Learning
                </Box>
              </Flex>
            </Flex>
          </Box>
        )}

        {/* Page Content */}
        <Box>{children}</Box>
      </Box>
    </Flex>
  );
}
