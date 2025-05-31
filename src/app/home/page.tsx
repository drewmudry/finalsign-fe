"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Zap,
  ChevronDown,
  Settings,
  LogOut,
  User,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useWorkspace } from "@/contexts/WorkspaceContext";

export default function HomePage() {
  const { workspaces, currentWorkspace, setCurrentWorkspace, loading, error } =
    useWorkspace();

  const handleLogout = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    window.location.href = `${apiUrl}/logout`;
  };

  const handleWorkspaceChange = (workspaceSlug: string) => {
    const workspace = workspaces.find((w) => w.slug === workspaceSlug);
    if (workspace) {
      setCurrentWorkspace(workspace);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Top Bar */}
      <header className="bg-white border-b border-sage/10 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo and Workspace Selector */}
            <div className="flex items-center space-x-6">
              {/* Logo */}
              <Link href="/home" className="flex items-center group">
                <div className="w-8 h-8 bg-gradient-to-br from-sage to-accent-orange rounded-lg flex items-center justify-center group-hover:shadow-lg transition-all duration-200">
                  <Zap className="w-5 h-5 text-cream" />
                </div>
                <span className="ml-2 text-xl font-semibold text-sage group-hover:text-accent-orange transition-colors">
                  Nexus
                </span>
              </Link>

              <div className="flex items-center space-x-2">
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-sage" />
                    <span className="text-sm text-sage/60">Loading...</span>
                  </div>
                ) : error ? (
                  <span className="text-sm text-red-500">
                    Error loading workspaces
                  </span>
                ) : (
                  <Select
                    value={currentWorkspace?.slug || ""}
                    onValueChange={handleWorkspaceChange}
                  >
                    <SelectTrigger className="w-64 border-sage/20 focus:border-accent-orange">
                      <SelectValue placeholder="Select workspace" />
                    </SelectTrigger>
                    <SelectContent>
                      {workspaces.map((workspace) => (
                        <SelectItem key={workspace.slug} value={workspace.slug}>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {workspace.name}
                            </span>
                            {workspace.description && (
                              <span className="text-xs text-sage/60">
                                {workspace.description}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 hover:bg-sage/5"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="" alt="User" />
                      <AvatarFallback className="bg-gradient-to-br from-sage to-accent-orange text-cream text-sm">
                        U
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-4 h-4 text-sage/60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-sm border border-sage/10 p-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-sage mb-2">
                Welcome to Nexus
              </h1>
              {currentWorkspace ? (
                <p className="text-sage/60 text-lg">
                  You're currently in the{" "}
                  <span className="font-semibold text-sage">
                    {currentWorkspace.name}
                  </span>{" "}
                  workspace
                </p>
              ) : (
                <p className="text-sage/60 text-lg">
                  Select a workspace to get started
                </p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-gradient-to-br from-sage/5 to-accent-orange/5 rounded-lg border border-sage/10">
                <h3 className="font-semibold text-sage mb-2">Dashboard</h3>
                <p className="text-sm text-sage/60 mb-4">
                  View your workspace dashboard and analytics
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-sage/20 hover:border-accent-orange"
                >
                  Go to Dashboard
                </Button>
              </div>

              <div className="p-6 bg-gradient-to-br from-sage/5 to-accent-orange/5 rounded-lg border border-sage/10">
                <h3 className="font-semibold text-sage mb-2">Projects</h3>
                <p className="text-sm text-sage/60 mb-4">
                  Manage your projects and tasks
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-sage/20 hover:border-accent-orange"
                >
                  View Projects
                </Button>
              </div>

              <div className="p-6 bg-gradient-to-br from-sage/5 to-accent-orange/5 rounded-lg border border-sage/10">
                <h3 className="font-semibold text-sage mb-2">Team</h3>
                <p className="text-sm text-sage/60 mb-4">
                  Collaborate with your team members
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-sage/20 hover:border-accent-orange"
                >
                  Manage Team
                </Button>
              </div>
            </div>
          </div>

          {/* Debug Info (remove in production) */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Debug Info:</h3>
              <pre className="text-xs text-gray-600 overflow-auto">
                {JSON.stringify(
                  {
                    currentWorkspace,
                    workspacesCount: workspaces.length,
                    loading,
                    error,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
