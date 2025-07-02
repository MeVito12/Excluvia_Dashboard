import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CategoryProvider, useCategory } from "@/contexts/CategoryContext";
import Index from "./pages/Index";
import LoginForm from "@/components/LoginForm";
import CategorySelector from "@/components/CategorySelector";

const AppContent = () => {
  const { isAuthenticated, login } = useAuth();
  const { isFirstLogin } = useCategory();

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  if (isFirstLogin) {
    return <CategorySelector />;
  }

  return <Index />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CategoryProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </CategoryProvider>
  </QueryClientProvider>
);

export default App;
