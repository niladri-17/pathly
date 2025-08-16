import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Edit, Share, MoreHorizontal, Trash } from "lucide-react";
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
import { Link } from "react-router-dom";

interface Service {
  _id: string;
  title: string;
  duration: number;
  amount: number;
  isPublic?: boolean;
}

interface ServiceCardProps {
  service: Service;
  handleDelete: (serviceId: string) => Promise<void>;
  isDeleting: boolean;
}

const formatDuration = (minutes: number): string => {
  if (minutes >= 1440) {
    const days = Math.floor(minutes / 1440);
    return `${days} day${days > 1 ? "s" : ""}`;
  }
  return `${minutes} mins`;
};

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  isDeleting,
  handleDelete,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <Card className="relative w-full max-w-sm border border-border rounded-lg">
      <CardContent className="space-y-10">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-card-foreground">
              {service.title}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
              <span>{formatDuration(service.duration)}</span>
              <span className="text-gray-500 dark:text-gray-400">|</span>
              <span>₹ {service.amount}</span>
            </div>
          </div>

          {/* Public/Private Badge */}
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Eye className="h-3 w-3" />
            <span>{service.isPublic ? "Public" : "Private"}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Edit Button */}
          <Link to={`edit/${service._id}`}>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs border-border"
            >
              Edit
            </Button>
          </Link>

          {/* Share Button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <Share className="h-4 w-4" />
          </Button>

          {/* More Options Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="bottom" className="w-40">
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit Service
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share className="h-4 w-4 mr-2" />
                Share Link
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                disabled={isDeleting}
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Service
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
      {isDeleting && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent backdrop-blur-[3px] rounded-lg z-10">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            Deleting...
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              service "{service.title}" and remove it from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(service._id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Service
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default ServiceCard;
