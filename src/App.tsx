import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import CropAdvisor from "./pages/CropAdvisor";
import DiseaseDetect from "./pages/DiseaseDetect";
import WeatherPage from "./pages/WeatherPage";
import MarketPage from "./pages/MarketPage";
import KnowledgeBase from "./pages/KnowledgeBase";
import AIChatPage from "./pages/AIChatPage";
import YieldPredictor from "./pages/YieldPredictor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/crop-advisor" element={<CropAdvisor />} />
            <Route path="/disease-detect" element={<DiseaseDetect />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/market" element={<MarketPage />} />
            <Route path="/knowledge" element={<KnowledgeBase />} />
            <Route path="/chat" element={<AIChatPage />} />
            <Route path="/yield-predictor" element={<YieldPredictor />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
