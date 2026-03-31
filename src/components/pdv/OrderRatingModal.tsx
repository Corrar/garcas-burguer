import React, { useState } from 'react';
import { Star, X, MessageSquareHeart } from 'lucide-react';
import { toast } from 'sonner';
import type { Order } from '@/types';

interface OrderRatingModalProps {
  order: Order;
  onClose: () => void;
  onSubmit: (ratings: Record<string, number>, feedback: string) => void;
}

export const OrderRatingModal: React.FC<OrderRatingModalProps> = ({ order, onClose, onSubmit }) => {
  // Configuração Dinâmica das Perguntas com base no tipo de pedido
  const evaluationAspects = {
    'delivery': [
      { id: 'time', label: 'Tempo de Entrega' },
      { id: 'packaging', label: 'Qualidade da Embalagem' },
      { id: 'food', label: 'Sabor e Temperatura da Comida' },
      { id: 'app', label: 'Experiência com o App' }
    ],
    'pickup': [
      { id: 'speed', label: 'Agilidade na Retirada' },
      { id: 'service', label: 'Cordialidade no Atendimento' },
      { id: 'food', label: 'Qualidade do Pedido' },
      { id: 'app', label: 'Facilidade de pedir pelo App' }
    ],
    'dine-in': [
      { id: 'waiter', label: 'Atendimento da Equipe' },
      { id: 'atmosphere', label: 'Ambiente e Limpeza' },
      { id: 'food', label: 'Apresentação e Sabor' },
      { id: 'speed', label: 'Tempo de Preparo' }
    ]
  };

  // CORREÇÃO: Lê 'orderType' ou 'type' ignorando o bloqueio do TypeScript. Padrão: 'pickup'
  const typeValue = (order as any).orderType || (order as any).type || 'pickup';
  const currentAspects = evaluationAspects[typeValue as keyof typeof evaluationAspects] || evaluationAspects['pickup'];

  // Estado para guardar as notas de cada aspeto (inicia vazio)
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState('');

  const handleStarClick = (aspectId: string, rating: number) => {
    setRatings(prev => ({ ...prev, [aspectId]: rating }));
  };

  const handleSubmit = () => {
    // Verifica se avaliou tudo
    if (Object.keys(ratings).length < currentAspects.length) {
      toast.error('Por favor, avalie todos os itens para nos ajudar a melhorar!');
      return;
    }
    
    // Passa os dados para a função "pai" e fecha
    onSubmit(ratings, feedback);
    toast.success('Avaliação enviada! Muito obrigado pelo feedback.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-card border border-border sm:rounded-3xl rounded-t-[2rem] w-full max-w-md flex flex-col shadow-2xl animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-300 overflow-hidden">
        
        {/* Cabeçalho */}
        <div className="px-6 py-5 border-b border-border/50 flex justify-between items-center bg-secondary/20">
          <div>
            <h3 className="font-display text-2xl font-bold text-foreground leading-tight">Avalie seu pedido</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Pedido #{(order as any).number || order.id.slice(0, 5).toUpperCase()}
            </p>
          </div>
          <button onClick={onClose} className="p-2 bg-background border border-border rounded-full text-muted-foreground hover:text-foreground transition-colors shadow-sm active:scale-95">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo com as Estrelas */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6 custom-scrollbar">
          <div className="text-center mb-2 animate-in zoom-in duration-500 delay-100">
            <MessageSquareHeart className="w-12 h-12 text-primary mx-auto mb-3 opacity-80" />
            <p className="text-sm font-medium text-foreground">Como foi sua experiência com o nosso serviço hoje?</p>
          </div>

          <div className="space-y-6 bg-secondary/10 border border-border/50 p-5 rounded-2xl shadow-sm">
            {currentAspects.map((aspect, index) => (
              <div 
                key={aspect.id} 
                className="flex flex-col gap-2 animate-in slide-in-from-left-4 fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <label className="text-sm font-bold text-foreground">{aspect.label}</label>
                <div className="flex items-center gap-1 sm:gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const currentRating = ratings[aspect.id] || 0;
                    const isFilled = star <= currentRating;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(aspect.id, star)}
                        className={`transition-all duration-300 active:scale-75 p-1 ${
                          isFilled 
                            ? 'text-amber-400 drop-shadow-sm scale-110' 
                            : 'text-muted-foreground/30 hover:text-amber-400/50 hover:scale-110'
                        }`}
                      >
                        <Star className="w-8 h-8 sm:w-9 sm:h-9" fill={isFilled ? "currentColor" : "none"} strokeWidth={isFilled ? 1 : 2} />
                      </button>
                    );
                  })}
                  <span className="ml-auto text-xs font-bold text-muted-foreground bg-background border border-border px-2.5 py-1.5 rounded-lg shadow-sm">
                    {ratings[aspect.id] ? `${ratings[aspect.id]}/5` : '-'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Observações Extras */}
          <div className="space-y-2 animate-in slide-in-from-bottom-4 fade-in delay-300">
            <label className="text-sm font-bold text-foreground pl-1">Quer adicionar algum comentário?</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="O lanche estava incrível, mas esqueceram o guardanapo..."
              className="w-full bg-background border border-border/50 rounded-2xl p-4 text-sm text-foreground resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow shadow-sm"
            />
          </div>
        </div>

        {/* Rodapé Fixo com Botão */}
        <div className="p-5 border-t border-border/50 bg-background shrink-0">
          <button 
            onClick={handleSubmit} 
            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 transition-all active:scale-95 shadow-sm shadow-primary/30 flex items-center justify-center gap-2"
          >
            Enviar Avaliação
          </button>
        </div>
      </div>
    </div>
  );
};