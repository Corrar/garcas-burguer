import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock } from 'lucide-react';
import { toast } from 'sonner';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Função para simular o login do cliente com o Google
  const handleGoogleUserLogin = () => {
    toast.info('Simulando Login com Google... (Aguardando configuração de Backend reais)');
  };

  // Função para validar o login do gerente
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminPassword.trim()) {
      toast.error('Digite a senha de acesso.');
      return;
    }

    // 👇 O FIM DO CONFLITO: A Vercel/Frontend já não decide se a senha está certa.
    // Guardamos o que foi digitado no "Cofre" do navegador e mandamos o utilizador para o painel.
    // Se a senha estiver errada, o Render (api.ts) vai bloqueá-lo e expulsá-lo automaticamente!
    localStorage.setItem('@burger-buddy:adminToken', adminPassword.trim());
    
    toast.success('Verificando credenciais...');
    
    // Navega para o painel. (Podes mudar para '/admin/produtos' se a tua rota for essa)
    navigate('/admin/dashboard'); 
  };

  return (
    <div className="flex-1 w-full h-full min-h-[100dvh] bg-background">
      <div className="p-6 max-w-md mx-auto space-y-6 pb-32 animate-in fade-in">
        
        {/* Cabeçalho da Página */}
        <div className="text-center space-y-2 mb-8 mt-4">
          <h1 className="text-3xl font-display text-primary">Meu Perfil</h1>
          <p className="text-muted-foreground">Sincronize ou gerencie sua conta</p>
        </div>

        {/* Cartão: Acesso do Cliente - Foco no GOOGLE LOGIN */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold">Sou Cliente</h2>
            <p className="text-sm text-muted-foreground mt-1">Conecte-se rapidinho para fazer seus pedidos</p>
          </div>
          
          <button 
            onClick={handleGoogleUserLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 py-3.5 rounded-lg font-medium hover:bg-gray-50 border border-gray-300 transition-all shadow-sm hover:scale-[1.01]"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.6 10.23c0-.65-.06-1.27-.16-1.87H10v3.54h5.38a4.6 4.6 0 01-2 3.01v2.51h3.24c1.9-1.75 2.98-4.32 2.98-7.19z" fill="#4285F4"/>
              <path d="M10 20c2.7 0 4.96-.9 6.61-2.43l-3.24-2.51c-.9.6-2.06.96-3.37.96-2.6 0-4.8-1.76-5.58-4.13H1.18v2.6C2.82 17.7 6.16 20 10 20z" fill="#34A853"/>
              <path d="M4.42 11.89a6 6 0 010-3.78V5.51H1.18a10 10 0 000 8.98l3.24-2.6z" fill="#FBBC05"/>
              <path d="M10 4.04c1.47 0 2.78.5 3.82 1.5l2.86-2.86C14.96.9 12.7 0 10 0 6.16 0 2.82 2.3 1.18 5.51l3.24 2.6c.78-2.37 2.98-4.13 5.58-4.13z" fill="#EA4335"/>
            </svg>
            <span className="text-base">Entrar com Google</span>
          </button>
        </div>

        {/* SECÇÃO DISCRETA DO GERENTE (MODO FURTIVO) */}
        <div className="pt-8">
          {!showAdminLogin ? (
            <div className="flex justify-center">
              <button 
                onClick={() => setShowAdminLogin(true)}
                className="p-3 text-muted-foreground/30 hover:text-primary transition-colors rounded-full hover:bg-secondary/50"
                title="Acesso Restrito"
              >
                {/* Ícone discreto no fundo da página */}
                <Shield className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleAdminLogin} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 bg-card border border-border/50 p-5 rounded-2xl shadow-sm">
              <div className="text-center mb-4">
                <Lock className="w-5 h-5 mx-auto mb-2 text-primary" />
                <h3 className="text-sm font-bold">Acesso Restrito</h3>
              </div>
              
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Senha do sistema..."
                className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-center tracking-widest"
                autoFocus
              />
              
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdminLogin(false)}
                  className="flex-1 bg-secondary text-secondary-foreground py-2.5 rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Entrar
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
