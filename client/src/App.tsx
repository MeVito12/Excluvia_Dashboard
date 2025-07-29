import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CategoryProvider } from "@/contexts/CategoryContext";
import { PermissionsProvider } from "@/contexts/PermissionsContext";
import Index from "./pages/Index";
import LoginForm from "@/components/LoginForm";

const AppContent = () => {
  const { isAuthenticated, login } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  return <Index />;
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