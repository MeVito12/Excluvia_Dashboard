import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions, availableSections } from '@/contexts/PermissionsContext';
import { useCustomAlert } from '@/hooks/use-custom-alert';
import { CustomAlert } from '@/components/ui/custom-alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  X
} from 'lucide-react';

interface UserData {
  id: number;
  name: string;
  email: string;
  businessCategory: string;
  userType: 'master' | 'regular';
}

const ControleSection = () => {
  const { user } = useAuth();
  const { updateUserPermissions, getAllUserPermissions, isMasterUser } = usePermissions();
  const { showAlert, isOpen, alertData, closeAlert } = useCustomAlert();
  
  // Mock users para demonstração
  const [users] = useState<UserData[]>([
    { id: 2, name: "Usuário Demo", email: "demo@example.com", businessCategory: "salao", userType: "regular" },
    { id: 3, name: "Maria Silva", email: "maria@salao.com", businessCategory: "salao", userType: "regular" },
    { id: 4, name: "João Santos", email: "joao@salao.com", businessCategory: "salao", userType: "regular" }
  ]);

  const [userPermissions, setUserPermissions] = useState<Record<number, string[]>>({});
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtra usuários baseado na pesquisa
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.businessCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    // Carrega permissões existentes
    const savedPermissions = getAllUserPermissions();
    const initialPermissions: Record<number, string[]> = {};
    
    users.forEach(u => {
      initialPermissions[u.id] = savedPermissions[u.id] || ['dashboard', 'graficos'];
    });
    
    setUserPermissions(initialPermissions);
  }, []);

  // Verifica se o usuário atual tem acesso
  if (!isMasterUser) {
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
    updateUserPermissions(userId, permissions);
    
    const user = users.find(u => u.id === userId);
    showAlert({
      title: "Permissões Salvas",
      description: `Permissões do usuário ${user?.name} foram atualizadas com sucesso.`,
      variant: "success"
    });
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

  return (
    <div className="app-section">
      <div className="main-card">
        {/* Título da seção */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-purple-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Controle</h1>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Shield className="w-4 h-4 mr-2" />
            Sistema Master
          </Button>
        </div>

        {/* Filtros */}
        <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-200/60">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              <Input
                placeholder="Pesquisar por usuário, email ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 h-12 bg-white/80 border-gray-300/60 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl shadow-sm"
              />
              {searchTerm && (
                <Button
                  onClick={clearSearch}
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </Button>
              )}
            </div>
            <Button 
              onClick={clearSearch}
              variant="outline" 
              className="h-12 px-6 border-gray-300 hover:bg-gray-100"
            >
              Limpar Filtros
            </Button>
          </div>
        </div>

        {/* Informações do Master - Card de Status */}
        <div className="list-card bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-purple-900">{user?.name}</h3>
              <p className="text-purple-700 text-sm mt-1">
                Administrador com acesso total ao sistema
              </p>
            </div>
            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
              Master
            </Badge>
          </div>
        </div>

        {/* Lista de Usuários - Título da seção */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Gerenciar Usuários</h2>
          <Badge variant="outline" className="ml-2">
            {filteredUsers.length} usuários
          </Badge>
        </div>

        <div className="space-y-4">{/* Removendo espaçamento extra */}

          {filteredUsers.length === 0 && searchTerm && (
            <div className="list-card text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Nenhum usuário encontrado
              </h3>
              <p className="text-gray-500 mb-4">
                Não encontramos usuários que correspondam à pesquisa "{searchTerm}"
              </p>
              <Button onClick={clearSearch} variant="outline">
                Limpar pesquisa
              </Button>
            </div>
          )}

          {filteredUsers.map(userData => {
            const permissions = userPermissions[userData.id] || [];
            const isExpanded = selectedUser === userData.id;

            return (
              <div key={userData.id} className="list-card hover:shadow-lg transition-all duration-200">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setSelectedUser(isExpanded ? null : userData.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900">{userData.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{userData.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {userData.businessCategory}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {permissions.length} permissões
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium text-gray-700">
                        {permissions.length} seções
                      </p>
                      <p className="text-xs text-gray-500">
                        {isExpanded ? 'Clique para ocultar' : 'Clique para configurar'}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0"
                    >
                      {isExpanded ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-2" />
                          Ocultar
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Configurar
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Settings className="w-5 h-5 text-purple-600" />
                      <h4 className="font-semibold text-gray-800">Configurar Permissões</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableSections.map(section => {
                        const hasAccess = hasPermission(userData.id, section.id);
                        return (
                          <div
                            key={section.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                              hasAccess
                                ? 'border-green-300 bg-green-50 hover:bg-green-100'
                                : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                            }`}
                            onClick={() => togglePermission(userData.id, section.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0">
                                {getPermissionIcon(userData.id, section.id)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm text-gray-800">
                                  {section.label}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                  {section.description}
                                </div>
                              </div>
                              <Badge 
                                variant={hasAccess ? "default" : "outline"}
                                className={hasAccess ? "bg-green-100 text-green-800" : ""}
                              >
                                {hasAccess ? "Ativo" : "Inativo"}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{permissions.length} de {availableSections.length} seções ativas</span>
                      </div>
                      <Button
                        onClick={() => saveUserPermissions(userData.id)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Permissões
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Informações sobre o sistema */}
        <div className="list-card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mt-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-3">Como funciona o sistema de permissões</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Usuários master têm acesso total a todas as seções</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Usuários regulares só veem seções permitidas no menu</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Permissões são aplicadas imediatamente após salvar</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Cada seção pode ser habilitada/desabilitada individualmente</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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