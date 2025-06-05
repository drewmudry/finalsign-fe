"use client";

import { useState, useEffect } from "react";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileIcon,
  Search,
  Plus,
  Filter,
  SortDesc,
  SortAsc,
} from "lucide-react";
import Link from "next/link";

// Types based on the provided Go types
// interface Template {
//   id: string; // UUID
//   name: string;
//   description: string;
//   s3_bucket: string;
//   s3_key: string;
//   pdf_hash: string;
//   file_size: number;
//   mime_type: string;
//   created_by: number;
//   workspace_id: string; // UUID
//   is_active: boolean;
//   created_at: string;
//   updated_at: string;
//   version: number;
// }

// interface TemplateField {
//   id: string; // UUID
//   template_id: string; // UUID
//   field_name: string;
//   field_type: string;
//   field_label: string;
//   placeholder_text: string;
//   position_data: string; // JSON string
//   validation_rules: string; // JSON string
//   required: boolean;
//   created_at: string;
//   version: number;
// }

interface UserTemplate {
  id: string; // UUID
  name: string;
  description: string;
  file_size: number;
  created_by: number;
  creator_name: string;
  creator_email: string;
  workspace_id: string; // UUID
  workspace_name: string;
  field_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  version: number;
}

export default function TemplatesList() {
  const { currentWorkspace, loading: workspaceLoading } = useWorkspace();
  const [templates, setTemplates] = useState<UserTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    async function fetchTemplates() {
      if (!currentWorkspace) return;

      try {
        setLoading(true);
        setError(null);

        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const response = await fetch(
          `${apiUrl}/workspaces/${currentWorkspace.slug}/templates`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch templates: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        setTemplates(Array.isArray(data.templates) ? data.templates : []);
      } catch (err) {
        console.error("Error fetching templates:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch templates"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();
  }, [currentWorkspace]);

  // Filter templates based on search query
  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort templates by created_at date
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  // Format date to a readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Format file size to a readable string
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (workspaceLoading) {
    return <TemplatesListSkeleton />;
  }

  if (!currentWorkspace) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">No Workspace Selected</h2>
        <p className="text-muted-foreground">
          Please select a workspace to view templates.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Templates</h1>
        <p className="text-muted-foreground">
          Manage document templates for {currentWorkspace.name}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            title={`Sort by date ${
              sortOrder === "asc" ? "descending" : "ascending"
            }`}
          >
            {sortOrder === "asc" ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
          <Button variant="outline" size="icon" title="Filter templates">
            <Filter className="h-4 w-4" />
          </Button>
          <Button asChild>
            <Link href="/templates/new">
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Link>
          </Button>
        </div>
      </div>

      {loading ? (
        <TemplatesListSkeleton />
      ) : error ? (
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md">
          <p className="font-medium">Error loading templates</p>
          <p className="text-sm">{error}</p>
        </div>
      ) : sortedTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/40">
          <FileIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No templates found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? "No templates match your search criteria."
              : "Get started by creating your first template."}
          </p>
          {!searchQuery && (
            <Button asChild>
              <Link href="/templates/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedTemplates.map((template) => (
            <Link href={`/templates/${template.id}`} key={template.id}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-1">
                      {template.name}
                    </CardTitle>
                    {!template.is_active && (
                      <Badge
                        variant="outline"
                        className="text-muted-foreground"
                      >
                        Inactive
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {template.description || "No description"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileIcon className="h-4 w-4 mr-1" />
                    <span>{formatFileSize(template.file_size)}</span>
                    <span className="mx-2">•</span>
                    <span>
                      {template.field_count}{" "}
                      {template.field_count === 1 ? "field" : "fields"}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 text-xs text-muted-foreground flex justify-between">
                  <Badge>{template.creator_name}</Badge>
                  <span>Updated {formatDate(template.updated_at)}</span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function TemplatesListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="h-full">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="pb-2">
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
          <CardFooter className="pt-0">
            <div className="flex justify-between w-full">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
