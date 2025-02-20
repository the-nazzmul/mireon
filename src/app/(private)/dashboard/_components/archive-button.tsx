"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useProject from "@/hooks/use-project";
import useRefetch from "@/hooks/use-refetch";
import { toast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
import { useUser } from "@clerk/nextjs";
import React from "react";

const ArchiveBtn = () => {
  const archiveProject = api.project.archiveProject.useMutation();
  const { user } = useUser();
  const { selectedProjectId, project } = useProject();
  const refetch = useRefetch();

  if (!user) return null;
  if (!project) return null;

  const handleArchive = () => {
    archiveProject.mutate(
      {
        projectId: selectedProjectId,
      },
      {
        onSuccess: () => {
          toast({
            title: "Project archived!",
            description: "Project has been archived",
          });
          refetch();
        },
        onError: (error) => {
          toast({
            title: "Error!",
            description: error.message,
            variant: "destructive",
          });
        },
      },
    );
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild hidden={user.id !== project.id}>
        <Button variant="destructive" disabled={archiveProject.isPending}>
          Archive
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to archive this project?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleArchive} className="bg-red-600">
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ArchiveBtn;
