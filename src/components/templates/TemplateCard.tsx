import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileIcon } from "lucide-react";
import Link from "next/link";

interface UserTemplate {
  id: string;
  name: string;
  description: string;
  file_size: number;
  created_by: number;
  creator_name: string;
  creator_email: string;
  workspace_id: string;
  workspace_name: string;
  field_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  version: number;
}

interface TemplateCardProps {
  template: UserTemplate;
}

export function TemplateCard({ template }: TemplateCardProps) {
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

  return (
    <Link href={`/templates/${template.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg line-clamp-1">
              {template.name}
            </CardTitle>
            {!template.is_active && (
              <Badge variant="outline" className="text-muted-foreground">
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
          <span>By {template.creator_name}</span>
          <span>Updated {formatDate(template.updated_at)}</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
