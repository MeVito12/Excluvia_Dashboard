import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  address: string;
  phone: string;
  email: string;
  businessCategory: string;
  isMainOffice: boolean;
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

  { value: 'vendas', label: 'Vendas/Comércio' },
  { value: 'design', label: 'Design Gráfico' },
  { value: 'sites', label: 'Criação de Sites' }
];

const CadastroSection = () => {
  const { user } = useAuth();

  const queryClient = useQueryClient();

  // Estados principais
  const [currentStep, setCurrentStep] = useState<'company' | 'master' | 'branches' | 'users' | 'success' | 'manage'>('company');
  const [hasBranches, setHasBranches] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'cadastro' | 'gestao'>('cadastro');
  const [showPostRegistrationDialog, setShowPostRegistrationDialog] = useState(false);
  const [showCommonUsersDialog, setShowCommonUsersDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Dados da empresa
  const [companyData, setCompanyData] = useState<CompanyData>({
    fantasyName: '',
    corporateName: '',
    cnpj: '',
    address: '',
    phone: '',
    email: '',
    businessCategory: '',
    isMainOffice: true
  });

  // Dados do usuário master
  const [masterUserData, setMasterUserData] = useState<UserData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Filiais
  const [branches, setBranches] = useState<any[]>([]);
  const [newBranch, setNewBranch] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    isMain: false
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
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': (user as any)?.id?.toString() || '1'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Erro ao criar empresa');
      return response.json();
    },
    onSuccess: async (company) => {
      setCompanyCreated(company);
      
      // Se for matriz, adicionar automaticamente como filial
      if (companyData.isMainOffice) {
        try {
          const branchResponse = await fetch('/api/branches', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'x-user-id': (user as any)?.id?.toString() || '1'
            },
            body: JSON.stringify({
              name: `${company.fantasyName} - Matriz`,
              address: company.address,
              phone: company.phone,
              email: company.email,
              companyId: company.id,
              isMain: true
            })
          });
          
          if (branchResponse.ok) {
            const branch = await branchResponse.json();
            setBranches([branch]);
          }
        } catch (error) {

        }
      }
      
      setCurrentStep('master');
