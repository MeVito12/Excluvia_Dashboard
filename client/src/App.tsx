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

// Limpeza de dados inconsistentes do localStorage
if (typeof window !== 'undefined') {
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    try {
      const userData = JSON.parse(currentUser);
      // Se detectar dados inconsistentes (email usuario@ mas role null), limpar
      if (userData.email === 'usuario@sistema.com' && !userData.role) {
        console.log('[AUTH-CLEANUP] 🔄 Clearing inconsistent localStorage data...');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userBusinessCategory');
        window.location.reload();
      }
    } catch (e) {
      console.log('[AUTH-CLEANUP] ❌ Error parsing localStorage, clearing...');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userBusinessCategory');
    }
  }
}

const AppContent = () => {
  const { isAuthenticated, login } = useAuth();
  const { notifications, removeNotification, showSuccess, showError, showWarning, showInfo } = useNotifications();

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  return (
    <NotificationProvider notificationFunctions={{ showSuccess, showError, showWarning, showInfo }}>
      <Index />

      <NotificationSystem 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
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