import { useState } from 'react';
import { useCategory } from '@/contexts/CategoryContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatDateBR } from '@/utils/dateFormat';
import { useFinancial } from '@/hooks/useFinancial';
import { useMoneyTransfers } from '@/hooks/useMoneyTransfers';
import { useBranches } from '@/hooks/useBranches';
import { useCustomAlert } from '@/hooks/use-custom-alert';
import { CustomAlert } from '@/components/ui/custom-alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  FileText, 
  Eye, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Upload,
  RotateCcw,
  Edit,
  Trash2,
  Calendar,
  X,
  ArrowLeftRight,
  Building2,
  DollarSign,
  Clock,
  Check,
  Search
} from 'lucide-react';
import { FinancialEntry, NewFinancialEntry, MoneyTransfer, NewMoneyTransfer } from '@shared/schema';

const FinanceiroSection = () => {
  const { selectedCategory } = useCategory();
  const { user } = useAuth();
  const { showAlert, isOpen, alertData, closeAlert } = useCustomAlert();
  const userId = (user as any)?.id || 1;

  // Configurar datas automáticas (últimos 7 dias por padrão)
  const getDefaultDates = () => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    return {
      from: sevenDaysAgo.toISOString().split('T')[0],
      to: today.toISOString().split('T')[0]
    };
  };
  
  const defaultDates = getDefaultDates();
  const [dateFrom, setDateFrom] = useState(defaultDates.from);
  const [dateTo, setDateTo] = useState(defaultDates.to);

  const { 
    entries: financialEntries = [], 
    isLoading, 
    createEntry: createFinancialEntry, 
    updateEntry: updateFinancialEntry, 
    deleteEntry: deleteFinancialEntry
  } = useFinancial(dateFrom, dateTo);

  const {
    moneyTransfers = [],
    isLoading: isTransfersLoading,
    createMoneyTransfer,
    updateMoneyTransfer,
    isCreating: isCreatingTransfer,
    isUpdating: isUpdatingTransfer
  } = useMoneyTransfers();

  const { branches = [] } = useBranches();

  // Função auxiliar para obter nome da filial
  const getBranchName = (branchId: number) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name : `Filial ${branchId}`;
  };

  const [activeTab, setActiveTab] = useState('entradas');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<FinancialEntry | null>(null);
  const [selectedTransfer, setSelectedTransfer] = useState<MoneyTransfer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [transferSearchTerm, setTransferSearchTerm] = useState('');
  const [transferStatusFilter, setTransferStatusFilter] = useState<string>('all');
  const [currentEntryType, setCurrentEntryType] = useState<'income' | 'expense'>('income');

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    dueDate: '',
    isBoleto: false,
    boletoCode: '',
    isInstallment: false,
    installmentCount: '',
    currentInstallment: ''
  });

  const [paymentData, setPaymentData] = useState({
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    paymentProof: ''
  });

  const [transferData, setTransferData] = useState({
    fromBranchId: '',
    toBranchId: '',
    amount: '',
    description: '',
    transferType: 'operational' as const,
    notes: ''
  });

  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      dueDate: '',
      isBoleto: false,
      boletoCode: '',
      isInstallment: false,
      installmentCount: '',
      currentInstallment: ''
    });
  };

  const filteredEntries = financialEntries.filter((entry: any) => {
    const matchesTab = activeTab === 'entradas' ? entry.type === 'income' : entry.type === 'expense';
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    return matchesTab && matchesSearch && matchesStatus;
  });

  const filteredTransfers = moneyTransfers.filter((transfer: any) => {
    const matchesSearch = transfer.description?.toLowerCase().includes(transferSearchTerm.toLowerCase()) ||
                         getBranchName(transfer.fromBranchId).toLowerCase().includes(transferSearchTerm.toLowerCase()) ||
                         getBranchName(transfer.toBranchId).toLowerCase().includes(transferSearchTerm.toLowerCase());
    const matchesStatus = transferStatusFilter === 'all' || transfer.status === transferStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateEntry = async () => {
    try {
      const entryData: NewFinancialEntry = {
        userId,
        businessCategory: selectedCategory,
        type: currentEntryType,
        amount: parseFloat(formData.amount),
        description: formData.description,
        dueDate: formData.dueDate,
        isBoleto: formData.isBoleto,
        boletoCode: formData.isBoleto ? formData.boletoCode : undefined,
        isInstallment: formData.isInstallment,
        installmentCount: formData.isInstallment ? parseInt(formData.installmentCount) : undefined,
        currentInstallment: formData.isInstallment ? parseInt(formData.currentInstallment) : undefined
      };

      await createFinancialEntry(entryData);
      
      showAlert({
        title: "Sucesso",
        description: `${currentEntryType === 'income' ? 'Entrada' : 'Saída'} financeira criada com sucesso`,
        variant: "success"
      });
      
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error) {
      showAlert({
        title: "Erro",
        description: `Erro ao criar ${currentEntryType === 'income' ? 'entrada' : 'saída'} financeira`,
        variant: "destructive"
      });
    }
  };

  const handlePayEntry = async () => {
    if (!selectedEntry) return;

    try {
      await updateFinancialEntry({
        id: selectedEntry.id,
        entry: {
          status: 'paid',
          paymentDate: new Date(paymentData.paymentDate),
          paymentMethod: paymentData.paymentMethod
        }
      });

      showAlert({
        title: "Sucesso",
        description: "Pagamento registrado com sucesso",
        variant: "success"
      });

      setIsPayModalOpen(false);
      setSelectedEntry(null);
    } catch (error) {
      showAlert({
        title: "Erro",
        description: "Erro ao registrar pagamento",
        variant: "destructive"
      });
    }
  };

  const handleRevertPayment = async (entryId: number) => {
    try {
      await updateFinancialEntry({
        id: entryId,
        entry: {
          status: 'pending',
          paymentDate: undefined,
          paymentMethod: undefined
        }
      });
      
      showAlert({
        title: "Sucesso",
        description: "Pagamento revertido com sucesso",
        variant: "success"
      });
    } catch (error) {
      showAlert({
        title: "Erro",
        description: "Erro ao reverter pagamento",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEntry = async (entryId: number) => {
    try {
      await deleteFinancialEntry(entryId);
      
      showAlert({
        title: "Sucesso",
        description: "Registro excluído com sucesso",
        variant: "success"
      });
    } catch (error) {
      showAlert({
        title: "Erro",
        description: "Erro ao excluir registro",
        variant: "destructive"
      });
    }
  };

  // Funções para transferências monetárias
  const handleCreateTransfer = async () => {
    try {
      const transferFormData: NewMoneyTransfer = {
        fromBranchId: parseInt(transferData.fromBranchId),
        toBranchId: parseInt(transferData.toBranchId),
        amount: parseFloat(transferData.amount),
        description: transferData.description,
        transferType: transferData.transferType,
        notes: transferData.notes
      };

      await createMoneyTransfer(transferFormData);
      
      showAlert({
        title: "Sucesso",
        description: "Transferência criada com sucesso",
        variant: "success"
      });
      
      setIsTransferModalOpen(false);
      setTransferData({
        fromBranchId: '',
        toBranchId: '',
        amount: '',
        description: '',
        transferType: 'operational',
        notes: ''
      });
    } catch (error) {
      showAlert({
        title: "Erro",
        description: "Erro ao criar transferência",
        variant: "destructive"
      });
    }
  };

  const handleUpdateTransferStatus = async (transferId: number, newStatus: string) => {
    try {
      await updateMoneyTransfer({
        id: transferId,
        transfer: { status: newStatus }
      });
      
      showAlert({
        title: "Sucesso",
        description: `Transferência ${newStatus === 'approved' ? 'aprovada' : newStatus === 'completed' ? 'concluída' : 'rejeitada'} com sucesso`,
        variant: "success"
      });
    } catch (error) {
      showAlert({
        title: "Erro",
        description: "Erro ao atualizar transferência",
        variant: "destructive"
      });
    }
  };

  const getTransferStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'approved': return 'Aprovada';
      case 'completed': return 'Concluída';
      case 'rejected': return 'Rejeitada';
      default: return 'Pendente';
    }
  };



  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'near_due': return 'Próximo ao vencimento';
      case 'overdue': return 'Vencido';
      case 'paid': return 'Pago';
      default: return 'Pendente';
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      paid: { color: 'bg-green-100 text-green-800', label: 'Pago' },
      pending: { color: 'bg-gray-100 text-gray-800', label: 'Pendente' },
      near_due: { color: 'bg-yellow-100 text-yellow-800', label: 'Próximo ao vencimento' },
      overdue: { color: 'bg-red-100 text-red-800', label: 'Vencido' }
    };

    const { color, label } = config[status as keyof typeof config] || config.pending;
    
    return (
      <Badge className={color}>
        {label}
      </Badge>
    );
  };

  if (isLoading && financialEntries.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <CreditCard className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Carregando dados financeiros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-section">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title">Gestão Financeira</h1>
          <p className="section-subtitle">Controle de entradas e saídas financeiras</p>
        </div>

      </div>



      {/* Métricas Financeiras */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receita Total</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {isLoading ? '...' : `R$ ${financialEntries.filter(e => e.type === 'income').reduce((total, entry) => total + Number(entry.amount || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              </p>
              <p className="text-xs text-green-600 mt-1">Período selecionado</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Despesas Total</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {isLoading ? '...' : `R$ ${financialEntries.filter(e => e.type === 'expense').reduce((total, entry) => total + Number(entry.amount || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              </p>
              <p className="text-xs text-red-600 mt-1">Período selecionado</p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saldo Atual</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {isLoading ? '...' : (() => {
                  const receitas = financialEntries.filter(e => e.type === 'income').reduce((total, entry) => total + Number(entry.amount || 0), 0);
                  const despesas = financialEntries.filter(e => e.type === 'expense').reduce((total, entry) => total + Number(entry.amount || 0), 0);
                  const saldo = receitas - despesas;
                  return `R$ ${saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
                })()}
              </p>
              <p className="text-xs text-blue-600 mt-1">Entradas - Saídas</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendências</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {isLoading ? '...' : financialEntries.filter(e => e.type === 'expense' && (e.status === 'pending' || e.status === 'near_due' || e.status === 'overdue')).length}
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                {financialEntries.filter(e => e.type === 'expense' && e.status === 'overdue').length > 0 ? 'Tem vencidas' : 'Em dia'}
              </p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Navegação das abas */}
      <div className="tab-navigation">
        <button
          onClick={() => setActiveTab('entradas')}
          className={`tab-button ${activeTab === 'entradas' ? 'active' : ''}`}
        >
          <TrendingUp className="w-4 h-4" />
          Entradas
        </button>
        <button
          onClick={() => setActiveTab('saidas')}
          className={`tab-button ${activeTab === 'saidas' ? 'active' : ''}`}
        >
          <TrendingDown className="w-4 h-4" />
          Saídas
        </button>
        <button
          onClick={() => setActiveTab('transferencias')}
          className={`tab-button ${activeTab === 'transferencias' ? 'active' : ''}`}
        >
          <ArrowLeftRight className="w-4 h-4" />
          Transferências
        </button>
      </div>

      {/* Conteúdo das abas */}
      <div className="animate-fade-in">
        <div className="main-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {activeTab === 'transferencias' ? 'Transferências de Dinheiro' : 
                 activeTab === 'entradas' ? 'Gestão de Entradas' : 'Gestão de Saídas'}
              </h3>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => {
                if (activeTab === 'transferencias') {
                  setIsTransferModalOpen(true);
                } else {
                  resetForm();
                  setCurrentEntryType(activeTab === 'entradas' ? 'income' : 'expense');
                  setSelectedEntry(null);
                  setIsCreateModalOpen(true);
                }
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              {activeTab === 'transferencias' ? 'Nova Transferência' :
               activeTab === 'entradas' ? 'Nova Entrada' : 'Nova Saída'}
            </button>
          </div>
          
          {/* Filtros e Busca */}
          {activeTab !== 'transferencias' && (
            <div className="bg-white rounded-lg p-4 mb-6">
              <div className="flex items-center gap-4 flex-wrap">
                {/* Campo de busca */}
                <div className="flex-1 min-w-[200px] relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none z-10" />
                  <input
                    type="text"
                    placeholder={`Buscar ${activeTab === 'entradas' ? 'entradas' : 'saídas'}...`}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Filtro de Status */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos os status</option>
                  <option value="pending">Pendente</option>
                  <option value="near_due">Próximo ao vencimento</option>
                  <option value="overdue">Vencido</option>
                  <option value="paid">Pago</option>
                </select>

                {/* Filtros de Data */}
                <div className="flex items-center space-x-2 border-l pl-4">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <div className="flex items-center space-x-1">
                    <Label htmlFor="dateFrom" className="text-xs font-medium text-gray-700">De:</Label>
                    <Input
                      id="dateFrom"
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-32 h-8 text-xs"
                    />
                  </div>
                  <div className="flex items-center space-x-1">
                    <Label htmlFor="dateTo" className="text-xs font-medium text-gray-700">Até:</Label>
                    <Input
                      id="dateTo"
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-32 h-8 text-xs"
                    />
                  </div>
                </div>

                {/* Botões de período rápido */}
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date();
                      const sevenDaysAgo = new Date();
                      sevenDaysAgo.setDate(today.getDate() - 7);
                      setDateFrom(sevenDaysAgo.toISOString().split('T')[0]);
                      setDateTo(today.toISOString().split('T')[0]);
                    }}
                    className="text-xs h-7 px-2"
                  >
                    7d
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date();
                      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                      setDateFrom(firstDayOfMonth.toISOString().split('T')[0]);
                      setDateTo(today.toISOString().split('T')[0]);
                    }}
                    className="text-xs h-7 px-2"
                  >
                    Mês
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date();
                      const thirtyDaysAgo = new Date();
                      thirtyDaysAgo.setDate(today.getDate() - 30);
                      setDateFrom(thirtyDaysAgo.toISOString().split('T')[0]);
                      setDateTo(today.toISOString().split('T')[0]);
                    }}
                    className="text-xs h-7 px-2"
                  >
                    30d
                  </Button>
                </div>

                {/* Botão de limpar filtros */}
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    const today = new Date();
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(today.getDate() - 7);
                    setDateFrom(sevenDaysAgo.toISOString().split('T')[0]);
                    setDateTo(today.toISOString().split('T')[0]);
                  }}
                  className="btn btn-outline text-xs h-8 px-3"
                >
                  <X className="w-3 h-3 mr-1" />
                  Limpar
                </button>
              </div>
            </div>
          )}

          {/* Lista de Entradas Financeiras */}
          {activeTab === 'transferencias' ? (
            <div>
              {/* Filtros para Transferências */}
              <div className="bg-white rounded-lg p-4 mb-6">
                <div className="flex items-center gap-4 flex-wrap">
                  {/* Campo de busca */}
                  <div className="flex-1 min-w-[200px] relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none z-10" />
                    <input
                      type="text"
                      placeholder="Buscar transferências, filiais..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={transferSearchTerm}
                      onChange={(e) => setTransferSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Filtro de Status */}
                  <select
                    value={transferStatusFilter}
                    onChange={(e) => setTransferStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">Todos os status</option>
                    <option value="pending">Pendente</option>
                    <option value="approved">Aprovada</option>
                    <option value="completed">Concluída</option>
                    <option value="cancelled">Cancelada</option>
                  </select>

                  {/* Filtros de Data para Transferências */}
                  <div className="flex items-center space-x-2 border-l pl-4">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <div className="flex items-center space-x-1">
                      <Label htmlFor="transferDateFrom" className="text-xs font-medium text-gray-700">De:</Label>
                      <Input
                        id="transferDateFrom"
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-32 h-8 text-xs"
                      />
                    </div>
                    <div className="flex items-center space-x-1">
                      <Label htmlFor="transferDateTo" className="text-xs font-medium text-gray-700">Até:</Label>
                      <Input
                        id="transferDateTo"
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-32 h-8 text-xs"
                      />
                    </div>
                  </div>

                  {/* Botões de período rápido */}
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const today = new Date();
                        const sevenDaysAgo = new Date();
                        sevenDaysAgo.setDate(today.getDate() - 7);
                        setDateFrom(sevenDaysAgo.toISOString().split('T')[0]);
                        setDateTo(today.toISOString().split('T')[0]);
                      }}
                      className="text-xs h-7 px-2"
                    >
                      7d
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const today = new Date();
                        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                        setDateFrom(firstDayOfMonth.toISOString().split('T')[0]);
                        setDateTo(today.toISOString().split('T')[0]);
                      }}
                      className="text-xs h-7 px-2"
                    >
                      Mês
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const today = new Date();
                        const thirtyDaysAgo = new Date();
                        thirtyDaysAgo.setDate(today.getDate() - 30);
                        setDateFrom(thirtyDaysAgo.toISOString().split('T')[0]);
                        setDateTo(today.toISOString().split('T')[0]);
                      }}
                      className="text-xs h-7 px-2"
                    >
                      30d
                    </Button>
                  </div>

                  {/* Botão de limpar filtros */}
                  <button
                    onClick={() => {
                      setTransferSearchTerm('');
                      setTransferStatusFilter('all');
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap"
                  >
                    Limpar Filtros
                  </button>
                </div>
              </div>

              {/* Conteúdo da aba Transferências */}
              {isTransfersLoading && filteredTransfers.length === 0 ? (
                <div className="text-center py-8">
                  <ArrowLeftRight className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Carregando transferências...</p>
                </div>
              ) : filteredTransfers.length === 0 ? (
                <div className="text-center py-8">
                  <ArrowLeftRight className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {transferSearchTerm || transferStatusFilter !== 'all' 
                      ? 'Nenhuma transferência encontrada com os filtros aplicados' 
                      : 'Nenhuma transferência encontrada'
                    }
                  </p>
                </div>
              ) : (
                <div className="standard-list-container">
                  <div className="standard-list-content">
                    {filteredTransfers.map((transfer: MoneyTransfer) => (
                    <div key={transfer.id} className="standard-list-item group">
                      <div className="list-item-main">
                        <div className="list-item-title">{transfer.description}</div>
                        <div className="list-item-subtitle">
                          De: {getBranchName(transfer.fromBranchId)} → Para: {getBranchName(transfer.toBranchId)}
                        </div>
                        <div className="list-item-meta flex items-center gap-2">
                          <span className={`list-status-badge ${
                            transfer.status === 'completed' ? 'status-success' : 
                            transfer.status === 'approved' ? 'status-info' : 
                            transfer.status === 'pending' ? 'status-warning' :
                            'status-danger'
                          }`}>
                            {getTransferStatusLabel(transfer.status)}
                          </span>
                          <span className="list-status-badge status-info">
                            {transfer.transferType === 'operational' ? 'Operacional' :
                             transfer.transferType === 'investment' ? 'Investimento' :
                             transfer.transferType === 'emergency' ? 'Emergência' : 'Reembolso'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            R$ {Number(transfer.amount || 0).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(transfer.transferDate).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        
                        <div className="list-item-actions">
                          {transfer.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateTransferStatus(transfer.id, 'approved')}
                                className="list-action-button edit"
                                title="Aprovar transferência"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleUpdateTransferStatus(transfer.id, 'rejected')}
                                className="list-action-button delete"
                                title="Rejeitar transferência"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {transfer.status === 'approved' && (
                            <button
                              onClick={() => handleUpdateTransferStatus(transfer.id, 'completed')}
                              className="list-action-button view"
                              title="Marcar como concluída"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <CreditCard className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Carregando dados financeiros...</p>
              </div>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum registro encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                {activeTab === 'entradas' ? 'Não há entradas' : 'Não há saídas'} cadastradas ainda.
              </p>
            </div>
          ) : (
            <div className="standard-list-container">
              <div className="standard-list-content">
                {filteredEntries.map((entry) => (
                  <div key={entry.id} className="standard-list-item group">
                    <div className="list-item-main">
                      <div className="list-item-title">{entry.description}</div>
                      <div className="list-item-subtitle">
                        Vencimento: {entry.dueDate ? new Date(entry.dueDate).toLocaleDateString('pt-BR') : 'Data não informada'}
                      </div>
                      <div className="list-item-meta flex items-center gap-2">
                        <span className={`list-status-badge ${
                          entry.status === 'paid' ? 'status-success' : 
                          entry.status === 'pending' ? 'status-warning' : 
                          entry.status === 'near_due' ? 'status-warning' :
                          entry.status === 'overdue' ? 'status-danger' :
                          'status-warning'
                        }`}>
                          {getStatusLabel(entry.status)}
                        </span>

                        {entry.isInstallment && (
                          <span className="list-status-badge status-info">
                            {entry.currentInstallment}/{entry.installmentCount}
                          </span>
                        )}

                        {entry.isBoleto && (
                          <span className="list-status-badge status-info">
                            Boleto
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          R$ {Number(entry.amount || 0).toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="list-item-actions">
                        <button
                          onClick={() => {
                            // Simular visualização de comprovante
                            if (entry.paymentProof) {
                              window.open(entry.paymentProof, '_blank');
                            } else {
                              showAlert({
                                title: "Comprovante",
                                description: "Nenhum comprovante anexado para este registro",
                                variant: "warning"
                              });
                            }
                          }}
                          className="list-action-button view"
                          title="Visualizar comprovante"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {entry.status !== 'paid' && (
                          <button
                            onClick={() => {
                              setSelectedEntry(entry);
                              setIsPayModalOpen(true);
                            }}
                            className="list-action-button edit"
                            title="Marcar como pago"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        {entry.status === 'paid' && entry.type === 'expense' && (
                          <button
                            onClick={() => handleRevertPayment(entry.id)}
                            className="list-action-button transfer"
                            title="Reverter pagamento"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}

                        {entry.type === 'expense' && (
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="list-action-button delete"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Criação - Padrão do Estoque */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {currentEntryType === 'income' ? 'Nova Entrada Financeira' : 'Nova Saída Financeira'}
              </h3>
              <button 
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreateEntry();
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
                  <input
                    type="text"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Digite a descrição"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="0,00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento *</label>
                    <input
                      type="date"
                      required
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center space-x-2 mb-3">
                    <input
                      id="isBoleto"
                      type="checkbox"
                      checked={formData.isBoleto}
                      onChange={(e) => setFormData({ ...formData, isBoleto: e.target.checked })}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isBoleto" className="text-sm font-medium text-gray-700">
                      É um boleto
                    </label>
                  </div>
                  
                  {formData.isBoleto && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Código do Boleto</label>
                      <input
                        type="text"
                        value={formData.boletoCode}
                        onChange={(e) => setFormData({ ...formData, boletoCode: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Código de barras do boleto"
                      />
                    </div>
                  )}
                </div>
                
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center space-x-2 mb-3">
                    <input
                      id="isInstallment"
                      type="checkbox"
                      checked={formData.isInstallment}
                      onChange={(e) => setFormData({ ...formData, isInstallment: e.target.checked })}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isInstallment" className="text-sm font-medium text-gray-700">
                      É parcelado
                    </label>
                  </div>
                  
                  {formData.isInstallment && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Parcela Atual</label>
                        <input
                          type="number"
                          value={formData.currentInstallment}
                          onChange={(e) => setFormData({ ...formData, currentInstallment: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total de Parcelas</label>
                        <input
                          type="number"
                          value={formData.installmentCount}
                          onChange={(e) => setFormData({ ...formData, installmentCount: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="12"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.description || !formData.amount || !formData.dueDate}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentEntryType === 'income' ? 'Criar Entrada' : 'Criar Saída'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Pagamento - Padrão do Estoque */}
      {isPayModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Registrar Pagamento</h3>
              <button 
                onClick={() => {
                  setIsPayModalOpen(false);
                  setSelectedEntry(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              handlePayEntry();
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data do Pagamento *</label>
                  <input
                    type="date"
                    required
                    value={paymentData.paymentDate}
                    onChange={(e) => setPaymentData({ ...paymentData, paymentDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pagamento *</label>
                  <select
                    required
                    value={paymentData.paymentMethod}
                    onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Selecione o método</option>
                    <option value="dinheiro">Dinheiro</option>
                    <option value="cartao">Cartão</option>
                    <option value="pix">PIX</option>
                    <option value="transferencia">Transferência</option>
                    <option value="boleto">Boleto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comprovante (URL)</label>
                  <input
                    type="url"
                    value={paymentData.paymentProof}
                    onChange={(e) => setPaymentData({ ...paymentData, paymentProof: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://exemplo.com/comprovante.pdf"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPayModalOpen(false);
                      setSelectedEntry(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!paymentData.paymentDate || !paymentData.paymentMethod}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirmar Pagamento
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Transferências Monetárias - Padrão do Estoque */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Nova Transferência de Dinheiro</h3>
              <button 
                onClick={() => setIsTransferModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreateTransfer();
            }}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filial de Origem *</label>
                    <select
                      required
                      value={transferData.fromBranchId}
                      onChange={(e) => setTransferData({ ...transferData, fromBranchId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Selecione origem</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filial de Destino *</label>
                    <select
                      required
                      value={transferData.toBranchId}
                      onChange={(e) => setTransferData({ ...transferData, toBranchId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Selecione destino</option>
                      {branches.filter(branch => branch.id.toString() !== transferData.fromBranchId).map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor da Transferência (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={transferData.amount}
                    onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0,00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
                  <input
                    type="text"
                    required
                    value={transferData.description}
                    onChange={(e) => setTransferData({ ...transferData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Motivo da transferência"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Transferência *</label>
                  <select
                    required
                    value={transferData.transferType}
                    onChange={(e) => setTransferData({ ...transferData, transferType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="operational">Operacional</option>
                    <option value="investment">Investimento</option>
                    <option value="emergency">Emergência</option>
                    <option value="reimbursement">Reembolso</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                  <textarea
                    value={transferData.notes}
                    onChange={(e) => setTransferData({ ...transferData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Observações adicionais (opcional)"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsTransferModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!transferData.fromBranchId || !transferData.toBranchId || !transferData.amount || !transferData.description || isCreatingTransfer}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreatingTransfer ? 'Criando...' : 'Criar Transferência'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Alerta customizado */}
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

export default FinanceiroSection;