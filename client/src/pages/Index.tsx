import { useState, Suspense, lazy } from 'react';
import Sidebar from '@/components/Sidebar';
import ErrorBoundary from '@/components/ErrorBoundary';

// Lazy load all sections for better performance
const DashboardSection = lazy(() => import('@/components/sections/DashboardSection'));
const GraficosSection = lazy(() => import('@/components/sections/GraficosSection'));
const AtividadeSection = lazy(() => import('@/components/sections/AtividadeSection'));
const AgendamentosSection = lazy(() => import('@/components/sections/AgendamentosSection'));
const EstoqueSection = lazy(() => import('@/components/sections/EstoqueSection'));
const AtendimentoSection = lazy(() => import('@/components/sections/AtendimentoSection'));

// Loading component for better UX
const SectionLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 bg-primary rounded-full animate-pulse"></div>
      </div>
    </div>
    <div className="ml-4 text-gray-400">
      <div className="text-lg font-medium">Carregando...</div>
      <div className="text-sm">Preparando seção</div>
    </div>
  </div>
);

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <ErrorBoundary>
            <Suspense fallback={<SectionLoader />}>
              <DashboardSection />
            </Suspense>
          </ErrorBoundary>
        );
      case 'graficos':
        return (
          <ErrorBoundary>
            <Suspense fallback={<SectionLoader />}>
              <GraficosSection />
            </Suspense>
          </ErrorBoundary>
        );
      case 'atividade':
        return (
          <ErrorBoundary>
            <Suspense fallback={<SectionLoader />}>
              <AtividadeSection />
            </Suspense>
          </ErrorBoundary>
        );
      case 'agendamentos':
        return (
          <ErrorBoundary>
            <Suspense fallback={<SectionLoader />}>
              <AgendamentosSection />
            </Suspense>
          </ErrorBoundary>
        );
      case 'estoque':
        return (
          <ErrorBoundary>
            <Suspense fallback={<SectionLoader />}>
              <EstoqueSection />
            </Suspense>
          </ErrorBoundary>
        );
      case 'atendimento':
        return (
          <ErrorBoundary>
            <Suspense fallback={<SectionLoader />}>
              <AtendimentoSection />
            </Suspense>
          </ErrorBoundary>
        );
      default:
        return (
          <ErrorBoundary>
            <Suspense fallback={<SectionLoader />}>
              <DashboardSection />
            </Suspense>
          </ErrorBoundary>
        );
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