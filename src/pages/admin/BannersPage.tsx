import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export const BannersPage = () => {
  const { promoBanners, addPromoBanner, updatePromoBanner, removePromoBanner } = useStore();
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('O título é obrigatório.');
      return;
    }
    
    addPromoBanner({
      title: newTitle,
      imageUrl: newUrl || 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop', // default fallback
      active: true,
    });
    
    setNewTitle('');
    setNewUrl('');
    setIsAdding(false);
    toast.success('Banner adicionado com sucesso!');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display text-primary">Gerenciar Banners</h1>
          <p className="text-muted-foreground mt-1">Configure os destaques promocionais do B2C</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          {isAdding ? <Trash2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {isAdding ? 'Cancelar' : 'Novo Banner'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-card border border-border p-5 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título da Oferta</label>
              <input
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Ex: Black Friday 50% OFF"
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">URL da Imagem (Opcional)</label>
              <input
                value={newUrl}
                onChange={e => setNewUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Adicionar Banner
            </button>
          </div>
        </form>
      )}

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {promoBanners.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
            <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
            <p>Nenhum banner cadastrado.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {promoBanners.map(banner => (
              <div key={banner.id} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                <div className="w-32 h-16 shrink-0 rounded-lg overflow-hidden bg-muted relative">
                  <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                  {!banner.active && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-xs text-white font-bold">INATIVO</div>}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-base">{banner.title}</h3>
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-sm font-medium text-muted-foreground">{banner.active ? 'Ativo' : 'Inativo'}</span>
                    <div className="relative inline-flex items-center">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={banner.active}
                        onChange={(e) => updatePromoBanner(banner.id, { active: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success"></div>
                    </div>
                  </label>

                  <button
                    onClick={() => {
                      if(window.confirm('Tem certeza que deseja excluir?')) {
                        removePromoBanner(banner.id);
                      }
                    }}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
