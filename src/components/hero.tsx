import Image from "next/image";

import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import DotPatternBackground from "./dot-background";

const Hero = async () => {
  const { userId } = await auth();
  return (
    <section className="">
      <div className="relative mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:items-center">
        <div className="mx-auto max-w-xl text-center">
          <div className="flex flex-col items-center gap-5">
            <Image src="/mireon-logo.png" alt="logo" height={200} width={200} />
            <h1 className="text-5xl font-extrabold uppercase text-primary sm:text-5xl">
              Mireon
            </h1>

            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Your AI Powered GitHub assistant.
            </h2>
            <p className="mt-4 text-muted-foreground sm:text-xl/relaxed">
              Mireon simplifies the experience of collaborating in a project for
              developers. It can help with learning about the GitHub repository,
              analyze changes made with each commits, and can summarize missed
              meetings. With a simple and user friendly approach of course..
            </p>
            <Button className="mt-4" size="lg">
              <Link href="/dashboard">
                {userId ? "Dashboard" : "Get Started"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <DotPatternBackground />
    </section>
  );
};

export default Hero;
