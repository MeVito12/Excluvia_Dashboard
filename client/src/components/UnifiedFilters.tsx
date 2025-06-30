import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, Filter, X } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface UnifiedFiltersProps {
  // Busca
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  
  // Filtros customizáveis
  filters?: {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
  }[];
  
  // Ações
  onClearFilters?: () => void;
  showClearButton?: boolean;
  
  // Customização
  title?: string;
  className?: string;
}

const UnifiedFilters = ({
  searchTerm = '',
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  filters = [],
  onClearFilters,
  showClearButton = true,
  title = 'Filtros e Pesquisa',
  className = ''
}: UnifiedFiltersProps) => {
  const hasActiveFilters = searchTerm || filters.some(filter => filter.value !== 'all' && filter.value !== '');

  return (
    <div className={`bg-white border border-border/50 rounded-lg p-6 space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-black flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-600" />
          {title}
        </h3>
        {showClearButton && hasActiveFilters && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onClearFilters}
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Campo de busca */}
        {onSearchChange && (
          <div className="relative">
            <Label htmlFor="unified-search" className="text-sm font-medium text-gray-700">
              Buscar
            </Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="unified-search"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}
        
        {/* Filtros dinâmicos */}
        {filters.map((filter) => (
          <div key={filter.id}>
            <Label htmlFor={filter.id} className="text-sm font-medium text-gray-700">
              {filter.label}
            </Label>
            <Select value={filter.value} onValueChange={filter.onChange}>
              <SelectTrigger className="mt-1" id={filter.id}>
                <SelectValue placeholder={`Selecionar ${filter.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
      
      {/* Indicador de filtros ativos */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          <span className="text-sm text-gray-600">Filtros ativos:</span>
          <div className="flex flex-wrap gap-1">
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                "{searchTerm}"
              </span>
            )}
            {filters
              .filter(filter => filter.value !== 'all' && filter.value !== '')
              .map(filter => {
                const selectedOption = filter.options.find(opt => opt.value === filter.value);
                return selectedOption ? (
                  <span key={filter.id} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    {selectedOption.label}
                  </span>
                ) : null;
              })
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedFilters;