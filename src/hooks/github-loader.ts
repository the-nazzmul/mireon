import { generateEmbedding, summarizeCode } from "@/lib/gemini";
import { db } from "@/server/db";
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { Document } from "@langchain/core/documents";
import { sleep } from "@trpc/server/unstable-core-do-not-import";
import path from "path";

export const loadGithubRepo = async (
  githubUrl: string,
  githubToken?: string,
) => {
  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: githubToken || "",
    branch: "main",
    ignoreFiles: [
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      "bun.lockb",
      ".DS_Store",
    ],
    recursive: true,
    unknown: "warn",
    maxConcurrency: 5,
  });
  const docs: Document[] = await loader.load();
  return docs;
};

export const indexGithubRepo = async (
  projectId: string,
  githubUrl: string,
  githubToken?: string,
) => {
  const docs = await loadGithubRepo(githubUrl, githubToken);
  const allowedExtensions = [
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".py",
    ".java",
    ".c",
    ".cpp",
    ".go",
    ".html",
    ".css",
    ".scss",
    ".sql",
    ".sh",
    ".txt",
    ".md",
    ".json",
  ];

  for (let i = 0; i < docs.length; i++) {
    try {
      console.log(`Processing file ${i + 1} of ${docs.length}`);
      console.log(`File source: ${docs[i]?.metadata.source}`);
      await sleep(1000);
      const doc = docs[i];

      if (!doc || !doc.metadata || !doc.metadata.source) {
        console.warn(
          `Skipping file ${i + 1} due to missing document or metadata.`,
        );
        continue;
      }

      const fileExtension = path.extname(doc.metadata.source).toLowerCase();

      if (!allowedExtensions.includes(fileExtension) && fileExtension !== "") {
        console.log(
          `Skipping file ${doc.metadata.source} due to file extension: ${fileExtension}`,
        );
        continue;
      }

      const summary = await summarizeCode(doc);
      if (!summary) {
        console.warn(
          `Skipping embedding for ${doc.metadata.source} due to summarization error.`,
        );
        continue;
      }

      const embeddingValues = await generateEmbedding(summary);

      const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
        data: {
          summary: summary,
          sourceCode: JSON.parse(JSON.stringify(doc?.pageContent)),
          fileName: doc?.metadata.source,
          projectId,
        },
      });

      await db.$executeRaw`
      UPDATE "SourceCodeEmbedding"
      SET "summaryEmbedding" = ${embeddingValues} :: vector
      WHERE "id" = ${sourceCodeEmbedding.id}
      `;
    } catch (error) {
      console.error(`Error processing file ${i + 1}`, error);
      console.error(
        `Error details for file ${docs[i]?.metadata.source}`,
        error,
      );
    }
  }

  //THE CODES BELOW WORK FASTER BUT HITS THE RATE LIMIT

  // const allEmbeddings = await generateEmbeddings(docs);

  // await Promise.allSettled(
  //   allEmbeddings.map(async (embedding, index) => {
  //     console.log(`Processing ${index} of ${allEmbeddings.length}`);

  //     if (!embedding) return;

  //     const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
  //       data: {
  //         summary: embedding.summary,
  //         sourceCode: embedding.sourceCode,
  //         fileName: embedding.fileName,
  //         projectId,
  //       },
  //     });

  //     //inset the embedding as prisma doesn't do it automatically
  //     await db.$executeRaw`
  //     UPDATE "SourceCodeEmbedding"
  //     SET "summaryEmbedding" = ${embedding.embedding} :: vector
  //     WHERE "id" = ${sourceCodeEmbedding.id}
  //     `;
  //   }),
  // );
  // };

  // const generateEmbeddings = async (docs: Document[]) => {
  //   return await Promise.all(
  //     docs.map(async (doc) => {
  //       const summary = await summarizeCode(doc);
  //       const embedding = await generateEmbedding(summary);
  //       return {
  //         summary,
  //         embedding,
  //         sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
  //         fileName: doc.metadata.source,
  //       };
  //     }),
  //   );
  // }
};
