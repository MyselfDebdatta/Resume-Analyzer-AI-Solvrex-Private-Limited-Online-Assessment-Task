import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { auth } from "./auth";
import { prisma } from "./db";

export const saveAnalysisFn = createServerFn({ method: "POST" })
  .validator((data: { role: string; matchPercentage: number; scorecard: any }) => data)
  .handler(async ({ data }) => {
    const request = getRequest();
    const sessionData = await auth.api.getSession({ headers: request.headers });

    if (!sessionData?.user) {
      throw new Error("Unauthorized");
    }

    const analysis = await prisma.analysis.create({
      data: {
        userId: sessionData.user.id,
        role: data.role,
        matchPercentage: data.matchPercentage,
        scorecard: data.scorecard,
      },
    });

    return { success: true, analysisId: analysis.id };
  });

export const getUserStatsFn = createServerFn({ method: "GET" })
  .handler(async () => {
    const request = getRequest();
    const sessionData = await auth.api.getSession({ headers: request.headers });

    if (!sessionData?.user) {
      return { count: 0, avgScore: 0 };
    }

    const analyses = await prisma.analysis.findMany({
      where: { userId: sessionData.user.id },
      select: { matchPercentage: true },
    });

    const count = analyses.length;
    const avgScore = count > 0
      ? Math.round(analyses.reduce((acc: number, curr: any) => acc + curr.matchPercentage, 0) / count)
      : 0;

    return { count, avgScore };
  });

export const getHistoryFn = createServerFn({ method: "GET" })
  .handler(async () => {
    const request = getRequest();
    const sessionData = await auth.api.getSession({ headers: request.headers });

    if (!sessionData?.user) {
      return [];
    }

    const analyses = await prisma.analysis.findMany({
      where: { userId: sessionData.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        role: true,
        matchPercentage: true,
        createdAt: true,
      },
    });

    return analyses;
  });

export const getAnalysisByIdFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const request = getRequest();
    const sessionData = await auth.api.getSession({ headers: request.headers });

    if (!sessionData?.user) {
      throw new Error("Unauthorized");
    }

    const analysis = await prisma.analysis.findUnique({
      where: { id },
      select: { role: true, scorecard: true }
    });

    if (!analysis) throw new Error("Not found");
    return analysis;
  });

export const deleteAnalysisFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const request = getRequest();
    const sessionData = await auth.api.getSession({ headers: request.headers });

    if (!sessionData?.user) {
      throw new Error("Unauthorized");
    }

    await prisma.analysis.deleteMany({
      where: { 
        id: id,
        userId: sessionData.user.id 
      },
    });

    return { success: true };
  });

export const clearHistoryFn = createServerFn({ method: "POST" })
  .handler(async () => {
    const request = getRequest();
    const sessionData = await auth.api.getSession({ headers: request.headers });

    if (!sessionData?.user) {
      throw new Error("Unauthorized");
    }

    await prisma.analysis.deleteMany({
      where: { userId: sessionData.user.id },
    });

    return { success: true };
  });
