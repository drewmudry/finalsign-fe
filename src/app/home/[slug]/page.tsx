"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  Users,
  Mail,
  MoreHorizontal,
  Trash2,
  UserMinus,
  Crown,
  Shield,
  User,
  Eye,
  Loader2,
  ArrowLeft,
  Save,
} from "lucide-react";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { toast } from "sonner";
import Link from "next/link";

// Types
interface WorkspaceMember {
  id: number;
  email: string;
  name: string;
  avatar_url?: string;
  role: "owner" | "admin" | "member" | "viewer";
  status: "active" | "pending";
  joined_at: string;
}

interface PendingInvitation {
  id: string;
  workspace_id: string;
  inviter_id: number;
  inviter_name: string;
  invitee_email: string;
  invitee_id?: number;
  role: "owner" | "admin" | "member" | "viewer";
  status: "pending";
  token: string;
  expires_at: string;
  created_at: string;
}

interface WorkspaceSettings {
  name: string;
  description: string;
  settings: {
    theme: "light" | "dark";
    color: string;
    logo?: string;
    custom_css?: string;
    timezone: string;
    language: string;
  };
}

export default function WorkspaceSettingsPage() {
  const params = useParams();
  const { currentWorkspace, fetchWorkspaces } = useWorkspace();
  const slug = params.slug as string;

  // State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [invitations, setInvitations] = useState<PendingInvitation[]>([]);
  const [workspaceSettings, setWorkspaceSettings] = useState<WorkspaceSettings>(
    {
      name: "",
      description: "",
      settings: {
        theme: "light",
        color: "#3b82f6",
        timezone: "America/New_York",
        language: "en",
      },
    }
  );

  // Invitation form
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member" | "viewer">(
    "member"
  );
  const [inviting, setInviting] = useState(false);

  // Confirmation dialogs
  const [memberToRemove, setMemberToRemove] = useState<WorkspaceMember | null>(
    null
  );
  const [invitationToCancel, setInvitationToCancel] =
    useState<PendingInvitation | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  // Check permissions
  const canManageSettings =
    currentWorkspace?.role === "owner" || currentWorkspace?.role === "admin";
  const canManageMembers = canManageSettings;
  const canManageOwners = currentWorkspace?.role === "owner";

  // Fetch data
  useEffect(() => {
    if (currentWorkspace && slug) {
      fetchWorkspaceData();
    }
  }, [currentWorkspace, slug]);

  useEffect(() => {
    if (currentWorkspace) {
      setWorkspaceSettings((prev) => ({
        name: currentWorkspace.name || prev.name,
        description: currentWorkspace.description || prev.description,
        settings: {
          ...prev.settings,
          // Add any existing settings from currentWorkspace if available
          // Since currentWorkspace might not have settings, keep the defaults
        },
      }));
    }
  }, [currentWorkspace]);

  const fetchWorkspaceData = async () => {
    try {
      setLoading(true);

      // Fetch workspace details (for settings)
      const workspaceResponse = await fetch(`${apiUrl}/workspaces/${slug}`, {
        credentials: "include",
      });

      if (workspaceResponse.ok) {
        const workspaceData = await workspaceResponse.json();

        // Merge existing settings with fetched data
        setWorkspaceSettings((prev) => ({
          name: workspaceData.name || currentWorkspace?.name || "",
          description:
            workspaceData.description || currentWorkspace?.description || "",
          settings: {
            theme: workspaceData.settings?.theme || prev.settings.theme,
            color: workspaceData.settings?.color || prev.settings.color,
            logo: workspaceData.settings?.logo || prev.settings.logo,
            custom_css:
              workspaceData.settings?.custom_css || prev.settings.custom_css,
            timezone:
              workspaceData.settings?.timezone || prev.settings.timezone,
            language:
              workspaceData.settings?.language || prev.settings.language,
          },
        }));
      } else {
        // If workspace fetch fails, at least use the currentWorkspace data
        if (currentWorkspace) {
          setWorkspaceSettings((prev) => ({
            name: currentWorkspace.name || prev.name,
            description: currentWorkspace.description || prev.description,
            settings: prev.settings, // Keep existing settings defaults
          }));
        }
      }

      if (canManageMembers) {
        // Fetch members
        const membersResponse = await fetch(
          `${apiUrl}/workspaces/${slug}/members`,
          {
            credentials: "include",
          }
        );

        if (membersResponse.ok) {
          const membersData = await membersResponse.json();
          setMembers(membersData.members || []);
        }

        // Fetch pending invitations
        const invitationsResponse = await fetch(
          `${apiUrl}/workspaces/${slug}/invitations`,
          {
            credentials: "include",
          }
        );

        if (invitationsResponse.ok) {
          const invitationsData = await invitationsResponse.json();
          setInvitations(invitationsData.invitations || []);
        }
      }
    } catch (error) {
      console.error("Error fetching workspace data:", error);
      toast("Error", {
        description: "Failed to load workspace data",
      });

      // Fallback to currentWorkspace data if available
      if (currentWorkspace) {
        setWorkspaceSettings((prev) => ({
          name: currentWorkspace.name || prev.name,
          description: currentWorkspace.description || prev.description,
          settings: prev.settings,
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  // Update workspace settings
  const handleSaveSettings = async () => {
    try {
      setSaving(true);

      const response = await fetch(`${apiUrl}/workspaces/${slug}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workspaceSettings),
      });

      if (response.ok) {
        toast("Success", {
          description: "Workspace settings updated successfully",
        });
        // Refresh workspace data
        await fetchWorkspaces();
      } else {
        throw new Error("Failed to update workspace");
      }
    } catch {
      toast("Error", {
        description: "Failed to update workspace settings",
      });
    } finally {
      setSaving(false);
    }
  };

  // Invite user
  const handleInviteUser = async () => {
    if (!inviteEmail.trim()) return;

    try {
      setInviting(true);

      const response = await fetch(`${apiUrl}/workspaces/${slug}/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: inviteEmail.trim(),
          role: inviteRole,
        }),
      });

      if (response.ok) {
        toast("Success", {
          description: `Invitation sent to ${inviteEmail}`,
        });
        setInviteEmail("");
        setInviteRole("member");
        fetchWorkspaceData(); // Refresh data
      } else {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to send invitation");
      }
    } catch (error) {
      console.error("Error inviting user:", error);
      toast("Success", {
        description: `"Failed to send invitation"`,
      });
    } finally {
      setInviting(false);
    }
  };

  // Update member role
  const handleUpdateRole = async (memberId: number, newRole: string) => {
    try {
      const response = await fetch(
        `${apiUrl}/workspaces/${slug}/members/${memberId}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (response.ok) {
        toast("Success", {
          description: `Member role updated successfully`,
        });
        fetchWorkspaceData(); // Refresh data
      } else {
        throw new Error("Failed to update member role");
      }
    } catch (error) {
      console.error("Error updating member role:", error);
      toast("Error", {
        description: `Failed to update member's role`,
      });
    }
  };

  // Remove member
  const handleRemoveMember = async () => {
    if (!memberToRemove) return;

    try {
      const response = await fetch(
        `${apiUrl}/workspaces/${slug}/members/${memberToRemove.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        toast("Success", {
          description: `${memberToRemove.name} has been removed from the workspace`,
        });
        setMemberToRemove(null);
        fetchWorkspaceData(); // Refresh data
      } else {
        throw new Error("Failed to remove member");
      }
    } catch (error) {
      console.error("Error removing member:", error);
      toast("Error", {
        description: "Failed to remove member",
      });
    }
  };

  // Cancel invitation
  const handleCancelInvitation = async () => {
    if (!invitationToCancel) return;

    try {
      const response = await fetch(
        `${apiUrl}/workspaces/${slug}/invitations/${invitationToCancel.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        toast("Success", {
          description: "Invitation cancelled successfully",
        });
        setInvitationToCancel(null);
        fetchWorkspaceData(); // Refresh data
      } else {
        throw new Error("Failed to cancel invitation");
      }
    } catch (error) {
      console.error("Error cancelling invitation:", error);
      toast("Error", {
        description: "Failed to cancel invite",
      });
    }
  };

  // Role badge component
  const RoleBadge = ({ role }: { role: string }) => {
    const roleConfig = {
      owner: {
        icon: Crown,
        color: "bg-yellow-100 text-yellow-800",
        label: "Owner",
      },
      admin: {
        icon: Shield,
        color: "bg-blue-100 text-blue-800",
        label: "Admin",
      },
      member: {
        icon: User,
        color: "bg-green-100 text-green-800",
        label: "Member",
      },
      viewer: {
        icon: Eye,
        color: "bg-gray-100 text-gray-800",
        label: "Viewer",
      },
    };

    const config =
      roleConfig[role as keyof typeof roleConfig] || roleConfig.member;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  if (!canManageSettings) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You don&apost have permission to access workspace settings.
          </p>
          <Link href="/home">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/home">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Workspace Settings
            </h1>
            <p className="text-gray-600">{currentWorkspace?.name}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Members ({members.length})
          </TabsTrigger>
          <TabsTrigger value="invitations" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Invitations ({invitations.length})
          </TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Workspace Information</CardTitle>
              <CardDescription>
                Update your workspace name, description, and appearance
                settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Workspace Name</Label>
                  <Input
                    id="name"
                    value={workspaceSettings.name}
                    onChange={(e) =>
                      setWorkspaceSettings((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Enter workspace name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={workspaceSettings.settings.theme}
                    onValueChange={(value: "light" | "dark") =>
                      setWorkspaceSettings((prev) => ({
                        ...prev,
                        settings: { ...prev.settings, theme: value },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={workspaceSettings.description}
                  onChange={(e) =>
                    setWorkspaceSettings((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter workspace description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="color">Accent Color</Label>
                  <Input
                    id="color"
                    type="color"
                    value={workspaceSettings.settings.color}
                    onChange={(e) =>
                      setWorkspaceSettings((prev) => ({
                        ...prev,
                        settings: { ...prev.settings, color: e.target.value },
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={workspaceSettings.settings.timezone}
                    onValueChange={(value) =>
                      setWorkspaceSettings((prev) => ({
                        ...prev,
                        settings: { ...prev.settings, timezone: value },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">
                        Eastern Time
                      </SelectItem>
                      <SelectItem value="America/Chicago">
                        Central Time
                      </SelectItem>
                      <SelectItem value="America/Denver">
                        Mountain Time
                      </SelectItem>
                      <SelectItem value="America/Los_Angeles">
                        Pacific Time
                      </SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members">
          <div className="space-y-6">
            {/* Invite New Member */}
            <Card>
              <CardHeader>
                <CardTitle>Invite New Member</CardTitle>
                <CardDescription>
                  Send an invitation to add a new member to your workspace.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter email address"
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </div>
                  <Select
                    value={inviteRole}
                    onValueChange={(value: "admin" | "member" | "viewer") =>
                      setInviteRole(value)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Viewer</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleInviteUser}
                    disabled={inviting || !inviteEmail.trim()}
                  >
                    {inviting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Inviting...
                      </>
                    ) : (
                      "Invite"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Members List */}
            <Card>
              <CardHeader>
                <CardTitle>Workspace Members</CardTitle>
                <CardDescription>
                  Manage roles and remove members from your workspace.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {members.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No members found
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {member.avatar_url ? (
                                <img
                                  src={member.avatar_url}
                                  alt={member.name}
                                  className="w-8 h-8 rounded-full"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sage to-accent-orange flex items-center justify-center text-cream text-sm font-medium">
                                  {member.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <div className="font-medium">{member.name}</div>
                                <div className="text-sm text-gray-500">
                                  {member.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <RoleBadge role={member.role} />
                          </TableCell>
                          <TableCell>
                            {new Date(member.joined_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {/* Role change options */}
                                {(canManageOwners ||
                                  member.role !== "owner") && (
                                  <>
                                    {member.role !== "viewer" && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleUpdateRole(member.id, "viewer")
                                        }
                                      >
                                        Make Viewer
                                      </DropdownMenuItem>
                                    )}
                                    {member.role !== "member" && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleUpdateRole(member.id, "member")
                                        }
                                      >
                                        Make Member
                                      </DropdownMenuItem>
                                    )}
                                    {member.role !== "admin" && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleUpdateRole(member.id, "admin")
                                        }
                                      >
                                        Make Admin
                                      </DropdownMenuItem>
                                    )}
                                    {canManageOwners &&
                                      member.role !== "owner" && (
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleUpdateRole(member.id, "owner")
                                          }
                                        >
                                          Make Owner
                                        </DropdownMenuItem>
                                      )}
                                    <DropdownMenuItem
                                      onClick={() => setMemberToRemove(member)}
                                      className="text-red-600"
                                    >
                                      <UserMinus className="w-4 h-4 mr-2" />
                                      Remove Member
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Invitations Tab */}
        <TabsContent value="invitations">
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>
                Manage pending workspace invitations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {invitations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No pending invitations
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Invited by</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invitations.map((invitation) => (
                      <TableRow key={invitation.id}>
                        <TableCell className="font-medium">
                          {invitation.invitee_email}
                        </TableCell>
                        <TableCell>
                          <RoleBadge role={invitation.role} />
                        </TableCell>
                        <TableCell>{invitation.inviter_name}</TableCell>
                        <TableCell>
                          {new Date(invitation.expires_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setInvitationToCancel(invitation)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialogs */}
      <AlertDialog
        open={!!memberToRemove}
        onOpenChange={() => setMemberToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {memberToRemove?.name} from this
              workspace? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!invitationToCancel}
        onOpenChange={() => setInvitationToCancel(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Invitation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel the invitation for{" "}
              {invitationToCancel?.invitee_email}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelInvitation}
              className="bg-red-600 hover:bg-red-700"
            >
              Cancel Invitation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
