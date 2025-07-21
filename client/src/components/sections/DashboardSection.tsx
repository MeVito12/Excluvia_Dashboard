import React from 'react';
import { EmptyState } from '@/components/EmptyState';
import { IntegrationStatus } from '@/components/IntegrationStatus';
import { TrendingUp, Users, ShoppingCart, Calendar, Database, Settings } from 'lucide-react';

const DashboardSection: React.FC = () => {
  return (
    <div className="app-section">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-white/80">Visão geral dos dados da empresa em tempo real</p>
      </div>

      {/* Status das Integrações */}
      <div className="main-card mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Status das Integrações</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <IntegrationStatus 
            status="awaiting" 
            service="Sistema ERP" 
            errorMessage="Aguardando credenciais da API"
          />
          <IntegrationStatus 
            status="awaiting" 
            service="Gateway de Pagamento" 
            errorMessage="Configurar webhook de vendas"
          />
          <IntegrationStatus 
            status="awaiting" 
            service="WhatsApp Business" 
            errorMessage="Conectar API do WhatsApp"
          />
          <IntegrationStatus 
            status="awaiting" 
            service="Google Calendar" 
            errorMessage="Autorizar acesso aos agendamentos"
          />
        </div>
      </div>

      {/* Métricas Principais - Aguardando Dados Reais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="metric-card-standard">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vendas do Mês</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Aguardando integração com PDV</p>
        </div>

        <div className="metric-card-standard">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clientes Ativos</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Aguardando conexão com CRM</p>
        </div>

        <div className="metric-card-standard">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Produtos</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Aguardando dados do estoque</p>
        </div>

        <div className="metric-card-standard">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Agendamentos</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Aguardando sincronização</p>
        </div>
      </div>

      {/* Estado Principal - Aguardando Dados */}
      <div className="main-card">
        <EmptyState
          type="awaiting"
          title="Aguardando Dados Reais da Empresa"
          description="Para exibir as métricas e gráficos do seu negócio, precisamos conectar com seus sistemas reais. Configure as integrações com seu ERP, PDV, CRM e outros sistemas para ver dados autênticos aqui."
          actionButton={
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configurar Integrações
            </button>
          }
        />
      </div>

      {/* Informações sobre Integrações Suportadas */}
      <div className="main-card mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          <Database className="w-5 h-5 inline mr-2" />
          Integrações Suportadas
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Vendas & PDV</h4>
            <p className="text-sm text-blue-700">
              Stone, Cielo, PagSeguro, Mercado Pago, Stripe, PayPal
            </p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">ERP & Estoque</h4>
            <p className="text-sm text-green-700">
              Omie, Tiny, Bling, Shopify, WooCommerce, Magento
            </p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">CRM & Agenda</h4>
            <p className="text-sm text-purple-700">
              HubSpot, Salesforce, Google Calendar, Outlook, WhatsApp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;