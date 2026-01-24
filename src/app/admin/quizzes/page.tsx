"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Search, Plus, Edit, Trash2, Eye, EyeOff, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  getQuizzes,
  toggleQuizPublish,
  deleteQuiz,
} from "@/app/admin/actions";

interface Quiz {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  isPublished: boolean;
  views: number;
  createdAt: Date | string;
  category: { name: string; slug: string } | null;
  subCategory: { name: string; slug: string } | null;
  _count: { questions: number };
}

interface QuizzesResponse {
  quizzes: Quiz[];
  total: number;
  pages: number;
  currentPage: number;
}

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [isPublished, setIsPublished] = useState<string>("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const data: QuizzesResponse = await getQuizzes({
        page: currentPage,
        limit: 10,
        search,
        difficulty: difficulty as any,
        isPublished: isPublished === "true" ? true : isPublished === "false" ? false : undefined,
      });

      setQuizzes(data.quizzes);
      setTotal(data.total);
      setPages(data.pages);
    } catch (error) {
      toast.error("Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [currentPage, difficulty, isPublished]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchQuizzes();
  };

  const handleTogglePublish = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      const result = await toggleQuizPublish(id, !currentStatus);
      if (result.success) {
        toast.success(`Quiz ${!currentStatus ? "published" : "unpublished"}`);
        fetchQuizzes();
      } else {
        toast.error(result.error || "Failed to update quiz");
      }
    });
  };

  const handleDelete = () => {
    if (!deleteId) return;

    startTransition(async () => {
      const result = await deleteQuiz(deleteId);
      if (result.success) {
        toast.success("Quiz deleted successfully");
        setDeleteId(null);
        fetchQuizzes();
      } else {
        toast.error(result.error || "Failed to delete quiz");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Quizzes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your quiz content
          </p>
        </div>
        <Link href="/admin/quizzes/new">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            New Quiz
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="glass p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search quizzes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              {/* <SelectItem value="">All</SelectItem> */}
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Select value={isPublished} onValueChange={setIsPublished}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {/* <SelectItem value="">All</SelectItem> */}
              <SelectItem value="true">Published</SelectItem>
              <SelectItem value="false">Draft</SelectItem>
            </SelectContent>
          </Select>

          <Button type="submit" variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Apply
          </Button>
        </form>

        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {total} quiz{total !== 1 ? "zes" : ""} found
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  Loading...
                </TableCell>
              </TableRow>
            ) : quizzes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <div className="flex flex-col items-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      No quizzes found
                    </p>
                    <Link href="/admin/quizzes/new">
                      <Button>Create your first quiz</Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              quizzes.map((quiz) => (
                <TableRow key={quiz.id}>
                  <TableCell>
                    <Link
                      href={`/admin/quizzes/${quiz.id}`}
                      className="font-medium hover:text-purple-600 dark:hover:text-purple-400"
                    >
                      {quiz.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {quiz.category?.name || "-"}
                    {quiz.subCategory && ` / ${quiz.subCategory.name}`}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="capitalize border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-300"
                    >
                      {quiz.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={quiz.isPublished ? "default" : "secondary"}
                      className={
                        quiz.isPublished
                          ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                      }
                    >
                      {quiz.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>{quiz._count.questions}</TableCell>
                  <TableCell>{quiz.views.toLocaleString()}</TableCell>
                  <TableCell>
                    {new Date(quiz.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTogglePublish(quiz.id, quiz.isPublished)}
                        title={quiz.isPublished ? "Unpublish" : "Publish"}
                        disabled={isPending}
                      >
                        {quiz.isPublished ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Link href={`/admin/quizzes/${quiz.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(quiz.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} of {pages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(pages, p + 1))}
                disabled={currentPage === pages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the quiz
              and all its questions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
