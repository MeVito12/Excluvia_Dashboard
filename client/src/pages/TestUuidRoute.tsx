import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface UuidUser {
  id: string;
  email: string;
  name: string;
  company_id?: string;
  branch_id?: string;
  role: string;
  business_category?: string;
}

export function TestUuidRoute() {
  const [email, setEmail] = useState('junior@mercadocentral.com.br');
  const [password, setPassword] = useState('demo123');
  const [user, setUser] = useState<UuidUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/uuid-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Erro no login');
        return;
      }

      const data = await response.json();
      setUser(data.user);
      setToken(data.token);
    } catch (err) {
      setError('Erro de conexão');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Sistema de Autenticação UUID
        </h1>

        {!user ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Teste de Login UUID</CardTitle>
              <CardDescription>
                Sistema baseado em UUID para melhor segurança
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
                disabled={isLoading}
              >
                {isLoading ? 'Testando...' : 'Testar Login UUID'}
              </Button>

              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800 font-medium mb-1">🧪 Credenciais de Teste</p>
                <p className="text-xs text-amber-700">
                  Email: junior@mercadocentral.com.br<br/>
                  Senha: demo123
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <Badge variant="default" className="text-lg px-4 py-2">
                Login UUID Realizado com Sucesso!
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    👤 Dados do Usuário
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <strong>ID (UUID):</strong>
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

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    🏢 Empresa & Filial
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <strong>Company ID:</strong>
                    <Badge variant="outline" className="ml-2 font-mono text-xs">
                      {user.company_id || 'Não definido'}
                    </Badge>
                  </div>
                  <div>
                    <strong>Branch ID:</strong>
                    <Badge variant="outline" className="ml-2 font-mono text-xs">
                      {user.branch_id || 'Não definido'}
                    </Badge>
                  </div>
                  <div>
                    <strong>Categoria:</strong>
                    <span className="ml-2">{user.business_category || 'Não definida'}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">🔐 Token JWT</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <code className="text-xs break-all text-gray-700">
                    {token}
                  </code>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button onClick={handleLogout} variant="outline" size="lg">
                Fazer Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}