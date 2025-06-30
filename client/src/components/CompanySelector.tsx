
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2 } from 'lucide-react';

const companies = [
  { id: 'all', name: 'Todas as Empresas' },
  { id: 'empresa-a', name: 'Empresa A - Tech Solutions' },
  { id: 'empresa-b', name: 'Empresa B - Digital Corp' },
  { id: 'empresa-c', name: 'Empresa C - Innovation Ltd' },
  { id: 'empresa-d', name: 'Empresa D - Smart Systems' },
  { id: 'empresa-e', name: 'Empresa E - Data Dynamics' },
];

interface CompanySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const CompanySelector = ({ value, onValueChange }: CompanySelectorProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Building2 className="h-5 w-5 text-muted-foreground" />
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-64 bg-card/80 backdrop-blur-sm border-border/50">
          <SelectValue placeholder="Selecione uma empresa" />
        </SelectTrigger>
        <SelectContent>
          {companies.map((company) => (
            <SelectItem key={company.id} value={company.id}>
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CompanySelector;
