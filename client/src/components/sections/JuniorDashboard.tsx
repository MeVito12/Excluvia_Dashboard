import React, { useState } from 'react';
import { Package, Truck, Building2, TrendingUp, AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { getJuniorData } from '@/lib/juniorMockData';

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

  return (
    <div className="space-y-6">
      {/* Header do Dashboard */}
      <div className="main-card p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Painel de Controle Multi-Unidades</h1>
            <p className="text-gray-600">Coordenação: Junior Silva - 5 Unidades Ativas</p>
          </div>
        </div>
      </div>

      {/* Métricas Globais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total de Produtos</p>
              <p className="text-2xl font-bold text-blue-700">{totalProducts}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="metric-card bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Valor Inventário</p>
              <p className="text-2xl font-bold text-green-700">R$ {totalInventoryValue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="metric-card bg-yellow-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Produtos Baixo Estoque</p>
              <p className="text-2xl font-bold text-yellow-700">{totalLowStock}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="metric-card bg-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Vendas Recentes</p>
              <p className="text-2xl font-bold text-purple-700">R$ {totalSalesValue.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Status das Unidades */}
      <div className="main-card p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Status Operacional das Unidades</h3>
        
        {/* Resumo Status */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <p className="font-medium text-gray-800">{healthyUnits} Saudáveis</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
            </div>
            <p className="font-medium text-gray-800">{warningUnits} Com Avisos</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <p className="font-medium text-gray-800">{criticalUnits} Críticas</p>
          </div>
        </div>

        {/* Lista das Unidades */}
        <div className="space-y-3">
          {unitSummaries.map(unit => (
            <div key={unit.unit} className="list-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full ${
                    unit.status === 'healthy' ? 'bg-green-500' :
                    unit.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <h4 className="font-medium text-gray-800">Unidade {unit.unit}</h4>
                    <p className="text-sm text-gray-600">{unit.totalProducts} produtos • Última reposição: {new Date(unit.lastRestock).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Valor Total</p>
                    <p className="font-medium">R$ {unit.totalValue.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Estoque Baixo</p>
                    <p className={`font-medium ${unit.lowStockCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {unit.lowStockCount} itens
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`badge ${
                      unit.status === 'healthy' ? 'badge-success' :
                      unit.status === 'warning' ? 'badge-warning' : 'badge-error'
                    }`}>
                      {unit.status === 'healthy' ? 'Saudável' :
                       unit.status === 'warning' ? 'Atenção' : 'Crítico'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Atividade Recente */}
      <div className="main-card p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Atividades Recentes</h3>
        <div className="space-y-3">
          {juniorData.activities.slice(0, 5).map(activity => (
            <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                activity.status === 'success' ? 'bg-green-500' :
                activity.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                <p className="text-xs text-gray-600">{activity.description}</p>
              </div>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JuniorDashboard;