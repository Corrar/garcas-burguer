import React, { useState, useEffect } from 'react';
import { Bike, Store, UtensilsCrossed, ArrowLeft } from 'lucide-react';
import type { OrderType } from '@/types';
import logo from '@/assets/logo.png';

interface WelcomeModalProps {
  onSelect: (type: OrderType, table?: string) => void;
}

// ----------------------------------------------------------------------
// 1. COMPONENTE DA ANIMAÇÃO: O Hambúrguer Sendo Montado
// Criamos os ingredientes com divs do Tailwind e atrasos na animação.
// ----------------------------------------------------------------------
const BurgerLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 h-56 animate-in fade-in duration-700">
      {/* Pão de cima */}
      <div className="w-24 h-10 bg-[#E89B53] rounded-t-full shadow-inner animate-bounce-in" style={{ animationDelay: '0ms' }} />
      {/* Alface */}
      <div className="w-28 h-3 bg-[#52B44B] rounded-full shadow-sm animate-bounce-in" style={{ animationDelay: '300ms' }} />
      {/* Tomate */}
      <div className="flex gap-1 animate-bounce-in" style={{ animationDelay: '600ms' }}>
        <div className="w-12 h-3 bg-[#E33D33] rounded-full shadow-sm" />
        <div className="w-12 h-3 bg-[#E33D33] rounded-full shadow-sm" />
      </div>
      {/* Queijo (Levemente inclinado para dar charme) */}
      <div className="w-26 h-3 bg-[#F4D03F] rotate-2 shadow-sm animate-bounce-in" style={{ animationDelay: '900ms' }} />
      {/* Carne (Estilo Smash) */}
      <div className="w-26 h-6 bg-[#5C3A21] rounded-xl shadow-md animate-bounce-in" style={{ animationDelay: '1200ms' }} />
      {/* Pão de baixo */}
      <div className="w-24 h-6 bg-[#E89B53] rounded-b-xl shadow-inner animate-bounce-in" style={{ animationDelay: '1500ms' }} />
      
      <p className="mt-8 text-primary font-bold animate-pulse tracking-widest text-sm">
        MONTANDO SEU PEDIDO...
      </p>
    </div>
  );
};

// ----------------------------------------------------------------------
// 2. COMPONENTE PRINCIPAL: O Modal de Boas-vindas
// ----------------------------------------------------------------------
export const WelcomeModal = ({ onSelect }: WelcomeModalProps) => {
  // Controle de fluxo: começa no 'loading', vai pro 'selection' e talvez 'table'
  const [step, setStep] = useState<'loading' | 'selection' | 'table'>('loading');
  const [table, setTable] = useState('');

  // Efeito educativo: Assim que o componente nasce (step === 'loading'), 
  // ele conta 3 segundos (3000ms) e muda automaticamente para 'selection'.
  useEffect(() => {
    if (step === 'loading') {
      const timer = setTimeout(() => {
        setStep('selection');
      }, 3000);
      return () => clearTimeout(timer); // Limpa o timer se o componente fechar antes
    }
  }, [step]);

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col justify-center items-center p-6 transition-all">
      {/* Estilos CSS injetados para a animação de "kikar" dos ingredientes */}
      <style>{`
        @keyframes bounce-in {
          0% { opacity: 0; transform: translateY(-50px); }
          60% { opacity: 1; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          opacity: 0;
        }
        /* Garantir largura do queijo/carne sem quebrar o Tailwind */
        .w-26 { width: 6.5rem; } 
      `}</style>

      {/* Container principal com bordas mais arredondadas e sombra suave (iFood style) */}
      <div className="w-full max-w-sm flex flex-col items-center bg-card p-8 rounded-[2rem] shadow-2xl border border-border/50 min-h-[400px] justify-center">
        
        {/* Passo 1: Animação */}
        {step === 'loading' && <BurgerLoader />}

        {/* Passo 2: Seleção de como receber o pedido */}
        {step === 'selection' && (
          <div className="w-full animate-in slide-in-from-bottom-8 fade-in duration-500">
            <div className="flex justify-center mb-6">
              <img src={logo} alt="Logo" className="w-24 h-24 rounded-2xl shadow-md object-cover" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2 text-center">Como vai ser hoje?</h1>
            <p className="text-muted-foreground text-center mb-8 text-sm">Escolha como deseja receber sua experiência.</p>

            <div className="w-full space-y-3">
              {/* Botões refeitos: grupo para efeito de hover conjunto, ícones destacados */}
              <button 
                onClick={() => onSelect('delivery')}
                className="w-full group flex items-center p-4 bg-background border border-border rounded-2xl hover:border-primary hover:shadow-md transition-all gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Bike className="w-6 h-6" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-foreground text-base">Entregar em casa</h3>
                  <p className="text-xs text-muted-foreground">Delivery rápido e seguro</p>
                </div>
              </button>

              <button 
                onClick={() => onSelect('pickup')}
                className="w-full group flex items-center p-4 bg-background border border-border rounded-2xl hover:border-primary hover:shadow-md transition-all gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Store className="w-6 h-6" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-foreground text-base">Retirar na Loja</h3>
                  <p className="text-xs text-muted-foreground">Pegue no balcão sem fila</p>
                </div>
              </button>

              <button 
                onClick={() => setStep('table')}
                className="w-full group flex items-center p-4 bg-background border border-border rounded-2xl hover:border-primary hover:shadow-md transition-all gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-foreground text-base">Comer aqui</h3>
                  <p className="text-xs text-muted-foreground">Já estou em uma mesa</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Passo 3: Input da Mesa */}
        {step === 'table' && (
          <div className="w-full animate-in slide-in-from-right-8 fade-in duration-300">
            <button 
              onClick={() => setStep('selection')}
              className="mb-6 flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </button>
            
            <h3 className="text-xl font-bold text-foreground text-center mb-2">Qual é a sua mesa?</h3>
            <p className="text-sm text-muted-foreground text-center mb-6">Digite o número para levarmos seu pedido.</p>
            
            <input 
              type="number"
              autoFocus
              value={table}
              onChange={e => setTable(e.target.value)}
              placeholder="Ex: 05"
              className="w-full bg-background border-2 border-border rounded-2xl p-4 text-center text-2xl font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all mb-6"
            />
            
            <button 
              onClick={() => { if(table.trim()) onSelect('dine-in', table) }} 
              disabled={!table.trim()}
              className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity shadow-lg shadow-primary/30"
            >
              Confirmar Mesa
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
