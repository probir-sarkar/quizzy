import type { QuizCardDto as QuizCardType } from "@/server/quiz";
import { QuizCard } from "./quiz-card";

export default function QuizListing({ quizzes }: { quizzes: QuizCardType[] }) {
  return (
    <div className="px-4 my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 container mx-auto">
      {quizzes.map((quiz, i) => (
        <QuizCard key={quiz.id} quiz={quiz} index={i} />
      ))}
    </div>
  );
}
