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
import MDEditor from "@uiw/react-md-editor";
import { readStreamableValue } from "ai/rsc";
import { SaveIcon } from "lucide-react";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { askQuestion } from "../actions";
import CodeReferences from "./code-references";
import { api } from "@/trpc/react";
import { toast } from "@/hooks/use-toast";

const AskQuestionCard = () => {
  const { project } = useProject();
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [filesReferences, setFilesReferences] = useState<
    { fileName: string; sourceCode: string; summary: string }[]
  >([]);

  const saveAnswer = api.project.saveAnswer.useMutation();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAnswer("");
    setFilesReferences([]);
    if (!project?.id) return;
    setLoading(true);

    const { output, fileReferences } = await askQuestion(question, project.id);
    setOpen(true);
    setFilesReferences(fileReferences);

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
        <DialogContent className="max-h-90vh sm:max-w-[80vw]">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2">
                <Image
                  src="/mireon-logo.png"
                  alt="mireon logo"
                  width={40}
                  height={40}
                />
                <h1 className="font-bold text-primary">Mireon</h1>
              </div>
            </DialogTitle>
          </DialogHeader>

          <MDEditor.Markdown
            source={answer}
            className="max-w-70vw !h-full max-h-[35vh] overflow-scroll rounded-md p-4"
          />

          <CodeReferences filesReferences={filesReferences} />
          <div className="flex justify-between">
            <Button
              type="button"
              onClick={() => {
                setOpen(false);
              }}
            >
              Close
            </Button>
            <Button
              disabled={saveAnswer.isPending}
              variant="default"
              onClick={() => {
                saveAnswer.mutate(
                  {
                    projectId: project!.id,
                    question,
                    answer,
                    filesReferences,
                  },
                  {
                    onSuccess: () => {
                      toast({
                        title: "Success!",
                        description: "Answer has been saved!",
                      });
                    },
                    onError: () => {
                      toast({
                        variant: "destructive",
                        title: "Failure!",
                        description: "Failed to save the answer!",
                      });
                    },
                  },
                );
              }}
            >
              <SaveIcon className="size-4" />
              Save Answer
            </Button>
          </div>
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
            <Button className="mt-4" type="submit" disabled={loading}>
              Ask Mireon
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AskQuestionCard;
