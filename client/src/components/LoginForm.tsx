import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff } from 'lucide-react';
import logoImage from "@assets/Design sem nome_1751285815327.png";
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
    'pet': { email: 'veterinario@petclinic.com', password: 'vet2025', name: 'Dr. Carlos Veterinário', business: 'Pet Clinic' },
    'saude': { email: 'medico@clinicasaude.com', password: 'med2025', name: 'Dra. Ana Médica', business: 'Clínica Saúde' },
    'alimenticio': { email: 'chef@restaurante.com', password: 'chef2025', name: 'Chef Roberto', business: 'Restaurante Bella Vista' },
    'vendas': { email: 'vendedor@comercial.com', password: 'venda2025', name: 'João Vendedor', business: 'Comercial Tech' },
    'design': { email: 'designer@agencia.com', password: 'design2025', name: 'Maria Designer', business: 'Agência Creative' },
    'sites': { email: 'dev@webagency.com', password: 'web2025', name: 'Pedro Desenvolvedor', business: 'Web Agency' }
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
        // Definir categoria no localStorage e contexto
        localStorage.setItem('userBusinessCategory', category);
        setSelectedCategory(category);
        
        onLogin({
          name: userData.name,
          email: userData.email
        });
        
        userFound = true;
        break;
      }
    }

    if (!userFound) {
      setError('Email ou senha incorretos. Credenciais válidas:\n' +
        '• veterinario@petclinic.com / vet2025 (Pet & Veterinário)\n' +
        '• medico@clinicasaude.com / med2025 (Saúde & Medicamentos)\n' +
        '• chef@restaurante.com / chef2025 (Alimentício)\n' +
        '• vendedor@comercial.com / venda2025 (Vendas)\n' +
        '• designer@agencia.com / design2025 (Design Gráfico)\n' +
        '• dev@webagency.com / web2025 (Criação de Sites)');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--dashboard-darker))] to-[hsl(var(--dashboard-dark))] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Slogan */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <img 
              src={logoImage} 
              alt="excluv.ia Logo" 
              className="w-80 h-20 object-contain mx-auto"
            />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-semibold">
              <span className="text-purple-400">Automatize</span>
              <span className="text-white"> com lógica.</span>
            </p>
            <p className="text-2xl font-semibold">
              <span className="text-green-400">Organize</span>
              <span className="text-white"> com clareza.</span>
            </p>
          </div>
        </div>

        {/* Formulário de Login */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Fazer Login
            </CardTitle>
            <CardDescription className="text-gray-600">
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription className="whitespace-pre-line text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90" 
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>


          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;