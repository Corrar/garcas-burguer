import React from 'react';
import { Home, Search, PackageOpen, User, LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';

// 1. Criamos uma interface para definir o que cada item de navegação precisa
interface NavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
}

// 2. Extraímos a lógica repetida para um componente reutilizável
const NavItem = ({ to, icon: Icon, label }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 active:scale-[0.85] ${
          isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div
            className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 ${
              isActive ? 'bg-primary/15' : 'bg-transparent'
            }`}
          >
            <Icon
              className={`w-[26px] h-[26px] transition-all duration-300 ${
                isActive ? 'scale-110 fill-current' : 'scale-100 fill-transparent'
              }`}
              strokeWidth={isActive ? 2.5 : 2}
            />
          </div>
          <span
            className={`text-[11px] tracking-wide transition-all ${
              isActive ? 'font-bold' : 'font-medium'
            }`}
          >
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
};

export const BottomNav = () => {
  // 3. O componente principal fica agora muito mais limpo e fácil de ler!
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-border/50 h-[72px] flex items-center justify-around pb-safe pt-1 px-2 lg:hidden shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.1)]">
      <NavItem to="/" icon={Home} label="Início" />
      <NavItem to="/busca" icon={Search} label="Busca" />
      <NavItem to="/meus-pedidos" icon={PackageOpen} label="Pedidos" />
      <NavItem to="/perfil" icon={User} label="Perfil" />
    </nav>
  );
};