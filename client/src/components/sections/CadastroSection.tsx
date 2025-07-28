import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCustomAlert } from '@/hooks/use-custom-alert';
import { CustomAlert } from '@/components/ui/custom-alert';
import { 
  Building2, 
  User, 
  Mail, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff,
  Users,
  Plus,
  X,
  Shield
} from 'lucide-react';
import ModernIcon from '@/components/ui/modern-icon';

interface CompanyData {
  fantasyName: string;
  corporateName: string;
  cnpj: string;
  businessCategory: string;
}

interface UserData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyId?: number;
}

interface CommonUser {
  name: string;
  email: string;
  password: string;
  role: string;
}

const businessCategories = [
  { value: 'farmacia', label: 'Farmácia' },
  { value: 'pet', label: 'Veterinária' },
  { value: 'medico', label: 'Clínica Médica' },
  { value: 'alimenticio', label: 'Alimentício' },
  { value: 'vendas', label: 'Vendas/Comércio' },
  { value: 'design', label: 'Design Gráfico' },
  { value: 'sites', label: 'Criação de Sites' }
];

const CadastroSection = () => {
  const { user } = useAuth();
  const { showAlert, isOpen, alertData, closeAlert } = useCustomAlert();
  const queryClient = useQueryClient();

  // Estados principais
  const [currentStep, setCurrentStep] = useState<'company' | 'master' | 'success'>('company');
  const [showPostRegistrationDialog, setShowPostRegistrationDialog] = useState(false);
  const [showCommonUsersDialog, setShowCommonUsersDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Dados da empresa
  const [companyData, setCompanyData] = useState<CompanyData>({
    fantasyName: '',
    corporateName: '',
    cnpj: '',
    businessCategory: ''
  });

  // Dados do usuário master
  const [masterUserData, setMasterUserData] = useState<UserData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Usuários comuns
  const [commonUsers, setCommonUsers] = useState<CommonUser[]>([]);
  const [newCommonUser, setNewCommonUser] = useState<CommonUser>({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  // Estados de validação
  const [cnpjValid, setCnpjValid] = useState<boolean | null>(null);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);
  const [companyCreated, setCompanyCreated] = useState<any>(null);

  // Funções de validação
  const validateCNPJ = (cnpj: string): boolean => {
    const cleanCNPJ = cnpj.replace(/[^\d]/g, '');
    if (cleanCNPJ.length !== 14) return false;
    
    if (/^(\d)\1+$/.test(cleanCNPJ)) return false;
    
    let sum = 0;
    let weight = 5;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleanCNPJ[i]) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    
    let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (parseInt(cleanCNPJ[12]) !== digit) return false;
    
    sum = 0;
    weight = 6;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cleanCNPJ[i]) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    
    digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    return parseInt(cleanCNPJ[13]) === digit;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formatCNPJ = (value: string): string => {
    const numbers = value.replace(/[^\d]/g, '');
    return numbers.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  };

  // Mutations
  const createCompanyMutation = useMutation({
    mutationFn: async (data: CompanyData) => {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Erro ao criar empresa');
      return response.json();
    },
    onSuccess: (company) => {
      setCompanyCreated(company);
      setCurrentStep('master');
      showAlert({
        title: "Empresa Cadastrada",
        description: `${company.fantasyName} foi cadastrada com sucesso!`,
        variant: "success"
      });
    },
    onError: () => {
      showAlert({
        title: "Erro",
        description: "Erro ao cadastrar empresa. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  const createMasterUserMutation = useMutation({
    mutationFn: async (data: UserData & { companyId: number }) => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          role: 'master',
          businessCategory: companyData.businessCategory
        })
      });
      if (!response.ok) throw new Error('Erro ao criar usuário master');
      return response.json();
    },
    onSuccess: () => {
      setCurrentStep('success');
      setShowPostRegistrationDialog(true);
      showAlert({
        title: "Usuário Master Criado",
        description: `${masterUserData.name} foi cadastrado com sucesso!`,
        variant: "success"
      });
    },
    onError: () => {
      showAlert({
        title: "Erro",
        description: "Erro ao criar usuário master. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  // Handlers
  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cnpjValid || !companyData.fantasyName || !companyData.corporateName || !companyData.businessCategory) {
      showAlert({
        title: "Campos Obrigatórios",
        description: "Preencha todos os campos obrigatórios com dados válidos.",
        variant: "destructive"
      });
      return;
    }
    createCompanyMutation.mutate(companyData);
  };

  const handleMasterUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValid || !passwordMatch || !masterUserData.name) {
      showAlert({
        title: "Dados Inválidos",
        description: "Verifique se todos os campos estão preenchidos corretamente.",
        variant: "destructive"
      });
      return;
    }
    
    if (companyCreated) {
      createMasterUserMutation.mutate({
        ...masterUserData,
        companyId: companyCreated.id
      });
    }
  };

  const handleCNPJChange = (value: string) => {
    const formatted = formatCNPJ(value);
    setCompanyData(prev => ({ ...prev, cnpj: formatted }));
    const isValid = validateCNPJ(formatted);
    setCnpjValid(isValid);
  };

  const handleEmailChange = (value: string) => {
    setMasterUserData(prev => ({ ...prev, email: value }));
    const isValid = validateEmail(value);
    setEmailValid(isValid);
  };

  const handlePasswordChange = (field: 'password' | 'confirmPassword', value: string) => {
    setMasterUserData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'password') {
      setPasswordMatch(masterUserData.confirmPassword === value);
    } else {
      setPasswordMatch(masterUserData.password === value);
    }
  };

  const addCommonUser = () => {
    if (newCommonUser.name && newCommonUser.email && newCommonUser.password) {
      setCommonUsers(prev => [...prev, { ...newCommonUser }]);
      setNewCommonUser({ name: '', email: '', password: '', role: 'user' });
    }
  };

  const removeCommonUser = (index: number) => {
    setCommonUsers(prev => prev.filter((_, i) => i !== index));
  };

  // Verificar se é CEO
  if ((user as any)?.role !== 'ceo') {
    return (
      <div className="app-section">
        <div className="section-header">
          <h1 className="section-title">Acesso Negado</h1>
          <p className="section-subtitle">Área restrita para CEOs</p>
        </div>
        <div className="main-card">
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-gray-700 mb-2">
              Acesso Restrito
            </h2>
            <p className="text-gray-600">
              Apenas CEOs podem acessar o cadastro de empresas e usuários master.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-section">
      <div className="section-header">
        <h1 className="section-title">Cadastro</h1>
        <p className="section-subtitle">Cadastro de empresas e usuários master</p>
      </div>

      {/* Indicador de Passos */}
      <div className="main-card mb-6">
        <div className="flex justify-center py-4">
          <div className="flex items-center space-x-12">
            <div className={`flex items-center ${currentStep === 'company' ? 'text-purple-600' : currentStep === 'master' || currentStep === 'success' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-semibold text-lg ${currentStep === 'company' ? 'border-purple-600 bg-purple-100 text-purple-700' : currentStep === 'master' || currentStep === 'success' ? 'border-green-600 bg-green-100 text-green-700' : 'border-gray-300 bg-gray-100'}`}>
                {currentStep === 'master' || currentStep === 'success' ? <CheckCircle className="w-6 h-6" /> : '1'}
              </div>
              <span className="ml-4 font-medium text-lg">Empresa</span>
            </div>
            
            <div className={`w-24 h-1 rounded-full ${currentStep === 'master' || currentStep === 'success' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            
            <div className={`flex items-center ${currentStep === 'master' ? 'text-purple-600' : currentStep === 'success' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-semibold text-lg ${currentStep === 'master' ? 'border-purple-600 bg-purple-100 text-purple-700' : currentStep === 'success' ? 'border-green-600 bg-green-100 text-green-700' : 'border-gray-300 bg-gray-100'}`}>
                {currentStep === 'success' ? <CheckCircle className="w-6 h-6" /> : '2'}
              </div>
              <span className="ml-4 font-medium text-lg">Usuário Master</span>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário da Empresa */}
      {currentStep === 'company' && (
        <div className="main-card">
          <div className="card-header">
            <div className="card-title">
              <ModernIcon icon={Building2} className="w-5 h-5" />
              <span>Dados da Empresa Principal</span>
            </div>
          </div>
          
          <form onSubmit={handleCompanySubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fantasyName" className="text-sm font-medium text-gray-700">Nome Fantasia *</Label>
                <Input
                  id="fantasyName"
                  value={companyData.fantasyName}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, fantasyName: e.target.value }))}
                  placeholder="Ex: Farmácia Central"
                  className="focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="corporateName" className="text-sm font-medium text-gray-700">Razão Social *</Label>
                <Input
                  id="corporateName"
                  value={companyData.corporateName}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, corporateName: e.target.value }))}
                  placeholder="Ex: Farmácia Central Ltda"
                  className="focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj" className="text-sm font-medium text-gray-700">CNPJ *</Label>
                <div className="relative">
                  <Input
                    id="cnpj"
                    value={companyData.cnpj}
                    onChange={(e) => handleCNPJChange(e.target.value)}
                    placeholder="00.000.000/0001-00"
                    maxLength={18}
                    className="focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                  {cnpjValid === true && (
                    <CheckCircle className="absolute right-3 top-3 w-4 h-4 text-green-600" />
                  )}
                  {cnpjValid === false && (
                    <AlertCircle className="absolute right-3 top-3 w-4 h-4 text-red-600" />
                  )}
                </div>
                {cnpjValid === false && (
                  <p className="text-sm text-red-600">CNPJ inválido</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessCategory" className="text-sm font-medium text-gray-700">Categoria do Negócio *</Label>
                <Select
                  value={companyData.businessCategory}
                  onValueChange={(value) => setCompanyData(prev => ({ ...prev, businessCategory: value }))}
                >
                  <SelectTrigger className="focus:ring-purple-500 focus:border-purple-500">
                    <SelectValue placeholder="Selecione a categoria" />
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
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                disabled={createCompanyMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
              >
                {createCompanyMutation.isPending ? 'Cadastrando...' : 'Cadastrar Empresa'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Formulário do Usuário Master */}
      {currentStep === 'master' && (
        <div className="main-card">
          <div className="card-header">
            <div className="card-title">
              <ModernIcon icon={User} className="w-5 h-5" />
              <span>Usuário Master - {companyCreated?.fantasyName}</span>
            </div>
          </div>
          
          <form onSubmit={handleMasterUserSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="masterName" className="text-sm font-medium text-gray-700">Nome Completo *</Label>
                <Input
                  id="masterName"
                  value={masterUserData.name}
                  onChange={(e) => setMasterUserData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: João Silva"
                  className="focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="masterEmail" className="text-sm font-medium text-gray-700">E-mail *</Label>
                <div className="relative">
                  <Input
                    id="masterEmail"
                    type="email"
                    value={masterUserData.email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    placeholder="joao@empresa.com"
                    className="focus:ring-purple-500 focus:border-purple-500 pr-20"
                    required
                  />
                  <Mail className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                  {emailValid === true && (
                    <CheckCircle className="absolute right-8 top-3 w-4 h-4 text-green-600" />
                  )}
                  {emailValid === false && (
                    <AlertCircle className="absolute right-8 top-3 w-4 h-4 text-red-600" />
                  )}
                </div>
                {emailValid === false && (
                  <p className="text-sm text-red-600">E-mail inválido</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="masterPassword" className="text-sm font-medium text-gray-700">Senha *</Label>
                <div className="relative">
                  <Input
                    id="masterPassword"
                    type={showPassword ? "text" : "password"}
                    value={masterUserData.password}
                    onChange={(e) => handlePasswordChange('password', e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    minLength={8}
                    className="focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {masterUserData.password && masterUserData.password.length < 8 && (
                  <p className="text-sm text-red-600">Senha deve ter no mínimo 8 caracteres</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirmar Senha *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={masterUserData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    placeholder="Confirme a senha"
                    className="focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  {passwordMatch === true && masterUserData.confirmPassword && (
                    <CheckCircle className="absolute right-10 top-3 w-4 h-4 text-green-600" />
                  )}
                  {passwordMatch === false && masterUserData.confirmPassword && (
                    <AlertCircle className="absolute right-10 top-3 w-4 h-4 text-red-600" />
                  )}
                </div>
                {passwordMatch === false && masterUserData.confirmPassword && (
                  <p className="text-sm text-red-600">Senhas não coincidem</p>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setCurrentStep('company')}
              >
                Voltar
              </Button>
              <Button 
                type="submit" 
                disabled={createMasterUserMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
              >
                {createMasterUserMutation.isPending ? 'Criando...' : 'Criar Usuário Master'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Diálogo Pós-Cadastro */}
      <Dialog open={showPostRegistrationDialog} onOpenChange={setShowPostRegistrationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Cadastro Concluído!
            </DialogTitle>
            <DialogDescription>
              Empresa e usuário master foram cadastrados com sucesso. O que deseja fazer agora?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Button
              onClick={() => {
                setShowPostRegistrationDialog(false);
                setShowCommonUsersDialog(true);
              }}
              className="w-full justify-start"
              variant="outline"
            >
              <Users className="w-4 h-4 mr-2" />
              Adicionar Usuários Comuns
            </Button>
          </div>
          
          <DialogFooter>
            <Button
              onClick={() => {
                setShowPostRegistrationDialog(false);
                // Reset form
                setCurrentStep('company');
                setCompanyData({ fantasyName: '', corporateName: '', cnpj: '', businessCategory: '' });
                setMasterUserData({ name: '', email: '', password: '', confirmPassword: '' });
                setCompanyCreated(null);
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Finalizar Cadastro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para Cadastro de Usuários Comuns */}
      <Dialog open={showCommonUsersDialog} onOpenChange={setShowCommonUsersDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adicionar Usuários Comuns</DialogTitle>
            <DialogDescription>
              Cadastre usuários que irão trabalhar na empresa {companyCreated?.fantasyName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Formulário para novo usuário */}
            <div className="main-card">
              <h4 className="font-medium mb-4">Novo Usuário</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Nome completo"
                    value={newCommonUser.name}
                    onChange={(e) => setNewCommonUser(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    placeholder="E-mail"
                    type="email"
                    value={newCommonUser.email}
                    onChange={(e) => setNewCommonUser(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Senha"
                    type="password"
                    value={newCommonUser.password}
                    onChange={(e) => setNewCommonUser(prev => ({ ...prev, password: e.target.value }))}
                  />
                  <Button onClick={addCommonUser} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </div>
            </div>

            {/* Lista de usuários adicionados */}
            {commonUsers.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Usuários Adicionados ({commonUsers.length})</h4>
                {commonUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeCommonUser(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCommonUsersDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setShowCommonUsersDialog(false);
                showAlert({
                  title: "Usuários Salvos",
                  description: `${commonUsers.length} usuários foram cadastrados com sucesso!`,
                  variant: "success"
                });
                setCommonUsers([]);
              }}
              disabled={commonUsers.length === 0}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Salvar Usuários
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

export default CadastroSection;