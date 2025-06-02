"use client";
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
import NotificationDropdown from "@/components/NotificationDropdown";

export default function Navbar() {
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

  // Check if current user can manage workspace settings
  const canManageWorkspace =
    currentWorkspace?.role === "owner" || currentWorkspace?.role === "admin";

  return (
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
                <>
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

                  {/* Workspace Settings Gear - Only show for owners and admins */}
                  {canManageWorkspace && currentWorkspace && (
                    <Link
                      href={`/home/${currentWorkspace.slug}`}
                      className="ml-2"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 hover:bg-sage/5 hover:text-accent-orange transition-colors"
                        title="Workspace Settings"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right side: Notifications and User Menu */}
          <div className="flex items-center space-x-2">
            {/* Notification Bell */}
            <NotificationDropdown />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 hover:bg-sage/5"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder.svg" alt="User" />
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
  );
}
