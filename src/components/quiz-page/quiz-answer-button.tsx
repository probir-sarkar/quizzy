import { Circle, CheckCircle2, XCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const styles = {
  button:
    "w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border shadow-sm text-sm sm:text-base transition-all",
  default:
    "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:shadow-md hover:bg-gray-50 dark:hover:bg-white/5",
  correct: "bg-green-50 dark:bg-green-900/30 border-green-500 text-green-900 dark:text-green-100",
  wrong: "bg-red-50 dark:bg-red-900/30 border-red-500 text-red-900 dark:text-red-100",
  reveal: "bg-green-50/70 dark:bg-green-900/20 border-green-400 text-green-900/90 dark:text-green-200",
  faded: "bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 opacity-60"
};

const answerVariants = {
  default: styles.default,
  correct: styles.correct,
  wrong: styles.wrong,
  reveal: styles.reveal,
  faded: styles.faded,
} as const;

type AnswerVariant = keyof typeof answerVariants;

function getAnswerVariant(isPicked: boolean, isCorrect: boolean, answered: boolean): AnswerVariant {
  if (!answered) return "default";
  if (isPicked && isCorrect) return "correct";
  if (isPicked && !isCorrect) return "wrong";
  if (isCorrect) return "reveal";
  return "faded";
}

export function AnswerIcon({ isPicked, isCorrect, answered }: { isPicked: boolean; isCorrect: boolean; answered: boolean }) {
  if (!answered)
    return <Circle className={cn("h-4 w-4 shrink-0 transition-all", isPicked && "fill-gray-900 dark:fill-gray-100")} />;
  if (isPicked)
    return isCorrect ? (
      <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600 dark:text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-500" />
    );
  if (isCorrect) return <Check className="h-4 w-4 shrink-0 text-green-500" />;
  return <Circle className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-600" />;
}

export function AnswerButton({
  text,
  isPicked,
  isCorrect,
  answered,
  disabled,
  onClick
}: {
  text: string;
  isPicked: boolean;
  isCorrect: boolean;
  answered: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const variant = getAnswerVariant(isPicked, isCorrect, answered);

  return (
    <button
      type="button"
      className={cn(
        styles.button,
        answerVariants[variant],
        !answered &&
        !disabled &&
        "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 dark:focus-visible:ring-white/20",
        !answered && disabled && "cursor-not-allowed"
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="flex items-center gap-3">
        <AnswerIcon isPicked={isPicked} isCorrect={isCorrect} answered={answered} />
        <span className="wrap-break-word">
          {text}
        </span>
      </span>
    </button>
  );
}
