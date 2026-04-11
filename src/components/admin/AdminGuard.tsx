import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';

export const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  // A única fonte de verdade agora é o LocalStorage
  const [token, setToken] = useState(() => localStorage.getItem('@burger-buddy:adminToken') || '');
  const [input, setInput] = useState('');

  // Escuta se o servidor nos expulsou (Erro 401)
  useEffect(() => {
    const handleLogout = () => setToken('');
    window.addEventListener('admin-logout', handleLogout);
    return () => window.removeEventListener('admin-logout', handleLogout);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Guarda a senha e avança. O backend é que vai decidir se a senha presta ou não!
    localStorage.setItem('@burger-buddy:adminToken', input.trim());
    setToken(input.trim());
  };

  // Se tem token (senha digitada), mostra o painel
  if (token) return <>{children}</>;

  // Se não tem token, mostra um design super minimalista e discreto
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative z-[100]">
      <form onSubmit={handleLogin} className="relative group">
        <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Acesso restrito..."
          className="w-64 pl-8 pr-4 py-2 bg-transparent border-b border-border/30 focus:border-primary outline-none text-center tracking-[0.3em] text-sm text-foreground transition-colors"
          autoFocus
        />
      </form>
    </div>
  );
};
