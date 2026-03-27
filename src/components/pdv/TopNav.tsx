import React from 'react';
import { NavLink } from 'react-router-dom';
import { Settings } from 'lucide-react';
import logo from '@/assets/logo.png';

export const TopNav = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background border-b border-border h-16 flex items-center px-4 lg:px-8 shadow-sm">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3">
          <img src={logo} alt="Garça's Burguer" className="h-10 w-10 rounded-full" />
          <span className="font-display font-bold text-xl text-primary mt-1">Garça's Burguer</span>
        </NavLink>
        
        <NavLink 
          to="/admin/configuracoes" 
          className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors hidden lg:flex items-center gap-2"
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm font-semibold">Gestão</span>
        </NavLink>
      </div>
    </header>
  );
};
