import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions, availableSections } from '@/contexts/PermissionsContext';
import { useCustomAlert } from '@/hooks/use-custom-alert';
import { CustomAlert } from '@/components/ui/custom-alert';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Settings, 
  Users, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Save,
  Eye,
  EyeOff,
  Search,
  X,
  Building2,
  UserCheck,
  Loader2
} from 'lucide-react';
import ModernIcon from '@/components/ui/modern-icon';

interface UserData {
  id: number;
  name: string;
  email: string;
  role?: string;
  businessCategory?: string;
  userType?: string;
  allowedSections?: string[];
  companyId?: number;
  company_id?: number;
  is_active?: boolean;
  isActive?: boolean;
  phone?: string;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
  company_name?: string;
  branch_name?: string;
}

interface Company {
  id: number;
  name: string;
  businessCategory: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
}

const ControleSection = () => {
  const { user } = useAuth();
  const { updateUserPermissions, getAllUserPermissions, isMasterUser, isCeoUser, isGestaoUser } = usePermissions();
  const { showAlert, isOpen, alertData, closeAlert } = useCustomAlert();
  const queryClient = useQueryClient();
  
  const [userPermissions, setUserPermissions] = useState<Record<number, string[]>>({});
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Buscar empresa do usuário master
  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: [`/api/user-company/${user?.id}`],
    queryFn: async (): Promise<Company | null> => {
      if (!user?.id) return null;
      const response = await fetch(`/api/user-company/${user.id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Erro ao buscar empresa');
      }
      return response.json();
    },
    enabled: !!user?.id && (isMasterUser || isCeoUser)
  });

  // Buscar usuários - Gestão vê todos, outros veem apenas da sua empresa
  const { data: companyUsers = [], isLoading: usersLoading } = useQuery({
    queryKey: isGestaoUser ? ['/api/all-users'] : [`/api/company-users/${company?.id}`],
    queryFn: async (): Promise<UserData[]> => {
      if (isGestaoUser) {
        // Perfil Gestão vê todos os usuários de todas as empresas
        const response = await fetch('/api/all-users');
        if (!response.ok) throw new Error('Erro ao buscar usuários');
        return response.json();
      } else {
        // Outros perfis veem apenas da sua empresa
        if (!company?.id) return [];
        const response = await fetch(`/api/company-users/${company.id}`);
        if (!response.ok) throw new Error('Erro ao buscar usuários');
        return response.json();
      }
    },
    enabled: (isGestaoUser || !!company?.id) && (isMasterUser || isCeoUser)
  });

  // Mutation para atualizar permissões
  const updatePermissionsMutation = useMutation({
    mutationFn: async ({ userId, allowedSections }: { userId: number; allowedSections: string[] }) => {
      const response = await fetch(`/api/users/${userId}/permissions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ allowedSections })
      });
      if (!response.ok) throw new Error('Erro ao atualizar permissões');
      return response.json();
    },
    onSuccess: (data, variables) => {
      const targetUser = companyUsers.find(u => u.id === variables.userId);
      showAlert({
        title: "Permissões Salvas",
        description: `Permissões do usuário ${targetUser?.name} foram atualizadas com sucesso.`,
        variant: "success"
      });
      queryClient.invalidateQueries({ queryKey: [`/api/company-users/${company?.id}`] });
    },
    onError: () => {
      showAlert({
        title: "Erro",
        description: "Erro ao atualizar permissões do usuário.",
        variant: "destructive"
      });
    }
  });
  
  // Filtra usuários baseado na pesquisa
  const filteredUsers = companyUsers.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.businessCategory || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    // Carrega permissões existentes dos usuários da empresa
    if (companyUsers.length > 0) {
      const initialPermissions: Record<number, string[]> = {};
      
      companyUsers.forEach(u => {
        initialPermissions[u.id] = u.allowedSections || ['dashboard', 'graficos'];
      });
      
      setUserPermissions(initialPermissions);
    }
  }, [companyUsers]);

  // Verifica se o usuário atual tem acesso
  if (!isMasterUser && !isCeoUser) {
    return (
      <div className="app-section">
        <div className="main-card">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-red-600" />
            <h1 className="text-xl font-semibold text-gray-800">Acesso Negado</h1>
          </div>
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-gray-700 mb-2">
              Acesso Restrito
            </h2>
            <p className="text-gray-600">
              Apenas usuários master podem acessar o controle de permissões.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const togglePermission = (userId: number, sectionId: string) => {
    setUserPermissions(prev => {
      const currentPermissions = prev[userId] || [];
      const newPermissions = currentPermissions.includes(sectionId)
        ? currentPermissions.filter(p => p !== sectionId)
        : [...currentPermissions, sectionId];
      
      return {
        ...prev,
        [userId]: newPermissions
      };
    });
  };

  const saveUserPermissions = (userId: number) => {
    const permissions = userPermissions[userId] || [];
    updatePermissionsMutation.mutate({ userId, allowedSections: permissions });
  };

  const hasPermission = (userId: number, sectionId: string): boolean => {
    return userPermissions[userId]?.includes(sectionId) || false;
  };

  const getPermissionIcon = (userId: number, sectionId: string) => {
    return hasPermission(userId, sectionId) ? 
      <CheckCircle className="w-5 h-5 text-green-600" /> : 
      <XCircle className="w-5 h-5 text-red-500" />;
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (companyLoading || usersLoading) {
    return (
      <div className="app-section">
        <div className="main-card">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <span className="ml-3 text-gray-600">Carregando dados da empresa...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-section">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title">Controle</h1>
          <p className="section-subtitle">
            Gerenciamento de usuários e permissões
          </p>
        </div>
      </div>

      {/* Main Card with Search and Users */}
      <div className="main-card">
        {/* Search Bar */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Users List */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {companyUsers.length === 0 ? 'Nenhum usuário encontrado' : 'Nenhum resultado encontrado'}
            </h3>
            <p className="text-gray-500">
              {companyUsers.length === 0 
                ? 'Ainda não há usuários cadastrados nesta empresa.' 
                : 'Tente ajustar os filtros de busca.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map(userData => {
              // Verificar se o usuário atual pode editar este usuário
              const canEditUser = () => {
                const targetUserRole = userData.role || userData.userType;
                
                // CEO pode editar todos os usuários (incluindo masters)
                if (isCeoUser) {
                  return true;
                }
                
                // Usuários master podem editar apenas usuários regulares (não outros masters)
                if (isMasterUser) {
                  return targetUserRole !== 'master';
                }
                
                return false;
              };

              const isEditable = canEditUser();
              
              return (
                <div key={userData.id} className="list-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                          <Users className="w-6 h-6 text-purple-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{userData.name}</h3>
                        <p className="text-sm text-gray-600">{userData.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs capitalize">
                            {(userData.company_name || 'Sem empresa').replace('_', ' ')}
                          </Badge>
                          <Badge variant={(userData.userType || userData.role) === 'master' ? 'default' : 'secondary'} className="text-xs">
                            {(userData.userType || userData.role) === 'master' ? 'Master' : 'Regular'}
                          </Badge>
                          {!isEditable && (
                            <Badge variant="destructive" className="text-xs">
                              Protegido
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedUser(selectedUser === userData.id ? null : userData.id)}
                        disabled={!isEditable}
                      >
                        {selectedUser === userData.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {selectedUser === userData.id ? 'Ocultar' : (isEditable ? 'Gerenciar' : 'Protegido')}
                      </Button>
                    </div>
                  </div>

                  {/* Permissions Panel */}
                  {selectedUser === userData.id && isEditable && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-800 flex items-center gap-2">
                        <UserCheck className="w-4 h-4" />
                        Permissões do Sistema
                      </h4>
                      <Button
                        onClick={() => saveUserPermissions(userData.id)}
                        disabled={updatePermissionsMutation.isPending}
                        size="sm"
                        className="system-btn-primary"
                      >
                        {updatePermissionsMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Salvar Alterações
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {availableSections.map(section => (
                        <div key={section.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {getPermissionIcon(userData.id, section.id)}
                            <div>
                              <span className="font-medium text-sm text-gray-800">{section.label}</span>
                              <p className="text-xs text-gray-600">{section.description}</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={hasPermission(userData.id, section.id)}
                              onChange={() => togglePermission(userData.id, section.id)}
                              className="sr-only peer"
                              disabled={!isEditable}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CustomAlert 
        isOpen={isOpen}
        onClose={closeAlert}
        title={alertData.title}
        description={alertData.description}
        variant={alertData.variant}
      />
    </div>
  );
};

export default ControleSection;