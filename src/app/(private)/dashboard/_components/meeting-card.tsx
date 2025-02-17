"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { uploadFile } from "@/lib/firebase";
import { set } from "date-fns";
import { Presentation, UploadCloud } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

const MeetingCard = () => {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "audio/*": [".mp3", ".wav", ".m4a"],
    },
    multiple: false,
    maxSize: 50_000_000,
    onDrop: async (acceptedFiles) => {
      setIsUploading(true);
      console.log(acceptedFiles);
      const file = acceptedFiles[0];
      const downloadUrl = await uploadFile(file as File, setProgress);
      setIsUploading(false);
    },
  });
  return (
    <Card
      className="col-span-2 flex flex-col items-center justify-center p-10"
      {...getRootProps()}
    >
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
            <Button disabled={isUploading}>
              <UploadCloud
                className="-ml-0.5 mr-1.5 size-5"
                area-hidden="true"
              />
              Upload Meeting
              <input className="hidden" {...getInputProps()} />
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};

export default MeetingCard;
