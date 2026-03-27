import { Star, Clock, Bike } from 'lucide-react';
import logo from '@/assets/logo.png';
import { useStore } from '@/context/StoreContext';

export const StoreHeader = () => {
  const { settings } = useStore();
  
  return (
    <div className="flex items-start gap-4 mb-6">
      <img src={logo} alt="Garça's Burguer" className="w-16 h-16 rounded-full object-cover border border-border shadow-sm" />
      <div className="flex-1">
        <h1 className="font-display text-2xl lg:text-3xl text-foreground flex items-center gap-2">
          Garça's Burguer
          <span className="flex items-center gap-1 text-sm font-sans font-bold bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">
            <Star className="w-3 h-3 fill-current" />
            4.9
          </span>
        </h1>
        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5 opacity-80">
            <Clock className="w-4 h-4" />
            <span>{settings.estimatedDeliveryTime || '30-40 min'}</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-border" />
          <div className="flex items-center gap-1.5">
            <Bike className="w-4 h-4 text-success" />
            <span className="text-success font-medium">
              {settings.deliveryFee === 0 ? 'Entrega Grátis' : `Entrega R$ ${settings.deliveryFee.toFixed(2)}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
