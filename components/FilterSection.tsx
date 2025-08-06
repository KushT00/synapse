import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { useState } from "react";

export type FilterOptions = {
  type: string[];
  date: string | null;
  sortBy: "name" | "date" | "size";
};

interface FilterSectionProps {
  onFilter: (filters: FilterOptions) => void;
}

const FilterSection = ({ onFilter }: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    type: [],
    date: null,
    sortBy: "date",
  });

  const fileTypes = [
    { label: "Images", value: "image" },
    { label: "Documents", value: "document" },
    { label: "Audio", value: "audio" },
    { label: "Video", value: "video" },
    { label: "Archives", value: "archive" },
  ];

  const sortOptions = [
    { label: "Name", value: "name" },
    { label: "Date", value: "date" },
    { label: "Size", value: "size" },
  ] as const;

  const toggleType = (type: string) => {
    setFilters((prev) => {
      const newTypes = prev.type.includes(type)
        ? prev.type.filter((t) => t !== type)
        : [...prev.type, type];

      return { ...prev, type: newTypes };
    });
  };

  const handleSortChange = (sortBy: "name" | "date" | "size") => {
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  const applyFilters = () => {
    onFilter(filters);
  };

  const clearFilters = () => {
    const resetFilters: FilterOptions = {
      type: [],
      date: null,
      sortBy: "date",
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  return (
    <div className="w-full">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-8 px-3 bg-card/80 backdrop-blur-md border border-border/60 rounded-lg shadow-sm focus:ring-primary/50"
      >
        <Filter size={14} />
        <span>Filters</span>
        {filters.type.length > 0 && (
          <Badge variant="secondary" className="ml-1 h-5 px-1.5">
            {filters.type.length}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="mt-2 p-4 bg-card/80 backdrop-blur-lg border border-border/60 rounded-xl shadow-lg transition-all duration-200 ease-in-out">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium">Filter Files</h3>
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 px-2">
              <X size={14} className="mr-1" /> Clear
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium mb-2">File Type</p>
              <div className="flex flex-wrap gap-1">
                {fileTypes.map((type) => (
                  <Badge
                    key={type.value}
                    variant={filters.type.includes(type.value) ? "default" : "outline"}
                    className={`cursor-pointer transition-all ${
                      filters.type.includes(type.value)
                        ? "shadow-[0_0_8px_var(--tw-shadow-color)]"
                        : ""
                    }`}
                    onClick={() => toggleType(type.value)}
                  >
                    {type.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium mb-2">Sort By</p>
              <div className="flex flex-wrap gap-1">
                {sortOptions.map((option) => (
                  <Badge
                    key={option.value}
                    variant={filters.sortBy === option.value ? "default" : "outline"}
                    className={`cursor-pointer transition-all ${
                      filters.sortBy === option.value
                        ? "shadow-[0_0_8px_var(--tw-shadow-color)]"
                        : ""
                    }`}
                    onClick={() => handleSortChange(option.value)}
                  >
                    {option.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button size="sm" onClick={applyFilters} className="h-8">
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;
