"use client";

import { WorkspaceProvider } from "@/contexts/WorkspaceContext";
import Navbar from "@/components/NavBar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WorkspaceProvider>
      <Navbar />
      {children}
    </WorkspaceProvider>
  );
}
