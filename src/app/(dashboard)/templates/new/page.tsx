"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileText,
  X,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface UploadError {
  message: string;
  details?: string;
}
interface UploadResponse {
  message: string;
  template: {
    id: number; // or string, depending on your ID type
    name: string;
    description: string;
    file_size: number;
    field_count: number;
    created_at: string; // ISO date string
  };
}

export default function NewTemplatePage() {
  const router = useRouter();
  const { currentWorkspace } = useWorkspace();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<UploadError | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Handle file selection
  const handleFileSelect = (file: File) => {
    setError(null);

    // Validate file type
    if (
      !file.type.includes("pdf") &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError({ message: "Only PDF files are allowed" });
      return;
    }

    // Validate file size (32MB max)
    const maxSize = 32 * 1024 * 1024;
    if (file.size > maxSize) {
      setError({ message: "File size must be less than 32MB" });
      return;
    }

    setSelectedFile(file);
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Remove selected file
  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile || !name.trim() || !currentWorkspace) {
      setError({ message: "Please fill in all required fields" });
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("pdf", selectedFile);
      formData.append("name", name.trim());
      formData.append("description", description.trim());

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

      // Create XMLHttpRequest for upload progress
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      // Handle response
      const uploadPromise = new Promise<UploadResponse>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (e) {
              reject(new Error(`Invalid response format: ${e} `));
            }
          } else {
            try {
              const errorResponse = JSON.parse(xhr.responseText);
              reject(
                new Error(
                  errorResponse.error ||
                    `Upload failed with status ${xhr.status}`
                )
              );
            } catch (e) {
              reject(
                new Error(`Upload failed with status ${xhr.status}, ${e}`)
              );
            }
          }
        };

        xhr.onerror = () => reject(new Error("Network error occurred"));
      });

      // Start upload
      xhr.open(
        "POST",
        `${apiUrl}/workspaces/${currentWorkspace.slug}/templates`,
        true
      );
      xhr.withCredentials = true;
      xhr.send(formData);

      const response = await uploadPromise;

      // Redirect to template editor
      router.push(`/templates/${response.template.id}`);
    } catch (err) {
      console.error("Upload error:", err);
      setError({
        message: "Failed to upload template",
        details: err instanceof Error ? err.message : "Unknown error occurred",
      });
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  if (!currentWorkspace) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">No Workspace Selected</h2>
          <p className="text-muted-foreground">
            Please select a workspace to create templates.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="flex items-center space-x-2 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/templates">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create New Template</h1>
          <p className="text-muted-foreground mt-2">
            Upload a PDF document and add fillable fields to create a template
            for {currentWorkspace.name}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Template Information</CardTitle>
              <CardDescription>
                Provide basic information about your template
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter template name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={255}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {name.length}/255 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter template description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {description.length}/500 characters
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>PDF Document</CardTitle>
              <CardDescription>
                Upload the PDF document that will serve as your template
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedFile ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-muted-foreground/50"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">
                    Drop your PDF here, or click to browse
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Maximum file size: 32MB
                  </p>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileInputChange}
                    className="hidden"
                    id="file-input"
                  />
                  <Button type="button" variant="outline" asChild>
                    <label htmlFor="file-input" className="cursor-pointer">
                      Choose File
                    </label>
                  </Button>
                </div>
              ) : (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-red-500" />
                      <div>
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      disabled={uploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {uploading && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-destructive/10 border border-destructive rounded-md">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-destructive">
                        {error.message}
                      </p>
                      {error.details && (
                        <p className="text-xs text-destructive/80 mt-1">
                          {error.details}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>
                After uploading, you&apos;ll be able to add fillable fields to
                your template
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Upload PDF document</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
                <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                <span>
                  Add signature fields, text fields, and other form elements
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
                <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                <span>Save and start using your template</span>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button type="button" variant="outline" asChild>
              <Link href="/templates">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={!selectedFile || !name.trim() || uploading}
              className="min-w-32"
            >
              {uploading ? <>Uploading...</> : <>Create Template</>}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
