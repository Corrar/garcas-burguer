import { Link, useLocation, Outlet } from 'react-router-dom';
import { Package, BarChart3, Settings, Image as ImageIcon, LayoutGrid, ChefHat, Store } from 'lucide-react';
import logo from '@/assets/logo.png';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/admin/pedidos', label: 'Pedidos', icon: LayoutGrid },
  { to: '/admin/cozinha', label: 'Cozinha', icon: ChefHat },
  { to: '/admin/produtos', label: 'Produtos', icon: Package },
  { to: '/admin/banners', label: 'Banners', icon: ImageIcon },
  { to: '/admin/configuracoes', label: 'Configurações', icon: Settings },
];

const AdminLayout = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="w-20 lg:w-64 bg-card border-r border-border flex flex-col shrink-0">
        <div className="p-4 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-lg" />
            <span className="hidden lg:block font-display text-xl text-primary">Admin Painel</span>
          </div>
        </div>
        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  active
                    ? 'bg-primary/15 text-primary force-active'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="hidden lg:block text-sm font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <Link to="/" className="flex items-center gap-3 px-3 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            <Store className="w-5 h-5 shrink-0" />
            <span className="hidden lg:block text-sm font-medium">Ver Loja (B2C)</span>
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-muted/20">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
