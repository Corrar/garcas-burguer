import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StoreProvider } from "@/context/StoreContext";

// IMPORTAÇÕES - B2C (Área do Cliente)
import PDVPage from "@/pages/PDVPage";
import QRCodePage from "@/pages/QRCodePage";
import KioskPage from "@/pages/KioskPage";
import { CustomerOrdersPage } from "@/pages/CustomerOrdersPage";
import ProfilePage from "@/pages/ProfilePage";
import SearchPage from "@/pages/SearchPage"; // <-- A NOSSA NOVA PÁGINA DE BUSCA
import NotFound from "./pages/NotFound";

// IMPORTAÇÕES - B2B (Área de Administração)
import KitchenPage from "@/pages/KitchenPage";
import OrdersPage from "@/pages/OrdersPage";
import { ProductsPage } from "@/pages/admin/ProductsPage";
import ReportsPage from "@/pages/ReportsPage";
import { SettingsPage } from "@/pages/admin/SettingsPage";
import { BannersPage } from "@/pages/admin/BannersPage";

// IMPORTAÇÕES - Layouts e Proteções (Guards)
import ClientLayout from "@/components/ClientLayout";
import AdminLayout from "@/components/admin/AdminLayout";
import { AdminGuard } from "@/components/admin/AdminGuard";

const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <Routes>
      {/* B2C / Client App */}
      <Route element={<ClientLayout />}>
        <Route path="/" element={<PDVPage />} />
        <Route path="/kiosk" element={<KioskPage />} />
        <Route path="/qrcode" element={<QRCodePage />} />
        
        {/* ROTAS DO CLIENTE */}
        <Route path="/busca" element={<SearchPage />} /> {/* <-- NOVA ROTA AQUI */}
        <Route path="/meus-pedidos" element={<CustomerOrdersPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
      </Route>

      {/* B2B / Admin Panel - PROTEGIDO POR SENHA COM O ADMINGUARD */}
      <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
        <Route path="dashboard" element={<ReportsPage />} />
        <Route path="pedidos" element={<OrdersPage />} />
        <Route path="cozinha" element={<KitchenPage />} />
        <Route path="produtos" element={<ProductsPage />} />
        <Route path="banners" element={<BannersPage />} />
        <Route path="configuracoes" element={<SettingsPage />} />
      </Route>

      {/* Rota 404 - Página não encontrada */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <StoreProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </StoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;