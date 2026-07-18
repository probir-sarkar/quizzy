"use client";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { memo, useState, useMemo, useCallback } from "react";
import { Filter, ChevronDown, Check } from "lucide-react";
import { sum, orderBy, filter } from "es-toolkit/compat";

// Types
interface SubCategory {
  name: string;
  slug: string;
  count: number;
}

interface Props {
  subCategories: SubCategory[];
  selectedSlug?: string | null;
  onSelect?: (slug: string | null) => void;
}

// Constants
const DIALOG_PLACEHOLDER = "Search subcategories...";
const ALL_SUBCATEGORIES_LABEL = "All Subcategories";

// Custom hook for URL state management
function useSubcategoryState(selectedSlug?: string | null) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentSlug = selectedSlug ?? searchParams.get("subcategory");

  const buildHref = useCallback(
    (slug?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (slug) params.set("subcategory", slug);
      else params.delete("subcategory");
      params.delete("page");
      return `${pathname}?${params.toString()}`;
    },
    [searchParams, pathname],
  );

  return { currentSlug, buildHref };
}

// Main Component
function SubCategoryFilters({
  subCategories,
  selectedSlug,
  onSelect,
}: Props) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { currentSlug, buildHref } = useSubcategoryState(selectedSlug);

  // Data transformations
  const sortedItems = useMemo(() => {
    return orderBy(subCategories, ["count"], ["desc"]);
  }, [subCategories]);

  const totalCount = useMemo(
    () => sum(subCategories.map((c: SubCategory) => c.count)),
    [subCategories],
  );

  const selectedSub = useMemo(
    () => subCategories.find((c: SubCategory) => c.slug === currentSlug) ?? null,
    [subCategories, currentSlug],
  );

  // Filter items by search
  const filteredItems = useMemo(() => {
    if (!searchValue) return sortedItems;
    const term = searchValue.toLowerCase();
    return filter(sortedItems, (item: SubCategory) =>
      item.name.toLowerCase().includes(term),
    );
  }, [sortedItems, searchValue]);

  const handleSelect = useCallback(
    (slug: string | null) => {
      onSelect?.(slug);
      setOpen(false);
      setSearchValue("");
    },
    [onSelect],
  );

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen);
      if (!newOpen) setSearchValue("");
    },
    [],
  );

  const selectedName = selectedSub?.name ?? ALL_SUBCATEGORIES_LABEL;
  const selectedCount = selectedSub?.count ?? totalCount;

  // Filter button content
  const buttonContent = (
    <>
      <Filter className="w-4 h-4 shrink-0" />
      <span className="truncate font-normal">
        {selectedName}
      </span>
      <Badge
        variant={selectedSub ? "secondary" : "outline"}
        className="ml-auto shrink-0"
      >
        {selectedCount}
      </Badge>
      <ChevronDown className="w-4 h-4 ml-2 shrink-0" />
    </>
  );

  const button = (
    <Button
      variant={selectedSub ? "default" : "outline"}
      size="default"
      onClick={onSelect ? () => setOpen(true) : undefined}
      className="gap-2 w-full sm:w-auto justify-start"
    >
      {buttonContent}
    </Button>
  );

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="h-14 sm:h-16 flex items-center justify-between gap-3">
          {/* Filter Trigger */}
          <div className="flex-1 min-w-0">
            {onSelect ? (
              button
            ) : (
              <Link href={buildHref()} className="block">
                {button}
              </Link>
            )}
          </div>

          {/* Result Count */}
          <div className="shrink-0">
            <p className="text-sm text-muted-foreground tabular-nums whitespace-nowrap">
              {selectedSub ? (
                <>
                  <span className="font-medium text-foreground">
                    {selectedSub.count}
                  </span>{" "}
                  quizzes
                </>
              ) : (
                <>
                  <span className="font-medium text-foreground">{totalCount}</span>{" "}
                  quizzes
                </>
              )}
            </p>
          </div>

          {/* Command Dialog */}
          <CommandDialog open={open} onOpenChange={handleOpenChange}>
            <Command shouldFilter={false}>
              <CommandInput
                placeholder={DIALOG_PLACEHOLDER}
                value={searchValue}
                onValueChange={setSearchValue}
              />
              <CommandList>
                <CommandEmpty>No subcategories found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="all"
                    onSelect={() => handleSelect(null)}
                    className="cursor-pointer group"
                  >
                    <span className="flex-1">{ALL_SUBCATEGORIES_LABEL}</span>
                    <Badge
                      variant="secondary"
                      className="group-hover:bg-primary/20 transition-colors"
                    >
                      {totalCount}
                    </Badge>
                    {!currentSlug && (
                      <Check className="w-4 h-4 text-primary ml-2 shrink-0" />
                    )}
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup>
                  {filteredItems.map((sub: SubCategory) => (
                    <CommandItem
                      key={sub.slug}
                      value={sub.slug}
                      onSelect={() => handleSelect(sub.slug)}
                      className="cursor-pointer group py-3"
                    >
                      <span className="flex-1 truncate">{sub.name}</span>
                      <Badge
                        variant="secondary"
                        className="group-hover:bg-primary/20 transition-colors"
                      >
                        {sub.count}
                      </Badge>
                      {currentSlug === sub.slug && (
                        <Check className="w-4 h-4 text-primary ml-2 shrink-0" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </CommandDialog>
        </div>
      </div>
    </header>
  );
}

export default memo(SubCategoryFilters);
