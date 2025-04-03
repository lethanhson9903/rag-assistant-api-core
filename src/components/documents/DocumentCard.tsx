
import React from "react";
import { Document } from "@/types/api";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontalIcon,
  FileIcon,
  FileTextIcon,
  FileCodeIcon,
  FileTypeIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  Loader2Icon,
  ClockIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "../ui/badge";

interface DocumentCardProps {
  document: Document;
  onEdit: (document: Document) => void;
  onDelete: (document: Document) => void;
  onReprocess: (document: Document) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onEdit,
  onDelete,
  onReprocess,
}) => {
  const getFileIcon = () => {
    switch (document.mime_type) {
      case "application/pdf":
        return <FileIcon className="w-10 h-10 text-red-500" />;
      case "text/plain":
        return <FileTextIcon className="w-10 h-10 text-blue-500" />;
      case "text/markdown":
        return <FileTextIcon className="w-10 h-10 text-green-500" />;
      case "text/html":
        return <FileCodeIcon className="w-10 h-10 text-orange-500" />;
      default:
        return <FileTypeIcon className="w-10 h-10 text-gray-500" />;
    }
  };

  const getStatusIcon = () => {
    switch (document.status) {
      case "processed":
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case "processing":
        return <Loader2Icon className="w-4 h-4 text-blue-500 animate-spin" />;
      case "failed":
        return <AlertCircleIcon className="w-4 h-4 text-red-500" />;
      case "pending":
        return <ClockIcon className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">{getFileIcon()}</div>
          <div className="flex-grow min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-medium text-base truncate" title={document.title}>
                {document.title}
              </h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(document)}>
                    Edit
                  </DropdownMenuItem>
                  {document.status === "failed" && (
                    <DropdownMenuItem onClick={() => onReprocess(document)}>
                      Reprocess
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => onDelete(document)}
                    className="text-red-600"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                {getStatusIcon()}
                <span className="capitalize">{document.status}</span>
              </div>
              <div className="text-muted-foreground text-sm">•</div>
              <div className="text-sm text-muted-foreground">
                {formatFileSize(document.file_size)}
              </div>
              <div className="text-muted-foreground text-sm">•</div>
              <div className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(document.updated_at), {
                  addSuffix: true,
                })}
              </div>
            </div>
            {document.description && (
              <p className="text-sm text-muted-foreground mt-2 truncate">
                {document.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
      {document.tags.length > 0 && (
        <CardFooter className="p-4 pt-0 flex gap-2 flex-wrap">
          {document.tags.map((tag) => (
            <Badge
              key={tag.id}
              variant="outline"
              style={{
                borderColor: tag.color,
                color: tag.color,
              }}
            >
              {tag.name}
            </Badge>
          ))}
        </CardFooter>
      )}
    </Card>
  );
};

export default DocumentCard;
