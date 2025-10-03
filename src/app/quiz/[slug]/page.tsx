import QuizQuestions from "@/components/quiz-page/question-list";
import QuizPageHero from "@/components/quiz-page/quiz-page.hero";
import { getQuiz } from "@/queries/home-page";
import { notFound } from "next/navigation";

const QuizPage = async ({ params }: { params: { slug: string } }) => {
  const quiz = await getQuiz(params.slug);
  if (!quiz) return notFound();

  return (
    <section>
      <QuizPageHero quiz={quiz} />

      {/* Section title */}
   

      <QuizQuestions questions={quiz.questions} />
    </section>
  );
};

export default QuizPage;
