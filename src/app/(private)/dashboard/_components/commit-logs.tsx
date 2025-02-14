"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useProject from "@/hooks/use-project";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

const CommitLogs = () => {
  const { selectedProjectId, project } = useProject();
  const { data: commits } = api.project.getCommit.useQuery({
    projectId: selectedProjectId,
  });
  return (
    <>
      <ul className="space-y-6">
        {commits?.map((commit, index) => {
          return (
            <li key={commit.id} className="relative flex gap-x-4">
              <div
                className={cn(
                  index === commits.length - 1 ? "h-6" : "-bottom-6",
                  "absolute left-0 top-0 flex w-6 justify-center",
                )}
              >
                <div className="w-px translate-x-1 bg-gray-200" />
              </div>
              <>
                <img
                  src={commit.commitAuthorAvatar}
                  alt="author image"
                  className="relative mt-3 size-8 flex-none rounded-full bg-gray-50"
                />
                <Card className="w-full">
                  <div className="flex-auto rounded-md ring-1 ring-inset ring-gray-200">
                    <CardHeader>
                      <div className="flex justify-between gap-x-4">
                        <Link
                          target="_black"
                          href={`${project?.githubUrl}/commits/${commit.commitHash}`}
                          className="text-xs leading-5"
                        >
                          <span className="font-bold">
                            {commit.comitAuthorName}{" "}
                          </span>
                          <span className="inline-flex items-center">
                            commited
                            <ExternalLinkIcon className="ml-1 size-4" />
                          </span>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <span className="font-semibold">
                        {commit.commitMessage}
                      </span>
                      <pre className="mt-2 whitespace-pre-wrap text-sm leading-6">
                        {commit.summary}
                      </pre>
                    </CardContent>
                  </div>
                </Card>
              </>
            </li>
          );
        })}
      </ul>
    </>
  );
};
export default CommitLogs;
