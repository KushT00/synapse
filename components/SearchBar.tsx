import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
        <Search size={18} />
      </div>
      <Input
        type="search"
        placeholder="Search files..."
        className="pl-10 h-11 bg-card/80 backdrop-blur-md border border-border rounded-xl shadow-sm focus:ring-primary/50 focus:ring-1 text-card-foreground w-full"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
