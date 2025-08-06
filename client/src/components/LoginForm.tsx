import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mail } from 'lucide-react';
import logoImage from "@assets/Design sem nome_1751285815327.png";
import { useCategory } from '@/contexts/CategoryContext';


interface LoginFormProps {
  onLogin: (user: any) => void;
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


  // REMOVIDO: Sistema de usuários hardcodados - apenas autenticação via Supabase



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Autenticação real via API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { user } = await response.json();
        console.log('[LOGIN] 📊 Login response user:', user);
        
        // Buscar dados completos do usuário incluindo company_id
        const userCompanyResponse = await fetch(`/api/user-company/${user.id}`);
        const { user: fullUser, company } = await userCompanyResponse.json();
        console.log('[LOGIN] 📋 Full user data:', fullUser);
        console.log('[LOGIN] 🏢 Company data:', company);
        
        // Armazenar dados completos do usuário - ESTRUTURA CORRIGIDA
        const userData = {
          id: fullUser.id,
          name: fullUser.name,
          email: fullUser.email, // Usar email do banco, não do formulário
          role: fullUser.role,
          businessCategory: fullUser.business_category,
          companyId: fullUser.company_id,
          company: company,
          permissions: fullUser.permissions
        };
        
        console.log('[LOGIN] 🔍 User role from database:', fullUser.role);
        console.log('[LOGIN] 📧 User email from database:', fullUser.email);
        
        console.log('[LOGIN] 💾 Saving to localStorage:', userData);
        
        // Salvar no localStorage para persistência
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('userBusinessCategory', fullUser.business_category);
        setSelectedCategory(fullUser.business_category);
        
        // Verificar se foi salvo corretamente
        const savedCheck = localStorage.getItem('currentUser');
        console.log('[LOGIN] ✅ Verification - saved to localStorage:', savedCheck);
        
        onLogin(userData);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro na autenticação');
      }
    } catch (error) {

      setError('Erro de conexão. Tente novamente.');
    }

    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Implementar recuperação de senha real via Supabase (se necessário)
    setError('Recuperação de senha: Entre em contato com o administrador do sistema.');
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
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="show-password"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                />
                <Label htmlFor="show-password" className="text-sm text-gray-700 cursor-pointer">
                  Mostrar senha
                </Label>
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full system-btn-primary"
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

              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={openForgotPassword}
                  className="text-sm text-purple-600 hover:text-purple-800"
                >
                  Esqueceu sua senha?
                </button>
                

              </div>
            </form>


          </CardContent>
        </Card>

        {/* Modal de Recuperação de Senha */}
        <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
          <DialogContent className="bg-white z-[60] !z-[60000] relative">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Recuperar Senha</DialogTitle>
              <DialogDescription className="text-gray-600">
                Digite seu email para receber instruções de recuperação de senha.
              </DialogDescription>
            </DialogHeader>
            
            {!resetSuccess ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="Digite seu email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
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
                    className="flex-1 system-btn-primary"
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
                  className="w-full system-btn-primary"
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