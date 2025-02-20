"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useProject from "@/hooks/use-project";
import { toast } from "@/hooks/use-toast";
import { CopyPlusIcon } from "lucide-react";

import { useState } from "react";

const InviteButton = () => {
  const { selectedProjectId } = useProject();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite team members</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            Ask them to copy and paste this link
          </p>
          <div className="my-4 flex items-center gap-2">
            <Input
              readOnly
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/join/${selectedProjectId}`,
                );
                toast({
                  title: "Copied to clipboard",
                });
              }}
              value={`${window.location.origin}/join/${selectedProjectId}`}
            />
            <CopyPlusIcon
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/join/${selectedProjectId}`,
                );
                toast({
                  title: "Copied to clipboard",
                });
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
      <Button size="sm" onClick={() => setOpen(true)}>
        Invite Members
      </Button>
    </>
  );
};

export default InviteButton;
