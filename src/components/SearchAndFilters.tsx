
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
            className="pl-10 bg-background/50 text-black"
          />
        </div>

        {/* Company Select */}
        <Select value={selectedCompany} onValueChange={onCompanyChange}>
          <SelectTrigger className="bg-background/50 text-muted-foreground">
            <SelectValue placeholder="Selecione uma empresa" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            {companies
              .filter(company => 
                company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                searchTerm === ''
              )
              .map((company) => (
                <SelectItem key={company.id} value={company.id} className="text-gray-600">
                  {company.name}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>

        {/* Date From */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal bg-background/50 text-muted-foreground",
                !dateFrom && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Data inicial"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateFrom}
              onSelect={onDateFromChange}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        {/* Date To */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal bg-background/50 text-muted-foreground",
                !dateTo && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateTo ? format(dateTo, "dd/MM/yyyy") : "Data final"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateTo}
              onSelect={onDateToChange}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default SearchAndFilters;
