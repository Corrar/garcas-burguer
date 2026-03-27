import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStore } from '@/context/StoreContext';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

const settingsSchema = z.object({
  isOpen: z.boolean(),
  estimatedDeliveryTime: z.string().min(1, 'O prazo de entrega é obrigatório'),
  deliveryFee: z.number().min(0, 'A taxa deve ser maior ou igual a zero'),
  minimumOrderValue: z.number().min(0, 'O valor mínimo deve ser maior ou igual a zero'),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export const SettingsPage = () => {
  const { settings, updateSettings } = useStore();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
  });

  const isOpen = watch('isOpen');

  const onSubmit = (data: SettingsFormValues) => {
    updateSettings(data);
    toast.success('Configurações salvas com sucesso!');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-display text-primary mb-6">Configurações da Loja</h1>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Loja Aberta/Fechada */}
          <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border">
            <div>
              <h3 className="font-semibold text-lg">Status do Restaurante</h3>
              <p className="text-sm text-muted-foreground">
                {isOpen ? 'A loja está aberta recebendo pedidos.' : 'A loja está fechada. Clientes não podem realizar pedidos.'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer cursor-allowed">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={isOpen}
                onChange={(e) => setValue('isOpen', e.target.checked, { shouldValidate: true })}
              />
              <div className="w-14 h-7 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-success"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Prazo Estimado de Entrega</label>
              <input
                {...register('estimatedDeliveryTime')}
                placeholder="Ex: 30-40 min"
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.estimatedDeliveryTime && <p className="text-xs text-destructive">{errors.estimatedDeliveryTime.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Taxa de Entrega (R$)</label>
              <input
                type="number"
                step="0.01"
                {...register('deliveryFee', { valueAsNumber: true })}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.deliveryFee && <p className="text-xs text-destructive">{errors.deliveryFee.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Pedido Mínimo (R$)</label>
              <input
                type="number"
                step="0.01"
                {...register('minimumOrderValue', { valueAsNumber: true })}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.minimumOrderValue && <p className="text-xs text-destructive">{errors.minimumOrderValue.message}</p>}
            </div>
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <Save className="w-5 h-5" />
              Salvar Configurações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
