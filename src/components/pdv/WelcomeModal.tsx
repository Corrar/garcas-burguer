import React, { useState } from 'react';
import { Bike, Store, UtensilsCrossed } from 'lucide-react';
import type { OrderType } from '@/types';
import logo from '@/assets/logo.png';

interface WelcomeModalProps {
  onSelect: (type: OrderType, table?: string) => void;
}

export const WelcomeModal = ({ onSelect }: WelcomeModalProps) => {
  const [showTableInput, setShowTableInput] = useState(false);
  const [table, setTable] = useState('');

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col justify-center items-center p-6 animate-in fade-in">
      <div className="w-full max-w-sm flex flex-col items-center">
        <img src={logo} alt="Logo" className="w-28 h-28 rounded-xl shadow-lg mb-6" />
        <h1 className="text-3xl font-display text-primary mb-2 text-center">Bem-vindo(a)!</h1>
        <p className="text-muted-foreground text-center mb-8">Como você deseja fazer o seu pedido hoje?</p>

        {showTableInput ? (
          <div className="w-full space-y-4 animate-in slide-in-from-bottom-4">
            <h3 className="font-semibold text-center mb-2">Qual o número da sua mesa?</h3>
            <input 
              type="text"
              autoFocus
              value={table}
              onChange={e => setTable(e.target.value)}
              placeholder="Ex: 12"
              className="w-full bg-secondary border border-border rounded-xl p-4 text-center text-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowTableInput(false)} className="flex-1 py-3 rounded-xl bg-secondary text-foreground font-medium">Voltar</button>
              <button 
                onClick={() => { if(table.trim()) onSelect('dine-in', table) }} 
                className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-bold"
              >
                Confirmar
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-4">
            <button 
              onClick={() => onSelect('delivery')}
              className="w-full flex items-center p-4 bg-card border border-border rounded-2xl shadow-sm hover:border-primary transition-colors gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Bike className="w-6 h-6" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-bold text-lg">Entrega (Delivery)</h3>
                <p className="text-sm text-muted-foreground">Receba no seu endereço</p>
              </div>
            </button>

            <button 
              onClick={() => onSelect('pickup')}
              className="w-full flex items-center p-4 bg-card border border-border rounded-2xl shadow-sm hover:border-primary transition-colors gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Store className="w-6 h-6" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-bold text-lg">Retirar na Loja</h3>
                <p className="text-sm text-muted-foreground">Pegue seu pedido no balcão</p>
              </div>
            </button>

            <button 
              onClick={() => setShowTableInput(true)}
              className="w-full flex items-center p-4 bg-card border border-border rounded-2xl shadow-sm hover:border-primary transition-colors gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-bold text-lg">Comer no Local</h3>
                <p className="text-sm text-muted-foreground">Estou em uma mesa</p>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
