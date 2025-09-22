import React from 'react';
import { Search, X } from 'lucide-react';

interface FilterChip {
  id: string;
  label: string;
  value: string;
  active: boolean;
}

interface FiltersBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterChips: FilterChip[];
  onChipToggle: (chipId: string) => void;
  onClearFilters: () => void;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  searchValue,
  onSearchChange,
  filterChips,
  onChipToggle,
  onClearFilters
}) => {
  const activeFiltersCount = filterChips.filter(chip => chip.active).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar movimentações..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          style={{ fontFamily: 'Segoe UI, sans-serif' }}
        />
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {filterChips.map((chip) => (
          <button
            key={chip.id}
            onClick={() => onChipToggle(chip.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              chip.active
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
            style={{ fontFamily: 'Segoe UI, sans-serif' }}
          >
            {chip.label}
          </button>
        ))}
        
        {activeFiltersCount > 0 && (
          <button
            onClick={onClearFilters}
            className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200 hover:bg-red-200 flex items-center space-x-1"
            style={{ fontFamily: 'Segoe UI, sans-serif' }}
          >
            <X className="h-3 w-3" />
            <span>Limpar ({activeFiltersCount})</span>
          </button>
        )}
      </div>
    </div>
  );
};

