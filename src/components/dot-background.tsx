"use client";

import { cn } from "@/lib/utils";
import { DotPattern } from "./magicui/dot-pattern";

const DotPatternBackground = () => {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 flex flex-col items-center justify-center overflow-hidden">
      <DotPattern
        glow={true}
        className={cn(
          "[mask-image:radial-gradient(450px_circle_at_center,white,transparent)]",
        )}
      />
    </div>
  );
};
export default DotPatternBackground;
