// Configuration file for Supabase multi-database integration
// This file handles multiple Supabase database connections

export interface SupabaseDatabaseConfig {
  id: string;
  name: string;
  url: string;
  anonKey: string;
  serviceKey?: string;
  isActive: boolean;
  description?: string;
}

// Load Supabase database configurations from environment variables
export function loadSupabaseConfigs(): SupabaseDatabaseConfig[] {
  const configs: SupabaseDatabaseConfig[] = [];
  
  // Example of how to load multiple database configurations
  // The actual implementation will read from environment variables
  
  // Database 1 - Main
  if (process.env.SUPABASE_URL_MAIN && process.env.SUPABASE_ANON_KEY_MAIN) {
    configs.push({
      id: 'main',
      name: 'Main Database',
      url: process.env.SUPABASE_URL_MAIN,
      anonKey: process.env.SUPABASE_ANON_KEY_MAIN,
      serviceKey: process.env.SUPABASE_SERVICE_KEY_MAIN,
      isActive: true,
      description: 'Primary database for appointments and users'
    });
  }
  
  // Database 2 - Secondary
  if (process.env.SUPABASE_URL_SECONDARY && process.env.SUPABASE_ANON_KEY_SECONDARY) {
    configs.push({
      id: 'secondary',
      name: 'Secondary Database',
      url: process.env.SUPABASE_URL_SECONDARY,
      anonKey: process.env.SUPABASE_ANON_KEY_SECONDARY,
      serviceKey: process.env.SUPABASE_SERVICE_KEY_SECONDARY,
      isActive: true,
      description: 'Secondary database for backup and additional data'
    });
  }
  
  // Database 3 - Analytics
  if (process.env.SUPABASE_URL_ANALYTICS && process.env.SUPABASE_ANON_KEY_ANALYTICS) {
    configs.push({
      id: 'analytics',
      name: 'Analytics Database',
      url: process.env.SUPABASE_URL_ANALYTICS,
      anonKey: process.env.SUPABASE_ANON_KEY_ANALYTICS,
      serviceKey: process.env.SUPABASE_SERVICE_KEY_ANALYTICS,
      isActive: true,
      description: 'Database for analytics and reporting data'
    });
  }
  
  return configs;
}

// Get active database configurations
export function getActiveSupabaseConfigs(): SupabaseDatabaseConfig[] {
  return loadSupabaseConfigs().filter(config => config.isActive);
}

// Get database configuration by ID
export function getSupabaseConfigById(id: string): SupabaseDatabaseConfig | undefined {
  return loadSupabaseConfigs().find(config => config.id === id);
}

// Default configuration for development
export const defaultSupabaseConfig: Partial<SupabaseDatabaseConfig> = {
  isActive: true,
  description: 'Default Supabase database configuration'
};

export default {
  loadConfigs: loadSupabaseConfigs,
  getActiveConfigs: getActiveSupabaseConfigs,
  getConfigById: getSupabaseConfigById,
  defaultConfig: defaultSupabaseConfig
};