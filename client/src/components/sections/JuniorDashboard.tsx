import React, { useState } from 'react';
import { Package, Truck, Building2, TrendingUp, AlertTriangle, CheckCircle, Clock, DollarSign, Calendar, BarChart3, Users, Target, PieChart, Zap } from 'lucide-react';
import { getJuniorData } from '@/lib/juniorMockData';
import { NotificationCenter } from '@/components/ui/notification-alert';

interface UnitSummary {
  unit: string;
  totalProducts: number;
  lowStockCount: number;
  totalValue: number;
  lastRestock: string;
  status: 'healthy' | 'warning' | 'critical';
}

const JuniorDashboard = () => {
  const juniorData = getJuniorData();
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'warning' as const,
      title: 'Estoque Crítico - Unidade Norte',
      message: 'Galaxy S24 com apenas 2 unidades em estoque. Reabastecer urgentemente.',
      timestamp: '2025-01-21 14:30'
    },
    {
      id: '2',
      type: 'success' as const,
      title: 'Transferência Concluída',
      message: '5 tablets iPad transferidos do Centro para Norte com sucesso.',
      timestamp: '2025-01-21 13:15'
    },
    {
      id: '3',
      type: 'error' as const,
      title: 'Fornecedor Sem Resposta',
      message: 'Samsung não respondeu solicitação de reposição há 24h. Contatar urgente.',
      timestamp: '2025-01-21 12:00'
    },
    {
      id: '4',
      type: 'info' as const,
      title: 'Relatório Consolidado',
      message: 'Relatório mensal de todas as unidades foi gerado e está disponível.',
      timestamp: '2025-01-21 10:45'
    },
    {
      id: '5',
      type: 'warning' as const,
      title: 'Meta de Vendas - Unidade Oeste',
      message: 'Unidade Oeste está 15% abaixo da meta mensal. Revisar estratégia.',
      timestamp: '2025-01-21 09:20'
    }
  ]);

  // Estados para filtros de data
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Funções de filtro
  const clearFilters = () => {
    setDateFrom('');
    setDateTo('');
  };

  const applyFilters = () => {
    // Aplicar filtros - por enquanto apenas console.log para demonstrar
    console.log('Filtros aplicados:', { dateFrom, dateTo });
  };
  
  // Calcular métricas por unidade
  const getUnitSummary = (): UnitSummary[] => {
    const units = ['Centro', 'Norte', 'Sul', 'Leste', 'Oeste'];
    
    return units.map(unit => {
      const unitProducts = juniorData.products.filter(p => (p as any).unit === unit);
      const totalProducts = unitProducts.length;
      const lowStockCount = unitProducts.filter(p => (p.stock || 0) <= (p.minStock || 0)).length;
      const totalValue = unitProducts.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0);
      const lastRestock = unitProducts
        .filter(p => (p as any).lastRestock)
        .sort((a, b) => new Date((b as any).lastRestock).getTime() - new Date((a as any).lastRestock).getTime())[0]?.lastRestock || '2025-01-01';
      
      let status: 'healthy' | 'warning' | 'critical' = 'healthy';
      if (lowStockCount > totalProducts * 0.3) status = 'critical';
      else if (lowStockCount > 0) status = 'warning';
      
      return { unit, totalProducts, lowStockCount, totalValue, lastRestock, status };
    });
  };

  const unitSummaries = getUnitSummary();
  const totalUnits = unitSummaries.length;
  const healthyUnits = unitSummaries.filter(u => u.status === 'healthy').length;
  const warningUnits = unitSummaries.filter(u => u.status === 'warning').length;
  const criticalUnits = unitSummaries.filter(u => u.status === 'critical').length;

  // Estatísticas consolidadas
  const totalInventoryValue = unitSummaries.reduce((sum, unit) => sum + unit.totalValue, 0);
  const totalProducts = unitSummaries.reduce((sum, unit) => sum + unit.totalProducts, 0);
  const totalLowStock = unitSummaries.reduce((sum, unit) => sum + unit.lowStockCount, 0);

  // Vendas recentes
  const recentSales = juniorData.sales.slice(0, 5);
  const totalSalesValue = recentSales.reduce((sum, sale) => sum + (sale as any).total, 0);

  // Funções para gerenciar notificações
  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="app-section">
      {/* Header Principal */}
      <div className="section-header">
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Multi-Unidades</h1>
            <p className="text-sm text-gray-600">Controle operacional de 5 unidades de distribuição</p>
          </div>
        </div>
      </div>

      {/* Filtros de Período */}
      <div className="main-card p-4 mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Filtrar por Período</h3>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <label className="text-sm font-medium text-gray-700">Data inicial:</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="border border-gray-200 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <label className="text-sm font-medium text-gray-700">Data final:</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="border border-gray-200 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={clearFilters}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Limpar Filtros
          </button>
          <button
            onClick={applyFilters}
            className="btn btn-primary px-4 py-1 text-sm"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>

      {/* Centro de Notificações */}
      <NotificationCenter
        notifications={notifications}
        onDismiss={handleDismissNotification}
        onClearAll={handleClearAllNotifications}
      />

      {/* Métricas Principais - Seguindo padrão da imagem */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Vendas Hoje */}
        <div className="metric-card-standard bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Vendas Hoje</p>
              <p className="text-2xl font-bold text-gray-900">R$ 18.950</p>
              <p className="text-xs text-green-600 font-medium">+15% vs ontem</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        
        {/* Vendas Esta Semana */}
        <div className="metric-card-standard bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Vendas Esta Semana</p>
              <p className="text-2xl font-bold text-gray-900">R$ 142.300</p>
              <p className="text-xs text-blue-600 font-medium">+8% vs sem. anterior</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        
        {/* Vendas Este Mês */}
        <div className="metric-card-standard bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Vendas Este Mês</p>
              <p className="text-2xl font-bold text-gray-900">R$ 586.700</p>
              <p className="text-xs text-purple-600 font-medium">+25% vs mês anterior</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
        
        {/* Ticket Médio */}
        <div className="metric-card-standard bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Ticket Médio</p>
              <p className="text-2xl font-bold text-gray-900">R$ 1.255,87</p>
              <p className="text-xs text-orange-600 font-medium">Média mensal</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <PieChart className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Segunda Linha de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Total Unidades */}
        <div className="metric-card-standard bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Unidades</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
              <p className="text-xs text-cyan-600 font-medium">+1 nova unidade</p>
            </div>
            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-cyan-600" />
            </div>
          </div>
        </div>
        
        {/* Taxa Eficiência */}
        <div className="metric-card-standard bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Taxa Eficiência</p>
              <p className="text-2xl font-bold text-gray-900">92%</p>
              <p className="text-xs text-green-600 font-medium">Últimos 30 dias</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        
        {/* Meta Mensal */}
        <div className="metric-card-standard bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Meta Mensal</p>
              <p className="text-2xl font-bold text-gray-900">87%</p>
              <p className="text-xs text-purple-600 font-medium">Do objetivo alcançado</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
        
        {/* Produtos Ativos */}
        <div className="metric-card-standard bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Produtos Ativos</p>
              <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              <p className="text-xs text-orange-600 font-medium">Em todas unidades</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Status das Unidades - Grid estilo da imagem */}
      <div className="main-card p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Status Operacional das Unidades</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {unitSummaries.map(unit => (
            <div key={unit.unit} className="metric-card-standard bg-white">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-3 h-3 rounded-full ${
                  unit.status === 'healthy' ? 'bg-green-500' :
                  unit.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <Building2 className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Unidade {unit.unit}</h4>
                <p className="text-2xl font-bold text-gray-900 mb-1">R$ {Math.round(unit.totalValue / 1000)}K</p>
                <p className="text-xs text-gray-600 mb-2">{unit.totalProducts} produtos</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    unit.status === 'healthy' ? 'bg-green-100 text-green-700' :
                    unit.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {unit.status === 'healthy' ? 'Saudável' :
                     unit.status === 'warning' ? 'Atenção' : 'Crítico'}
                  </span>
                  {unit.lowStockCount > 0 && (
                    <span className="text-xs text-red-600 font-medium">
                      {unit.lowStockCount} baixo
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Atividades Recentes - Formato de Lista Compacta */}
      <div className="main-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Atividades Recentes</h3>
        <div className="space-y-3">
          {juniorData.activities.slice(0, 8).map(activity => (
            <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                activity.status === 'success' ? 'bg-green-500' :
                activity.status === 'warning' ? 'bg-yellow-500' : 
                activity.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
              }`}></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{activity.action}</p>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{activity.description}</p>
              </div>
              <div className="flex-shrink-0">
                <p className="text-xs text-gray-500">{activity.time.split(' ')[1]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JuniorDashboard;