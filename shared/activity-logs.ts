// Sistema de logs de atividades para todas as integrações
export interface ActivityLog {
  id: string;
  timestamp: Date;
  type: 'email' | 'whatsapp' | 'telegram' | 'calendar' | 'payment' | 'system' | 'integration';
  action: string;
  description: string;
  category: string;
  status: 'success' | 'warning' | 'error' | 'info';
  metadata?: Record<string, any>;
  integrationId?: string;
  userId?: string;
}

// Logs de atividade em tempo real
export const activityLogs: ActivityLog[] = [
  {
    id: '1',
    timestamp: new Date('2024-12-26T08:30:00'),
    type: 'email',
    action: 'reminder_sent',
    description: 'Lembrete de consulta enviado para Maria Silva',
    category: 'pet',
    status: 'success',
    metadata: {
      recipient: 'maria.silva@email.com',
      appointmentId: 'apt_123',
      template: 'appointment_reminder'
    },
    integrationId: 'email-sendgrid'
  },
  {
    id: '2',
    timestamp: new Date('2024-12-26T09:15:00'),
    type: 'whatsapp',
    action: 'message_received',
    description: 'Cliente solicitou cardápio via WhatsApp',
    category: 'alimenticio',
    status: 'success',
    metadata: {
      from: '+5511999999999',
      message: 'Gostaria de ver o cardápio',
      automated_response: true
    },
    integrationId: 'whatsapp-business'
  },
  {
    id: '3',
    timestamp: new Date('2024-12-26T09:16:00'),
    type: 'whatsapp',
    action: 'menu_sent',
    description: 'Cardápio enviado automaticamente via WhatsApp',
    category: 'alimenticio',
    status: 'success',
    metadata: {
      to: '+5511999999999',
      menu_items: 12,
      response_time: '1.2s'
    },
    integrationId: 'whatsapp-business'
  },
  {
    id: '4',
    timestamp: new Date('2024-12-26T10:00:00'),
    type: 'telegram',
    action: 'stock_alert',
    description: 'Alerta de estoque baixo enviado via Telegram',
    category: 'pet',
    status: 'success',
    metadata: {
      product: 'Ração Premium Golden',
      current_stock: 5,
      minimum_stock: 10,
      chat_id: '-1234567890'
    },
    integrationId: 'telegram-bot'
  },
  {
    id: '5',
    timestamp: new Date('2024-12-26T10:30:00'),
    type: 'payment',
    action: 'order_processed',
    description: 'Pagamento processado via PIX - Pedido #245',
    category: 'alimenticio',
    status: 'success',
    metadata: {
      order_id: '245',
      amount: 'R$ 45,90',
      payment_method: 'pix',
      customer: 'João Santos'
    },
    integrationId: 'stripe-payments'
  },
  {
    id: '6',
    timestamp: new Date('2024-12-26T11:00:00'),
    type: 'calendar',
    action: 'appointment_synced',
    description: 'Consulta sincronizada com Google Calendar',
    category: 'medico',
    status: 'success',
    metadata: {
      appointment_id: 'apt_456',
      patient: 'Ana Costa',
      date: '2024-12-27',
      time: '14:00',
      sync_direction: 'to_google'
    },
    integrationId: 'google-calendar'
  },
  {
    id: '7',
    timestamp: new Date('2024-12-26T11:30:00'),
    type: 'integration',
    action: 'doctoralia_sync',
    description: 'Sincronização com Doctoralia concluída',
    category: 'medico',
    status: 'success',
    metadata: {
      appointments_synced: 3,
      patients_updated: 2,
      sync_duration: '2.5s'
    },
    integrationId: 'doctoralia'
  },
  {
    id: '8',
    timestamp: new Date('2024-12-26T12:00:00'),
    type: 'whatsapp',
    action: 'order_placed',
    description: 'Pedido realizado via WhatsApp - Pizza Margherita',
    category: 'alimenticio',
    status: 'success',
    metadata: {
      customer: 'Carlos Lima',
      items: ['Pizza Margherita', 'Coca-Cola 350ml'],
      total: 'R$ 28,50',
      payment_link_sent: true
    },
    integrationId: 'whatsapp-business'
  },
  {
    id: '9',
    timestamp: new Date('2024-12-26T12:15:00'),
    type: 'email',
    action: 'stock_alert',
    description: 'Alerta de produtos vencendo enviado por email',
    category: 'alimenticio',
    status: 'warning',
    metadata: {
      products_expiring: 4,
      expires_today: 2,
      recipient: 'gerente@empresa.com'
    },
    integrationId: 'email-sendgrid'
  },
  {
    id: '10',
    timestamp: new Date('2024-12-26T13:00:00'),
    type: 'system',
    action: 'integration_error',
    description: 'Erro na sincronização com Outlook Calendar',
    category: 'vendas',
    status: 'error',
    metadata: {
      error_code: 'AUTH_EXPIRED',
      error_message: 'Token de acesso expirado',
      retry_scheduled: true
    },
    integrationId: 'outlook-calendar'
  },
  {
    id: '11',
    timestamp: new Date('2024-12-26T14:00:00'),
    type: 'whatsapp',
    action: 'ai_response',
    description: 'IA respondeu dúvida sobre ingredientes',
    category: 'alimenticio',
    status: 'success',
    metadata: {
      question: 'Quais ingredientes vêm no Burguer Vegano?',
      response_confidence: 0.95,
      response_time: '0.8s'
    },
    integrationId: 'whatsapp-business'
  },
  {
    id: '12',
    timestamp: new Date('2024-12-26T14:30:00'),
    type: 'telegram',
    action: 'daily_report',
    description: 'Relatório diário enviado via Telegram',
    category: 'vendas',
    status: 'success',
    metadata: {
      sales_today: 'R$ 2.450,00',
      orders_count: 18,
      top_product: 'Processador Intel i7'
    },
    integrationId: 'telegram-bot'
  }
];

