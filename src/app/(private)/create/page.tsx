"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useRefetch from "@/hooks/use-refetch";
import { toast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
import { InfoIcon } from "lucide-react";
import { useForm } from "react-hook-form";

type FormInput = {
  projectName: string;
  repoUrl: string;
  githubToken: string;
};

const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const checkCredits = api.project.checkCredits.useMutation();
  const createProject = api.project.createProject.useMutation();
  const refetch = useRefetch();

  const onSubmit = (data: FormInput) => {
    if (!!checkCredits.data) {
      createProject.mutate(
        {
          name: data.projectName,
          githubUrl: data.repoUrl,
          githubToken: data.githubToken,
        },
        {
          onSuccess: () => {
            toast({
              title: "Success!",
              description: "Project Created Successfully",
            });
            refetch();
            reset();
          },
          onError: () => {
            toast({
              variant: "destructive",
              title: "Failure!",
              description: "Failed to create project",
            });
          },
        },
      );
    } else {
      checkCredits.mutate({
        githubUrl: data.repoUrl,
        githubToken: data.githubToken,
      });
    }
  };

  const hasEnoughCredits = checkCredits?.data?.userCredits
    ? checkCredits.data.fileCount <= checkCredits.data.userCredits
    : true;

  return (
    <div className="flex h-full items-center justify-center gap-12">
      <img src="/coding.svg" alt="image" className="h-56 w-auto" />
      <div>
        <div>
          <h1 className="text-2xl font-semibold">
            Link your GitHub Repository
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter the URL of your repository to link it to Mireon
          </p>
        </div>
        <div className="h-4" />

        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-2">
          <Input
            {...register("projectName", { required: true })}
            placeholder="Project Name"
            required
          />
          <Input
            {...register("repoUrl", { required: true })}
            placeholder="Github URL"
            type="url"
            required
          />
          <Input
            {...register("githubToken")}
            placeholder="Github Token"
            required
          />
          {!!checkCredits.data && (
            <>
              <Card className="rounded-md border px-4 py-2 text-orange-500">
                <div className="flex items-center gap-2">
                  <InfoIcon className="size-4" />
                  <p className="text-sm">
                    You will be charged{" "}
                    <strong>{checkCredits?.data.fileCount}</strong> credits to
                    index this repository.
                  </p>
                </div>
                <p className="text-sm">
                  You have <strong>{checkCredits?.data.userCredits}</strong>{" "}
                  credits remaining.
                </p>
              </Card>
            </>
          )}
          <Button
            type="submit"
            disabled={
              createProject.isPending ||
              !!checkCredits.isPending ||
              !hasEnoughCredits
            }
          >
            {!!checkCredits.data ? "Create Project" : "Check Credits"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreatePage;
