"use client";
import useProject from "@/hooks/use-project";
import { api } from "@/trpc/react";
import MeetingCard from "../dashboard/_components/meeting-card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const MeetingPage = () => {
  const { selectedProjectId } = useProject();
  const { data: meetings, isLoading } = api.project.getMeeting.useQuery(
    {
      projectId: selectedProjectId!,
    },
    { refetchInterval: 400 },
  );
  return (
    <div>
      <MeetingCard />
      <h1 className="mt-6 text-xl font-semibold">Meetings</h1>
      {meetings && meetings.length === 0 && <div>No meetings found</div>}
      {isLoading && <div>Loading...</div>}
      <ul className="divide-y divide-gray-200">
        {meetings?.map((meeting) => (
          <li
            key={meeting.id}
            className="flex items-center justify-between gap-x-6 py-5"
          >
            <Card className="flex w-full items-center justify-between p-4">
              <div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/meetings/${meeting.id}`}
                      className="text-sm font-semibold"
                    >
                      {meeting.name}
                    </Link>
                    {meeting.status === "PROCESSING" && (
                      <Badge variant="secondary">Processing...</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-x-2 text-xs text-gray-500">
                  <p className="whitespace-nowrap">
                    {meeting.createdAt.toLocaleDateString()}
                  </p>
                  <p className="truncate">{meeting.issues.length} issues</p>
                </div>
              </div>
              <div className="flex flex-none items-center gap-x-4">
                <Link href={`/meetings/${meeting.id}`}>
                  <Button size="sm">View</Button>
                </Link>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MeetingPage;
