import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChefHat, Users, ShoppingCart, Clock, TrendingUp, DollarSign, Package, Utensils } from 'lucide-react';

const Dashboard = () => {
  // Dados de exemplo para demonstração
  const stats = {
    todayOrders: 127,
    activeOrders: 18,
    totalRevenue: 8450.75,
    averageTicket: 67.80,
    availableTables: 12,
    totalTables: 20,
    dishesAvailable: 45
  };

  const activeOrders = [
    { id: 1, table: "Mesa 5", status: "preparing", items: 3, time: "12 min", total: 89.50 },
    { id: 2, table: "Delivery", status: "ready", items: 2, time: "20 min", total: 156.90 },
    { id: 3, table: "Mesa 12", status: "pending", items: 4, time: "5 min", total: 234.60 },
  ];

  const popularDishes = [
    { name: "Hambúrguer Artesanal", orders: 23, revenue: 1150.00 },
    { name: "Pizza Margherita", orders: 18, revenue: 1080.00 },
    { name: "Salada Caesar", orders: 15, revenue: 675.00 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return 'bg-yellow-100 text-yellow-700';
      case 'ready': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'preparing': return 'Preparando';
      case 'ready': return 'Pronto';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-600 text-white p-2 rounded-lg">
                <ChefHat className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sistema Alimentício</h1>
                <p className="text-sm text-gray-500">Gestão Completa para Restaurantes</p>
              </div>
            </div>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Utensils className="w-4 h-4 mr-2" />
              Novo Pedido
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Hoje</CardTitle>
              <ShoppingCart className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.todayOrders}</div>
              <p className="text-xs text-gray-500">{stats.activeOrders} ativos agora</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita do Dia</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                R$ {stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-gray-500">Ticket médio: R$ {stats.averageTicket.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mesas</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.availableTables}/{stats.totalTables}</div>
              <p className="text-xs text-gray-500">Disponíveis/Total</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pratos Disponíveis</CardTitle>
              <Package className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.dishesAvailable}</div>
              <p className="text-xs text-gray-500">No cardápio atual</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pedidos Ativos */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                Pedidos Ativos
              </CardTitle>
              <CardDescription>Pedidos em preparo ou aguardando</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                      <div>
                        <p className="font-medium text-gray-900">{order.table}</p>
                        <p className="text-sm text-gray-500">{order.items} itens • {order.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        R$ {order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pratos Populares */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Pratos Populares Hoje
              </CardTitle>
              <CardDescription>Mais pedidos do dia</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularDishes.map((dish, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <p className="font-medium text-gray-900">{dish.name}</p>
                      <p className="text-sm text-gray-500">{dish.orders} pedidos</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        R$ {dish.revenue.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status da Cozinha */}
        <div className="mt-8">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <ChefHat className="h-5 w-5" />
                Status da Cozinha
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.activeOrders}</div>
                  <div className="text-sm text-gray-600">Pedidos na Fila</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-green-600">15 min</div>
                  <div className="text-sm text-gray-600">Tempo Médio</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">95%</div>
                  <div className="text-sm text-gray-600">Taxa de Satisfação</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;