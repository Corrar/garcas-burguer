import React from 'react';
import { Home, Search, Receipt, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border h-16 flex items-center justify-around pb-safe lg:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <NavLink 
        to="/" 
        className={({ isActive }) => 
          `flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`
        }
      >
        <Home className="w-6 h-6" />
        <span className="text-[10px] font-medium">Início</span>
      </NavLink>

      <button className="flex flex-col items-center justify-center w-full h-full gap-1 text-muted-foreground hover:text-foreground transition-colors">
        <Search className="w-6 h-6" />
        <span className="text-[10px] font-medium">Busca</span>
      </button>

      <button className="flex flex-col items-center justify-center w-full h-full gap-1 text-muted-foreground hover:text-foreground transition-colors">
        <Receipt className="w-6 h-6" />
        <span className="text-[10px] font-medium">Pedidos</span>
      </button>

      <NavLink 
        to="/admin/configuracoes" 
        className={({ isActive }) => 
          `flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`
        }
      >
        <User className="w-6 h-6" />
        <span className="text-[10px] font-medium">Perfil</span>
      </NavLink>
    </nav>
  );
};
