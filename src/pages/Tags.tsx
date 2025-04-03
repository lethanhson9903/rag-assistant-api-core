
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag } from "@/types/api";
import { mockApi, tagApi } from "@/services/api";
import { toast } from "sonner";
import {
  PlusIcon,
  LoaderIcon,
  MoreHorizontalIcon,
  TrashIcon,
  PencilIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";

// Simple color selector component
const ColorSelector = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) => {
  const colors = [
    "#FF5733", // Red
    "#FFC300", // Yellow
    "#33FF57", // Green
    "#33A8FF", // Blue
    "#CB33FF", // Purple
    "#FF33A8", // Pink
    "#33FFF6", // Cyan
    "#FF8C33", // Orange
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          className={`w-8 h-8 rounded-full border-2 ${
            color === value ? "border-gray-900 dark:border-white" : "border-transparent"
          }`}
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
        />
      ))}
    </div>
  );
};

const Tags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
  const [tagToEdit, setTagToEdit] = useState<Tag | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#33A8FF");
  const [newTagDescription, setNewTagDescription] = useState("");

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true);
        // In a real app, we would use tagApi.getTags()
        // For demo purposes, we're using mock data
        setTags(mockApi.mockTags());
      } catch (error) {
        console.error("Failed to fetch tags:", error);
        toast.error("Failed to load tags");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      toast.error("Tag name is required");
      return;
    }

    try {
      // In a real app, we would use tagApi.createTag()
      // For demo purposes, create a mock tag
      const newTag: Tag = {
        id: `tag-${Date.now()}`,
        name: newTagName.trim(),
        color: newTagColor,
        description: newTagDescription.trim() || undefined,
      };

      setTags([...tags, newTag]);
      resetForm();
      setIsCreateDialogOpen(false);
      toast.success("Tag created successfully");
    } catch (error) {
      console.error("Failed to create tag:", error);
      toast.error("Failed to create tag");
    }
  };

  const handleEditTag = (tag: Tag) => {
    setTagToEdit(tag);
    setNewTagName(tag.name);
    setNewTagColor(tag.color);
    setNewTagDescription(tag.description || "");
    setIsEditDialogOpen(true);
  };

  const handleUpdateTag = async () => {
    if (!tagToEdit || !newTagName.trim()) {
      toast.error("Tag name is required");
      return;
    }

    try {
      // In a real app, we would use tagApi.updateTag()
      const updatedTag: Tag = {
        ...tagToEdit,
        name: newTagName.trim(),
        color: newTagColor,
        description: newTagDescription.trim() || undefined,
      };

      setTags(tags.map((t) => (t.id === updatedTag.id ? updatedTag : t)));
      resetForm();
      setIsEditDialogOpen(false);
      toast.success("Tag updated successfully");
    } catch (error) {
      console.error("Failed to update tag:", error);
      toast.error("Failed to update tag");
    }
  };

  const handleDeleteTag = (tag: Tag) => {
    setTagToDelete(tag);
  };

  const confirmDelete = async () => {
    if (!tagToDelete) return;

    try {
      // In a real app, we would use tagApi.deleteTag()
      setTags(tags.filter((t) => t.id !== tagToDelete.id));
      setTagToDelete(null);
      toast.success("Tag deleted successfully");
    } catch (error) {
      console.error("Failed to delete tag:", error);
      toast.error("Failed to delete tag");
    }
  };

  const resetForm = () => {
    setNewTagName("");
    setNewTagColor("#33A8FF");
    setNewTagDescription("");
    setTagToEdit(null);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold">Tags</h1>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Tag
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoaderIcon className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : tags.length === 0 ? (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
              <TagIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No tags created</h3>
            <p className="text-muted-foreground mb-4">
              Tags help you organize your documents and filter context
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Tag
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="border rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: tag.color }}
                  ></div>
                  <div>
                    <h3 className="font-medium">{tag.name}</h3>
                    {tag.description && (
                      <p className="text-sm text-muted-foreground">
                        {tag.description}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditTag(tag)}>
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteTag(tag)}
                        className="text-red-600"
                      >
                        <TrashIcon className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Tag Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Tag</DialogTitle>
            <DialogDescription>
              Create a new tag to organize your documents
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Tag name"
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <ColorSelector value={newTagColor} onChange={setNewTagColor} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={newTagDescription}
                onChange={(e) => setNewTagDescription(e.target.value)}
                placeholder="Brief description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setIsCreateDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateTag}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Tag Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
            <DialogDescription>
              Update the details for this tag
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Tag name"
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <ColorSelector value={newTagColor} onChange={setNewTagColor} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Input
                id="edit-description"
                value={newTagDescription}
                onChange={(e) => setNewTagDescription(e.target.value)}
                placeholder="Brief description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setIsEditDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateTag}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!tagToDelete}
        onOpenChange={() => setTagToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the tag "{tagToDelete?.name}".
              Documents will no longer be associated with this tag.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Tags;

// Helper component for the empty state
const TagIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="M7 7h.01M7 3h5a1.99 1.99 0 011.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z"
    />
  </svg>
);
