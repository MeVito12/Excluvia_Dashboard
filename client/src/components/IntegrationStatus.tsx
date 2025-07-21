import React from 'react';
import { CheckCircle, Clock, AlertCircle, XCircle, Zap } from 'lucide-react';

interface IntegrationStatusProps {
  status: 'connected' | 'awaiting' | 'error' | 'no-data' | 'syncing';
  service: string;
  lastSync?: Date;
  errorMessage?: string;
}

export const IntegrationStatus: React.FC<IntegrationStatusProps> = ({
  status,
  service,
  lastSync,
  errorMessage
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-100',
          label: 'Conectado',
          description: 'Recebendo dados em tempo real'
        };
      case 'syncing':
        return {
          icon: Zap,
          color: 'text-blue-600',
          bg: 'bg-blue-100',
          label: 'Sincronizando',
          description: 'Buscando dados mais recentes'
        };
      case 'awaiting':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bg: 'bg-yellow-100',
          label: 'Aguardando',
          description: 'Aguardando configuração da API'
        };
      case 'error':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bg: 'bg-red-100',
          label: 'Erro',
          description: errorMessage || 'Falha na conexão'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-600',
          bg: 'bg-gray-100',
          label: 'Sem dados',
          description: 'Nenhum dado encontrado'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-white">
      <div className={`p-2 rounded-full ${config.bg}`}>
        <Icon className={`w-4 h-4 ${config.color}`} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{service}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${config.bg} ${config.color}`}>
            {config.label}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mt-1">{config.description}</p>
        
        {lastSync && status === 'connected' && (
          <p className="text-xs text-gray-500 mt-1">
            Última sincronização: {lastSync.toLocaleString('pt-BR')}
          </p>
        )}
      </div>
    </div>
  );
};

export default IntegrationStatus;