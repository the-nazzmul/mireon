import { api } from "@/trpc/react";
import { useLocalStorage } from "usehooks-ts";

const useProject = () => {
  const [selectedProjectId, setSelectedProjectId] = useLocalStorage(
    "mireon-projectId",
    "",
  );
  const { data: projects } = api.project.getAllProjects.useQuery();

  const project = projects?.find((p) => p.id === selectedProjectId);

  return { projects, project, selectedProjectId, setSelectedProjectId };
};

export default useProject;
