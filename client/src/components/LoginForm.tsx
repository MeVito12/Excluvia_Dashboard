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
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Sistema de usuários por categoria
  const categoryUsers = {
    'master': { email: 'master@sistema.com', password: 'master2025', name: 'Administrador Master', business: 'Sistema Central', userType: 'master' },

    'farmacia': { email: 'farmaceutico@farmaciacentral.com', password: 'farm2025', name: 'Dr. Fernando Farmacêutico', business: 'Farmácia Central', userType: 'regular' },
    'pet': { email: 'veterinario@petclinic.com', password: 'vet2025', name: 'Dr. Carlos Veterinário', business: 'Pet Clinic', userType: 'regular' },
    'medico': { email: 'medico@clinicasaude.com', password: 'med2025', name: 'Dra. Ana Médica', business: 'Clínica Saúde', userType: 'regular' },

    'vendas': { email: 'vendedor@comercial.com', password: 'venda2025', name: 'João Vendedor', business: 'Comercial Tech', userType: 'regular' },
    'design': { email: 'designer@agencia.com', password: 'design2025', name: 'Maria Designer', business: 'Agência Creative', userType: 'regular' },
    'sites': { email: 'dev@webagency.com', password: 'web2025', name: 'Pedro Desenvolvedor', business: 'Web Agency', userType: 'regular' }
  };

  // Perfis de demonstração com dados completos
  const demoProfiles = [
    {
      category: 'farmacia',
      name: 'Dr. Fernando Farmacêutico',
      business: 'Farmácia Central',
      description: 'Sistema completo para farmácias com controle de medicamentos, vendas e estoque com validade',
      features: ['Controle de medicamentos', 'Gestão de validade', 'Receitas médicas', 'Vendas automatizadas']
    },
    {
      category: 'pet',
      name: 'Dr. Carlos Veterinário', 
      business: 'Pet Clinic',
      description: 'Plataforma veterinária com agendamentos, prontuários e controle de produtos pet',
      features: ['Agendamentos veterinários', 'Prontuários digitais', 'Produtos pet', 'Consultas e vacinas']
    },
    {
      category: 'medico',
      name: 'Dra. Ana Médica',
      business: 'Clínica Saúde', 
      description: 'Sistema médico completo com agendamentos, prontuários e controle financeiro',
      features: ['Agendamentos médicos', 'Prontuários eletrônicos', 'Controle financeiro', 'Equipamentos médicos']
    },
    {
      category: 'vendas',
      name: 'João Vendedor',
      business: 'Comercial Tech',
      description: 'Plataforma de vendas B2B com gestão de clientes corporativos e produtos tecnológicos',
      features: ['Vendas B2B', 'Clientes corporativos', 'Produtos tecnológicos', 'Relatórios de vendas']
    },
    {
      category: 'design',
      name: 'Maria Designer',
      business: 'Agência Creative',
      description: 'Gestão de projetos criativos com portfólio, clientes e controle de campanhas',
      features: ['Portfólio de projetos', 'Gestão de campanhas', 'Clientes criativos', 'Propostas comerciais']
    },
    {
      category: 'sites',
      name: 'Pedro Desenvolvedor', 
      business: 'Web Agency',
      description: 'Agência de desenvolvimento web com projetos, clientes e gestão técnica completa',
      features: ['Projetos web', 'Desenvolvimento técnico', 'Clientes digitais', 'Hospedagem e domínios']
    }
  ];

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
        
        // Definir categoria no localStorage e contexto
        localStorage.setItem('userBusinessCategory', user.businessCategory);
        setSelectedCategory(user.businessCategory);
        
        onLogin({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          businessCategory: user.businessCategory,
          permissions: user.permissions
        });
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

  const handleDemoLogin = async (profile: any) => {
    setIsLoading(true);
    const userData = categoryUsers[profile.category as keyof typeof categoryUsers];
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: userData.email, 
          password: userData.password 
        }),
      });

      if (response.ok) {
        const { user } = await response.json();
        
        localStorage.setItem('userBusinessCategory', user.businessCategory);
        setSelectedCategory(user.businessCategory);
        
        onLogin({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          businessCategory: user.businessCategory,
          permissions: user.permissions
        });
      }
    } catch (error) {
      setError('Erro ao acessar demonstração');
    }
    
    setIsLoading(false);
    setShowDemoModal(false);
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
                
                <div className="flex items-center justify-center">
                  <div className="border-t border-gray-300 flex-1"></div>
                  <span className="px-3 text-xs text-gray-500">ou</span>
                  <div className="border-t border-gray-300 flex-1"></div>
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowDemoModal(true)}
                  className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-md hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  🚀 Acessar Demonstração
                </button>
              </div>
            </form>


          </CardContent>
        </Card>

        {/* Modal de Recuperação de Senha */}
        <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
          <DialogContent className="bg-white">
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

        {/* Modal de Demonstração */}
        <Dialog open={showDemoModal} onOpenChange={setShowDemoModal}>
          <DialogContent className="bg-white max-w-5xl w-[95vw] max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900 text-center">
                🚀 Demonstração do Sistema
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-center text-sm">
                Escolha um perfil para explorar todas as funcionalidades com dados reais
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
              {demoProfiles.map((profile, index) => (
                <div 
                  key={profile.category}
                  className="border border-gray-200 rounded-lg p-3 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-purple-300"
                  onClick={() => handleDemoLogin(profile)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-base text-gray-900">{profile.name}</h3>
                      <p className="text-xs text-purple-600 font-medium">{profile.business}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center text-lg">
                      {profile.category === 'farmacia' ? '💊' :
                       profile.category === 'pet' ? '🐕' :
                       profile.category === 'medico' ? '🏥' :
                       profile.category === 'vendas' ? '💼' :
                       profile.category === 'design' ? '🎨' : '💻'}
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-2">{profile.description}</p>
                  
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-700">Funcionalidades:</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.features.slice(0, 2).map((feature, idx) => (
                        <span 
                          key={idx}
                          className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                      {profile.features.length > 2 && (
                        <span className="text-xs text-gray-500">+{profile.features.length - 2}</span>
                      )}
                    </div>
                  </div>
                  
                  <button className="w-full mt-3 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-medium rounded-md hover:from-purple-600 hover:to-blue-600 transition-colors">
                    Acessar Demo
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <div className="text-lg">ℹ️</div>
                <div>
                  <h4 className="font-medium text-blue-900 mb-1 text-sm">Sobre a Demonstração</h4>
                  <p className="text-xs text-blue-800">
                    Cada perfil possui dados completos do Supabase: produtos, vendas, clientes, 
                    agendamentos, transferências e relatórios financeiros. Explore sem limitações.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-3">
              <Button 
                variant="outline"
                onClick={() => setShowDemoModal(false)}
                className="px-6 text-sm"
              >
                Fechar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LoginForm;