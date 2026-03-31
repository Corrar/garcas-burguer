import React, { useState } from 'react';
import { X, User, Lock, Phone } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { toast } from 'sonner';

export const CustomerLoginModal = ({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) => {
  const { setCustomer } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }
    if (!isLogin && !name) {
      toast.error("Preencha seu nome para criar a conta!");
      return;
    }

    // Faz o Login ou Cadastro salvando os dados no App
    setCustomer({ 
      name: isLogin ? (name || "Cliente") : name, 
      phone 
    });
    
    toast.success(isLogin ? "Bem-vindo de volta!" : "Conta criada com sucesso!");
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
      <div className="bg-background sm:border border-border/50 rounded-t-[2rem] sm:rounded-3xl w-full max-w-md flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300 overflow-hidden pb-safe">
        
        <div className="flex justify-between items-center p-6 border-b border-border/50 bg-card">
          <h3 className="font-display text-2xl font-bold text-foreground">
            {isLogin ? 'Fazer Login' : 'Criar Conta'}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:bg-secondary p-2 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-secondary/10">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="João Silva" className="w-full bg-card border border-border focus:border-primary rounded-xl py-3.5 pl-11 pr-4 outline-none transition-all shadow-sm" />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">WhatsApp / Celular</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(11) 99999-9999" className="w-full bg-card border border-border focus:border-primary rounded-xl py-3.5 pl-11 pr-4 outline-none transition-all shadow-sm" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-card border border-border focus:border-primary rounded-xl py-3.5 pl-11 pr-4 outline-none transition-all shadow-sm" />
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full py-4 bg-primary text-primary-foreground text-[17px] font-bold rounded-xl shadow-lg shadow-primary/30 active:scale-[0.98] transition-all">
              {isLogin ? 'Entrar e Continuar' : 'Cadastrar e Continuar'}
            </button>
          </div>
          
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="w-full py-2 text-[15px] font-bold text-muted-foreground hover:text-primary transition-colors">
            {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
          </button>
        </form>
      </div>
    </div>
  );
};