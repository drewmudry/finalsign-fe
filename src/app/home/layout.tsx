"use client";

import { WorkspaceProvider } from "@/contexts/WorkspaceContext";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WorkspaceProvider>{children}</WorkspaceProvider>;
}
