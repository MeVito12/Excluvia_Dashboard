// Configurações e tipos para todas as integrações do sistema
export interface IntegrationConfig {
  id: string;
  name: string;
  type: 'email' | 'messaging' | 'calendar' | 'payment' | 'platform';
  status: 'active' | 'inactive' | 'error';
  category: string[];
  settings: Record<string, any>;
  lastSync?: Date;
  apiKey?: string;
  webhookUrl?: string;
}

export interface IntegrationEvent {
  id: string;
  integrationId: string;
  type: 'sync' | 'send' | 'receive' | 'error';
  data: any;
  timestamp: Date;
  status: 'success' | 'error' | 'pending';
  error?: string;
}

export interface WhatsAppMessage {
  id: string;
  from: string;
  to: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'image' | 'document' | 'audio';
  status: 'sent' | 'delivered' | 'read' | 'failed';
}

export interface EmailConfig {
  provider: 'sendgrid' | 'gmail' | 'outlook';
  from: string;
  replyTo?: string;
  apiKey?: string;
  smtpHost?: string;
  smtpPort?: number;
  username?: string;
  password?: string;
}

export interface TelegramConfig {
  botToken: string;
  chatId: string;
  enabled: boolean;
}

export interface CalendarIntegration {
  provider: 'google' | 'outlook' | 'doctoralia';
  accessToken: string;
  refreshToken?: string;
  calendarId: string;
  syncEnabled: boolean;
  lastSync?: Date;
}

export interface PaymentIntegration {
  provider: 'stripe' | 'pix' | 'mercadopago';
  publicKey: string;
  secretKey: string;
  webhookSecret?: string;
  enabled: boolean;
}

// Configurações padrão das integrações
export const defaultIntegrations: IntegrationConfig[] = [
  {
    id: 'email-sendgrid',
    name: 'SendGrid Email',
    type: 'email',
    status: 'inactive',
    category: ['all'],
    settings: {
      provider: 'sendgrid',
      from: 'noreply@empresa.com',
      templates: {
        appointment_reminder: 'template_id_1',
        stock_alert: 'template_id_2',
        order_confirmation: 'template_id_3'
      }
    }
  },
  {
    id: 'whatsapp-business',
    name: 'WhatsApp Business',
    type: 'messaging',
    status: 'inactive',
    category: ['alimenticio', 'pet', 'vendas'],
    settings: {
      phoneNumber: '',
      accessToken: '',
      webhookUrl: '/api/webhooks/whatsapp',
      businessAccountId: ''
    }
  },
  {
    id: 'telegram-bot',
    name: 'Telegram Bot',
    type: 'messaging',
    status: 'inactive',
    category: ['all'],
    settings: {
      botToken: '',
      chatId: '',
      enabled: false
    }
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    type: 'calendar',
    status: 'active',
    category: ['all'],
    settings: {
      accessToken: '',
      refreshToken: '',
      calendarId: 'primary',
      syncEnabled: true
    }
  },
  {
    id: 'doctoralia',
    name: 'Doctoralia',
    type: 'platform',
    status: 'active',
    category: ['medico', 'pet'],
    settings: {
      apiKey: '',
      clinicId: '',
      syncAppointments: true,
      syncPatients: false
    }
  },
  {
    id: 'stripe-payments',
    name: 'Stripe Payments',
    type: 'payment',
    status: 'inactive',
    category: ['alimenticio', 'vendas'],
    settings: {
      publicKey: '',
      secretKey: '',
      webhookSecret: '',
      enabled: false
    }
  }
];

// Logs de atividade das integrações
export const integrationLogs: IntegrationEvent[] = [
  {
    id: '1',
    integrationId: 'email-sendgrid',
    type: 'send',
    data: {
      to: 'cliente@email.com',
      subject: 'Lembrete de Consulta',
      template: 'appointment_reminder'
    },
    timestamp: new Date('2024-12-26T08:30:00'),
    status: 'success'
  },
  {
    id: '2',
    integrationId: 'whatsapp-business',
    type: 'receive',
    data: {
      from: '+5511999999999',
      message: 'Gostaria de ver o cardápio',
      type: 'text'
    },
    timestamp: new Date('2024-12-26T09:15:00'),
    status: 'success'
  },
  {
    id: '3',
    integrationId: 'telegram-bot',
    type: 'send',
    data: {
      chatId: '-1234567890',
      message: 'Estoque baixo: Ração Premium - 5 unidades restantes',
      type: 'alert'
    },
    timestamp: new Date('2024-12-26T10:00:00'),
    status: 'success'
  },
  {
    id: '4',
    integrationId: 'google-calendar',
    type: 'sync',
    data: {
      appointments: 3,
      created: 1,
      updated: 2
    },
    timestamp: new Date('2024-12-26T11:30:00'),
    status: 'success'
  },
  {
    id: '5',
    integrationId: 'doctoralia',
    type: 'sync',
    data: {
      appointments: 2,
      patients: 1
    },
    timestamp: new Date('2024-12-26T12:00:00'),
    status: 'success'
  }
];

// Funções auxiliares para integrações
export const getIntegrationsByCategory = (category: string): IntegrationConfig[] => {
  return defaultIntegrations.filter(integration => 
    integration.category.includes(category) || integration.category.includes('all')
  );
};

export const getActiveIntegrations = (): IntegrationConfig[] => {
  return defaultIntegrations.filter(integration => integration.status === 'active');
};

export const getIntegrationLogs = (integrationId?: string): IntegrationEvent[] => {
  if (integrationId) {
    return integrationLogs.filter(log => log.integrationId === integrationId);
  }
  return integrationLogs;
};