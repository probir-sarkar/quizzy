"use client";

import { Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CategorySearch({ initialSearch }: { initialSearch: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setSearchTerm(initialSearch);
  }, [initialSearch]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setIsSearching(true);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search by 500ms
    searchTimeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (term.trim()) {
        params.set("search", term);
        params.delete("page"); // Reset to page 1 when searching
      } else {
        params.delete("search");
      }

      const queryString = params.toString();
      router.push(`/category${queryString ? `?${queryString}` : ""}`);
      setIsSearching(false);
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.target.value);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="relative">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
          isSearching ? "text-indigo-500 animate-pulse" : "text-gray-400"
        }`} />
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Search categories or subcategories..."
          className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        />
        {searchTerm && (
          <button
            onClick={() => handleSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
