import prisma from "@/lib/prisma";

export async function getHomePageData() {
  return prisma.category.findMany({
    where: {
      quizzes: {
        some: {}
      }
    },
    orderBy: {
      name: "asc"
    },
    include: {
      quizzes: {
        take: 15,
        orderBy: {
          createdAt: "desc"
        },
        include: {
          category: true,
          _count: {
            select: {
              questions: true
            }
          }
        }
      }
    }
  });
}

export type HomePageData = Awaited<ReturnType<typeof getHomePageData>>;
export type QuizCard = HomePageData[number]["quizzes"][number];
