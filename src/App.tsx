import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./features/homepage/pages/Index";
import Kindred from "./features/kindred/pages/Kindred";
import FantasyBasketball from "./features/fantasy-basketball/pages/FantasyBasketball";
import GuildManager from "./features/guild-manager/pages/GuildManager";
import AdminDashboard from "./features/guild-manager/pages/AdminDashboard";
import ManhuaTracker from "./features/manhua-tracker/pages/ManhuaTracker";
import BankDetail from "./features/banks/pages/BankDetail";
import MigrateImages from "./pages/MigrateImages";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/kindred" element={<Kindred />} />
            <Route path="/fantasy-basketball" element={<FantasyBasketball />} />
            <Route path="/guild-manager" element={<GuildManager />} />
            <Route path="/guild-manager/admin" element={<AdminDashboard />} />
            <Route path="/manhua-tracker" element={<ManhuaTracker />} />
            <Route path="/banks/:slug" element={<BankDetail />} />
            <Route path="/migrate-images" element={<MigrateImages />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
