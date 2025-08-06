import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CategoryProvider } from "@/contexts/CategoryContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { PermissionsProvider } from "@/contexts/PermissionsContext";
import NotificationSystem, { useNotifications } from "@/components/NotificationSystem";
import Index from "./pages/Index";
import LoginForm from "@/components/LoginForm";

// Limpeza FORÇADA de dados inconsistentes do localStorage
if (typeof window !== 'undefined') {
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    try {
      const userData = JSON.parse(currentUser);
      // Se detectar qualquer dados inconsistentes (email usuario@ OU role null), limpar
      if (userData.email === 'usuario@sistema.com' || !userData.role) {
        console.log('[AUTH-CLEANUP] 🔄 FORCED clearing of inconsistent localStorage data...');
        localStorage.clear(); // Limpar tudo
        sessionStorage.clear(); // Limpar session também
        window.location.reload();
      }
    } catch (e) {
      console.log('[AUTH-CLEANUP] ❌ Error parsing localStorage, clearing everything...');
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
  }
}

const AppContent = () => {
  const { isAuthenticated, login } = useAuth();
  const { notifications, removeNotification } = useNotifications();

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  return (
    <NotificationProvider>
      <Index />
    </NotificationProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CategoryProvider>
      <AuthProvider>
        <TooltipProvider>
          <PermissionsProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </PermissionsProvider>
        </TooltipProvider>
      </AuthProvider>
    </CategoryProvider>
  </QueryClientProvider>
);

export default App;