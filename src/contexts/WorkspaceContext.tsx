"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Types
interface UserWorkspace {
  user_id: number;
  email: string;
  user_name: string;
  workspace_id: string; // UUID string, not number
  workspace_name: string;
  workspace_slug: string;
  role: string;
  membership_status: string;
  joined_at: string;
  plan: string;
  workspace_active: boolean;
}

interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  // Additional fields from UserWorkspace
  role?: string;
  membershipStatus?: string;
  plan?: string;
  active?: boolean;
}

interface WorkspaceContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  loading: boolean;
  error: string | null;
  fetchWorkspaces: () => Promise<void>;
}

// Create context
const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

// Provider component
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      console.log("🔍 Fetching workspaces from:", `${apiUrl}/workspaces`);

      const response = await fetch(`${apiUrl}/workspaces`, {
        method: "GET",
        credentials: "include", // Include cookies for authentication
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("📡 Response status:", response.status);
      console.log("📡 Response headers:", response.headers);

      if (!response.ok) {
        // Get more detailed error information
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

        try {
          const errorData = await response.text();
          console.error("❌ Error response body:", errorData);
          errorMessage += ` - ${errorData}`;
        } catch (parseError) {
          console.error("❌ Could not parse error response:", parseError);
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("✅ API Response data:", data);

      // Transform UserWorkspace array to Workspace array
      let workspacesArray: Workspace[] = [];

      // Handle the actual API response structure: { workspaces: [...] }
      if (data && Array.isArray(data.workspaces)) {
        console.log("📋 Processing workspaces from data.workspaces array");
        workspacesArray = data.workspaces.map((uw: UserWorkspace) => ({
          id: uw.workspace_id,
          name: uw.workspace_name,
          slug: uw.workspace_slug,
          createdAt: uw.joined_at,
          updatedAt: uw.joined_at,
          role: uw.role,
          membershipStatus: uw.membership_status,
          plan: uw.plan,
          active: uw.workspace_active,
        }));
      } else if (Array.isArray(data)) {
        console.log("📋 Processing workspaces from direct array");
        workspacesArray = data.map((uw: UserWorkspace) => ({
          id: uw.workspace_id,
          name: uw.workspace_name,
          slug: uw.workspace_slug,
          createdAt: uw.joined_at,
          updatedAt: uw.joined_at,
          role: uw.role,
          membershipStatus: uw.membership_status,
          plan: uw.plan,
          active: uw.workspace_active,
        }));
      } else {
        console.warn("⚠️ Unexpected API response structure:", data);
        workspacesArray = [];
      }

      console.log("🏢 Processed workspaces:", workspacesArray);
      setWorkspaces(workspacesArray);

      // Set the first workspace as current if none is selected and workspaces exist
      if (!currentWorkspace && workspacesArray.length > 0) {
        console.log("🎯 Setting current workspace to:", workspacesArray[0]);
        setCurrentWorkspace(workspacesArray[0]);
      }
    } catch (err) {
      console.error("💥 Error fetching workspaces:", err);

      // More specific error handling
      if (err instanceof TypeError && err.message.includes("fetch")) {
        setError(
          "Network error: Could not connect to the API server. Is it running on localhost:8080?"
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred while fetching workspaces");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch workspaces only after mounting (client-side)
  useEffect(() => {
    if (mounted) {
      fetchWorkspaces();
    }
  }, [mounted]);

  const value: WorkspaceContextType = {
    workspaces,
    currentWorkspace,
    setCurrentWorkspace,
    loading,
    error,
    fetchWorkspaces,
  };

  // Don't render children until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

// Hook to use the workspace context
export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
