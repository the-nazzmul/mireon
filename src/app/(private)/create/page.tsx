"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useRefetch from "@/hooks/use-refetch";
import { toast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
import { useForm } from "react-hook-form";

type FormInput = {
  projectName: string;
  repoUrl: string;
  githubToken: string;
};

const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const createProject = api.project.createProject.useMutation();
  const refetch = useRefetch();

  const onSubmit = (data: FormInput) => {
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

    console.log(data);
  };

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
          <Button type="submit" disabled={createProject.isPending}>
            Create Project
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreatePage;