console.log("Action performed");
        title: "Empresa Cadastrada",
        description: `${company.fantasyName} foi cadastrada com sucesso!${companyData.isMainOffice ? ' Matriz adicionada automaticamente como filial.' : ''}`,
        variant: "success"
      });
    },
    onError: () => {
console.log("Action performed");
        title: "Erro",
        description: "Erro ao cadastrar empresa. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  const createMasterUserMutation = useMutation({
    mutationFn: async (data: UserData & { companyId: number }) => {
      const response = await fetch('/api/master-users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': (user as any)?.id?.toString() || '1'
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          companyId: data.companyId,
          businessCategory: companyCreated?.businessCategory || 'geral'
        })
      });
      if (!response.ok) throw new Error('Erro ao criar usuário master');
      return response.json();
    },
    onSuccess: () => {
console.log("Action performed");
        title: "Usuário Master Criado",
        description: `${masterUserData.name} foi cadastrado com sucesso!`,
        variant: "success"
      });
      
      // Ir para etapa de pergunta sobre filiais
      setCurrentStep('branches');
    },
    onError: () => {
console.log("Action performed");
        title: "Erro",
        description: "Erro ao criar usuário master. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  const createBranchMutation = useMutation({
    mutationFn: async (branchData: any) => {
      const response = await fetch('/api/branches', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': (user as any)?.id?.toString() || '1'
        },
        body: JSON.stringify({
          ...branchData,
          companyId: companyCreated?.id
        })
      });
      if (!response.ok) throw new Error('Erro ao criar filial');
      return response.json();
    },
    onSuccess: (branch) => {
      setBranches(prev => [...prev, branch]);
      setNewBranch({
        name: '',
        address: '',
        phone: '',
        email: '',
        isMain: false
      });
console.log("Action performed");
        title: "Filial Criada",
        description: `${branch.name} foi cadastrada com sucesso!`,
        variant: "success"
      });
    },
    onError: () => {
console.log("Action performed");
        title: "Erro",
        description: "Erro ao criar filial. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  const createCommonUserMutation = useMutation({
    mutationFn: async (userData: CommonUser & { companyId: number }) => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': (user as any)?.id?.toString() || '1'
        },
        body: JSON.stringify({
          ...userData,
          businessCategory: companyCreated?.businessCategory || 'geral'
        })
      });
      if (!response.ok) throw new Error('Erro ao criar usuário');
      return response.json();
    },
    onSuccess: (newUser) => {
      setCommonUsers(prev => [...prev, newUser]);
      setNewCommonUser({
        name: '',
        email: '',
        password: '',
        role: 'user'
      });
console.log("Action performed");
        title: "Usuário Criado",
        description: `${newUser.name} foi cadastrado com sucesso!`,
        variant: "success"
      });
    },
    onError: () => {
console.log("Action performed");
        title: "Erro",
        description: "Erro ao criar usuário. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  // Handlers
  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cnpjValid || !companyData.fantasyName || !companyData.corporateName || !companyData.businessCategory || !companyData.address.trim()) {
console.log("Action performed");
        title: "Campos Obrigatórios",
        description: "Preencha todos os campos obrigatórios com dados válidos, incluindo o endereço.",
        variant: "destructive"
      });
      return;
    }
    createCompanyMutation.mutate(companyData);
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

  const removeBranch = (index: number) => {
    setBranches(prev => prev.filter((_, i) => i !== index));
  };

  const removeCommonUser = (index: number) => {
    setCommonUsers(prev => prev.filter((_, i) => i !== index));
  };

  // Handler para envio de filial
  const handleBranchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newBranch.name.trim()) {
console.log("Action performed");
        title: "Erro",
        description: "Nome da filial é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    const branchToCreate = {
      ...newBranch,
      companyId: companyCreated?.id || 0
    };

    setBranches(prev => [...prev, branchToCreate]);
    setNewBranch({ name: '', address: '', phone: '', email: '', isMain: false });
    
console.log("Action performed");
      title: "Sucesso",
      description: "Filial adicionada com sucesso!",
      variant: "default"
    });
  };

  // Handler para envio de usuário comum
  const handleCommonUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCommonUser.name.trim() || !newCommonUser.email.trim()) {
console.log("Action performed");
        title: "Erro",
        description: "Nome e e-mail são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if (!validateEmail(newCommonUser.email)) {
console.log("Action performed");
        title: "Erro",
        description: "E-mail inválido.",
        variant: "destructive"
      });
      return;
    }

    const userToCreate = {
      ...newCommonUser,
      companyId: companyCreated?.id || 0
    };

    setCommonUsers(prev => [...prev, userToCreate]);
    setNewCommonUser({ name: '', email: '', password: '', role: 'user' });
    
