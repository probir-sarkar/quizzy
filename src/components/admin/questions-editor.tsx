"use client";

import { useFieldArray, Control } from "react-hook-form";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { QuizFormData } from "@/lib/schemas/admin";
import { QuestionFormData } from "@/lib/schemas/admin";

interface QuestionsEditorProps {
  control: Control<QuizFormData>;
  isLoading?: boolean;
}

export function QuestionsEditor({ control, isLoading }: QuestionsEditorProps) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "questions",
  });

  const addQuestion = () => {
    append({
      text: "",
      options: ["", "", "", ""],
      correctIndex: 0,
      explanation: "",
    });
  };

  // const updateOption = (
  //   questionIndex: number,
  //   optionIndex: number,
  //   value: string
  // ) => {
  //   const currentOptions = fields[questionIndex].options as string[];
  //   const newOptions = [...currentOptions];
  //   newOptions[optionIndex] = value;
  //   // @ts-ignore - we need to update the nested array
  //   control.fieldsArray.questions?.[questionIndex].options = newOptions;
  // };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Questions</h3>
        <Button
          type="button"
          onClick={addQuestion}
          variant="outline"
          disabled={isLoading}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No questions yet
          </p>
          <Button type="button" onClick={addQuestion} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add First Question
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {fields.map((field, questionIndex) => (
            <div
              key={field.id}
              className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                  <span className="font-medium">
                    Question {questionIndex + 1}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(questionIndex)}
                  disabled={isLoading}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Question Text */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Question Text
                </label>
                <Textarea
                  {...control.register(`questions.${questionIndex}.text`)}
                  placeholder="Enter your question..."
                  rows={2}
                  disabled={isLoading}
                  className="resize-none"
                />
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Options (Select the correct answer)
                </label>
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-3">
                      <input
                        type="radio"
                        {...control.register(
                          `questions.${questionIndex}.correctIndex`
                        )}
                        value={optionIndex}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                        disabled={isLoading}
                      />
                      <Input
                        {...control.register(
                          `questions.${questionIndex}.options.${optionIndex}`
                        )}
                        placeholder={`Option ${optionIndex + 1}`}
                        disabled={isLoading}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Explanation */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Explanation (Optional)
                </label>
                <Textarea
                  {...control.register(
                    `questions.${questionIndex}.explanation`
                  )}
                  placeholder="Explain why this is the correct answer..."
                  rows={2}
                  disabled={isLoading}
                  className="resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
