import { useState } from 'react';
import DatabaseChart from '@/components/DatabaseChart';
import SearchAndFilters from '@/components/SearchAndFilters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Calendar, TrendingUp, BarChart3, PieChart } from 'lucide-react';

const GraficosSection = () => {
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Relatórios e Gráficos</h1>
        <p className="text-gray-300">Relatórios de vendas, análises e visualizações detalhadas</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vendas Hoje</p>
                <p className="text-2xl font-bold text-green-600">R$ 8.450</p>
                <p className="text-xs text-green-600">+12% vs ontem</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vendas Esta Semana</p>
                <p className="text-2xl font-bold text-blue-600">R$ 45.200</p>
                <p className="text-xs text-blue-600">+8% vs sem. anterior</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vendas Este Mês</p>
                <p className="text-2xl font-bold text-purple-600">R$ 165.300</p>
                <p className="text-xs text-purple-600">+15% vs mês anterior</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ticket Médio</p>
                <p className="text-2xl font-bold text-orange-600">R$ 285</p>
                <p className="text-xs text-orange-600">+5% vs período anterior</p>
              </div>
              <PieChart className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botões de Relatórios */}
      <Card className="bg-white border border-border/50">
        <CardHeader>
          <CardTitle className="text-black">Relatórios de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white justify-start">
              <Download className="w-4 h-4 mr-2" />
              Relatório Diário
            </Button>
            <Button className="bg-green-500 hover:bg-green-600 text-white justify-start">
              <Download className="w-4 h-4 mr-2" />
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