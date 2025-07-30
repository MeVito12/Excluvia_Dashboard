import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CategoryProvider } from "@/contexts/CategoryContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { PermissionsProvider } from "@/contexts/PermissionsContext";
import { DemoProvider } from "@/contexts/DemoContext";
import NotificationSystem, { useNotifications } from "@/components/NotificationSystem";
import FloatingAIChat from "@/components/FloatingAIChat";
import Index from "./pages/Index";
import LoginForm from "@/components/LoginForm";

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
      <FloatingAIChat />
    </NotificationProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CategoryProvider>
      <DemoProvider>
        <AuthProvider>
          <PermissionsProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AppContent />
            </TooltipProvider>
          </PermissionsProvider>
        </AuthProvider>
      </DemoProvider>
    </CategoryProvider>
  </QueryClientProvider>
);

export default App;