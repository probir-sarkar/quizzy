"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileQuestion,
  FolderTree,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminLogout } from "@/app/admin/actions";

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Quizzes",
    href: "/admin/quizzes",
    icon: FileQuestion,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await adminLogout();
      window.location.href = "/admin/login";
    });
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-purple-600 dark:text-purple-400">
          Quiz Zone Admin
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
          onClick={handleLogout}
          disabled={isPending}
        >
          <LogOut className="h-5 w-5 mr-3" />
          {isPending ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </aside>
  );
}
