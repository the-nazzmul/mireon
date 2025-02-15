"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  filesReferences: { fileName: string; sourceCode: string; summary: string }[];
};

const CodeReferences = ({ filesReferences }: Props) => {
  const [tab, setTab] = useState(filesReferences[0]?.fileName);
  if (filesReferences.length === 0) return null;
  return (
    <div className="mt-4 max-w-[70vw]">
      <Tabs value={tab} onValueChange={setTab}>
        <div className="flex gap-2 overflow-scroll rounded-md p-1">
          {filesReferences.map((file) => (
            <button
              key={file.fileName}
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted",
                {
                  "border border-primary text-primary-foreground":
                    tab === file.fileName,
                },
              )}
              onClick={() => setTab(file.fileName)}
            >
              {file.fileName}
            </button>
          ))}
        </div>
        {filesReferences.map((file) => (
          <TabsContent
            key={file.fileName}
            value={file.fileName}
            className="max-h-[35vh] max-w-7xl overflow-scroll rounded-md"
          >
            <SyntaxHighlighter language="typescript" style={atomDark}>
              {file.sourceCode}
            </SyntaxHighlighter>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CodeReferences;
