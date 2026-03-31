import { Link, useLocation, Outlet } from 'react-router-dom';
import { Package, BarChart3, Settings, Image as ImageIcon, LayoutGrid, ChefHat, Store } from 'lucide-react';
import logo from '@/assets/logo.png';

// Nomes encurtados para caberem melhor na barra inferior do telemóvel
const navItems = [
  { to: '/admin/dashboard', label: 'Resumo', icon: BarChart3 },
  { to: '/admin/pedidos', label: 'Pedidos', icon: LayoutGrid },
  { to: '/admin/cozinha', label: 'Cozinha', icon: ChefHat },
  { to: '/admin/produtos', label: 'Cardápio', icon: Package },
  { to: '/admin/banners', label: 'Banners', icon: ImageIcon },
  { to: '/admin/configuracoes', label: 'Ajustes', icon: Settings },
];

const AdminLayout = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-muted/20">
      
      {/* ---------------------------------------------------------
          BARRA LATERAL (SIDEBAR) - Visível apenas no Desktop (lg) 
          --------------------------------------------------------- */}
      <aside className="hidden lg:flex w-64 bg-card border-r border-border flex-col shrink-0 shadow-sm z-20">
        <div className="p-6 flex items-center justify-center border-b border-border/50">
          <div className="flex flex-col items-center gap-3 text-center">
            <img src={logo} alt="Logo" className="w-16 h-16 rounded-2xl shadow-sm" />
            <span className="font-display text-xl text-primary font-bold">Portal do Parceiro</span>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-6 space-y-2 px-4">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium ${
                  active
                    ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border/50 bg-secondary/20">
          <Link to="/" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-background border border-border text-foreground hover:bg-secondary transition-all shadow-sm font-medium">
            <Store className="w-5 h-5 shrink-0" />
            <span>Ver a Loja</span>
          </Link>
        </div>
      </aside>

      {/* ---------------------------------------------------------
          CONTEÚDO PRINCIPAL (Mobile e Desktop)
          --------------------------------------------------------- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
        
        {/* Cabeçalho Mobile - Visível apenas no telemóvel */}
        <header className="lg:hidden flex items-center justify-between px-4 h-16 bg-card border-b border-border z-20 shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-9 h-9 rounded-lg shadow-sm" />
            <span className="font-display text-lg text-primary font-bold">Portal Admin</span>
          </div>
          <Link to="/" className="p-2 bg-secondary/50 hover:bg-secondary rounded-full text-foreground transition-colors" title="Ir para a loja">
            <Store className="w-5 h-5" />
          </Link>
        </header>

        {/* Área onde as páginas do painel são renderizadas */}
        {/* pb-[80px] adiciona espaço no fundo no telemóvel para a barra de navegação não tapar conteúdo */}
        <main className="flex-1 overflow-y-auto w-full p-4 lg:p-6 pb-[90px] lg:pb-6 scroll-smooth">
          <Outlet />
        </main>

        {/* ---------------------------------------------------------
            BARRA DE NAVEGAÇÃO INFERIOR - Visível apenas no Mobile
            --------------------------------------------------------- */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-border/50 h-[72px] flex items-center px-2 pb-safe shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.1)] overflow-x-auto no-scrollbar">
          <div className="flex items-center w-full justify-between min-w-max gap-1 px-1">
            {navItems.map(({ to, label, icon: Icon }) => {
              const active = location.pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative flex flex-col items-center justify-center w-[60px] h-[64px] transition-all duration-300 active:scale-[0.85] ${
                    active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 ${active ? 'bg-primary/15' : 'bg-transparent'}`}>
                    <Icon
                      className={`w-[22px] h-[22px] transition-all duration-300 ${active ? 'scale-110' : 'scale-100'}`}
                      strokeWidth={active ? 2.5 : 2}
                    />
                  </div>
                  <span className={`text-[10px] mt-0.5 tracking-tight truncate w-full text-center ${active ? 'font-bold' : 'font-medium'}`}>
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

    </div>
  );
};

export default AdminLayout;