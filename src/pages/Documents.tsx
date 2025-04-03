
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Document, Tag } from "@/types/api";
import DocumentCard from "@/components/documents/DocumentCard";
import DocumentUpload from "@/components/documents/DocumentUpload";
import { documentApi, mockApi } from "@/services/api";
import { toast } from "sonner";
import {
  UploadIcon,
  SearchIcon,
  FilterIcon,
  LoaderIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        // In a real app, we would use documentApi.getDocuments()
        // For demo purposes, we're using mock data
        const mockDocs = mockApi.mockDocuments();
        setDocuments(mockDocs);
        
        // Extract unique tags from documents
        const allTags = mockDocs
          .flatMap((doc) => doc.tags)
          .reduce((acc: Tag[], tag) => {
            if (!acc.some((t) => t.id === tag.id)) {
              acc.push(tag);
            }
            return acc;
          }, []);
        
        setTags(allTags);
      } catch (error) {
        console.error("Failed to fetch documents:", error);
        toast.error("Failed to load documents");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleUpload = async (
    file: File,
    title: string,
    description: string,
    tagIds: string[]
  ) => {
    try {
      // In a real app, we would use documentApi.uploadDocument()
      // For demo purposes, create a mock document
      const newDocument: Document = {
        id: `doc-${Date.now()}`,
        title: title || file.name,
        description: description || undefined,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type || "application/octet-stream",
        status: "processing",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: "user-1",
        tags: tags.filter((tag) => tagIds.includes(tag.id)),
      };
      
      setDocuments([newDocument, ...documents]);
      toast.success("Document uploaded successfully");
      
      // Simulate processing completion
      setTimeout(() => {
        setDocuments((docs) =>
          docs.map((doc) =>
            doc.id === newDocument.id
              ? { ...doc, status: "processed" }
              : doc
          )
        );
      }, 3000);
    } catch (error) {
      console.error("Failed to upload document:", error);
      toast.error("Failed to upload document");
    }
  };

  const handleDeleteDocument = (document: Document) => {
    setDocumentToDelete(document);
  };

  const confirmDelete = async () => {
    if (!documentToDelete) return;
    
    try {
      // In a real app, we would use documentApi.deleteDocument()
      setDocuments(documents.filter((doc) => doc.id !== documentToDelete.id));
      toast.success("Document deleted successfully");
    } catch (error) {
      console.error("Failed to delete document:", error);
      toast.error("Failed to delete document");
    } finally {
      setDocumentToDelete(null);
    }
  };

  const handleEditDocument = (document: Document) => {
    toast.info("Edit functionality not implemented in this demo");
  };

  const handleReprocessDocument = async (document: Document) => {
    try {
      // In a real app, we would use documentApi.reprocessDocument()
      setDocuments(
        documents.map((doc) =>
          doc.id === document.id ? { ...doc, status: "processing" } : doc
        )
      );
      
      toast.success("Document reprocessing started");
      
      // Simulate processing completion
      setTimeout(() => {
        setDocuments((docs) =>
          docs.map((doc) =>
            doc.id === document.id ? { ...doc, status: "processed" } : doc
          )
        );
      }, 3000);
    } catch (error) {
      console.error("Failed to reprocess document:", error);
      toast.error("Failed to reprocess document");
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = searchTerm
      ? doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.description &&
          doc.description.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
      
    const matchesTag = selectedTag
      ? doc.tags.some((tag) => tag.id === selectedTag)
      : true;
      
    const matchesStatus = selectedStatus
      ? doc.status === selectedStatus
      : true;
      
    return matchesSearch && matchesTag && matchesStatus;
  });

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold">Documents</h1>
          <Button onClick={() => setIsUploadOpen(true)}>
            <UploadIcon className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search documents..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Tags</SelectItem>
                {tags.map((tag) => (
                  <SelectItem key={tag.id} value={tag.id}>
                    <div className="flex items-center">
                      <div
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: tag.color }}
                      ></div>
                      {tag.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="processed">Processed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoaderIcon className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
              <FileIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No documents found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedTag || selectedStatus
                ? "Try adjusting your filters"
                : "Upload a document to get started"}
            </p>
            <Button onClick={() => setIsUploadOpen(true)}>
              <UploadIcon className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredDocuments.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onDelete={handleDeleteDocument}
                onEdit={handleEditDocument}
                onReprocess={handleReprocessDocument}
              />
            ))}
          </div>
        )}
      </div>

      <DocumentUpload
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUpload}
        tags={tags}
      />

      <AlertDialog open={!!documentToDelete} onOpenChange={() => setDocumentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the document "
              {documentToDelete?.title}" and remove it from your knowledge base.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Documents;

// Helper component for the empty state
const FileIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);
