import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, Users, Shield, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ControleSection = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock permissions data for demonstration
  const mockUsers = [
    {
      id: 1,
      name: 'Dr. Ana Silva',
      email: 'farmaceutico@farmaciacentral.com',
      businessCategory: 'farmacia',
      userType: 'admin',
      allowedSections: ['dashboard', 'estoque', 'financeiro', 'atividade']
    },
    {
      id: 2,
      name: 'Dr. Carlos Mendes',
      email: 'veterinario@petclinic.com',
      businessCategory: 'pet',
      userType: 'user',
      allowedSections: ['dashboard', 'agendamentos', 'atendimento']
    },
    {
      id: 3,
      name: 'Dra. Maria Santos',
      email: 'medico@clinicasaude.com',
      businessCategory: 'medico',
      userType: 'user',
      allowedSections: ['dashboard', 'agendamentos', 'atividade']
    }
  ];

  const filteredUsers = mockUsers.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const togglePermission = (userId: number, section: string) => {
    alert(`Permissão ${section} alterada para usuário ${userId}`);
  };

  const savePermissions = () => {
    alert('Permissões salvas com sucesso!');
  };

  return (
    <div className="app-section">
      <div className="section-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <Settings className="h-6 w-6 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Controle de Acesso</h1>
        </div>
        <Button onClick={savePermissions} className="btn btn-primary">
          <Shield className="h-4 w-4 mr-2" />
          Salvar Permissões
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Lista de Usuários */}
      <div className="main-card">
        <div className="space-y-4">
          {filteredUsers.map((userData) => (
            <div key={userData.id} className="list-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">{userData.name}</h3>
                    <p className="text-sm text-gray-600">{userData.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="badge-primary">
                        {userData.businessCategory}
                      </Badge>
                      <Badge className="badge-success">
                        {userData.userType}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-2">Seções Permitidas:</p>
                  <div className="flex flex-wrap gap-1">
                    {['dashboard', 'estoque', 'financeiro', 'agendamentos', 'atendimento', 'atividade', 'graficos'].map((section) => (
                      <button
                        key={section}
                        onClick={() => togglePermission(userData.id, section)}
                        className={`px-2 py-1 text-xs rounded ${
                          userData.allowedSections?.includes(section)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {section}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ControleSection;