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
import AuthForm from "@/components/AuthForm";

const AppContent = () => {
  const { user, loading } = useAuth();
  const { notifications, removeNotification, showSuccess, showError, showWarning, showInfo } = useNotifications();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--dashboard-darker))] to-[hsl(var(--dashboard-dark))] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onLogin={() => {}} />;
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
        <PermissionsProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </TooltipProvider>
        </PermissionsProvider>
      </AuthProvider>
    </CategoryProvider>
  </QueryClientProvider>
);

export default App;