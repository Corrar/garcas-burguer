import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Trash2, Plus, Image as ImageIcon, X, Power } from 'lucide-react';
import { toast } from 'sonner';
import type { PromoBanner } from '@/types';

export const BannersPage = () => {
  const { promoBanners, addPromoBanner, updatePromoBanner, removePromoBanner } = useStore();
  
  // Estados para o Modal de Adicionar
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // Estado para o Modal de Exclusão Seguro
  const [bannerToDelete, setBannerToDelete] = useState<PromoBanner | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('O título da oferta é obrigatório.');
      return;
    }
    
    addPromoBanner({
      title: newTitle,
      imageUrl: newUrl || 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop', // fallback
      active: true,
    });
    
    setNewTitle('');
    setNewUrl('');
    setIsAdding(false);
    toast.success('Banner adicionado com sucesso!');
  };

  const confirmDelete = () => {
    if (bannerToDelete) {
      removePromoBanner(bannerToDelete.id);
      toast.success('Banner removido!');
      setBannerToDelete(null);
    }
  };

  return (
    <div className="p-4 lg:p-8 min-h-full pb-32 lg:pb-12 bg-background flex flex-col">
      
      {/* Cabeçalho */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in slide-in-from-left-4 fade-in duration-500 shrink-0">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-foreground font-bold tracking-tight">Painel de Banners</h1>
          <p className="text-muted-foreground text-sm font-medium mt-1">Configure os destaques promocionais da loja</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-full font-bold hover:bg-primary/90 transition-transform active:scale-95 shadow-sm shadow-primary/30"
        >
          <Plus className="w-5 h-5" /> Novo Banner
        </button>
      </div>

      {/* Grid de Banners (Cartões estilo iFood) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-4">
        {promoBanners.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground animate-in fade-in">
            <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
            <p className="font-bold text-lg text-foreground">Nenhum banner cadastrado</p>
            <p className="text-sm">Adicione um banner para dar destaque a promoções.</p>
          </div>
        ) : (
          promoBanners.map((banner, index) => (
            <div 
              key={banner.id} 
              style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
              className={`bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col animate-in slide-in-from-bottom-4 fade-in ${
                banner.active ? 'border-border/50' : 'border-dashed border-muted-foreground/30 opacity-75'
              }`}
            >
              {/* Imagem Proporcional 21:9 */}
              <div className="w-full aspect-[21/9] bg-secondary/50 relative overflow-hidden group">
                <img 
                  src={banner.imageUrl} 
                  alt={banner.title} 
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${banner.active ? '' : 'grayscale'}`} 
                />
                
                {!banner.active && (
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="bg-background text-foreground text-xs font-bold px-3 py-1.5 rounded-full border border-border shadow-sm flex items-center gap-1.5">
                      <Power className="w-3 h-3" /> PAUSADO
                    </span>
                  </div>
                )}
              </div>
              
              {/* Rodapé do Banner */}
              <div className="p-4 flex items-center justify-between gap-4 bg-card z-10">
                <h3 className="font-bold text-foreground truncate flex-1">{banner.title}</h3>

                <div className="flex items-center gap-4 shrink-0">
                  <label className="flex items-center gap-2 cursor-pointer group" title={banner.active ? 'Pausar Banner' : 'Ativar Banner'}>
                    <div className="relative inline-flex items-center">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={banner.active}
                        onChange={(e) => updatePromoBanner(banner.id, { active: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 group-active:scale-95 transition-transform"></div>
                    </div>
                  </label>

                  <div className="w-px h-6 bg-border/50"></div>

                  <button
                    onClick={() => setBannerToDelete(banner)}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors active:scale-90"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL DE CRIAÇÃO */}
      {isAdding && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border sm:rounded-2xl rounded-t-3xl p-6 w-full max-w-lg shadow-2xl animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-300">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-2xl font-bold text-foreground">Novo Banner Promocional</h3>
              <button onClick={() => setIsAdding(false)} className="p-2 bg-secondary rounded-full text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-muted-foreground">Título da Promoção</label>
                <input
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Ex: Combo Família 20% OFF"
                  className="w-full bg-background border border-border/50 rounded-xl p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                  autoFocus
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-muted-foreground">URL da Imagem da Web</label>
                <p className="text-[11px] text-muted-foreground mb-1 leading-tight">
                  Cole o link da imagem. O sistema adapta fotos de qualquer tamanho.
                </p>
                
                <div className="flex gap-3 items-center">
                  <div className="w-24 h-12 shrink-0 bg-secondary/50 rounded-lg overflow-hidden border border-border flex items-center justify-center">
                    {newUrl ? (
                      <img 
                        src={newUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                        onError={(e) => (e.currentTarget.style.display = 'none')} 
                      />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-muted-foreground opacity-50" />
                    )}
                  </div>
                  <input
                    value={newUrl}
                    onChange={e => setNewUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-background border border-border/50 rounded-xl p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                  />
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-border/50 flex flex-col-reverse sm:flex-row justify-end gap-3">
                <button type="button" onClick={() => setIsAdding(false)} className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold bg-secondary text-foreground hover:bg-secondary/80 transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors shadow-sm shadow-primary/30">
                  Criar Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE EXCLUSÃO */}
      {bannerToDelete && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-5 mx-auto">
              <Trash2 className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-bold text-center text-foreground mb-2">Excluir Banner?</h3>
            <p className="text-center text-muted-foreground text-sm mb-6">
              Tem certeza que deseja apagar o banner <strong className="text-foreground">"{bannerToDelete.title}"</strong>? 
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setBannerToDelete(null)} 
                className="flex-1 px-4 py-3 rounded-xl bg-secondary text-foreground hover:bg-secondary/80 font-bold text-sm transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 px-4 py-3 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold text-sm transition-colors shadow-sm"
              >
                Sim, Apagar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};