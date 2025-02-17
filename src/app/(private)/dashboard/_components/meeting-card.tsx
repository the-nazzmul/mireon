"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { UploadButton } from "@/lib/uploadthing";
import { Presentation } from "lucide-react";
import { useState } from "react";

const MeetingCard = () => {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <Card className="col-span-2 flex flex-col items-center justify-center p-10">
      {!isUploading && (
        <>
          <Presentation className="size-10 animate-bounce" />
          <h3 className="mt-2 text-sm font-semibold">Create a new meeting</h3>
          <p className="mt-1 text-center text-sm text-gray-500">
            Analyse your meeting with Mireon
            <br />
            Powered by AI
          </p>
          <div className="mt-6">
            <UploadButton
              endpoint="meetingAudio"
              onClientUploadComplete={(res) => {
                setIsUploading(false);
                console.log("FILE:", res[0]?.serverData.fileUrl);
              }}
              onUploadError={(error: Error) => {
                toast({
                  title: "Error",
                  description: error.message,
                  variant: "destructive",
                });
              }}
              onUploadProgress={(progress) => {
                setIsUploading(true);
                setProgress(progress);
              }}
              appearance={{
                button:
                  "ut-readying:bg-primary bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 ",
              }}
            />
          </div>
        </>
      )}
      {isUploading && (
        <div className="flex flex-col items-center justify-center">
          <Presentation className="size-10 animate-bounce" />
          <h3 className="mt-2 text-sm font-semibold">
            Uploading your meeting...
          </h3>

          <Progress
            value={progress}
            className="my-12 w-full"
            style={{ height: 30 }}
          />
        </div>
      )}
    </Card>
  );
};

export default MeetingCard;
