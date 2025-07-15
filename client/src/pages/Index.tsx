import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardSection from '@/components/sections/DashboardSection';
import GraficosSection from '@/components/sections/GraficosSection';
import AtividadeSection from '@/components/sections/AtividadeSection';
import AgendamentosSection from '@/components/sections/AgendamentosSection';
import EstoqueFunctional from '@/components/sections/EstoqueFunctional';
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
        return <EstoqueFunctional />;
      case 'atendimento':
        return <AtendimentoSection />;
      default:
        return <DashboardSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--dashboard-darker))] to-[hsl(var(--dashboard-dark))] text-white relative overflow-hidden">
      {/* Efeito de fundo sutil - SEM BLOQUEAR CLIQUES */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary rounded-full blur-3xl modern-float pointer-events-none"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent rounded-full blur-3xl modern-pulse-subtle pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      </div>

      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />

      {/* Main Content */}
      <main className="ml-0 md:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          {renderActiveSection()}
        </div>
      </main>
    </div>
  );
};

export default Index;