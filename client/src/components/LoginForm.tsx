import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { useCategory } from '@/contexts/CategoryContext';

interface LoginFormProps {
  onLogin: (user: { name: string; email: string }) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const { setSelectedCategory } = useCategory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sistema de usuários por categoria
  const categoryUsers = {
    'master': { email: 'master@sistema.com', password: 'master2025', name: 'Administrador Master', business: 'Sistema Central', userType: 'master' },
    'farmacia': { email: 'farmaceutico@farmaciacentral.com', password: 'farm2025', name: 'Dr. Fernando Farmacêutico', business: 'Farmácia Central', userType: 'regular' },
    'pet': { email: 'veterinario@petclinic.com', password: 'vet2025', name: 'Dr. Carlos Veterinário', business: 'Pet Clinic', userType: 'regular' },
    'medico': { email: 'medico@clinicasaude.com', password: 'med2025', name: 'Dra. Ana Médica', business: 'Clínica Saúde', userType: 'regular' },
    'alimenticio': { email: 'chef@restaurante.com', password: 'chef2025', name: 'Chef Roberto', business: 'Restaurante Bella Vista', userType: 'regular' },
    'vendas': { email: 'vendedor@comercial.com', password: 'venda2025', name: 'João Vendedor', business: 'Comercial Tech', userType: 'regular' },
    'design': { email: 'designer@agencia.com', password: 'design2025', name: 'Maria Designer', business: 'Agência Creative', userType: 'regular' },
    'sites': { email: 'dev@webagency.com', password: 'web2025', name: 'Pedro Desenvolvedor', business: 'Web Agency', userType: 'regular' }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verificar credenciais e definir categoria automaticamente
    let userFound = false;
    for (const [category, userData] of Object.entries(categoryUsers)) {
      if (email === userData.email && password === userData.password) {
        // Para usuário master, usar a categoria 'estetica' por padrão
        const businessCategory = category === 'master' ? 'estetica' : category;
        
        // Definir categoria no localStorage e contexto
        localStorage.setItem('userBusinessCategory', businessCategory);
        setSelectedCategory(businessCategory);
        
        onLogin({
          name: userData.name,
          email: userData.email,
          userType: userData.userType,
          businessCategory: businessCategory,
          id: category === 'master' ? 1 : 2
        } as any);
        
        userFound = true;
        break;
      }
    }

    if (!userFound) {
      setError('Email ou senha incorretos.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo e Slogan */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-white">excluv</span>
            <span className="text-purple-400">.</span>
            <span className="text-green-400">ia</span>
          </h1>
          <div className="space-y-1">
            <p className="text-white text-lg">
              <span className="text-purple-400 font-semibold">Automatize</span>
              <span> com lógica.</span>
            </p>
            <p className="text-white text-lg">
              <span className="text-green-400 font-semibold">Organize</span>
              <span> com clareza.</span>
            </p>
          </div>
        </div>

        {/* Formulário de Login */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl rounded-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Fazer Login
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Senha
                </Label>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="show-password" 
                  checked={showPassword}
                  onCheckedChange={setShowPassword}
                />
                <Label htmlFor="show-password" className="text-sm text-gray-600">
                  Mostrar senha
                </Label>
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800 text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Entrando...
                  </div>
                ) : (
                  'Entrar'
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
                >
                  Esqueceu sua senha?
                </button>
              </div>
            </form>

            {/* Credenciais para desenvolvimento */}
            <div className="mt-6 p-3 bg-gray-50 rounded text-xs">
              <details>
                <summary className="text-gray-600 cursor-pointer">Credenciais de teste</summary>
                <div className="mt-2 space-y-1 text-gray-500">
                  <p><strong>Master:</strong> master@sistema.com / master2025</p>
                  <p><strong>Farmácia:</strong> farmaceutico@farmaciacentral.com / farm2025</p>
                  <p><strong>Pet:</strong> veterinario@petclinic.com / vet2025</p>
                  <p><strong>Médico:</strong> medico@clinicasaude.com / med2025</p>
                  <p><strong>Alimentício:</strong> chef@restaurante.com / chef2025</p>
                  <p><strong>Vendas:</strong> vendedor@comercial.com / venda2025</p>
                  <p><strong>Design:</strong> designer@agencia.com / design2025</p>
                  <p><strong>Sites:</strong> dev@webagency.com / web2025</p>
                </div>
              </details>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;