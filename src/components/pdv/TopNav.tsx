import React from 'react';
import { NavLink } from 'react-router-dom';
import { Settings } from 'lucide-react';
import logo from '@/assets/logo.png';

export const TopNav = () => {
  return (
    // Header fixo com efeito "Vidro" (backdrop-blur) e borda sutil
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/50 h-[72px] flex items-center px-4 lg:px-8 shadow-sm transition-all duration-300">
      
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Lado Esquerdo: Marca / Logo (com efeito de grupo no hover) */}
        <NavLink to="/" className="group flex items-center gap-3 active:scale-[0.98] transition-transform">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border border-border/50 shadow-sm">
            <img 
              src={logo} 
              alt="Garça's Burguer" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            />
          </div>
          <span className="font-display font-bold text-xl text-foreground tracking-tight group-hover:text-primary transition-colors">
            Garça's Burguer
          </span>
        </NavLink>
        
        {/* Lado Direito: Acesso à Gestão (Só aparece em telas maiores - Tablet/Desktop) */}
        <NavLink 
          to="/admin/configuracoes" 
          className="hidden lg:flex items-center gap-2.5 px-4 py-2 bg-card border border-border/50 text-muted-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/30 rounded-full transition-all duration-300 active:scale-95 shadow-sm"
        >
          <Settings className="w-[18px] h-[18px]" strokeWidth={2.5} />
          <span className="text-sm font-bold tracking-wide">Gestão</span>
        </NavLink>
        
      </div>
    </header>
  );
};
