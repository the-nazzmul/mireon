import { generateEmbedding, summarizeCode } from "@/lib/gemini";
import { db } from "@/server/db";
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { Document } from "@langchain/core/documents";
import { sleep } from "@trpc/server/unstable-core-do-not-import";

const isBinaryFile = (fileName: string): boolean => {
  const binaryExtensions = [
    "png",
    "jpg",
    "jpeg",
    "gif",
    "bmp",
    "ico",
    "webp",
    "svg",
    "pdf",
    "zip",
    "rar",
    "7z",
    "tar",
    "gz",
    "mp3",
    "wav",
    "flac",
    "mp4",
    "mkv",
    "avi",
    "exe",
    "bin",
    "dll",
  ];
  return binaryExtensions.some((ext) => fileName.endsWith(`.${ext}`));
};

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

  const dirtyDocs = await loader.load();
  const docs = dirtyDocs.filter((doc) => {
    const fileName = doc.metadata.source || "";
    return !fileName.includes(".DS_Store") && !isBinaryFile(fileName);
  });
  return docs;
};

export const indexGithubRepo = async (
  projectId: string,
  githubUrl: string,
  githubToken?: string,
) => {
  const docs = await loadGithubRepo(githubUrl, githubToken);
  for (let i = 0; i < docs.length; i++) {
    try {
      console.log(`Processing file ${i + 1} of ${docs.length}`);
      await sleep(1000);
      const doc = docs[i];
      const summary = await summarizeCode(doc!);
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
    }
  }
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
};

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
// };
