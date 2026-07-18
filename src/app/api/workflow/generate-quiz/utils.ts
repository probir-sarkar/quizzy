import prisma from "@/lib/prisma";

type Difficulty = "easy" | "medium" | "hard";

export function randomDifficulty(): Difficulty {
  const values: Difficulty[] = ["easy", "medium", "hard"];
  return values[Math.floor(Math.random() * values.length)];
}

export function randomCount(): number {
  return 5 + Math.floor(Math.random() * 11); // random int 5–15
}

export async function pickRandomSubCategory(): Promise<{
  category: { id: number; name: string };
  subCategory: { id: number; name: string };
}> {
  const total = await prisma.category.count({
    where: { subCategories: { some: {} } }
  });

  if (total === 0) {
    throw new Error("No categories with subcategories found. Seed some data first.");
  }

  const skipCat = Math.floor(Math.random() * total);

  const pickedCategory = await prisma.category.findFirst({
    where: { subCategories: { some: {} } },
    skip: skipCat,
    orderBy: { id: "asc" },
    select: {
      id: true,
      name: true,
      subCategories: {
        select: { id: true, name: true }
      }
    }
  });

  if (!pickedCategory || pickedCategory.subCategories.length === 0) {
    throw new Error("Selected category has no subcategories (unexpected).");
  }

  const subIdx = Math.floor(Math.random() * pickedCategory.subCategories.length);
  const pickedSub = pickedCategory.subCategories[subIdx];

  return {
    category: { id: pickedCategory.id, name: pickedCategory.name },
    subCategory: { id: pickedSub.id, name: pickedSub.name }
  };
}

export interface QuizPromptOptions {
  categoryName: string;
  subCategoryName: string;
  difficulty: Difficulty;
  count: number;
}

const difficultyExamples = {
  easy: `Questions test basic facts and straightforward concepts.
         Example: "What is the primary function of the mitochondria?"`,
  medium: `Questions require understanding relationships and applying concepts.
          Example: "Which process best explains why cells divide through mitosis?"`,
  hard: `Questions involve synthesis, analysis, or complex connections.
         Example: "Compare and contrast the energy efficiency of photosynthesis pathways."`
};

const goodQuestionExample = {
  prompt: "In JavaScript, what happens when you add a string to a number?",
  options: [
    "The number is converted to a string and concatenated",
    "The string is converted to a number and added",
    "A type error is thrown",
    "The result is always 0"
  ],
  correctIndex: 0,
  explanation: "JavaScript uses type coercion, converting the number to string when combined with +"
};

const badQuestionExample = {
  prompt: "Which of these is true about JavaScript?",
  options: ["All of the above", "None of the above", "JavaScript is cool", "JavaScript is always fast"],
  issues: ["Uses 'all/none of the above'", "Vague options", "Subjective statement", "Absolute claim"]
};

export function generateQuizPrompt(options: QuizPromptOptions): string {
  const { categoryName, subCategoryName, difficulty, count } = options;

  return `
You are creating ONE complete, publish-ready quiz for ${categoryName} > ${subCategoryName}.

OUTPUT REQUIREMENTS:
- Return ONLY valid JSON matching the provided schema
- Plain text only - no markdown formatting (*, **, ##, etc.)
- No comments, no extra fields

DIFFICULTY: ${difficulty.toUpperCase()}
${difficultyExamples[difficulty]}

QUESTION COUNT: ${count} questions

STRUCTURE:
1. quizPageTitle: Catchy, SEO-friendly (≤70 chars). Unique wording each time.
2. quizPageDescription: Meta description (120-160 chars). No markdown.
3. tags: 1-10 diverse, plain-text keywords. No hashtags, no emojis.
4. difficulty: "${difficulty}"
5. title: On-page heading, slightly different phrasing than quizPageTitle
6. description: Short quiz intro, distinct from quizPageDescription
7. questions: ${count} items, each with:
   - prompt: Clear, engaging question text
   - options: 2-6 plain-text choices
   - correctIndex: 0-based index of correct answer
   - explanation: Optional 1-2 sentence explanation

GOOD EXAMPLE (follow this pattern):
${JSON.stringify(goodQuestionExample, null, 2)}

BAD EXAMPLE (avoid these patterns):
${JSON.stringify(badQuestionExample, null, 2)}

QUESTION QUALITY RULES:
✓ Dive deep into ${subCategoryName} specifics, not ${categoryName} generalities
✓ Each question has ONE objectively correct answer
✓ Distractors must be plausible but clearly incorrect to experts
✓ Include 1-2 "close but wrong" options based on common misconceptions
✓ Distractors similar in length/complexity to correct answer
✓ Mix: direct questions, complete-the-statement, scenario-based, comparisons

FORBIDDEN PATTERNS:
✗ "All of the above" / "None of the above"
✗ "Always" / "Never" / "Every time" absolute claims
✗ Time-sensitive references (current years, recent events)
✗ Joke answers or obviously nonsense options
✗ True/false styled binary choices
✗ Markdown formatting (*bold*, **bold**, ## headings, etc.)

UNIQUENESS REQUIREMENTS:
- Vary sentence structure and length across all fields
- Don't repeat key nouns between title/description/questions
- Tags should be diverse, not just repeating topic words
- Each generation should feel fresh, not templated

CATEGORY CONTEXT:
This quiz is for ${categoryName} enthusiasts who want to test their ${subCategoryName} knowledge.
Make questions feel specific to ${subCategoryName}, not generic ${categoryName} trivia.

Return ONLY schema-valid JSON. No preamble, no postscript, no markdown formatting.
`;
}
