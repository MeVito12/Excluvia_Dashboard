import { useState } from 'react';
import DatabaseChart from '@/components/DatabaseChart';
import SearchAndFilters from '@/components/SearchAndFilters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Calendar, TrendingUp, BarChart3, PieChart } from 'lucide-react';

  return (
    <div className="app-section">
      {/* Header */}
      <div className="section-header">
        <h1 className="section-title">Relatórios e Gráficos</h1>
        <p className="section-subtitle">Relatórios de vendas, análises e visualizações detalhadas</p>
      </div>

      {/* Search and Filters */}
      <SearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCompany={selectedCompany}
        onCompanyChange={setSelectedCompany}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
      />

      {/* Relatórios de Vendas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vendas Hoje</p>
              <p className="text-2xl font-bold mt-1 text-gray-900">R$ 8.450</p>
              <p className="text-xs mt-1 text-green-600">+12% vs ontem</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vendas Esta Semana</p>
              <p className="text-2xl font-bold mt-1 text-gray-900">R$ 45.200</p>
              <p className="text-xs mt-1 text-green-600">+8% vs sem. anterior</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vendas Este Mês</p>
              <p className="text-2xl font-bold mt-1 text-gray-900">R$ 165.300</p>
              <p className="text-xs mt-1 text-green-600">+15% vs mês anterior</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
              <p className="text-2xl font-bold mt-1 text-gray-900">R$ 285</p>
              <p className="text-xs mt-1 text-green-600">+5% vs período anterior</p>
            </div>
            <div className="p-3 rounded-full bg-orange-100">
              <PieChart className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Botões de Relatórios */}
      <Card className="main-card">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Download className="h-5 w-5 text-purple-600" />
            Relatórios de Vendas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="btn-primary justify-start">
              Relatório Diário
            </Button>
            <Button className="btn-secondary justify-start">
              Relatório Semanal
            </Button>
            <Button className="bg-purple-500 hover:bg-purple-600 text-white justify-start">
              <Download className="w-4 h-4 mr-2" />
              Relatório Mensal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DatabaseChart
          type="bar"
          title="Usuários e Transações por Empresa"
          selectedCompany={selectedCompany}
        />
        <DatabaseChart
          type="line"
          title="Receita e Crescimento Mensal"
          selectedCompany={selectedCompany}
        />
      </div>

      {/* Secondary Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DatabaseChart
          type="pie"
          title="Status dos Servidores"
        />
        <DatabaseChart
          type="area"
          title="Satisfação do Cliente"
          selectedCompany={selectedCompany}
        />
        <DatabaseChart
          type="performance"
          title="Performance e Recursos"
        />
      </div>

      {/* Additional Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-border/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-black">Análise de Tendências</h3>
          <DatabaseChart
            type="line"
            title="Evolução de Métricas no Tempo"
            selectedCompany={selectedCompany}
          />
        </div>
        <div className="bg-white border border-border/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-black">Comparativo de Performance</h3>
          <DatabaseChart
            type="bar"
            title="Comparação entre Empresas"
            selectedCompany={selectedCompany}
          />
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="bg-white border border-border/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-6 text-black">Relatórios Detalhados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">89.3%</div>
            <div className="text-sm text-blue-700">Taxa de Conversão</div>
            <div className="text-xs text-blue-500 mt-1">+5.2% vs mês anterior</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">247ms</div>
            <div className="text-sm text-green-700">Tempo Médio de Resposta</div>
            <div className="text-xs text-green-500 mt-1">-15ms vs mês anterior</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">12.4K</div>
            <div className="text-sm text-purple-700">Novos Usuários</div>
            <div className="text-xs text-purple-500 mt-1">+18% vs mês anterior</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">97.1%</div>
            <div className="text-sm text-orange-700">Uptime dos Servidores</div>
            <div className="text-xs text-orange-500 mt-1">+2.1% vs mês anterior</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraficosSection;