import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCategoryStore } from '@/stores/category-store';
import { useContactStore } from '@/stores/contact-store';

interface KanbanFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategoryId: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  selectedAssigneeId: string | null;
  onAssigneeChange: (assigneeId: string | null) => void;
}

export function KanbanFilters({
  searchQuery,
  onSearchChange,
  selectedCategoryId,
  onCategoryChange,
  selectedAssigneeId,
  onAssigneeChange,
}: KanbanFiltersProps) {
  const categories = useCategoryStore((state) => state.categories);
  const contacts = useContactStore((state) => state.contacts);

  // Filter contacts that could be assignees (committee members and volunteers)
  const assignableContacts = contacts.filter(
    (contact) => contact.role === 'committee' || contact.role === 'volunteer'
  );

  const hasActiveFilters = searchQuery || selectedCategoryId || selectedAssigneeId;

  const clearFilters = () => {
    onSearchChange('');
    onCategoryChange(null);
    onAssigneeChange(null);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-card border rounded-lg">
      {/* Search Box */}
      <div className="relative flex-1 min-w-[200px] max-w-[300px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={cn(
            'w-full pl-9 pr-4 py-2 rounded-md',
            'border border-input bg-background',
            'text-sm placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
          )}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2',
              'p-1 rounded hover:bg-muted',
              'text-muted-foreground hover:text-foreground'
            )}
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-muted-foreground">Category:</label>
        <select
          value={selectedCategoryId || ''}
          onChange={(e) => onCategoryChange(e.target.value || null)}
          className={cn(
            'px-3 py-2 rounded-md',
            'border border-input bg-background',
            'text-sm',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
          )}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Assignee Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-muted-foreground">Assignee:</label>
        <select
          value={selectedAssigneeId || ''}
          onChange={(e) => onAssigneeChange(e.target.value || null)}
          className={cn(
            'px-3 py-2 rounded-md',
            'border border-input bg-background',
            'text-sm',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
          )}
        >
          <option value="">All Assignees</option>
          <option value="unassigned">Unassigned</option>
          {assignableContacts.map((contact) => (
            <option key={contact.id} value={contact.id}>
              {contact.name}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4 mr-1" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}
