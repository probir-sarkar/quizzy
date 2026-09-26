import { Circle, CheckCircle2, XCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const styles = {
  button: "w-full text-left px-3.5 sm:px-4 py-3 border-2 border-foreground font-sans text-sm sm:text-base font-bold transition-all duration-150",
  default: "bg-background text-foreground hover:bg-foreground hover:text-background",
  correct: "bg-lime-300 text-neutral-950 border-foreground",
  wrong: "bg-rose-300 text-neutral-950 border-foreground",
  reveal: "bg-lime-300/40 text-foreground border-dashed border-foreground",
  faded: "bg-background text-muted-foreground border-foreground/30 opacity-60"
} as const;

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
    return (
      <Circle
        className={cn("h-4 w-4 shrink-0 transition-all", isPicked && "fill-current")}
      />
    );
  if (isPicked)
    return isCorrect ? (
      <CheckCircle2 className="h-4 w-4 shrink-0" />
    ) : (
      <XCircle className="h-4 w-4 shrink-0" />
    );
  if (isCorrect) return <Check className="h-4 w-4 shrink-0" />;
  return <Circle className="h-4 w-4 shrink-0 opacity-40" />;
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
        !answered && !disabled && "cursor-pointer",
        !answered && disabled && "cursor-not-allowed"
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="flex items-center gap-3">
        <AnswerIcon isPicked={isPicked} isCorrect={isCorrect} answered={answered} />
        <span className="wrap-break-word">{text}</span>
      </span>
    </button>
  );
}
