import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardSection from '@/components/sections/DashboardSection';
import GraficosSection from '@/components/sections/GraficosSection';
import AtividadeSection from '@/components/sections/AtividadeSection';
import AgendamentosSection from '@/components/sections/AgendamentosSection';

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
      default:
        return <DashboardSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--dashboard-darker))] to-[hsl(var(--dashboard-dark))] text-black">
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