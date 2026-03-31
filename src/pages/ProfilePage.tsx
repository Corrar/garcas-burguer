import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock } from 'lucide-react'; // Sem o Grape, como vimos!
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
    if (adminPassword === 'admin123') {
      toast.success('Acesso Administrativo concedido!');
      navigate('/admin/dashboard');
    } else {
      toast.error('Senha incorreta! Acesso negado.');
      setAdminPassword('');
    }
  };

  return (
    // CORREÇÃO AQUI: 
    // Usamos flex-1, w-full, h-full para forçar o preenchimento total do espaço
    // que o ClientLayout disponibiliza, e mantemos o bg-background.
    <div className="flex-1 w-full h-full min-h-[100dvh] bg-background">
      <div className="p-6 max-w-md mx-auto space-y-6 pb-32 animate-in fade-in">
        
        {/* Cabeçalho da Página */}
        <div className="text-center space-y-2 mb-8 mt-4">
          <h1 className="text-3xl font-display text-primary">Meu Perfil</h1>
          <p className="text-muted-foreground">Sincronize ou gerencie sua conta</p>
        </div>

        {/* Cartão 1: Acesso do Cliente - Foco no GOOGLE LOGIN */}
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

        {/* Cartão 2: Acesso do Gerente (Administrador) */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm mt-8 opacity-70 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-destructive/10 rounded-full text-destructive">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Acesso Restrito</h2>
              <p className="text-sm text-muted-foreground">Apenas para a equipa do restaurante</p>
            </div>
          </div>

          {showAdminLogin ? (
            <form onSubmit={handleAdminLogin} className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <Lock className="w-4 h-4" /> Senha Administrativa
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Digite a senha..."
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdminLogin(false)}
                  className="flex-1 bg-secondary text-secondary-foreground py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Acessar
                </button>
              </div>
            </form>
          ) : (
            <button 
              onClick={() => setShowAdminLogin(true)}
              className="w-full flex items-center justify-center gap-2 border border-border text-foreground py-3 rounded-lg font-medium hover:bg-secondary transition-colors"
            >
              Sou Gerente
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;