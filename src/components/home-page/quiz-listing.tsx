import type { QuizCardDto as QuizCardType } from "@/server/quiz";
import { QuizCard } from "./quiz-card";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

export default function QuizListing({ quizzes }: { quizzes: QuizCardType[] }) {
  return (
    <Stagger
      gap={0.04}
      className="grid grid-cols-1 gap-6 pb-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {quizzes.map((quiz, i) => (
        <StaggerItem key={quiz.id} className="h-full">
          <QuizCard quiz={quiz} index={i} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
