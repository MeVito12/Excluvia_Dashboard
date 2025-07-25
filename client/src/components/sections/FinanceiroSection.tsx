import { useState } from 'react';
import { useCategory } from '@/contexts/CategoryContext';
import { useAuth } from '@/contexts/AuthContext';
import { useFinancial } from '@/hooks/useFinancial';
import { useCustomAlert } from '@/hooks/use-custom-alert';
import { CustomAlert } from '@/components/ui/custom-alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Calendar
} from 'lucide-react';
import { FinancialEntry, NewFinancialEntry } from '@shared/schema';

const FinanceiroSection = () => {
  const { selectedCategory } = useCategory();
  const { user } = useAuth();
  const { showAlert, isOpen, alertData, closeAlert } = useCustomAlert();
  const userId = (user as any)?.id || 1;

  const { 
    financialEntries, 
    isLoading, 
    createFinancialEntry, 
    updateFinancialEntry, 
    deleteFinancialEntry,
    payFinancialEntry,
    revertFinancialEntry 
  } = useFinancial(userId, selectedCategory);

  const [activeTab, setActiveTab] = useState('entradas');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<FinancialEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Estados do formulário
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    description: '',
    dueDate: '',
    isBoleto: false,
    boletoCode: '',
    isInstallment: false,
    installmentCount: '',
    currentInstallment: '1'
  });

  const [paymentProof, setPaymentProof] = useState('');

  // Calcular resumo financeiro
  const summary = {
    totalIncome: financialEntries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0),
    totalExpense: financialEntries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0),
    pendingExpenses: financialEntries.filter(e => e.type === 'expense' && e.status !== 'paid').reduce((sum, e) => sum + e.amount, 0),
    overdueCount: financialEntries.filter(e => e.status === 'overdue').length,
    nearDueCount: financialEntries.filter(e => e.status === 'near_due').length
  };

  // Filtrar entradas baseado na aba ativa
  const entriesByTab = financialEntries.filter(entry => {
    if (activeTab === 'entradas') return entry.type === 'income';
    if (activeTab === 'saidas') return entry.type === 'expense';
    return true;
  });

  // Aplicar filtros adicionais
  const filteredEntries = entriesByTab.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateEntry = async () => {
    try {
      const entryType = activeTab === 'entradas' ? 'income' : 'expense';
      const entryData: NewFinancialEntry = {
        userId,
        businessCategory: selectedCategory,
        type: entryType,
        amount: parseFloat(formData.amount),
        description: formData.description,
        dueDate: new Date(formData.dueDate),
        isBoleto: formData.isBoleto,
        boletoCode: formData.isBoleto ? formData.boletoCode : undefined,
        isInstallment: formData.isInstallment,
        installmentCount: formData.isInstallment ? parseInt(formData.installmentCount) : undefined,
        currentInstallment: formData.isInstallment ? parseInt(formData.currentInstallment) : undefined
      };

      await createFinancialEntry.mutateAsync(entryData);
      
      showAlert({
        title: "Sucesso",
        description: `${activeTab === 'entradas' ? 'Entrada' : 'Saída'} financeira criada com sucesso`,
        variant: "success"
      });
      
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error) {
      showAlert({
        title: "Erro",
        description: `Erro ao criar ${activeTab === 'entradas' ? 'entrada' : 'saída'} financeira`,
        variant: "destructive"
      });
    }
  };

  const handlePayEntry = async () => {
    if (!selectedEntry || !paymentProof.trim()) return;

    try {
      await payFinancialEntry.mutateAsync({
        id: selectedEntry.id,
        paymentProof: paymentProof.trim()
      });
      
      showAlert({
        title: "Sucesso",
        description: "Pagamento registrado com sucesso",
        variant: "success"
      });
      
      setIsPayModalOpen(false);
      setPaymentProof('');
      setSelectedEntry(null);
    } catch (error) {
      showAlert({
        title: "Erro",
        description: "Erro ao registrar pagamento",
        variant: "destructive"
      });
    }
  };

  const handleRevertEntry = async (entry: FinancialEntry) => {
    try {
      await revertFinancialEntry.mutateAsync(entry.id);
      
      showAlert({
        title: "Sucesso",
        description: "Status revertido com sucesso",
        variant: "success"
      });
    } catch (error) {
      showAlert({
        title: "Erro",
        description: "Erro ao reverter status",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEntry = async (entry: FinancialEntry) => {
    if (!confirm('Tem certeza que deseja excluir esta entrada?')) return;

    try {
      await deleteFinancialEntry.mutateAsync(entry.id);
      
      showAlert({
        title: "Sucesso",
        description: "Entrada excluída com sucesso",
        variant: "success"
      });
    } catch (error) {
      showAlert({
        title: "Erro",
        description: "Erro ao excluir entrada",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'expense',
      amount: '',
      description: '',
      dueDate: '',
      isBoleto: false,
      boletoCode: '',
      isInstallment: false,
      installmentCount: '',
      currentInstallment: '1'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Pago</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Vencido</Badge>;
      case 'near_due':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3 mr-1" />Próximo ao vencimento</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800"><Calendar className="w-3 h-3 mr-1" />Pendente</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="app-section">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Carregando dados financeiros...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-section">
      {/* Header */}
      <div className="section-header">
        <h1 className="section-title">Financeiro</h1>
        <p className="section-subtitle">Controle de entradas e saídas financeiras</p>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              {activeTab === 'entradas' ? 'Nova Entrada' : 'Nova Saída'}
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Navegação por Abas */}
      <div className="main-card p-1 mb-6">
        <div className="tab-navigation">
          <button
            onClick={() => setActiveTab('entradas')}
            className={`tab-button ${activeTab === 'entradas' ? 'tab-button-active' : ''}`}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Entradas
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              {financialEntries.filter(e => e.type === 'income').length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('saidas')}
            className={`tab-button ${activeTab === 'saidas' ? 'tab-button-active' : ''}`}
          >
            <TrendingDown className="w-4 h-4 mr-2" />
            Saídas
            <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
              {financialEntries.filter(e => e.type === 'expense').length}
            </span>
          </button>
        </div>
      </div>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <div className="metric-card-standard">
          <div className="flex items-center justify-between">
            <div className="metric-card-content">
              <p className="metric-card-label">Total Entradas</p>
              <p className="metric-card-value text-green-600">R$ {summary.totalIncome.toFixed(2)}</p>
              <p className="metric-card-description text-green-600">Vendas realizadas</p>
            </div>
            <div className="metric-card-icon bg-green-100">
              <TrendingUp className="h-4 w-4 md:h-6 md:w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="metric-card-standard">
          <div className="flex items-center justify-between">
            <div className="metric-card-content">
              <p className="metric-card-label">Total Saídas</p>
              <p className="metric-card-value text-red-600">R$ {summary.totalExpense.toFixed(2)}</p>
              <p className="metric-card-description text-red-600">Despesas registradas</p>
            </div>
            <div className="metric-card-icon bg-red-100">
              <TrendingDown className="h-4 w-4 md:h-6 md:w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="metric-card-standard">
          <div className="flex items-center justify-between">
            <div className="metric-card-content">
              <p className="metric-card-label">Saldo</p>
              <p className={`metric-card-value ${summary.totalIncome - summary.totalExpense >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {(summary.totalIncome - summary.totalExpense).toFixed(2)}
              </p>
              <p className="metric-card-description text-gray-600">Diferença atual</p>
            </div>
            <div className="metric-card-icon bg-blue-100">
              <CreditCard className="h-4 w-4 md:h-6 md:w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="metric-card-standard">
          <div className="flex items-center justify-between">
            <div className="metric-card-content">
              <p className="metric-card-label">Contas Vencidas</p>
              <p className="metric-card-value text-red-600">{summary.overdueCount}</p>
              <p className="metric-card-description text-red-600">Requer atenção</p>
            </div>
            <div className="metric-card-icon bg-red-100">
              <XCircle className="h-4 w-4 md:h-6 md:w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="metric-card-standard">
          <div className="flex items-center justify-between">
            <div className="metric-card-content">
              <p className="metric-card-label">Próximo Vencimento</p>
              <p className="metric-card-value text-yellow-600">{summary.nearDueCount}</p>
              <p className="metric-card-description text-yellow-600">Próximos 7 dias</p>
            </div>
            <div className="metric-card-icon bg-yellow-100">
              <AlertTriangle className="h-4 w-4 md:h-6 md:w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="main-card p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1">
            <Input
              placeholder={`Buscar ${activeTab === 'entradas' ? 'entradas' : 'saídas'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md"
          >
            <option value="all">Todos os status</option>
            <option value="pending">Pendente</option>
            <option value="near_due">Próximo ao vencimento</option>
            <option value="overdue">Vencido</option>
            <option value="paid">Pago</option>
          </select>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
          >
            Limpar Filtros
          </Button>
        </div>
      </div>

      {/* Lista de Entradas Financeiras */}
      <div className="space-y-4">
        {filteredEntries.map((entry) => (
          <Card key={entry.id} className="main-card">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      entry.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {entry.type === 'income' ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{entry.description}</h3>
                      <p className="text-sm text-gray-600">
                        {entry.type === 'income' ? 'Entrada' : 'Saída'} • 
                        Vencimento: {new Date(entry.dueDate).toLocaleDateString()}
                        {entry.isInstallment && ` • Parcela ${entry.currentInstallment}/${entry.installmentCount}`}
                        {entry.isBoleto && ' • Boleto'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-lg font-bold ${
                      entry.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      R$ {entry.amount.toFixed(2)}
                    </span>
                    {getStatusBadge(entry.status)}
                    {entry.isAutoGenerated && (
                      <Badge variant="outline" className="text-xs">
                        Automático
                      </Badge>
                    )}
                  </div>

                  {entry.boletoCode && (
                    <p className="text-xs text-gray-500 font-mono">
                      Código: {entry.boletoCode}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {entry.status === 'overdue' && (
                    <Button
                      onClick={() => {
                        setSelectedEntry(entry);
                        setIsPayModalOpen(true);
                      }}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                      size="sm"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Pagar
                    </Button>
                  )}

                  {entry.status === 'paid' && entry.paymentProof && (
                    <>
                      <Button
                        onClick={() => window.open(entry.paymentProof, '_blank')}
                        variant="outline"
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver Comprovante
                      </Button>
                      <Button
                        onClick={() => handleRevertEntry(entry)}
                        variant="outline"
                        size="sm"
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Reverter
                      </Button>
                    </>
                  )}

                  {!entry.isAutoGenerated && (
                    <>
                      <Button
                        onClick={() => {
                          setSelectedEntry(entry);
                          setIsEditModalOpen(true);
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        onClick={() => handleDeleteEntry(entry)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Excluir
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredEntries.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhuma entrada financeira encontrada.
          </div>
        )}
      </div>

      {/* Modal de Criação */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {activeTab === 'entradas' ? 'Nova Entrada Financeira' : 'Nova Saída Financeira'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ex: Aluguel, Energia elétrica..."
              />
            </div>

            <div>
              <Label htmlFor="amount">Valor</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0,00"
              />
            </div>

            <div>
              <Label htmlFor="dueDate">Data de Vencimento</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isBoleto"
                checked={formData.isBoleto}
                onCheckedChange={(checked) => setFormData({ ...formData, isBoleto: !!checked })}
              />
              <Label htmlFor="isBoleto">É um boleto</Label>
            </div>

            {formData.isBoleto && (
              <div>
                <Label htmlFor="boletoCode">Código do Boleto</Label>
                <Input
                  id="boletoCode"
                  value={formData.boletoCode}
                  onChange={(e) => setFormData({ ...formData, boletoCode: e.target.value })}
                  placeholder="Código de barras do boleto"
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isInstallment"
                checked={formData.isInstallment}
                onCheckedChange={(checked) => setFormData({ ...formData, isInstallment: !!checked })}
              />
              <Label htmlFor="isInstallment">Parcelado</Label>
            </div>

            {formData.isInstallment && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="installmentCount">Total de Parcelas</Label>
                  <Input
                    id="installmentCount"
                    type="number"
                    value={formData.installmentCount}
                    onChange={(e) => setFormData({ ...formData, installmentCount: e.target.value })}
                    placeholder="Ex: 12"
                  />
                </div>
                <div>
                  <Label htmlFor="currentInstallment">Parcela Atual</Label>
                  <Input
                    id="currentInstallment"
                    type="number"
                    value={formData.currentInstallment}
                    onChange={(e) => setFormData({ ...formData, currentInstallment: e.target.value })}
                    placeholder="Ex: 1"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleCreateEntry}
                disabled={!formData.description || !formData.amount || !formData.dueDate}
                className="flex-1"
              >
                {activeTab === 'entradas' ? 'Criar Entrada' : 'Criar Saída'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Pagamento */}
      <Dialog open={isPayModalOpen} onOpenChange={setIsPayModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Pagamento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Conta: {selectedEntry?.description}
              </p>
              <p className="text-lg font-semibold">
                Valor: R$ {selectedEntry?.amount.toFixed(2)}
              </p>
            </div>

            <div>
              <Label htmlFor="paymentProof">Comprovante de Pagamento</Label>
              <Textarea
                id="paymentProof"
                value={paymentProof}
                onChange={(e) => setPaymentProof(e.target.value)}
                placeholder="Cole aqui o link do comprovante ou descreva o método de pagamento..."
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                Você pode colar um link para o arquivo ou inserir informações do pagamento
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handlePayEntry}
                disabled={!paymentProof.trim()}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirmar Pagamento
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsPayModalOpen(false);
                  setPaymentProof('');
                  setSelectedEntry(null);
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
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

export default FinanceiroSection;