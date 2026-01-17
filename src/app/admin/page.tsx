import { getDashboardAnalytics } from "@/queries/admin";
import {
  FileQuestion,
  Eye,
  FolderTree,
  TrendingUp,
  CheckCircle,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const analytics = await getDashboardAnalytics();

  const statsCards = [
    {
      title: "Total Quizzes",
      value: analytics.totalQuizzes,
      icon: FileQuestion,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      description: `${analytics.publishedQuizzes} published`,
    },
    {
      title: "Total Views",
      value: analytics.totalViews.toLocaleString(),
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      description: "All time views",
    },
    {
      title: "Published",
      value: analytics.publishedQuizzes,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      description: `${analytics.draftQuizzes} drafts remaining`,
    },
    {
      title: "Categories",
      value: analytics.totalCategories,
      icon: FolderTree,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      description: `${analytics.totalSubCategories} subcategories`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome to Quiz Zone Admin
          </p>
        </div>
        <Link
          href="/admin/quizzes/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <FileText className="h-4 w-4" />
          Create Quiz
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="glass border-gray-200 dark:border-gray-700"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Quizzes */}
      <Card className="glass border-gray-200 dark:border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Recent Quizzes
            </CardTitle>
            <Link
              href="/admin/quizzes"
              className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
            >
              View All
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {analytics.recentQuizzes.length === 0 ? (
            <div className="text-center py-12">
              <FileQuestion className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No quizzes yet</p>
              <Link
                href="/admin/quizzes/new"
                className="inline-block mt-4 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
              >
                Create your first quiz →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {analytics.recentQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/quizzes/${quiz.id}`}
                        className="font-medium text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400"
                      >
                        {quiz.title}
                      </Link>
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
                      <Badge
                        variant="outline"
                        className="capitalize border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-300"
                      >
                        {quiz.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {quiz.category?.name && `${quiz.category.name} • `}
                      {quiz.views} views • Created{" "}
                      {new Date(quiz.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    href={`/admin/quizzes/${quiz.id}`}
                    className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                  >
                    Edit →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
