
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Search, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCompany: string;
  onCompanyChange: (value: string) => void;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  onDateFromChange: (date: Date | undefined) => void;
  onDateToChange: (date: Date | undefined) => void;
}

const companies = [
  { id: 'all', name: 'Todas as Empresas' },
  { id: 'empresa-a', name: 'Empresa A - Tech Solutions' },
  { id: 'empresa-b', name: 'Empresa B - Digital Corp' },
  { id: 'empresa-c', name: 'Empresa C - Innovation Ltd' },
  { id: 'empresa-d', name: 'Empresa D - Smart Systems' },
  { id: 'empresa-e', name: 'Empresa E - Data Dynamics' },
  { id: 'empresa-f', name: 'Empresa F - Cloud Services' },
  { id: 'empresa-g', name: 'Empresa G - AI Solutions' },
];

const SearchAndFilters = ({ 
  searchTerm, 
  onSearchChange, 
  selectedCompany, 
  onCompanyChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange
}: SearchAndFiltersProps) => {
  return (
    <div className="bg-white border border-border/50 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-black mb-4">Filtros e Pesquisa</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar empresas..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white text-gray-900 placeholder:text-gray-500 border-gray-200 focus:border-purple-500"
          />
        </div>

        {/* Company Select */}
        <Select value={selectedCompany} onValueChange={onCompanyChange}>
          <SelectTrigger className="bg-white text-gray-900 border-gray-200">
            <SelectValue placeholder="Selecione uma empresa" className="text-gray-900" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {companies
              .filter(company => 
                company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                searchTerm === ''
              )
              .map((company) => (
                <SelectItem key={company.id} value={company.id} className="text-gray-900 hover:bg-gray-100">
                  {company.name}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>

        {/* Date From */}
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-gray-500" />
          <input
            type="date"
            className="px-3 py-2 border border-gray-200 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={dateFrom ? dateFrom.toISOString().split('T')[0] : ''}
            onChange={(e) => {
              const date = e.target.value ? new Date(e.target.value) : undefined;
              onDateFromChange(date);
            }}
            placeholder="Data inicial"
          />
        </div>

        {/* Date To */}
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-gray-500" />
          <input
            type="date"
            className="px-3 py-2 border border-gray-200 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={dateTo ? dateTo.toISOString().split('T')[0] : ''}
            onChange={(e) => {
              const date = e.target.value ? new Date(e.target.value) : undefined;
              onDateToChange(date);
            }}
            placeholder="Data final"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilters;
