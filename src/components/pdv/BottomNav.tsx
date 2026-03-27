import React from 'react';
import { Home, Search, Receipt, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const BottomNav = () => {
  return (
    // Container com Glassmorphism (efeito vidro desfocado), altura maior e sombra elegante
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-border/50 h-[72px] flex items-center justify-around pb-safe pt-1 px-2 lg:hidden shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.1)]">
      
      {/* 1. ABA: Início */}
      <NavLink 
        to="/" 
        className={({ isActive }) => 
          `relative flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 active:scale-[0.85] ${
            isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`
        }
      >
        {({ isActive }) => (
          <>
            {/* Fundo redondo que aparece só quando ativo */}
            <div className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 ${isActive ? 'bg-primary/15' : 'bg-transparent'}`}>
              <Home 
                // Truque Mágico: fill-current preenche o ícone com a cor do texto!
                className={`w-[26px] h-[26px] transition-all duration-300 ${isActive ? 'scale-110 fill-current' : 'scale-100 fill-transparent'}`} 
                strokeWidth={isActive ? 2.5 : 2} 
              />
            </div>
            <span className={`text-[11px] tracking-wide transition-all ${isActive ? 'font-bold' : 'font-medium'}`}>
              Início
            </span>
          </>
        )}
      </NavLink>

      {/* 2. ABA: Busca (Mantida como botão por enquanto) */}
      <button className="relative flex flex-col items-center justify-center w-full h-full gap-1 text-muted-foreground hover:text-foreground transition-all duration-300 active:scale-[0.85]">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-full transition-colors bg-transparent hover:bg-secondary">
          <Search className="w-[26px] h-[26px] transition-all duration-300 scale-100 fill-transparent" strokeWidth={2} />
        </div>
        <span className="text-[11px] font-medium tracking-wide">Busca</span>
      </button>

      {/* 3. ABA: Pedidos (Mantida como botão por enquanto) */}
      <button className="relative flex flex-col items-center justify-center w-full h-full gap-1 text-muted-foreground hover:text-foreground transition-all duration-300 active:scale-[0.85]">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-full transition-colors bg-transparent hover:bg-secondary">
          <Receipt className="w-[26px] h-[26px] transition-all duration-300 scale-100 fill-transparent" strokeWidth={2} />
        </div>
        <span className="text-[11px] font-medium tracking-wide">Pedidos</span>
      </button>

      {/* 4. ABA: Perfil */}
      <NavLink 
        to="/admin/configuracoes" 
        className={({ isActive }) => 
          `relative flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 active:scale-[0.85] ${
            isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <div className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 ${isActive ? 'bg-primary/15' : 'bg-transparent'}`}>
              <User 
                className={`w-[26px] h-[26px] transition-all duration-300 ${isActive ? 'scale-110 fill-current' : 'scale-100 fill-transparent'}`} 
                strokeWidth={isActive ? 2.5 : 2} 
              />
            </div>
            <span className={`text-[11px] tracking-wide transition-all ${isActive ? 'font-bold' : 'font-medium'}`}>
              Perfil
            </span>
          </>
        )}
      </NavLink>
    </nav>
  );
};
