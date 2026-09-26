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
  onSelect: (slug: string | null) => void;
}

// Constants
const DIALOG_PLACEHOLDER = "Search subcategories...";
const ALL_SUBCATEGORIES_LABEL = "All Subcategories";

// Main Component
function SubCategoryFilters({
  subCategories,
  selectedSlug,
  onSelect,
}: Props) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const currentSlug = selectedSlug;

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
      onSelect(slug);
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

  // Filter button content
  const buttonContent = (
    <>
      <Filter className="h-4 w-4 shrink-0" />
      <span className="truncate font-mono text-xs font-bold uppercase tracking-[0.14em]">{selectedName}</span>
      <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
    </>
  );

  const button = (
    <Button
      variant={selectedSub ? "default" : "outline"}
      size="default"
      onClick={() => setOpen(true)}
      className="h-11 w-full justify-start gap-2 rounded-none border-2 border-foreground px-4 sm:w-auto"
    >
      {buttonContent}
    </Button>
  );

  return (
    <header className="sticky top-16 z-10 border-b-2 border-foreground bg-background/90 backdrop-blur-md">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="h-14 sm:h-16 flex items-center justify-between gap-3">
          {/* Filter Trigger */}
          <div className="flex-1 min-w-0">
            {button}
          </div>

          {/* Result Count */}
          <div className="shrink-0 text-right">
            <p className="text-sm text-muted-foreground whitespace-nowrap">
              <span className="font-medium text-foreground">
                {selectedSub?.count ?? totalCount}
              </span>{" "}
              quizzes
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
