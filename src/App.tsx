import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import CropAdvisor from "./pages/CropAdvisor";
import DiseaseDetect from "./pages/DiseaseDetect";
import WeatherPage from "./pages/WeatherPage";
import MarketPage from "./pages/MarketPage";
import KnowledgeBase from "./pages/KnowledgeBase";
import AIChatPage from "./pages/AIChatPage";
import YieldPredictor from "./pages/YieldPredictor";
import AuthPage from "./pages/AuthPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={<AuthRoute><AuthPage /></AuthRoute>} />
    <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/crop-advisor" element={<CropAdvisor />} />
      <Route path="/disease-detect" element={<DiseaseDetect />} />
      <Route path="/weather" element={<WeatherPage />} />
      <Route path="/market" element={<MarketPage />} />
      <Route path="/knowledge" element={<KnowledgeBase />} />
      <Route path="/chat" element={<AIChatPage />} />
      <Route path="/yield-predictor" element={<YieldPredictor />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LanguageProvider>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
