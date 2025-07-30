import { useDemo } from '@/contexts/DemoContext';
import { useCategory } from '@/contexts/CategoryContext';
import { X } from 'lucide-react';

const DemoIndicator = () => {
  const { isDemoMode, exitDemoMode } = useDemo();
  const { selectedCategory } = useCategory();

  if (!isDemoMode) return null;

  const getCategoryInfo = (category: string) => {
    const categories: Record<string, { name: string; emoji: string }> = {
      'farmacia': { name: 'Farmácia Central', emoji: '💊' },
      'pet': { name: 'Pet Clinic', emoji: '🐕' },
      'medico': { name: 'Clínica Saúde', emoji: '🏥' },
      'vendas': { name: 'Comercial Tech', emoji: '💼' },
      'design': { name: 'Agência Creative', emoji: '🎨' },
      'sites': { name: 'Web Agency', emoji: '💻' }
    };
    return categories[category] || { name: 'Demo', emoji: '🚀' };
  };

  const categoryInfo = getCategoryInfo(selectedCategory);

  return (
    <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">{categoryInfo.emoji}</span>
        <div>
          <div className="font-semibold text-sm">MODO DEMONSTRAÇÃO</div>
          <div className="text-xs opacity-90">{categoryInfo.name}</div>
        </div>
      </div>
      <button
        onClick={exitDemoMode}
        className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
        title="Sair do modo demo"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default DemoIndicator;