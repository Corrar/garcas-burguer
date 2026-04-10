import { useState } from 'react';
import { Star, X, CheckCircle2, MessageSquare } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Função que será chamada quando o usuário enviar a avaliação
  onSubmit: (feedback: { appRating: number; serviceRating: number; comment: string }) => void;
}

export const FeedbackModal = ({ isOpen, onClose, onSubmit }: FeedbackModalProps) => {
  // Estados para guardar as notas e o comentário
  const [appRating, setAppRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [comment, setComment] = useState('');
  
  // Estado para mostrar a tela de "Obrigado"
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Se o modal não estiver aberto, não renderiza nada
  if (!isOpen) return null;

  // Função que lida com o envio
  const handleSubmit = () => {
    onSubmit({ appRating, serviceRating, comment });
    setIsSubmitted(true);
    
    // Fecha o modal automaticamente após 2 segundos
    setTimeout(() => {
      setIsSubmitted(false);
      setAppRating(0);
      setServiceRating(0);
      setComment('');
      onClose();
    }, 2500);
  };

  // Componente interno para desenhar as estrelinhas
  const StarSelector = ({ rating, setRating, label }: { rating: number, setRating: (r: number) => void, label: string }) => (
    <div className="mb-4">
      <p className="text-sm font-medium text-foreground mb-2">{label}</p>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star 
              className={`w-8 h-8 ${rating >= star ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted-foreground'}`} 
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden relative">
        
        {/* Botão de Fechar */}
        {!isSubmitted && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="p-6">
          {isSubmitted ? (
            // Tela de Sucesso (Obrigado)
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in-95">
              <CheckCircle2 className="w-16 h-16 text-success mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Muito Obrigado!</h2>
              <p className="text-muted-foreground">
                Sua avaliação nos ajuda a melhorar nosso serviço a cada dia.
              </p>
            </div>
          ) : (
            // Tela de Avaliação
            <>
              <div className="mb-6 text-center">
                <h2 className="text-xl font-bold text-foreground mb-1">Como foi sua experiência?</h2>
                <p className="text-sm text-muted-foreground">Avalie seu pedido para nos ajudar a melhorar.</p>
              </div>

              {/* Avaliação do Aplicativo */}
              <StarSelector 
                label="Facilidade de usar o nosso App:" 
                rating={appRating} 
                setRating={setAppRating} 
              />

              {/* Avaliação do Atendimento/Serviço */}
              <StarSelector 
                label="Expectativa com o Atendimento/Pedido:" 
                rating={serviceRating} 
                setRating={setServiceRating} 
              />

              {/* Campo de Comentário */}
              <div className="mb-6">
                <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  Deixe um comentário (opcional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Conte para a gente o que achou..."
                  className="w-full h-24 p-3 text-sm rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                />
              </div>

              {/* Botão de Enviar */}
              <button
                onClick={handleSubmit}
                disabled={appRating === 0 && serviceRating === 0}
                className={`w-full py-3 rounded-xl font-bold text-white transition-colors ${
                  appRating === 0 && serviceRating === 0 
                    ? 'bg-muted-foreground/50 cursor-not-allowed' 
                    : 'bg-primary hover:bg-primary/90'
                }`}
              >
                Enviar Avaliação
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};