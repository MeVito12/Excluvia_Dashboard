import { useState } from 'react';
import { useCategory } from '@/contexts/CategoryContext';
import { useAuth } from '@/contexts/AuthContext';
import { useFinancial } from '@/hooks/useFinancial';
import { useCustomAlert } from '@/hooks/use-custom-alert';
import { CustomAlert } from '@/components/ui/custom-alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
  X
} from 'lucide-react';
import { FinancialEntry, NewFinancialEntry } from '@shared/schema';

const FinanceiroSection = () => {
  const { selectedCategory } = useCategory();
  const { user } = useAuth();
  const { showAlert, isOpen, alertData, closeAlert } = useCustomAlert();
  const userId = (user as any)?.id || 1;

  const { 
    entries: financialEntries = [], 
    isLoading, 
    createEntry: createFinancialEntry, 
    updateEntry: updateFinancialEntry, 
    deleteEntry: deleteFinancialEntry
  } = useFinancial();

  const [activeTab, setActiveTab] = useState('entradas');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<FinancialEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
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

  const filteredEntries = financialEntries.filter(entry => {
    const matchesTab = activeTab === 'entradas' ? entry.type === 'income' : entry.type === 'expense';
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    return matchesTab && matchesSearch && matchesStatus;
  });

  const handleCreateEntry = async () => {
    try {
      const entryData: NewFinancialEntry = {
        userId,
        businessCategory: selectedCategory,
        type: currentEntryType,
        amount: parseFloat(formData.amount),
        description: formData.description,
        dueDate: new Date(formData.dueDate),
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
              <p className="text-xs text-green-600 mt-1">Total de entradas</p>
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
              <p className="text-xs text-red-600 mt-1">Total de saídas</p>
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
      </div>

      {/* Conteúdo das abas */}
      <div className="animate-fade-in">
        <div className="main-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Gestão de {activeTab === 'entradas' ? 'Entradas' : 'Saídas'}
              </h3>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => {
                resetForm();
                setCurrentEntryType(activeTab === 'entradas' ? 'income' : 'expense');
                setSelectedEntry(null);
                setIsCreateModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              {activeTab === 'entradas' ? 'Nova Entrada' : 'Nova Saída'}
            </button>
          </div>
          
          {/* Filtros */}
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder={`Buscar ${activeTab === 'entradas' ? 'entradas' : 'saídas'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os status</option>
              <option value="pending">Pendente</option>
              <option value="near_due">Próximo ao vencimento</option>
              <option value="overdue">Vencido</option>
              <option value="paid">Pago</option>
            </select>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="btn btn-outline"
            >
              Limpar Filtros
            </button>
          </div>

          {/* Lista de Entradas Financeiras */}
          {isLoading ? (
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

      {/* Modal de Criação - Personalizado */}
      {isCreateModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsCreateModalOpen(false);
              resetForm();
            }
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {currentEntryType === 'income' ? 'Nova Entrada Financeira' : 'Nova Saída Financeira'}
              </h3>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição *
                </label>
                <input
                  id="description"
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Digite a descrição"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Valor (R$) *
                </label>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0,00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Vencimento *
                </label>
                <input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="isBoleto"
                  type="checkbox"
                  checked={formData.isBoleto}
                  onChange={(e) => setFormData({ ...formData, isBoleto: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isBoleto" className="text-sm text-gray-700">É um boleto</label>
              </div>

              {formData.isBoleto && (
                <div>
                  <label htmlFor="boletoCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Código do Boleto
                  </label>
                  <input
                    id="boletoCode"
                    type="text"
                    value={formData.boletoCode}
                    onChange={(e) => setFormData({ ...formData, boletoCode: e.target.value })}
                    placeholder="Código de barras do boleto"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  id="isInstallment"
                  type="checkbox"
                  checked={formData.isInstallment}
                  onChange={(e) => setFormData({ ...formData, isInstallment: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isInstallment" className="text-sm text-gray-700">É parcelado</label>
              </div>

              {formData.isInstallment && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="currentInstallment" className="block text-sm font-medium text-gray-700 mb-1">
                      Parcela Atual
                    </label>
                    <input
                      id="currentInstallment"
                      type="number"
                      value={formData.currentInstallment}
                      onChange={(e) => setFormData({ ...formData, currentInstallment: e.target.value })}
                      placeholder="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="installmentCount" className="block text-sm font-medium text-gray-700 mb-1">
                      Total de Parcelas
                    </label>
                    <input
                      id="installmentCount"
                      type="number"
                      value={formData.installmentCount}
                      onChange={(e) => setFormData({ ...formData, installmentCount: e.target.value })}
                      placeholder="12"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    resetForm();
                  }}
                  className="btn btn-outline"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateEntry}
                  disabled={!formData.description || !formData.amount || !formData.dueDate}
                  className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentEntryType === 'income' ? 'Criar Entrada' : 'Criar Saída'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pagamento - Personalizado */}
      {isPayModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsPayModalOpen(false);
              setSelectedEntry(null);
            }
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Registrar Pagamento
              </h3>
              <button
                onClick={() => {
                  setIsPayModalOpen(false);
                  setSelectedEntry(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Data do Pagamento *
                </label>
                <input
                  id="paymentDate"
                  type="date"
                  value={paymentData.paymentDate}
                  onChange={(e) => setPaymentData({ ...paymentData, paymentDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                  Método de Pagamento *
                </label>
                <select
                  id="paymentMethod"
                  value={paymentData.paymentMethod}
                  onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="dinheiro">Dinheiro</option>
                  <option value="cartao">Cartão</option>
                  <option value="pix">PIX</option>
                  <option value="transferencia">Transferência</option>
                  <option value="boleto">Boleto</option>
                </select>
              </div>

              <div>
                <label htmlFor="paymentProof" className="block text-sm font-medium text-gray-700 mb-1">
                  Comprovante (URL)
                </label>
                <input
                  id="paymentProof"
                  type="url"
                  value={paymentData.paymentProof}
                  onChange={(e) => setPaymentData({ ...paymentData, paymentProof: e.target.value })}
                  placeholder="https://exemplo.com/comprovante.pdf"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setIsPayModalOpen(false);
                    setSelectedEntry(null);
                  }}
                  className="btn btn-outline"
                >
                  Cancelar
                </button>
                <button
                  onClick={handlePayEntry}
                  disabled={!paymentData.paymentDate || !paymentData.paymentMethod}
                  className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirmar Pagamento
                </button>
              </div>
            </div>
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