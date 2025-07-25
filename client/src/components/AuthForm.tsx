import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff } from 'lucide-react';
import logoImage from "@assets/Design sem nome_1751285815327.png";
import { useCategory } from '@/contexts/CategoryContext';
import { useAuth } from '@/contexts/AuthContext';

interface AuthFormProps {
  onLogin: (user: { name: string; email: string }) => void;
}

const AuthForm = ({ onLogin }: AuthFormProps) => {
  const { setSelectedCategory } = useCategory();
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const businessCategories = [
    { value: 'farmacia', label: 'Farmácia' },
    { value: 'pet', label: 'Pet Shop/Veterinária' },
    { value: 'medico', label: 'Clínica Médica' },
    { value: 'alimenticio', label: 'Restaurante/Alimentício' },
    { value: 'vendas', label: 'Vendas/Comércio' },
    { value: 'design', label: 'Design Gráfico' },
    { value: 'sites', label: 'Desenvolvimento Web' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isRegister) {
        // Validações para registro
        if (!name.trim()) {
          setError('Nome é obrigatório');
          return;
        }
        if (!businessCategory) {
          setError('Categoria de negócio é obrigatória');
          return;
        }

        await signUp(email, password, { name: name.trim(), businessCategory });
        setSuccess('Conta criada! Verifique seu email para confirmar.');
        setIsRegister(false);
        
        // Limpar campos
        setEmail('');
        setPassword('');
        setName('');
        setBusinessCategory('');
      } else {
        // Login com Supabase Auth
        await signIn(email, password);
        
        // Buscar dados do usuário da tabela users
        const response = await fetch('/api/auth/user-by-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

        if (response.ok) {
          const userData = await response.json();
          setSelectedCategory(userData.businessCategory);
          localStorage.setItem('userBusinessCategory', userData.businessCategory);
          onLogin(userData);
        }
      }
    } catch (error: any) {
      setError(error.message || 'Erro na autenticação');
    } finally {
      setIsLoading(false);
    }
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

        {/* Formulário de Autenticação */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {isRegister ? 'Criar Conta' : 'Fazer Login'}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {isRegister 
                ? 'Crie sua conta para acessar o sistema'
                : 'Entre com suas credenciais para acessar o sistema'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome (só no registro) */}
              {isRegister && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Nome Completo
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Digite seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
              )}

              {/* Email */}
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

              {/* Senha */}
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
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Categoria de Negócio (só no registro) */}
              {isRegister && (
                <div className="space-y-2">
                  <Label htmlFor="business-category" className="text-sm font-medium text-gray-700">
                    Categoria de Negócio
                  </Label>
                  <Select value={businessCategory} onValueChange={setBusinessCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione sua categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Mensagens */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              {/* Botão Submit */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isRegister ? 'Criando conta...' : 'Entrando...'}
                  </div>
                ) : (
                  isRegister ? 'Criar Conta' : 'Entrar'
                )}
              </Button>

              {/* Toggle entre login/registro */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setError('');
                    setSuccess('');
                  }}
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                >
                  {isRegister 
                    ? 'Já tem uma conta? Fazer login'
                    : 'Não tem conta? Criar nova conta'
                  }
                </button>
              </div>
            </form>

            {/* Credenciais de demo para testes */}
            {!isRegister && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 font-medium mb-2">Credenciais de teste:</p>
                <p className="text-xs text-gray-500">farmaceutico@farmaciacentral.com / farm2025</p>
                <p className="text-xs text-gray-500">veterinario@petclinic.com / vet2025</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthForm;