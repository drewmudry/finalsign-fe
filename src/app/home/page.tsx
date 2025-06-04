"use client";
import TemplatesList from "@/components/templates/TemplatesList";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/contexts/WorkspaceContext";

export default function HomePage() {
  const { currentWorkspace, workspaces, loading, error } = useWorkspace();

  return (
    <div className="min-h-screen bg-cream">
      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-sm border border-sage/10 p-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-sage mb-2">
                Welcome to Nexus
              </h1>
            </div>
            <TemplatesList />
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
