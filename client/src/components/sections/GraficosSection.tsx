import { useState } from 'react';
import DatabaseChart from '@/components/DatabaseChart';
import SearchAndFilters from '@/components/SearchAndFilters';

const GraficosSection = () => {
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gráficos</h1>
        <p className="text-gray-600 dark:text-gray-400">Análises e relatórios</p>
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