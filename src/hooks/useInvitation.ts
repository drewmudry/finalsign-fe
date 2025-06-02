import { useState, useCallback } from "react";

// Types based on your Go structs
export interface Notification {
  id: string;
  user_id: number;
  type: string;
  title: string;
  message: string;
  data: string; // JSON string
  is_read: boolean;
  created_at: string;
  expires_at?: string;
}

export interface NotificationResponse {
  notifications: Notification[];
}

// Parse invitation data from notification
export interface InvitationData {
  invitation_id: string;
  token: string;
  workspace_id?: string;
  workspace_name?: string;
  inviter_name?: string;
  role?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Custom hook for managing notifications (including invitations)
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's notifications
  const fetchNotifications = useCallback(async (limit: number = 50) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/notifications?limit=${limit}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data: NotificationResponse = await response.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark a notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/notifications/${notificationId}/read`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to mark notification as read"
        );
      }

      // Update the notification in the list
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    }
  }, []);

  // Accept invitation from notification
  const acceptInvitation = useCallback(async (notificationId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/notifications/${notificationId}/accept`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to accept invitation");
      }

      // Mark the notification as read and update the list
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Decline invitation from notification
  const declineInvitation = useCallback(async (notificationId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/notifications/${notificationId}/decline`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to decline invitation");
      }

      // Mark the notification as read and update the list
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper function to parse invitation data from notification
  const parseInvitationData = useCallback(
    (notification: Notification): InvitationData | null => {
      if (notification.type !== "workspace_invitation") return null;

      try {
        return JSON.parse(notification.data) as InvitationData;
      } catch {
        return null;
      }
    },
    []
  );

  // Get unread count
  const unreadCount = notifications.filter((notif) => !notif.is_read).length;

  // Get invitation notifications specifically
  const invitationNotifications = notifications.filter(
    (notif) => notif.type === "workspace_invitation" && !notif.is_read
  );

  // Get non-invitation notifications
  const regularNotifications = notifications.filter(
    (notif) => notif.type !== "workspace_invitation"
  );

  return {
    notifications,
    unreadCount,
    invitationNotifications,
    regularNotifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    acceptInvitation,
    declineInvitation,
    parseInvitationData,
  };
};

// Hook for workspace invitation actions (for workspace owners/admins)
export const useWorkspaceInvitations = (workspaceSlug?: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Send invitation
  const sendInvitation = useCallback(
    async (email: string, role: string) => {
      if (!workspaceSlug) {
        throw new Error("Workspace slug is required");
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_BASE_URL}/workspaces/${workspaceSlug}/invite`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, role }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to send invitation");
        }

        return await response.json();
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [workspaceSlug]
  );

  return {
    sendInvitation,
    loading,
    error,
  };
};
