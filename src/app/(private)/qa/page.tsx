"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useProject from "@/hooks/use-project";
import { api } from "@/trpc/react";
import AskQuestionCard from "../dashboard/_components/ask-question-card";
import React, { useState } from "react";
import Image from "next/image";
import MDEditor from "@uiw/react-md-editor";
import CodeReferences from "../dashboard/_components/code-references";
import { Card } from "@/components/ui/card";

const QAPage = () => {
  const { selectedProjectId } = useProject();
  const { data: questions } = api.project.getQuestions.useQuery({
    projectId: selectedProjectId,
  });

  const [questionIndex, setQuestionIndex] = useState(0);
  const question = questions?.[questionIndex];

  return (
    <Sheet>
      <AskQuestionCard />
      <h1 className="mt-4 text-xl font-semibold">Saved Questions</h1>
      <div className="mt-2 flex flex-col gap-2">
        {questions?.map((question, index) => {
          return (
            <React.Fragment key={question.id}>
              <SheetTrigger onClick={() => setQuestionIndex(index)}>
                <Card className="flex items-center gap-4 rounded-lg border p-4 shadow">
                  <Image
                    className="rounded-full"
                    height={30}
                    width={40}
                    src={question.user.imageUrl ?? ""}
                    alt="avatar"
                  />
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-2">
                      <p className="line-clamp-1 text-lg font-medium">
                        {question.question}
                      </p>
                      <span className="whitespace-nowrap text-xs">
                        {question.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="line-clamp-1 text-sm text-gray-400">
                      {question.answer}
                    </p>
                  </div>
                </Card>
              </SheetTrigger>
            </React.Fragment>
          );
        })}
      </div>
      {question && (
        <SheetContent className="sm:max-w-[80vw]">
          <SheetHeader>
            <SheetTitle>{question.question}</SheetTitle>
            <div className="flex flex-col">
              <MDEditor.Markdown
                source={question.answer}
                className={`!h-full overflow-scroll rounded-md p-4 ${
                  Array.isArray(question.filesReferences) &&
                  question.filesReferences.length > 0
                    ? "max-h-[40vh]"
                    : "max-h-[90vh]"
                }`}
              />
              <CodeReferences
                filesReferences={question.filesReferences ?? ([] as any)}
              />
            </div>
          </SheetHeader>
        </SheetContent>
      )}
    </Sheet>
  );
};

export default QAPage;
