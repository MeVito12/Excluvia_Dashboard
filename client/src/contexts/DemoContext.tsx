import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getMockDataByCategory } from '@/data/mockDemoData';

interface DemoContextType {
  isDemoMode: boolean;
  demoData: any;
  setDemoMode: (category: string) => void;
  exitDemoMode: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider = ({ children }: { children: ReactNode }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoData, setDemoData] = useState<any>(null);

  // Verificar se já estava em modo demo ao inicializar
  useEffect(() => {
    const savedDemoMode = localStorage.getItem('demoMode');
    const savedCategory = localStorage.getItem('demoCategory');
    
    if (savedDemoMode === 'true' && savedCategory) {
      const mockData = getMockDataByCategory(savedCategory);
      if (mockData) {
        setDemoData(mockData);
        setIsDemoMode(true);
      }
    }
  }, []);

  const setDemoMode = (category: string) => {
    const mockData = getMockDataByCategory(category);
    if (mockData) {
      setDemoData(mockData);
      setIsDemoMode(true);
      localStorage.setItem('demoMode', 'true');
      localStorage.setItem('demoCategory', category);
    }
  };

  const exitDemoMode = () => {
    setIsDemoMode(false);
    setDemoData(null);
    localStorage.removeItem('demoMode');
    localStorage.removeItem('demoCategory');
    localStorage.removeItem('userBusinessCategory');
    // Recarregar a página para voltar ao login
    window.location.reload();
  };

  return (
    <DemoContext.Provider value={{
      isDemoMode,
      demoData,
      setDemoMode,
      exitDemoMode
    }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};