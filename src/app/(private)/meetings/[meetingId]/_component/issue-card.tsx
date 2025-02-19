"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RouterOutputs } from "@/trpc/react";
import { useState } from "react";

const IssueCard = ({
  issue,
}: {
  issue: NonNullable<
    RouterOutputs["project"]["getMeetingById"]
  >["issues"][number];
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{issue.gist}</DialogTitle>
            <DialogDescription>
              {issue.createdAt.toLocaleDateString()}
            </DialogDescription>
            <p className="text-gray-500">{issue.headline}</p>
            <blockquote className="mt-2 border-l-4 border-gray-300 p-4">
              <span className="text-sm text-gray-600">
                {issue.start} - {issue.end}
              </span>
              <p className="font-medium italic leading-relaxed">
                {issue.summary}
              </p>
            </blockquote>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Card className="relative">
        <CardHeader>
          <CardTitle className="text-xl">{issue.gist}</CardTitle>
          <div className="border-b" />
          <CardDescription>{issue.headline}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => {
              setOpen(true);
            }}
          >
            Details
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default IssueCard;
