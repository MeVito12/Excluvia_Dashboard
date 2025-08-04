import { useMemo } from 'react';
import { useProducts, useSales, useClients, useFinancial } from '@/hooks/useData';

interface UnifiedMetricsProps {
  companyId: any;
  dateFrom?: string;
  dateTo?: string;
}

export const useUnifiedMetrics = ({ companyId, dateFrom, dateTo }: UnifiedMetricsProps) => {
  // Buscar dados usando hooks existentes
  const { data: sales = [] } = useSales(undefined, companyId);
  const { data: financialEntries = [] } = useFinancial(undefined, companyId);

  // Função para filtrar por data
  const filterByDateRange = (data: any[], dateField: string) => {
    if (!data || !Array.isArray(data)) return [];
    if (!dateFrom && !dateTo) return data;
    
    return data.filter(item => {
      const itemValue = item[dateField];
      if (!itemValue) return false;
      
      const itemDate = new Date(itemValue);
      const fromDate = dateFrom ? new Date(dateFrom) : new Date('1900-01-01');
      const toDate = dateTo ? new Date(dateTo + 'T23:59:59') : new Date('2100-12-31');
      
      if (isNaN(itemDate.getTime())) {
        return false;
      }
      
      return itemDate >= fromDate && itemDate <= toDate;
    });
  };

  // Calcular métricas unificadas
  const metrics = useMemo(() => {
    // Filtrar vendas por data
    const filteredSales = filterByDateRange(sales, 'sale_date');
    
    // Filtrar entradas financeiras por data
    const filteredFinancialEntries = filterByDateRange(financialEntries, 'created_at');
    
    // Calcular total de vendas automáticas
    const totalVendas = filteredSales.reduce((sum: number, sale: any) => 
      sum + (Number(sale.total_price) || 0), 0
    );
    
    // Calcular total de receitas (entradas financeiras de income)
    const totalReceitas = filteredFinancialEntries
      .filter((entry: any) => entry.type === 'income')
      .reduce((sum: number, entry: any) => sum + (Number(entry.amount) || 0), 0);
    
    // Calcular despesas
    const totalDespesas = filteredFinancialEntries
      .filter((entry: any) => entry.type === 'expense')
      .reduce((sum: number, entry: any) => sum + (Number(entry.amount) || 0), 0);
    
    // Total combinado (vendas + receitas)
    const totalCombinado = totalVendas + totalReceitas;
    
    return {
      // Valores principais
      totalVendas,
      totalReceitas,
      totalDespesas,
      totalCombinado,
      
      // Contadores
      vendasCount: filteredSales.length,
      receitasCount: filteredFinancialEntries.filter((e: any) => e.type === 'income').length,
      despesasCount: filteredFinancialEntries.filter((e: any) => e.type === 'expense').length,
      
      // Dados originais filtrados
      filteredSales,
      filteredFinancialEntries,
      
      // Para debugging
      debug: {
        totalVendas,
        totalReceitas,
        totalCombinado,
        vendas: filteredSales.length,
        receitas: filteredFinancialEntries.filter((e: any) => e.type === 'income').length,
        companyId,
        filtroData: `${dateFrom} até ${dateTo}`
      }
    };
  }, [sales, financialEntries, dateFrom, dateTo, companyId]);

  return metrics;
};