// Função para adicionar novo log
export const addActivityLog = (log: Omit<ActivityLog, 'id' | 'timestamp'>): ActivityLog => {
  const newLog: ActivityLog = {
    id: Date.now().toString(),
    timestamp: new Date(),
    ...log
  };
  
  activityLogs.unshift(newLog);
  return newLog;
};

// Função para filtrar logs por categoria
export const getLogsByCategory = (category: string): ActivityLog[] => {
  return activityLogs.filter(log => log.category === category);
};

// Função para filtrar logs por tipo
export const getLogsByType = (type: ActivityLog['type']): ActivityLog[] => {
  return activityLogs.filter(log => log.type === type);
};

// Função para filtrar logs por status
export const getLogsByStatus = (status: ActivityLog['status']): ActivityLog[] => {
  return activityLogs.filter(log => log.status === status);
};

// Função para obter logs recentes
export const getRecentLogs = (limit: number = 10): ActivityLog[] => {
  return activityLogs.slice(0, limit);
};

// Função para obter estatísticas dos logs
export const getLogStats = () => {
  const total = activityLogs.length;
  const byStatus = {
    success: activityLogs.filter(log => log.status === 'success').length,
    warning: activityLogs.filter(log => log.status === 'warning').length,
    error: activityLogs.filter(log => log.status === 'error').length,
    info: activityLogs.filter(log => log.status === 'info').length
  };
  
  const byType = {
    email: activityLogs.filter(log => log.type === 'email').length,
    whatsapp: activityLogs.filter(log => log.type === 'whatsapp').length,
    telegram: activityLogs.filter(log => log.type === 'telegram').length,
    calendar: activityLogs.filter(log => log.type === 'calendar').length,
    payment: activityLogs.filter(log => log.type === 'payment').length,
    system: activityLogs.filter(log => log.type === 'system').length,
    integration: activityLogs.filter(log => log.type === 'integration').length
  };
  
  return {
    total,
    byStatus,
    byType
  };
};