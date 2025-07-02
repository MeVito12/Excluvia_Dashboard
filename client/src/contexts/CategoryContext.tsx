import React, { createContext, useContext, useState, useEffect } from 'react';

interface CategoryContextType {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  isFirstLogin: boolean;
  setIsFirstLogin: (isFirst: boolean) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const categories = [
  { value: 'pet', label: 'Pet & Veterinário', icon: '🐕', description: 'Clínicas veterinárias, pet shops e cuidados animais' },
  { value: 'saude', label: 'Saúde & Medicamentos', icon: '⚕️', description: 'Clínicas médicas, farmácias e serviços de saúde' },
  { value: 'alimenticio', label: 'Alimentício', icon: '🍽️', description: 'Restaurantes, delivery e serviços alimentícios' },
  { value: 'vendas', label: 'Vendas no Geral', icon: '💼', description: 'Empresas de vendas, comércio e representações' },
  { value: 'design', label: 'Design Gráfico', icon: '🎨', description: 'Estúdios de design e agências criativas' },
  { value: 'sites', label: 'Criação de Sites', icon: '🌐', description: 'Desenvolvimento web e marketing digital' }
];

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isFirstLogin, setIsFirstLogin] = useState<boolean>(true);

  useEffect(() => {
    // Para demonstração: sempre mantém como primeiro login
    // Limpa dados salvos para simular primeiro acesso sempre
    localStorage.removeItem('selectedBusinessCategory');
    localStorage.removeItem('hasCompletedCategorySetup');
    setIsFirstLogin(true);
    setSelectedCategory('');
  }, []);

  const handleSetSelectedCategory = (category: string) => {
    setSelectedCategory(category);
    // Para demonstração: não salva no localStorage para manter como primeiro login
    // localStorage.setItem('selectedBusinessCategory', category);
    // localStorage.setItem('hasCompletedCategorySetup', 'true');
    setIsFirstLogin(false);
  };

  return (
    <CategoryContext.Provider 
      value={{ 
        selectedCategory, 
        setSelectedCategory: handleSetSelectedCategory, 
        isFirstLogin, 
        setIsFirstLogin 
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
};