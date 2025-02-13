import { db } from "@/server/db";
import { Octokit } from "octokit";
import axios from "axios";
import { summarizeCommitByAI } from "./gemini";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

type Response = {
  commitHash: string;
  commitMessage: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: string;
};

export const getCommitHashes = async (
  githubUrl: string,
): Promise<Response[]> => {
  const repoDetails = extractRepoDetails(githubUrl);

  if (!repoDetails) {
    throw new Error("Invalid GitHub repository URL");
  }

  const { owner, repo } = repoDetails;
  const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo,
  });
  const sortedCommits = data.sort(
    (a: any, b: any) =>
      new Date(b.commit.author.date).getTime() -
      new Date(a.commit.author.date).getTime(),
  ) as any[];
  return sortedCommits.slice(0, 10).map((commit: any) => ({
    commitHash: commit?.sha as string,
    commitMessage: commit?.commit?.message ?? "",
    commitAuthorName: commit?.commit?.author?.name ?? "",
    commitAuthorAvatar: commit?.author?.avatar_url ?? "",
    commitDate: commit?.commit?.author?.date ?? "",
  }));
};

export const pullCommits = async (projectId: string) => {
  const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
  const commitHashes = await getCommitHashes(githubUrl);
  const unprocessedCommits = await filterUnprocessedCommits(
    commitHashes,
    projectId,
  );
  const summaryResponses = await Promise.allSettled(
    unprocessedCommits.map((commit) => {
      return summarizeCommit(githubUrl, commit.commitHash);
    }),
  );

  const summaries = summaryResponses.map((response) => {
    if (response.status === "fulfilled") {
      return response.value as string;
    }
    return "";
  });

  const commits = await db.commit.createMany({
    data: summaries.map((summary, index) => {
      return {
        projectId: projectId,
        commitHash: unprocessedCommits[index]!.commitHash,
        commitMessage: unprocessedCommits[index]!.commitMessage,
        comitAuthorName: unprocessedCommits[index]!.commitAuthorName,
        commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
        commitDate: unprocessedCommits[index]!.commitDate,
        summary,
      };
    }),
  });

  return commits;
};

// util type functions

function extractRepoDetails(
  url: string,
): { owner: string; repo: string } | null {
  try {
    const parsedUrl = new URL(url);
    const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);

    if (pathSegments.length >= 2) {
      const owner = pathSegments[0] ?? "";
      const repo = pathSegments[1] ?? "";
      return {
        owner,
        repo,
      };
    }
  } catch (error) {
    console.error("Invalid URL:", error);
  }

  return null;
}

async function fetchProjectGithubUrl(projectId: string) {
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: {
      githubUrl: true,
    },
  });
  if (!project?.githubUrl) {
    throw new Error("Project has no github url");
  }
  return { project, githubUrl: project?.githubUrl };
}

async function filterUnprocessedCommits(
  commitHashes: Response[],
  projectId: string,
) {
  const processedCommits = await db.commit.findMany({
    where: { projectId },
  });
  const unprocessedCommits = commitHashes.filter(
    (commit) =>
      !processedCommits.some(
        (processedCommit) => processedCommit.commitHash === commit.commitHash,
      ),
  );

  return unprocessedCommits;
}

async function summarizeCommit(githubUrl: string, commitHash: string) {
  //get the diff, then pass the diff into ai

  const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
    headers: {
      Accept: "application/vnd.github.v3.diff",
    },
  });
  return (await summarizeCommitByAI(data)) || "";
}
