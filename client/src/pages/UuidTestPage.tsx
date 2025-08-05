import React from 'react';
import { UuidAuthProvider, useUuidAuth } from '@/contexts/UuidAuthContext';
import { UuidLoginForm } from '@/components/UuidLoginForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function UuidDashboard() {
  const { user, logout } = useUuidAuth();

  if (!user) {
    return <UuidLoginForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Dashboard UUID
          </h1>
          <Button onClick={logout} variant="outline">
            Sair
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                🏢 Informações da Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <strong>ID da Empresa:</strong>
                <Badge variant="secondary" className="ml-2 font-mono text-xs">
                  {user.company_id || 'Não definido'}
                </Badge>
              </div>
              <div>
                <strong>Categoria:</strong>
                <span className="ml-2">{user.business_category || 'Não definida'}</span>
              </div>
              <div>
                <strong>ID da Filial:</strong>
                <Badge variant="outline" className="ml-2 font-mono text-xs">
                  {user.branch_id || 'Não definido'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                👤 Dados do Usuário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <strong>ID do Usuário:</strong>
                <Badge variant="secondary" className="ml-2 font-mono text-xs">
                  {user.id}
                </Badge>
              </div>
              <div>
                <strong>Nome:</strong>
                <span className="ml-2">{user.name}</span>
              </div>
              <div>
                <strong>Email:</strong>
                <span className="ml-2">{user.email}</span>
              </div>
              <div>
                <strong>Papel:</strong>
                <Badge variant="default" className="ml-2">
                  {user.role}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              ✅ Vantagens do Sistema UUID
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-green-700">Segurança</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• IDs não sequenciais</li>
                  <li>• Impossível enumerar usuários</li>
                  <li>• Melhor para APIs públicas</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-700">Escalabilidade</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Geração distribuída</li>
                  <li>• Sem conflitos entre sistemas</li>
                  <li>• Melhor para microserviços</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function UuidTestPage() {
  return (
    <UuidAuthProvider>
      <UuidDashboard />
    </UuidAuthProvider>
  );
}