import React, { useState } from 'react';
import { Lock } from 'lucide-react';

export const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  // Verifica se o dono já digitou a senha nesta sessão
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('@burger-buddy:admin-auth') === 'true';
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // A SENHA ESTÁ AQUI: "admin123" (Você pode mudar depois)
    if (password === 'admin123') { 
      sessionStorage.setItem('@burger-buddy:admin-auth', 'true');
      setIsAuthenticated(true);
    } else {
      setError(true);
    }
  };

  // Se já tiver a senha correta, mostra o painel de administração
  if (isAuthenticated) return <>{children}</>;

  // Se não tiver, mostra a tela de bloqueio
  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center p-4 relative z-[100]">
      <div className="bg-card border border-border/50 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="font-display text-2xl font-bold mb-2">Acesso Restrito</h2>
        <p className="text-muted-foreground text-sm mb-8">Área exclusiva para a gestão do Garça's Burguer.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Digite a Senha"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              className={`w-full bg-secondary border ${error ? 'border-destructive' : 'border-transparent'} focus:border-primary rounded-xl p-4 text-center text-lg font-bold tracking-widest`}
            />
            {error && <p className="text-destructive text-sm mt-2 font-medium">Senha incorreta!</p>}
          </div>
          <button type="submit" className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg active:scale-[0.98] transition-all shadow-lg shadow-primary/30">
            Acessar Sistema
          </button>
        </form>
      </div>
    </div>
  );
};