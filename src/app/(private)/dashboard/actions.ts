"use server";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateEmbedding } from "@/lib/gemini";
import { db } from "@/server/db";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function askQuestion(question: string, projectId: string) {
  const stream = createStreamableValue();

  const queryVector = await generateEmbedding(question);
  const vectorQuery = `[${queryVector.join(",")}]`;

  const result = (await db.$queryRaw`
    SELECT "fileName", "sourceCode", "summary",
    1 - ("summaryEmbedding"<=> ${vectorQuery}:: vector) AS similarity
    FROM "SourceCodeEmbedding"
    WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > 0.5
    AND "projectId" = ${projectId}
    ORDER BY similarity DESC
    LIMIT 10
    `) as {
    fileName: string;
    sourceCode: string;
    summary: string;
  }[];

  let context = "";

  for (const doc of result) {
    context += `source: ${doc.fileName}\ncode content: ${doc.sourceCode}\nsummary of file: ${doc.summary}`;
  }

  (async () => {
    const { textStream } = streamText({
      model: google("gemini-2.0-flash"),
      prompt: `
        You are a ai code assistant who answers question s about the codebase. Your target audience is a technical intern who is looking to understand the codebase.

        AI assistant is a brand new, powerful, human-like artificial intelligence. It is a well-behaved and well-mannered individual who is friendly, kind and inspiring, and is eager to provide vivid and thoughtful response to the user.

        AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
        
        If the question is asking about code or a specific file, AI will provide the detailed answer, giving step by step instruction, including code snippets.

        START OF CONTEXT BLOCK
        ${context}
        END OF CONTEXT BLOCK

        START OF QUESTION
        ${question}
        END OF QUESTION
        `,
    });
    for await (const delta of textStream) {
      stream.update(delta);
    }
    stream.done();
  })();
  return {
    output: stream.value,
    fileReferences: result,
  };
}
