"use client";

import { api } from "@/trpc/react";
import { VideoIcon } from "lucide-react";
import IssueCard from "./issue-card";

type Props = {
  meetingId: string;
};

const IssuesList = ({ meetingId }: Props) => {
  const { data: meeting, isLoading } = api.project.getMeetingById.useQuery(
    {
      meetingId,
    },
    { refetchInterval: 4000 },
  );

  if (isLoading || !meeting) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-x-8 border-b pb-6 lg:mx-0 lg:max-w-none">
        <div className="flex items-center gap-x-6">
          <div className="rounded-full border p-3">
            <VideoIcon className="size-6" />
          </div>
          <div>
            <div className="text-sm leading-6">
              Meeting on {meeting.createdAt.toLocaleDateString()}
            </div>
            <div className="mt-1 text-base font-semibold leading-6">
              {meeting.name}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {meeting.issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
};

export default IssuesList;
