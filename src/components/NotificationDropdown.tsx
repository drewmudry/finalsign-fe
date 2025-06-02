"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Check, X, Mail, Users, Clock, Loader2 } from "lucide-react";
import { useNotifications } from "@/hooks/useInvitation";
import { toast } from "sonner";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    unreadCount,
    invitationNotifications,
    regularNotifications,
    loading,
    error,
    fetchNotifications,
    acceptInvitation,
    declineInvitation,
    markAsRead,
  } = useNotifications();

  // Fetch data when component mounts
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Auto-refresh every 30 seconds when dropdown is closed
  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        fetchNotifications();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isOpen, fetchNotifications]);

  const handleAcceptInvitation = async (
    notificationId: string,
    workspaceName?: string
  ) => {
    try {
      await acceptInvitation(notificationId);
      toast.success(`Successfully joined ${workspaceName || "workspace"}!`);
      // Refresh notifications after accepting
      fetchNotifications();
    } catch (err) {
      toast.error("Failed to accept invitation");
      console.error("Failed to accept invitation:", err);
    }
  };

  const handleDeclineInvitation = async (
    notificationId: string,
    workspaceName?: string
  ) => {
    try {
      await declineInvitation(notificationId);
      toast.success(`Declined invitation to ${workspaceName || "workspace"}`);
      // Refresh notifications after declining
      fetchNotifications();
    } catch (err) {
      toast.error("Failed to decline invitation");
      console.error("Failed to decline invitation:", err);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const extractWorkspaceNameFromMessage = (message: string): string => {
    // Try to extract workspace name from message like "You've been invited to join workspace_name"
    const match = message.match(/join (.+)$/);
    return match ? match[1] : "workspace";
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative p-2 hover:bg-sage/5 hover:text-accent-orange transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-accent-orange"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-96 max-h-[500px] overflow-hidden"
        sideOffset={5}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-sage">Notifications</h3>
          {loading && <Loader2 className="w-4 h-4 animate-spin text-sage/60" />}
          {unreadCount > 0 && (
            <Badge variant="secondary" className="bg-sage/10 text-sage">
              {unreadCount} new
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {error && (
            <div className="p-4 text-center text-red-500 text-sm">{error}</div>
          )}

          {/* Pending Invitations */}
          {invitationNotifications.length > 0 && (
            <>
              <div className="p-3 border-b bg-blue-50/50">
                <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
                  <Users className="w-4 h-4" />
                  Workspace Invitations ({invitationNotifications.length})
                </div>
              </div>

              {invitationNotifications.map((notification) => {
                const workspaceName = extractWorkspaceNameFromMessage(
                  notification.message
                );

                return (
                  <div
                    key={notification.id}
                    className="p-3 border-b bg-blue-50/20"
                  >
                    <Card className="border-0 shadow-none bg-transparent">
                      <CardContent className="p-0">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-sm text-sage">
                                {notification.title}
                              </p>
                              <p className="text-xs text-sage/70">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-1 text-xs text-sage/50 mt-1">
                                <Clock className="w-3 h-3" />
                                {formatTimeAgo(notification.created_at)}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1 h-7 text-xs bg-green-600 hover:bg-green-700"
                              onClick={() =>
                                handleAcceptInvitation(
                                  notification.id,
                                  workspaceName
                                )
                              }
                              disabled={loading}
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 h-7 text-xs border-red-200 text-red-600 hover:bg-red-50"
                              onClick={() =>
                                handleDeclineInvitation(
                                  notification.id,
                                  workspaceName
                                )
                              }
                              disabled={loading}
                            >
                              <X className="w-3 h-3 mr-1" />
                              Decline
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}

              {regularNotifications.length > 0 && <DropdownMenuSeparator />}
            </>
          )}

          {/* Other Notifications */}
          {regularNotifications.length > 0 ? (
            regularNotifications.slice(0, 5).map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`p-3 cursor-pointer hover:bg-sage/5 ${
                  !notification.is_read
                    ? "bg-blue-50/30 border-l-2 border-l-blue-500"
                    : ""
                }`}
                onClick={() => {
                  if (!notification.is_read) {
                    handleMarkAsRead(notification.id);
                  }
                }}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="flex-shrink-0 mt-1">
                    {notification.type === "workspace_invitation" ? (
                      <Users className="w-4 h-4 text-blue-500" />
                    ) : (
                      <Mail className="w-4 h-4 text-sage/60" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm ${
                        !notification.is_read ? "font-semibold" : ""
                      }`}
                    >
                      {notification.title}
                    </p>
                    <p className="text-xs text-sage/70 truncate">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-sage/50 mt-1">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(notification.created_at)}
                    </div>
                  </div>
                  {!notification.is_read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                  )}
                </div>
              </DropdownMenuItem>
            ))
          ) : invitationNotifications.length === 0 && !loading ? (
            <div className="p-8 text-center text-sage/60">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : null}

          {/* Show more notifications indicator */}
          {regularNotifications.length > 5 && (
            <div className="p-3 text-center border-t bg-sage/5">
              <p className="text-xs text-sage/70">
                {regularNotifications.length - 5} more notifications...
              </p>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
