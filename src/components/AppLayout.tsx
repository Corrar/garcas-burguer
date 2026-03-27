import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, ChefHat, LayoutGrid, Package, BarChart3, UtensilsCrossed, QrCode } from 'lucide-react';
import logo from '@/assets/logo.png';

const navItems = [
  { to: '/', label: 'PDV', icon: ShoppingCart },
  { to: '/menu', label: 'Cardápio', icon: UtensilsCrossed },
  { to: '/kitchen', label: 'Cozinha', icon: ChefHat },
  { to: '/orders', label: 'Pedidos', icon: LayoutGrid },
  { to: '/products', label: 'Produtos', icon: Package },
  { to: '/reports', label: 'Relatórios', icon: BarChart3 },
  { to: '/qrcode', label: 'QR Code', icon: QrCode },
];

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-20 lg:w-64 bg-card border-r border-border flex flex-col shrink-0">
        <div className="p-4 flex items-center gap-3 border-b border-border">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-lg" />
          <span className="hidden lg:block font-display text-2xl text-primary">GARÇA'S BURGUER</span>
        </div>
        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  active
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="hidden lg:block text-sm font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};

export default AppLayout;
