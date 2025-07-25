import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, UserPlus, Settings, Eye, Search, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ModernIcon from '@/components/ui/modern-icon';

interface Company {
  id: number;
  name: string;
  businessCategory: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  createdBy: number;
  createdAt: string;
}

interface UserWithHierarchy {
  id: number;
  name: string;
  email: string;
  userType: 'super_admin' | 'company_admin' | 'branch_manager' | 'employee';
  companyId?: number;
  branchId?: number;
  managerId?: number;
  isActive: boolean;
  company?: Company;
  branch?: { id: number; name: string };
  manager?: { id: number; name: string };
  subordinates?: UserWithHierarchy[];
}

const HierarchySection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedUserType, setSelectedUserType] = useState<string>('all');

  // Buscar empresas
  const { data: companies = [], isLoading: companiesLoading } = useQuery({
    queryKey: ['/api/hierarchy/companies'],
    queryFn: async (): Promise<Company[]> => {
      const response = await fetch('/api/hierarchy/companies');
      if (!response.ok) throw new Error('Erro ao buscar empresas');
      return response.json();
    }
  });

  // Buscar usuários com hierarquia
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['/api/hierarchy/users'],
    queryFn: async (): Promise<UserWithHierarchy[]> => {
      const response = await fetch('/api/hierarchy/users');
      if (!response.ok) throw new Error('Erro ao buscar usuários');
      return response.json();
    }
  });

  // Filtrar dados
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = selectedCompany === 'all' || user.companyId?.toString() === selectedCompany;
    const matchesUserType = selectedUserType === 'all' || user.userType === selectedUserType;
    
    return matchesSearch && matchesCompany && matchesUserType;
  });

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case 'super_admin': return 'Super Admin';
      case 'company_admin': return 'Admin Empresa';
      case 'branch_manager': return 'Gerente Filial';
      case 'employee': return 'Funcionário';
      default: return type;
    }
  };

  const getUserTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'super_admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'company_admin': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'branch_manager': return 'bg-green-100 text-green-800 border-green-200';
      case 'employee': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'farmacia': return '💊';
      case 'pet': return '🐕';
      case 'medico': return '🏥';
      case 'alimenticio': return '🍽️';
      case 'vendas': return '💼';
      case 'design': return '🎨';
      case 'sites': return '💻';
      default: return '🏢';
    }
  };

  if (companiesLoading || usersLoading) {
    return (
      <div className="app-section">
        <div className="section-header">
          <div className="flex items-center gap-3">
            <ModernIcon icon={Building2} variant="default" size="lg" />
            <div>
              <h1>Hierarquia Empresarial</h1>
              <p>Carregando dados...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-section">
      <div className="section-header">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <ModernIcon icon={Building2} variant="default" size="lg" />
            <div>
              <h1>Hierarquia Empresarial</h1>
              <p>Gerencie empresas, usuários e estrutura organizacional</p>
            </div>
          </div>
          <Button className="modern-button">
            <UserPlus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Button>
        </div>
      </div>

      {/* Métricas gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="metric-card-standard">
          <CardContent className="metric-content">
            <div className="metric-icon">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="metric-values">
              <div className="metric-number">{companies.length}</div>
              <div className="metric-label">Empresas</div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card-standard">
          <CardContent className="metric-content">
            <div className="metric-icon">
              <Users className="w-5 h-5" />
            </div>
            <div className="metric-values">
              <div className="metric-number">{users.length}</div>
              <div className="metric-label">Total Usuários</div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card-standard">
          <CardContent className="metric-content">
            <div className="metric-icon">
              <UserPlus className="w-5 h-5" />
            </div>
            <div className="metric-values">
              <div className="metric-number">{users.filter(u => u.userType === 'company_admin').length}</div>
              <div className="metric-label">Admins Empresa</div>
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card-standard">
          <CardContent className="metric-content">
            <div className="metric-icon">
              <Eye className="w-5 h-5" />
            </div>
            <div className="metric-values">
              <div className="metric-number">{users.filter(u => u.isActive).length}</div>
              <div className="metric-label">Usuários Ativos</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="main-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="form-label">Buscar usuário</label>
              <Input
                placeholder="Nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="form-label">Empresa</label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger className="input-field">
                  <SelectValue placeholder="Todas empresas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas empresas</SelectItem>
                  {companies.map(company => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {getCategoryIcon(company.businessCategory)} {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="form-label">Tipo de usuário</label>
              <Select value={selectedUserType} onValueChange={setSelectedUserType}>
                <SelectTrigger className="input-field">
                  <SelectValue placeholder="Todos tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos tipos</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="company_admin">Admin Empresa</SelectItem>
                  <SelectItem value="branch_manager">Gerente Filial</SelectItem>
                  <SelectItem value="employee">Funcionário</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCompany('all');
                  setSelectedUserType('all');
                }}
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de usuários */}
      <Card className="main-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Usuários ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map(user => (
              <div key={user.id} className="list-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getUserTypeBadgeColor(user.userType)}>
                          {getUserTypeLabel(user.userType)}
                        </Badge>
                        {user.company && (
                          <Badge variant="outline" className="text-xs">
                            {getCategoryIcon(user.company.businessCategory)} {user.company.name}
                          </Badge>
                        )}
                        {!user.isActive && (
                          <Badge variant="destructive" className="text-xs">
                            Inativo
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-1" />
                      Gerenciar
                    </Button>
                  </div>
                </div>

                {/* Informações hierárquicas */}
                {(user.branch || user.manager) && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      {user.branch && (
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          <span>Filial: {user.branch.name}</span>
                        </div>
                      )}
                      {user.manager && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>Gerente: {user.manager.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum usuário encontrado com os filtros aplicados</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HierarchySection;