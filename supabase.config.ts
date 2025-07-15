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
  
  // Primary Supabase Database Configuration
  configs.push({
    id: 'main',
    name: 'Business Management Database',
    url: 'https://mjydrjmckcoixrnnrehm.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qeWRyam1ja2NvaXhybm5yZWhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNTc4MDgsImV4cCI6MjA2NzgzMzgwOH0.eYTUOTN5m_M3C-_0viLNU-MLjraNc-DHFooCwHa2WIo',
    serviceKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qeWRyam1ja2NvaXhybm5yZWhtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjI1NzgwOCwiZXhwIjoyMDY3ODMzODA4fQ._HjvF-0uX3t3QXlx6XoESxcdGqV0P3J4Kb00FzpAp0k',
    isActive: true,
    description: 'Primary database for all business management operations - appointments, inventory, sales, clients, and customer service'
  });
  
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