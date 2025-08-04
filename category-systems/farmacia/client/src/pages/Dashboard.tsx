import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pill, Users, ShoppingCart, AlertTriangle, TrendingUp, DollarSign, Package, Calendar } from 'lucide-react';

const Dashboard = () => {
  // Dados de exemplo para demonstração
  const stats = {
    totalMedicines: 1250,
    lowStock: 15,
    todaySales: 42,
    monthlyRevenue: 35280.50,
    expiringSoon: 8,
    clientsCount: 340
  };

  const recentSales = [
    { id: 1, client: "Maria Silva", total: 45.90, items: 3, time: "14:30" },
    { id: 2, client: "João Santos", total: 128.50, items: 5, time: "14:15" },
    { id: 3, client: "Ana Costa", total: 67.20, items: 2, time: "13:45" },
  ];

  const lowStockMedicines = [
    { name: "Dipirona 500mg", stock: 5, minimum: 20 },
    { name: "Paracetamol 750mg", stock: 8, minimum: 25 },
    { name: "Amoxicilina 500mg", stock: 3, minimum: 15 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 text-white p-2 rounded-lg">
                <Pill className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sistema Farmácia</h1>
                <p className="text-sm text-gray-500">Gestão Completa para Farmácias</p>
              </div>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              <Package className="w-4 h-4 mr-2" />
              Nova Venda
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medicamentos</CardTitle>
              <Pill className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalMedicines}</div>
              <p className="text-xs text-gray-500">Total no estoque</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas Hoje</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.todaySales}</div>
              <p className="text-xs text-gray-500">Transações realizadas</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                R$ {stats.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-gray-500">Faturamento do mês</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.lowStock}</div>
              <p className="text-xs text-gray-500">Produtos para repor</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vendas Recentes */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
                Vendas Recentes
              </CardTitle>
              <CardDescription>Últimas transações realizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{sale.client}</p>
                      <p className="text-sm text-gray-500">{sale.items} itens • {sale.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        R$ {sale.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Estoque Baixo */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Estoque Baixo
              </CardTitle>
              <CardDescription>Medicamentos que precisam de reposição</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockMedicines.map((medicine, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <p className="font-medium text-gray-900">{medicine.name}</p>
                      <p className="text-sm text-gray-500">Mínimo: {medicine.minimum} unidades</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive" className="bg-red-100 text-red-700">
                        {medicine.stock} restantes
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alertas Importantes */}
        <div className="mt-8">
          <Card className="bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <Calendar className="h-5 w-5" />
                Medicamentos Vencendo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-700">
                <strong>{stats.expiringSoon} medicamentos</strong> vencem nos próximos 30 dias. 
                Verifique a seção de estoque para detalhes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;