import prisma from "@/lib/prisma";
import { cacheLife } from "next/cache";

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: {
      name: "asc"
    }
  });
}
export async function getHomePageData() {
  return prisma.category.findMany({
    where: {
      quizzes: {
        some: {}
      }
    },
    take: 12,
    orderBy: {
      name: "asc"
    },
    include: {
      quizzes: {
        take: 4,
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

export async function getQuiz(slug: string) {
  return prisma.quiz.findUnique({
    where: { slug },
    include: {
      category: true,
      questions: true,
      tags: {
        include: {
          tag: true
        }
      },
      _count: {
        select: {
          questions: true
        }
      }
    }
  });
}

// quiz page type without null
export type QuizPageType = NonNullable<Awaited<ReturnType<typeof getQuiz>>>;

// question type helper
export type QuestionType = QuizPageType["questions"][number];

export async function getMoreQuizzes(currentSlug: string) {
  return prisma.quiz.findMany({
    where: { slug: { not: currentSlug } },
    take: 6,
    orderBy: { publishedAt: "desc" },
    include: {
      category: true,
      _count: {
        select: {
          questions: true
        }
      }
    }
  });
}
