"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useProject from "@/hooks/use-project";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { askQuestion } from "../actions";
import { readStreamableValue } from "ai/rsc";

const AskQuestionCard = () => {
  const { project } = useProject();
  const [question, setQuestion] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileReferences, setFileReferences] = useState<
    { fileName: string; sourceCode: string; summary: string }[]
  >([]);
  const [answer, setAnswer] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!project?.id) return;
    setLoading(true);
    setOpen(true);

    const { output, fileReferences } = await askQuestion(question, project.id);
    setFileReferences(fileReferences);

    for await (const delta of readStreamableValue(output)) {
      if (delta) {
        setAnswer((ans) => ans + delta);
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <Image
                src="/mireon-logo.png"
                alt="mireon logo"
                width={40}
                height={40}
              />
            </DialogTitle>
          </DialogHeader>
          {answer}
          <h1>File Reference</h1>
          {fileReferences.map((file) => {
            return <span key={file.fileName}>{file.fileName}</span>;
          })}
        </DialogContent>
      </Dialog>

      {/* Prompt card */}
      <Card className="relative col-span-3">
        <CardHeader>
          <CardTitle>Ask a question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <Textarea
              placeholder="Ask any question about this repository"
              onChange={(e) => setQuestion(e.target.value)}
            />
            <Button className="mt-4" type="submit">
              Ask Mireon
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AskQuestionCard;
