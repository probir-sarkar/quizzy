import prisma from "@/lib/prisma";

export async function getHomePageData() {
  return prisma.category.findMany({
    orderBy: {
      name: "asc"
    },
    select: {
      _count: true,
      name: true,
      slug: true,
      quizzes: {
        take: 15,
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });
}

export type HomePageData = Awaited<ReturnType<typeof getHomePageData>>;
