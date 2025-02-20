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
import { api } from "@/trpc/react";
import { useUser } from "@clerk/nextjs";
import React from "react";

const ArchiveBtn = () => {
  const archiveProject = api.project.archiveProject.useMutation();
  const { user } = useUser();
  const { selectedProjectId, project } = useProject();

  if (!user) return null;
  if (!project) return null;

  const handleArchive = () => {
    archiveProject.mutate({
      projectId: selectedProjectId,
    });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild hidden={user.id !== project.id}>
        <Button>Archive</Button>
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
          <AlertDialogAction onClick={handleArchive}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ArchiveBtn;
