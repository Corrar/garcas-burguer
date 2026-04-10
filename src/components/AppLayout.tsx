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
    <div className="flex h-screen overflow-hidden bg-background">

      {/* Sidebar (Painel Lateral) */}
      <aside className="w-[88px] lg:w-72 bg-card border-r border-border/50 flex flex-col shrink-0 z-40 transition-all duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">

        {/* Cabeçalho do Menu (Logo) */}
        <div className="h-[88px] flex items-center justify-center lg:justify-start lg:px-6 border-b border-border/50 shrink-0">
          <Link to="/" className="flex items-center gap-3 group active:scale-95 transition-transform">
            <div className="relative w-12 h-12 rounded-[14px] overflow-hidden shadow-sm border border-border/50 group-hover:scale-105 transition-transform duration-300">
              <img src={logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="font-display font-extrabold text-xl text-foreground tracking-tight group-hover:text-primary transition-colors leading-none mb-1">
                GARÇA'S
              </span>
              <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase leading-none">
                Burguer
              </span>
            </div>
          </Link>
        </div>

        {/* Links de Navegação */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 lg:px-4 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;

            return (
              <Link
                key={to}
                to={to}
                className={`relative flex items-center justify-center lg:justify-start gap-4 px-3 py-3.5 rounded-2xl transition-all duration-300 active:scale-[0.98] group ${active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                  }`}
              >
                {/* Indicador lateral (aquela barrinha na esquerda indicando a página ativa) */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-r-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                )}

                {/* Ícone com truque de preenchimento (fill) se estiver ativo */}
                <div className="relative flex items-center justify-center">
                  <Icon
                    className={`w-6 h-6 transition-all duration-300 ${active ? 'scale-110 fill-current' : 'scale-100 fill-transparent group-hover:scale-110'}`}
                    strokeWidth={active ? 2.5 : 2}
                  />
                </div>

                {/* Texto (Só aparece em telas grandes) */}
                <span className={`hidden lg:block text-sm tracking-wide transition-all ${active ? 'font-bold' : 'font-medium'}`}>
                  {label}
                </span>

                {/* Opcional: Efeito hover no ícone quando o menu tá fechado (tablet/mobile) */}
                {!active && (
                  <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-border/50 transition-colors" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Rodapé da Sidebar (Versão do Sistema) */}
        <div className="p-4 border-t border-border/50 shrink-0 text-center lg:text-left">
          <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest hidden lg:block">Sistema PDV • v2.0</span>
          <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest lg:hidden">v2.0</span>
        </div>
      </aside>

      {/* Área Principal de Conteúdo (Onde as telas abrem) */}
      <main className="flex-1 overflow-auto bg-background/50 relative">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;