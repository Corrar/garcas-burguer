import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StoreProvider } from "@/context/StoreContext";
import PDVPage from "@/pages/PDVPage";
import KitchenPage from "@/pages/KitchenPage";
import OrdersPage from "@/pages/OrdersPage";
import { ProductsPage } from "@/pages/admin/ProductsPage";
import ReportsPage from "@/pages/ReportsPage";
import QRCodePage from "@/pages/QRCodePage";
import KioskPage from "@/pages/KioskPage";
import NotFound from "./pages/NotFound";

import ClientLayout from "@/components/ClientLayout";
import AdminLayout from "@/components/admin/AdminLayout";
import { SettingsPage } from "@/pages/admin/SettingsPage";
import { BannersPage } from "@/pages/admin/BannersPage";

const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <Routes>
      {/* B2C / Client App */}
      <Route element={<ClientLayout />}>
        <Route path="/" element={<PDVPage />} />
        <Route path="/kiosk" element={<KioskPage />} />
        <Route path="/qrcode" element={<QRCodePage />} />
      </Route>

      {/* B2B / Admin Panel */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<ReportsPage />} />
        <Route path="pedidos" element={<OrdersPage />} />
        <Route path="cozinha" element={<KitchenPage />} />
        <Route path="produtos" element={<ProductsPage />} />
        <Route path="banners" element={<BannersPage />} />
        <Route path="configuracoes" element={<SettingsPage />} />
      </Route>

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
