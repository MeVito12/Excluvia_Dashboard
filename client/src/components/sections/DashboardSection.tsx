import { useState, useMemo } from 'react';
import { 
  Database, 
  Users, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Bell, 
  AlertTriangle, 
  ShoppingCart,
  Activity,
  Package,
  ExternalLink,
  MessageSquare,
  ArrowRight,

  BarChart3
} from 'lucide-react';
import { useCategory } from '@/contexts/CategoryContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCustomAlert } from '@/hooks/use-custom-alert';
import { CustomAlert } from '@/components/ui/custom-alert';
import { useProducts } from '@/hooks/useProducts';
import { useSales } from '@/hooks/useSales';
import { useClients } from '@/hooks/useClients';
import { useTransfers } from '@/hooks/useTransfers';
import { useAppointments } from '@/hooks/useAppointments';
import { formatDateBR } from '@/utils/dateFormat';

interface DashboardSectionProps {
  onSectionChange?: (section: string) => void;
}

const DashboardSection = ({ onSectionChange }: DashboardSectionProps) => {
  const { selectedCategory } = useCategory();
  const { user } = useAuth();
  const { showAlert, isOpen, alertData, closeAlert } = useCustomAlert();
  
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
  const [dateFrom, setDateFrom] = useState<string>(defaultDates.from);
  const [dateTo, setDateTo] = useState<string>(defaultDates.to);
  const userId = user?.id || 1;

  // Hooks para dados reais da API
  const { products, isLoading: productsLoading } = useProducts();
  const { sales, isLoading: salesLoading } = useSales();
  const { clients, isLoading: clientsLoading } = useClients();
  const { transfers, isLoading: transfersLoading } = useTransfers();
  const { appointments, isLoading: appointmentsLoading } = useAppointments();

  // Gerar atividades baseadas em dados reais
  const activities = useMemo(() => {
    const activitiesList: any[] = [];
    
    // Adicionar vendas como atividades
    sales.forEach((sale: any) => {
      activitiesList.push({
        id: `sale-${sale.id}`,
        action: `Venda realizada: R$ ${Number(sale.total_price || 0).toFixed(2)}`,
        timestamp: sale.sale_date,
        type: 'sale'
      });
    });
    
    // Adicionar agendamentos como atividades
    appointments.forEach((appointment: any) => {
      activitiesList.push({
        id: `appointment-${appointment.id}`,
        action: `Agendamento: ${appointment.title}`,
        timestamp: appointment.appointment_date,
        type: 'appointment'
      });
    });
    
    // Adicionar transferências como atividades
    transfers.forEach((transfer: any) => {
      activitiesList.push({
        id: `transfer-${transfer.id}`,
        action: `Transferência de produto (${transfer.quantity} unidades)`,
        timestamp: transfer.transferDate,
        type: 'transfer'
      });
    });
    
    // Ordenar por data mais recente
    return activitiesList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [sales, appointments, transfers]);

  // Função para filtrar dados por data
  const filterByDateRange = (data: any[], dateField: string) => {
    if (!dateFrom && !dateTo) return data;
    
    return data.filter(item => {
      const itemDate = new Date(item[dateField]);
      const fromDate = dateFrom ? new Date(dateFrom) : new Date('1900-01-01');
      const toDate = dateTo ? new Date(dateTo) : new Date('2100-12-31');
      
      return itemDate >= fromDate && itemDate <= toDate;
    });
  };

  // Dados filtrados por período
  const filteredSales = useMemo(() => filterByDateRange(sales, 'sale_date'), [sales, dateFrom, dateTo]);
  const filteredActivities = useMemo(() => filterByDateRange(activities, 'timestamp'), [activities, dateFrom, dateTo]);
  const filteredTransfers = useMemo(() => filterByDateRange(transfers, 'created_at'), [transfers, dateFrom, dateTo]);
  
  // Compromissos recentes e próximos (últimos 30 dias e próximos 30 dias)
  const upcomingAppointments = useMemo(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    const thirtyDaysAhead = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    thirtyDaysAhead.setDate(today.getDate() + 30);
    
    return appointments
      .filter((appointment: any) => {
        const appointmentDate = new Date(appointment.appointment_date);
        return appointmentDate >= thirtyDaysAgo && appointmentDate <= thirtyDaysAhead;
      })
      .sort((a: any, b: any) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime());
  }, [appointments]);

  // Análise de produtos críticos
  const criticalProducts = useMemo(() => {
    const today = new Date();
    return products.filter((product: any) => {
      // Produtos vencidos
      if (product.expiry_date && new Date(product.expiry_date) < today) return true;
      
      // Produtos próximos ao vencimento (3 dias)
      if (product.expiry_date) {
        const diffTime = new Date(product.expiry_date).getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 3 && diffDays >= 0) return true;
      }
      
      // Produtos sem estoque
      if (product.stock === 0) return true;
      
      // Produtos com estoque baixo
      if (product.stock <= (product.min_stock || 10)) return true;
      
      return false;
    });
  }, [products]);

  // Função de navegação para seções
  const navigateToSection = (sectionName: string) => {
    const sectionMap: { [key: string]: string } = {
      'Gráficos': 'graficos',
      'Atividade': 'atividade', 
      'Agendamentos': 'agendamentos',
      'Estoque': 'estoque',
      'Atendimento': 'atendimento',
      'Financeiro': 'financeiro'
    };
    
    const section = sectionMap[sectionName];
    if (section && onSectionChange) {
      onSectionChange(section);
    }
  };

  // Limpar filtros
  const clearFilters = () => {
    const defaultDates = getDefaultDates();
    setDateFrom(defaultDates.from);
    setDateTo(defaultDates.to);
  };

  return (
    <div className="app-section">
      <div className="section-header">
        <h1 className="section-title">Dashboard</h1>
        <p className="section-subtitle">
          Visão geral completa do seu negócio em tempo real
        </p>
      </div>

      {/* Filtros por Data */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtrar por Período</h3>
        
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Data inicial:</span>
            <input
              type="date"
              className="px-3 py-2 border border-gray-200 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder="dd/mm/aaaa"
            />
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Data final:</span>
            <input
              type="date"
              className="px-3 py-2 border border-gray-200 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="dd/mm/aaaa"
            />
          </div>

          <button 
            onClick={clearFilters}
            className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            Limpar Filtros
          </button>

          <button 
            onClick={() => {
              const period = dateFrom && dateTo ? `${dateFrom} até ${dateTo}` : 'período atual';
              showAlert({
                title: "Filtros Aplicados",
                description: `Dashboard atualizado para o período: ${period}`,
                variant: "success"
              });
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="metrics-grid mb-8">
        <div className="metric-card-standard">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receita Total</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                R$ {filteredSales.reduce((sum, sale) => sum + (Number(sale.total_price) || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-green-600 mt-1">{filteredSales.length} vendas realizadas</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="metric-card-standard">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Produtos Críticos</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{criticalProducts.length}</p>
              <p className="text-xs text-red-600 mt-1">Necessitam atenção</p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="metric-card-standard">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Agendamentos</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{upcomingAppointments.length}</p>
              <p className="text-xs text-blue-600 mt-1">Últimos 30 dias</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="metric-card-standard">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Atividades</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{filteredActivities.length}</p>
              <p className="text-xs text-purple-600 mt-1">Registros de atividade</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Seções Integradas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Vendas do Gráficos */}
        <div className="main-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">Vendas Recentes</h3>
            </div>
            <button
              onClick={() => navigateToSection('Gráficos')}
              className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800"
            >
              Ver mais <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {filteredSales.slice(0, 3).map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">R$ {Number(sale.total_price || 0).toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Qtd: {sale.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{formatDateBR(sale.sale_date)}</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    {sale.payment_method || 'Dinheiro'}
                  </span>
                </div>
              </div>
            ))}
            {filteredSales.length === 0 && (
              <p className="text-gray-500 text-center py-4">Nenhuma venda no período selecionado</p>
            )}
          </div>
        </div>

        {/* Atividades */}
        <div className="main-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-800">Atividades Recentes</h3>
            </div>
            <button
              onClick={() => navigateToSection('Atividade')}
              className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800"
            >
              Ver mais <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {filteredActivities.slice(0, 3).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Activity className="w-4 h-4 text-purple-500 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                  <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
            {filteredActivities.length === 0 && (
              <p className="text-gray-500 text-center py-4">Nenhuma atividade no período selecionado</p>
            )}
          </div>
        </div>

        {/* Agendamentos */}
        <div className="main-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Próximos Compromissos</h3>
            </div>
            <button
              onClick={() => navigateToSection('Agendamentos')}
              className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800"
            >
              Ver mais <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {upcomingAppointments.slice(0, 3).map((appointment: any) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{appointment.title}</p>
                  <p className="text-sm text-gray-600">{appointment.client_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {formatDateBR(appointment.appointment_date)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {appointment.start_time}
                  </p>
                </div>
              </div>
            ))}
            {upcomingAppointments.length === 0 && (
              <p className="text-gray-500 text-center py-4">Nenhum compromisso nos últimos 30 dias</p>
            )}
          </div>
        </div>

        {/* Alertas de Estoque */}
        <div className="main-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-800">Alertas de Estoque</h3>
            </div>
            <button
              onClick={() => navigateToSection('Estoque')}
              className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800"
            >
              Ver mais <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {criticalProducts.slice(0, 3).map((product: any) => {
              const getStatus = () => {
                if (product.expiry_date && new Date(product.expiry_date) < new Date()) return { text: 'Vencido', color: 'red' };
                if (product.expiry_date) {
                  const diffTime = new Date(product.expiry_date).getTime() - new Date().getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  if (diffDays <= 3 && diffDays >= 0) return { text: 'Vence em breve', color: 'yellow' };
                }
                if (product.stock === 0) return { text: 'Sem estoque', color: 'red' };
                if (product.stock <= (product.min_stock || 10)) return { text: 'Estoque baixo', color: 'orange' };
                return { text: 'Normal', color: 'green' };
              };
              
              const status = getStatus();
              
              return (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-600">Estoque: {product.stock}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${{
                      red: 'bg-red-100 text-red-800',
                      yellow: 'bg-yellow-100 text-yellow-800',
                      orange: 'bg-orange-100 text-orange-800',
                      green: 'bg-green-100 text-green-800'
                    }[status.color]}`}>
                      {status.text}
                    </span>
                  </div>
                </div>
              );
            })}
            {criticalProducts.length === 0 && (
              <p className="text-gray-500 text-center py-4">Nenhum produto crítico no momento</p>
            )}
          </div>
        </div>

        {/* Transferências */}
        <div className="main-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <ArrowRight className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-800">Transferências</h3>
            </div>
            <button
              onClick={() => navigateToSection('Estoque')}
              className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800"
            >
              Ver mais <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {filteredTransfers.slice(0, 3).map((transfer) => (
              <div key={transfer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Qtd: {transfer.quantity}</p>
                  <p className="text-sm text-gray-600">{transfer.notes}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {formatDateBR(transfer.created_at)}
                  </p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                    transfer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    transfer.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                    transfer.status === 'received' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {transfer.status === 'pending' ? 'Pendente' :
                     transfer.status === 'sent' ? 'Enviado' :
                     transfer.status === 'received' ? 'Recebido' : 'Devolvido'}
                  </span>
                </div>
              </div>
            ))}
            {filteredTransfers.length === 0 && (
              <p className="text-gray-500 text-center py-4">Nenhuma transferência no período selecionado</p>
            )}
          </div>
        </div>

        {/* Atendimentos WhatsApp */}
        <div className="main-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">Atendimentos Recentes</h3>
            </div>
            <button
              onClick={() => navigateToSection('Atendimento')}
              className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800"
            >
              Ver mais <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {[].slice(0, 3).map((chat: any) => (
              <div key={chat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{chat.name}</p>
                  <p className="text-sm text-gray-600 truncate max-w-xs">{chat.lastMessage}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{chat.time}</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                    chat.status === 'online' ? 'bg-green-100 text-green-800' : 
                    chat.status === 'away' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {chat.status === 'online' ? 'Online' : 
                     chat.status === 'away' ? 'Ausente' : 'Offline'}
                  </span>
                </div>
              </div>
            ))}
            {[].length === 0 && (
              <p className="text-gray-500 text-center py-4">Nenhum atendimento recente</p>
            )}
          </div>
        </div>
      </div>

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

export default DashboardSection;