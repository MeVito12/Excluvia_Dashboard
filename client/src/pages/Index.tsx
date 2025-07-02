import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardSection from '@/components/sections/DashboardSection';
import GraficosSection from '@/components/sections/GraficosSection';
import AtividadeSection from '@/components/sections/AtividadeSection';
import AgendamentosSection from '@/components/sections/AgendamentosSection';
import EstoqueSection from '@/components/sections/EstoqueSection';
import AtendimentoSection from '@/components/sections/AtendimentoSection';

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardSection />;
      case 'graficos':
        return <GraficosSection />;
      case 'atividade':
        return <AtividadeSection />;
      case 'agendamentos':
        return <AgendamentosSection />;
      case 'estoque':
        return <EstoqueSection />;
      case 'atendimento':
        return <AtendimentoSection />;
      default:
        return <DashboardSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />

      {/* Main Content */}
      <main className="ml-0 md:ml-64 p-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {renderActiveSection()}
        </div>
      </main>
    </div>
  );
};

export default Index;