import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions, availableSections } from '@/contexts/PermissionsContext';
import { useCustomAlert } from '@/hooks/use-custom-alert';
import { CustomAlert } from '@/components/ui/custom-alert';
import { 
  Settings, 
  Users, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Save,
  Eye,
  EyeOff
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

  return (
    <div className="app-section">
      <div className="main-card">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-purple-600" />
          <h1 className="text-xl font-semibold text-gray-800">Controle</h1>
        </div>

        {/* Informações do Master */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-purple-600" />
            <div>
              <h3 className="font-medium text-purple-800">Usuário Master</h3>
              <p className="text-sm text-purple-600">
                {user?.name} - Acesso total e configuração
              </p>
            </div>
          </div>
        </div>

        {/* Lista de Usuários */}
        <div className="grid gap-6">
          {users.map(userData => (
            <div key={userData.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="font-medium text-gray-800">{userData.name}</h3>
                    <p className="text-sm text-gray-600">{userData.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedUser(selectedUser === userData.id ? null : userData.id)}
                    className="btn btn-outline btn-sm"
                  >
                    {selectedUser === userData.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {selectedUser === userData.id ? 'Ocultar' : 'Configurar'}
                  </button>
                </div>
              </div>

              {selectedUser === userData.id && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-700 mb-3">Permissões de Acesso</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availableSections.map(section => (
                      <div
                        key={section.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-all ${
                          hasPermission(userData.id, section.id)
                            ? 'border-green-300 bg-green-50'
                            : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                        }`}
                        onClick={() => togglePermission(userData.id, section.id)}
                      >
                        <div className="flex items-center gap-3">
                          {getPermissionIcon(userData.id, section.id)}
                          <div className="flex-1">
                            <div className="font-medium text-sm text-gray-800">
                              {section.label}
                            </div>
                            <div className="text-xs text-gray-600">
                              {section.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      {userPermissions[userData.id]?.length || 0} seções permitidas
                    </div>
                    <button
                      onClick={() => saveUserPermissions(userData.id)}
                      className="btn btn-primary btn-sm"
                    >
                      <Save className="w-4 h-4" />
                      Salvar Permissões
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Informações sobre o sistema */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2">Como funciona</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Usuários master têm acesso total a todas as seções</li>
            <li>• Usuários regulares só veem as seções permitidas no menu lateral</li>
            <li>• As permissões são salvas automaticamente e aplicadas imediatamente</li>
            <li>• Cada seção pode ser habilitada ou desabilitada individualmente</li>
          </ul>
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