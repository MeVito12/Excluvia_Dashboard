import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, EyeOff, Mail } from 'lucide-react';
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
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Sistema de usuários por categoria
  const categoryUsers = {
    'farmacia': { email: 'farmaceutico@farmaciacentral.com', password: 'farm2025', name: 'Dr. Fernando Farmacêutico', business: 'Farmácia Central' },
    'pet': { email: 'veterinario@petclinic.com', password: 'vet2025', name: 'Dr. Carlos Veterinário', business: 'Pet Clinic' },
    'medico': { email: 'medico@clinicasaude.com', password: 'med2025', name: 'Dra. Ana Médica', business: 'Clínica Saúde' },
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
      setError('Email ou senha incorretos.');
    }

    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar se o email existe no sistema
    const emailExists = Object.values(categoryUsers).some(user => user.email === resetEmail);
    
    if (emailExists) {
      // Simular envio de email
      await new Promise(resolve => setTimeout(resolve, 1500));
      setResetSuccess(true);
    } else {
      setError('Email não encontrado no sistema.');
    }
  };

  const openForgotPassword = () => {
    setForgotPasswordOpen(true);
    setResetEmail(email); // Pre-preencher com o email digitado
    setResetSuccess(false);
    setError('');
  };

  const closeForgotPassword = () => {
    setForgotPasswordOpen(false);
    setResetEmail('');
    setResetSuccess(false);
    setError('');
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
                    className="w-full pr-12"
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </div>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription className="text-sm">
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

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  className="text-sm text-primary hover:text-primary/80 p-0 h-auto"
                  onClick={openForgotPassword}
                >
                  Esqueceu sua senha?
                </Button>
              </div>
            </form>


          </CardContent>
        </Card>

        {/* Modal de Esqueceu a Senha */}
        <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">
                <Mail className="h-6 w-6 mx-auto mb-2 text-primary" />
                Recuperar Senha
              </DialogTitle>
              <DialogDescription className="text-center">
                {resetSuccess 
                  ? "Email de recuperação enviado com sucesso!"
                  : "Digite seu email para receber as instruções de recuperação"
                }
              </DialogDescription>
            </DialogHeader>
            
            {!resetSuccess ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resetEmail" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="resetEmail"
                    type="email"
                    placeholder="Digite seu email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
                
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription className="text-sm">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={closeForgotPassword}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    Enviar
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-green-800 text-sm">
                    Enviamos um email com as instruções para recuperação de senha para:{" "}
                    <strong>{resetEmail}</strong>
                  </p>
                  <p className="text-green-600 text-xs mt-2">
                    Verifique sua caixa de entrada e spam.
                  </p>
                </div>
                
                <Button 
                  onClick={closeForgotPassword}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Fechar
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LoginForm;