console.log("Action performed");
      title: "Sucesso",
      description: "Usuário adicionado com sucesso!",
      variant: "default"
    });
  };

  // Handler para envio do usuário master
  const handleMasterUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyCreated) {
console.log("Action performed");
        title: "Erro",
        description: "Empresa não encontrada. Tente novamente.",
        variant: "destructive"
      });
      return;
    }

    if (masterUserData.password !== masterUserData.confirmPassword) {
console.log("Action performed");
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive"
      });
      return;
    }

    const masterUserData2 = {
      name: masterUserData.name,
      email: masterUserData.email,
      password: masterUserData.password,
      confirmPassword: masterUserData.confirmPassword,
      companyId: companyCreated.id
    };

    createMasterUserMutation.mutate(masterUserData2);
  };

  // Handler para finalizar registro
  const handleFinishRegistration = () => {
    // Resetar todos os dados do formulário
    setCompanyData({
      fantasyName: '',
      corporateName: '',
      cnpj: '',
      address: '',
      phone: '',
      email: '',
      businessCategory: '',
      isMainOffice: true
    });
    setMasterUserData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setBranches([]);
    setCommonUsers([]);
    setCompanyCreated(null);
    
    // Voltar ao início do fluxo
    setCurrentStep('company');
    
console.log("Action performed");
      title: "Sucesso",
      description: "Cadastro finalizado! Você pode iniciar um novo cadastro.",
      variant: "success"
    });
  };

  // Estados para gerenciamento
  const [existingCompanies, setExistingCompanies] = useState<any[]>([]);
  const [existingUsers, setExistingUsers] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newRole, setNewRole] = useState<string>('');

  // Buscar empresas existentes
  const fetchExistingCompanies = async () => {
    try {
      const response = await fetch('/api/companies', {
        headers: { 'x-user-id': (user as any)?.id?.toString() || '1' }
      });
      if (response.ok) {
        const companies = await response.json();
        setExistingCompanies(companies);
      }
    } catch (error) {

    }
  };

  // Buscar usuários existentes
  const fetchExistingUsers = async () => {
    try {
      const response = await fetch('/api/all-users', {
        headers: { 'x-user-id': (user as any)?.id?.toString() || '1' }
      });
      if (response.ok) {
        const users = await response.json();
        setExistingUsers(users);
      }
    } catch (error) {

    }
  };

  // Mutation para atualizar role do usuário
  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: number, newRole: string }) => {
      const response = await fetch(`/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': (user as any)?.id?.toString() || '1'
        },
        body: JSON.stringify({ role: newRole })
      });
      if (!response.ok) throw new Error('Erro ao atualizar role');
      return response.json();
    },
    onSuccess: () => {
console.log("Action performed");
        title: "Role Atualizada",
        description: "Role do usuário foi atualizada com sucesso!",
        variant: "success"
      });
      fetchExistingUsers();
      setSelectedUser(null);
      setNewRole('');
    },
    onError: () => {
console.log("Action performed");
        title: "Erro",
        description: "Erro ao atualizar role do usuário.",
        variant: "destructive"
      });
    }
  });

  // Verificar se é CEO (por role ou email específico)
  const isCeoUser = (user as any)?.role === 'ceo' || (user as any)?.email === 'ceo@sistema.com';
  
  if (!isCeoUser) {
    return (
      <div className="app-section">
        <div className="section-header">
          <h1 className="section-title">Acesso Negado</h1>
          <p className="section-subtitle">Área restrita para CEOs</p>
        </div>
        <div className="main-card">
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-black mb-2">
              Acesso Restrito
            </h2>
            <p className="text-gray-700">
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
        <p className="section-subtitle">Cadastro de empresas e gerenciamento de usuários</p>
      </div>

      {/* Navegação por Abas */}
      <div className="tab-navigation">
        <button
          onClick={() => {
            setActiveTab('cadastro');
            setCurrentStep('company');
          }}
          className={`tab-button ${activeTab === 'cadastro' ? 'tab-active' : 'tab-inactive'}`}
        >
          <Building2 className="w-4 h-4" />
          <span>Cadastro</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('gestao');
            fetchExistingCompanies();
            fetchExistingUsers();
          }}
          className={`tab-button ${activeTab === 'gestao' ? 'tab-active' : 'tab-inactive'}`}
        >
          <Users className="w-4 h-4" />
          <span>Gestão</span>
        </button>
      </div>

      {/* Conteúdo da Aba Cadastro */}
      {activeTab === 'cadastro' && (
        <div className="tab-content">
          {/* Indicador de Passos */}
          <div className="main-card mb-6">
            <div className="flex justify-center py-4">
              <div className="flex items-center space-x-12">
                <div className={`flex items-center ${currentStep === 'company' ? 'text-purple-600' : (currentStep === 'master' || currentStep === 'branches' || currentStep === 'users' || currentStep === 'success') ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-semibold text-lg ${currentStep === 'company' ? 'border-purple-600 bg-purple-100 text-purple-700' : (currentStep === 'master' || currentStep === 'branches' || currentStep === 'users' || currentStep === 'success') ? 'border-green-600 bg-green-100 text-green-700' : 'border-gray-300 bg-gray-100'}`}>
                    {(currentStep === 'master' || currentStep === 'branches' || currentStep === 'users' || currentStep === 'success') ? <CheckCircle className="w-6 h-6" /> : '1'}
                  </div>
                  <span className="ml-4 font-medium text-lg">Empresa</span>
                </div>
                
                <div className={`w-24 h-1 rounded-full ${currentStep === 'master' || currentStep === 'success' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                
                <div className={`flex items-center ${currentStep === 'master' ? 'text-purple-600' : (currentStep === 'branches' || currentStep === 'users' || currentStep === 'success') ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-semibold text-lg ${currentStep === 'master' ? 'border-purple-600 bg-purple-100 text-purple-700' : (currentStep === 'branches' || currentStep === 'users' || currentStep === 'success') ? 'border-green-600 bg-green-100 text-green-700' : 'border-gray-300 bg-gray-100'}`}>
                    {(currentStep === 'branches' || currentStep === 'users' || currentStep === 'success') ? <CheckCircle className="w-6 h-6" /> : '2'}
                  </div>
                  <span className="ml-4 font-medium text-lg">Usuário Master</span>
                </div>
                
                <div className={`w-24 h-1 rounded-full ${(currentStep === 'branches' || currentStep === 'users' || currentStep === 'success') ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                
                <div className={`flex items-center ${(currentStep === 'branches' || currentStep === 'users') ? 'text-purple-600' : currentStep === 'success' ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-semibold text-lg ${(currentStep === 'branches' || currentStep === 'users') ? 'border-purple-600 bg-purple-100 text-purple-700' : currentStep === 'success' ? 'border-green-600 bg-green-100 text-green-700' : 'border-gray-300 bg-gray-100'}`}>
                    {currentStep === 'success' ? <CheckCircle className="w-6 h-6" /> : '3'}
                  </div>
                  <span className="ml-4 font-medium text-lg">Filiais & Usuários</span>
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
                <Label htmlFor="fantasyName" className="text-sm font-medium" style={{ color: "#000000" }}>Nome Fantasia *</Label>
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
                <Label htmlFor="corporateName" className="text-sm font-medium" style={{ color: "#000000" }}>Razão Social *</Label>
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
                <Label htmlFor="cnpj" className="text-sm font-medium" style={{ color: "#000000" }}>CNPJ *</Label>
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
                <Label htmlFor="businessCategory" className="text-sm font-medium" style={{ color: "#000000" }}>Categoria do Negócio *</Label>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium" style={{ color: "#000000" }}>Endereço Completo *</Label>
                <Input
                  id="address"
                  value={companyData.address}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Ex: Rua das Flores, 123, Centro, São Paulo - SP"
                  className="focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium" style={{ color: "#000000" }}>Telefone</Label>
                <Input
                  id="phone"
                  value={companyData.phone}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                  className="focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium" style={{ color: "#000000" }}>E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={companyData.email}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="contato@empresa.com"
                  className="focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium" style={{ color: "#000000" }}>Tipo de Estabelecimento *</Label>
                <Select 
                  value={companyData.isMainOffice ? 'matriz' : 'gestao'} 
                  onValueChange={(value) => setCompanyData(prev => ({ ...prev, isMainOffice: value === 'matriz' }))}
                >
                  <SelectTrigger className="focus:ring-purple-500 focus:border-purple-500">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matriz">Matriz (Local de atendimento)</SelectItem>
                    <SelectItem value="gestao">Unidade de Gestão (Apenas administrativo)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                disabled={createCompanyMutation.isPending}
                className="system-btn-primary px-6 py-2"
                style={{ color: 'white' }}
              >
                <span style={{ color: 'white' }}>
                  {createCompanyMutation.isPending ? 'Cadastrando...' : 'Cadastrar Empresa'}
                </span>
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
                <Label htmlFor="masterName" className="text-sm font-medium" style={{ color: "#000000" }}>Nome Completo *</Label>
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
                <Label htmlFor="masterEmail" className="text-sm font-medium" style={{ color: "#000000" }}>E-mail *</Label>
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
                <Label htmlFor="masterPassword" className="text-sm font-medium" style={{ color: "#000000" }}>Senha *</Label>
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
                <Label htmlFor="confirmPassword" className="text-sm font-medium" style={{ color: "#000000" }}>Confirmar Senha *</Label>
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
                className="system-btn-primary px-6 py-2"
                style={{ color: 'white' }}
              >
                <span style={{ color: 'white' }}>
                  {createMasterUserMutation.isPending ? 'Criando...' : 'Criar Usuário Master'}
                </span>
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Etapa: Pergunta sobre Filiais */}
      {currentStep === 'branches' && hasBranches === null && (
        <div className="main-card">
          <div className="card-header">
            <div className="card-title">
              <ModernIcon icon={Building2} className="w-5 h-5" />
              <span>Configuração de Filiais - {companyCreated?.fantasyName}</span>
            </div>
          </div>
          
          <div className="text-center py-8">
            <Building2 className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-black mb-4">
              Sua empresa possui filiais?
            </h3>
            <p className="text-gray-700 mb-8">
              Você pode cadastrar as filiais da sua empresa agora ou pular esta etapa.
            </p>
            
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={() => setHasBranches(true)}
                className="system-btn-primary px-8 py-3"
                style={{ color: 'white' }}
              >
                <span style={{ color: 'white' }}>Sim, cadastrar filiais</span>
              </Button>
              <Button 
                variant="outline"
                onClick={() => setCurrentStep('users')}
                className="px-8 py-3"
              >
                Pular esta etapa
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Formulário de Filiais */}
      {currentStep === 'branches' && hasBranches === true && (
        <div className="main-card">
          <div className="card-header">
            <div className="card-title">
              <ModernIcon icon={Building2} className="w-5 h-5" />
              <span>Cadastrar Filiais - {companyCreated?.fantasyName}</span>
            </div>
          </div>
          
          <form onSubmit={handleBranchSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="branchName" className="text-sm font-medium" style={{ color: "#000000" }}>Nome da Filial *</Label>
                <Input
                  id="branchName"
                  value={newBranch.name}
                  onChange={(e) => setNewBranch(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Filial Centro"
                  className="focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="branchAddress" className="text-sm font-medium" style={{ color: "#000000" }}>Endereço</Label>
                <Input
                  id="branchAddress"
                  value={newBranch.address}
                  onChange={(e) => setNewBranch(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Ex: Rua Principal, 123"
                  className="focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="branchPhone" className="text-sm font-medium" style={{ color: "#000000" }}>Telefone</Label>
                <Input
                  id="branchPhone"
                  value={newBranch.phone}
                  onChange={(e) => setNewBranch(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                  className="focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="branchEmail" className="text-sm font-medium" style={{ color: "#000000" }}>E-mail</Label>
                <Input
                  id="branchEmail"
                  type="email"
                  value={newBranch.email}
                  onChange={(e) => setNewBranch(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="filial@empresa.com"
                  className="focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <div className="flex space-x-2">
                <Button 
                  type="submit" 
                  disabled={createBranchMutation.isPending}
                  className="system-btn-primary px-6"
                  style={{ color: 'white' }}
                >
                  <span style={{ color: 'white' }}>
                    {createBranchMutation.isPending ? 'Adicionando...' : 'Adicionar Filial'}
                  </span>
                </Button>
                <Button 
                  type="button"
                  onClick={() => setCurrentStep('users')}
                  className="system-btn-primary px-6"
                  style={{ color: 'white' }}
                >
                  <span style={{ color: 'white' }}>Continuar para Usuários</span>
                </Button>
              </div>
            </div>
          </form>

          {/* Lista de Filiais Cadastradas */}
          {branches.length > 0 && (
            <div className="mt-8 pt-6 border-t">
              <h4 className="font-medium text-black mb-4">Filiais Cadastradas</h4>
              <div className="space-y-3">
                {branches.map((branch, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div>
                      <p className="font-medium text-black">{branch.name}</p>
                      <p className="text-sm text-gray-700">{branch.address}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBranch(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Etapa: Usuários Comuns */}
      {currentStep === 'users' && (
        <div className="main-card">
          <div className="card-header">
            <div className="card-title">
              <ModernIcon icon={Users} className="w-5 h-5" />
              <span>Cadastrar Usuários Comuns - {companyCreated?.fantasyName}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Opcional:</strong> Cadastre usuários comuns da sua empresa ou pule esta etapa para finalizar.
              </p>
            </div>
          </div>

          <form onSubmit={handleCommonUserSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="userName" className="text-sm font-medium" style={{ color: "#000000" }}>Nome Completo *</Label>
                <Input
                  id="userName"
                  value={newCommonUser.name}
                  onChange={(e) => setNewCommonUser(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Maria Silva"
                  className="focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userEmail" className="text-sm font-medium" style={{ color: "#000000" }}>E-mail *</Label>
                <Input
                  id="userEmail"
                  type="email"
                  value={newCommonUser.email}
                  onChange={(e) => setNewCommonUser(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="maria@empresa.com"
                  className="focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userPassword" className="text-sm font-medium" style={{ color: "#000000" }}>Senha *</Label>
                <Input
                  id="userPassword"
                  type="password"
                  value={newCommonUser.password}
                  onChange={(e) => setNewCommonUser(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Mínimo 8 caracteres"
                  minLength={8}
                  className="focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <div className="flex space-x-2">
                <Button 
                  type="submit" 
                  disabled={createCommonUserMutation.isPending}
                  className="system-btn-primary px-6"
                  style={{ color: 'white' }}
                >
                  <span style={{ color: 'white' }}>
                    {createCommonUserMutation.isPending ? 'Adicionando...' : 'Adicionar Usuário'}
                  </span>
                </Button>
                <Button 
                  type="button"
                  onClick={handleFinishRegistration}
                  className="system-btn-primary px-6"
                  style={{ color: 'white' }}
                >
                  <span style={{ color: 'white' }}>Finalizar Cadastro</span>
                </Button>
              </div>
            </div>
          </form>

          {/* Lista de Usuários Cadastrados */}
          {commonUsers.length > 0 && (
            <div className="mt-8 pt-6 border-t">
              <h4 className="font-medium text-black mb-4">Usuários Cadastrados</h4>
              <div className="space-y-3">
                {commonUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div>
                      <p className="font-medium text-black">{user.name}</p>
                      <p className="text-sm text-gray-700">{user.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCommonUser(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

          {/* Seção de Sucesso */}
          {currentStep === 'success' && (
            <div className="main-card">
              <div className="text-center py-12">
                <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
                <h2 className="text-2xl font-semibold text-black mb-4">
                  Cadastro Realizado com Sucesso!
                </h2>
                <p className="text-gray-700 mb-8">
                  A empresa {companyCreated?.fantasyName} foi cadastrada com sucesso.
                </p>
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-medium text-green-800 mb-2">Resumo do Cadastro</h3>
                    <p className="text-green-700">
                      <strong>Empresa:</strong> {companyCreated?.fantasyName}<br />
                      <strong>CNPJ:</strong> {companyCreated?.cnpj}<br />
                      <strong>Filiais:</strong> {branches.length}<br />
                      <strong>Usuários:</strong> {commonUsers.length + 1} (incluindo master)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Conteúdo da Aba Gestão */}
      {activeTab === 'gestao' && (
        <div className="tab-content space-y-6">
          {/* Gerenciar Usuários */}
          <div className="main-card">
            <div className="card-header">
              <div className="card-title">
                <ModernIcon icon={Users} className="w-5 h-5" />
                <span>Gerenciar Usuários Existentes</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lista de Usuários */}
                <div>
                  <h4 className="font-medium mb-4" style={{ color: '#000000' }}>Usuários Cadastrados</h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {existingUsers.map((user) => (
                      <div 
                        key={user.id} 
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedUser?.id === user.id 
                            ? 'border-purple-500 bg-purple-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => {
                          setSelectedUser(user);
                          setNewRole(user.role);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium" style={{ color: '#000000' }}>{user.name}</p>
                            <p className="text-sm" style={{ color: '#666666' }}>{user.email}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              user.role === 'ceo' ? 'bg-blue-100 text-blue-800' :
                              user.role === 'master' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-black'
                            }`}>
                              {user.role === 'ceo' ? 'Gestão' : 
                               user.role === 'master' ? 'Master' : 
                               'Usuário'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Painel de Edição */}
                <div>
                  {selectedUser ? (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-4" style={{ color: '#000000' }}>Editar Usuário</h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm" style={{ color: '#666666' }}>Nome:</p>
                          <p className="font-medium" style={{ color: '#000000' }}>{selectedUser.name}</p>
                        </div>
                        <div>
                          <p className="text-sm" style={{ color: '#666666' }}>E-mail:</p>
                          <p className="font-medium" style={{ color: '#000000' }}>{selectedUser.email}</p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium" style={{ color: "#000000" }}>Nova Role</Label>
                          <Select value={newRole} onValueChange={setNewRole}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">Usuário Comum</SelectItem>
                              <SelectItem value="master">Master</SelectItem>
                              {selectedUser.role === 'ceo' && <SelectItem value="ceo">CEO</SelectItem>}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => {
                              if (newRole && newRole !== selectedUser.role) {
                                updateUserRoleMutation.mutate({
                                  userId: selectedUser.id,
                                  newRole
                                });
                              }
                            }}
                            disabled={!newRole || newRole === selectedUser.role || updateUserRoleMutation.isPending}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            {updateUserRoleMutation.isPending ? 'Atualizando...' : 'Atualizar Role'}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(null);
                              setNewRole('');
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-8 rounded-lg text-center">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p style={{ color: '#000000' }}>Selecione um usuário para editar</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Gerenciar Empresas */}
          <div className="main-card">
            <div className="card-header">
              <div className="card-title">
                <ModernIcon icon={Building2} className="w-5 h-5" />
                <span>Gerenciar Empresas Existentes</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lista de Empresas */}
                <div>
                  <h4 className="font-medium text-black mb-4">Empresas Cadastradas</h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {existingCompanies.map((company) => (
                      <div 
                        key={company.id} 
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedCompany?.id === company.id 
                            ? 'border-purple-500 bg-purple-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedCompany(company)}
                      >
                        <div>
                          <p className="font-medium text-black">{company.fantasyName}</p>
                          <p className="text-sm text-gray-700">{company.cnpj}</p>
                          <p className="text-xs text-gray-700">
                            {businessCategories.find(cat => cat.value === company.businessCategory)?.label}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Painel de Ações */}
                <div>
                  {selectedCompany ? (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-black mb-4">Ações da Empresa</h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-700">Empresa:</p>
                          <p className="font-medium" style={{ color: '#000000' }}>{selectedCompany.fantasyName}</p>
                        </div>
                        <div className="space-y-2">
                          <Button
                            onClick={() => {
                              setCompanyCreated(selectedCompany);
                              setHasBranches(true);
                              setCurrentStep('branches');
                              setActiveTab('cadastro');
                            }}
                            className="w-full bg-green-600 hover:bg-green-700"
                            style={{ color: 'white !important' }}
                          >
                            <Building2 className="w-4 h-4 mr-2" style={{ color: 'white !important' }} />
                            <span style={{ color: 'white !important', textShadow: 'none' }}>Adicionar Filiais</span>
                          </Button>
                          <Button
                            onClick={() => {
                              setCompanyCreated(selectedCompany);
                              setCurrentStep('users');
                              setActiveTab('cadastro');
                            }}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            style={{ color: 'white !important' }}
                          >
                            <Users className="w-4 h-4 mr-2" style={{ color: 'white !important' }} />
                            <span style={{ color: 'white !important', textShadow: 'none' }}>Adicionar Usuários</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-8 rounded-lg text-center">
                      <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p style={{ color: '#000000' }}>Selecione uma empresa para gerenciar</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      </div>
    );
  };

export default CadastroSection;
