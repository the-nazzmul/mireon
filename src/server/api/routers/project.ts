import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { pullCommits } from "@/lib/github";
import { indexGithubRepo } from "@/hooks/github-loader";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        githubUrl: z.string(),
        githubToken: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.create({
        data: {
          name: input.name,
          githubUrl: input.githubUrl,
          ownerId: ctx.user.userId!,
          userToProject: {
            create: {
              userId: ctx.user.userId!,
            },
          },
        },
      });
      await pullCommits(project.id);
      await indexGithubRepo(project.id, input.githubUrl, input.githubToken);
      return project;
    }),
  getAllProjects: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.project.findMany({
      where: {
        userToProject: {
          some: {
            userId: ctx.user.userId!,
          },
        },
        deletedAt: null,
      },
    });
  }),
  getCommit: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.project.findUnique({
        where: {
          id: input.projectId,
        },
        select: {
          githubUrl: true,
        },
      });

      if (project?.githubUrl) {
        pullCommits(input.projectId).then().catch(console.error);
      }

      return await ctx.db.commit.findMany({
        where: { projectId: input.projectId },
      });
    }),
  saveAnswer: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        question: z.string(),
        answer: z.string(),
        filesReferences: z.any(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.question.create({
        data: {
          answer: input.answer,
          filesReferences: input.filesReferences,
          question: input.question,
          projectId: input.projectId,
          userId: ctx.user.userId!,
        },
      });
    }),
  getQuestions: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.question.findMany({
        where: {
          projectId: input.projectId,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
  uploadMeeting: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        meetingUrl: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const meeting = await ctx.db.meeting.create({
        data: {
          name: input.name,
          meetingUrl: input.meetingUrl,
          projectId: input.projectId,
          status: "PROCESSING",
        },
      });
      return meeting;
    }),
  getMeeting: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.meeting.findMany({
        where: {
          projectId: input.projectId,
        },
        include: { issues: true },
      });
    }),
  deleteMeeting: protectedProcedure
    .input(
      z.object({
        meetingId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.meeting.delete({
        where: {
          id: input.meetingId,
        },
      });
    }),
  getMeetingById: protectedProcedure
    .input(
      z.object({
        meetingId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.meeting.findUnique({
        where: {
          id: input.meetingId,
        },
        include: {
          issues: true,
        },
      });
    }),
  archiveProject: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.findUnique({
        where: {
          id: input.projectId,
        },
      });

      if (ctx.user.userId !== project?.ownerId) {
        throw new Error("You are not the owner of this project");
      }

      return await ctx.db.project.update({
        where: {
          id: input.projectId,
        },
        data: {
          deletedAt: new Date(),
        },
      });
    }),
});
