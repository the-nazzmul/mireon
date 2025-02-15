"use client";

import useProject from "@/hooks/use-project";
import { ExternalLinkIcon, GithubIcon } from "lucide-react";
import Link from "next/link";
import CommitLogs from "./_components/commit-logs";
import AskQuestionCard from "./_components/ask-question-card";

const DashboardPage = () => {
  const { project } = useProject();
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-y-4">
        {/* repository link */}
        <div className="flex w-fit items-center rounded-md bg-primary px-4 py-4">
          <GithubIcon className="size-5 text-white" />
          <div className="ml-2">
            <p className="text-sm font-medium text-white/80">
              This project is linked to:{" "}
              <Link
                href={project?.githubUrl ?? ""}
                className="inline-flex items-center text-white hover:underline"
              >
                {project?.githubUrl}
                <ExternalLinkIcon className="ml-1 size-4" />
              </Link>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* TODO: implement components here */}
          Team members Invite button ArchiveBtn
        </div>
      </div>
      <div className="mt-4">
        <div className="grid gap-4 sm:grid-cols-5">
          {/* TODO: Implement comp0nents here */}
          <AskQuestionCard />
          MeetingCard
        </div>
      </div>
      <div className="mt-8">
        <CommitLogs />
      </div>
    </div>
  );
};

export default DashboardPage;
