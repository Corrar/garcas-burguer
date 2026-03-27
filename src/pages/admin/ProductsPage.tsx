import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import type { Category, Product } from '@/types';
import { CATEGORY_LABELS } from '@/types';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

const emptyProduct: Partial<Product> = { name: '', description: '', price: 0, category: 'burgers', image: '', popular: false, customizations: [] };

export const ProductsPage = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [editing, setEditing] = useState<Partial<Product> & { isNew?: boolean } | null>(null);
  const [customizationsInput, setCustomizationsInput] = useState('');

  const openEdit = (prod: Product | null) => {
    if (prod) {
      setEditing(prod);
      setCustomizationsInput(prod.customizations?.join(', ') || '');
    } else {
      setEditing({ ...emptyProduct, isNew: true });
      setCustomizationsInput('');
    }
  };

  const handleSave = () => {
    if (!editing?.name || editing.price === undefined) {
      toast.error('Preencha nome e preço');
      return;
    }
    
    const parsedCustomizations = customizationsInput.split(',').map(s => s.trim()).filter(Boolean);
    const finalProduct = { ...editing, customizations: parsedCustomizations };

    if (finalProduct.isNew) {
      const { isNew, id, ...rest } = finalProduct as any;
      addProduct(rest);
      toast.success('Produto criado!');
    } else if (finalProduct.id) {
      const { isNew, ...rest } = finalProduct as any;
      updateProduct(finalProduct.id, rest);
      toast.success('Produto atualizado!');
    }
    setEditing(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display text-primary">Cardápio</h1>
          <p className="text-muted-foreground mt-1">Gerencie os produtos, preços e customizações</p>
        </div>
        <button
          onClick={() => openEdit(null)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" /> Novo Produto
        </button>
      </div>

      <div className="bg-card border border-border flex flex-col rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 text-muted-foreground">
              <tr>
                <th className="p-4 font-medium">Produto</th>
                <th className="p-4 font-medium">Categoria</th>
                <th className="p-4 font-medium">Preço</th>
                <th className="p-4 font-medium">Destaque</th>
                <th className="p-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-xs">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4"><span className="bg-secondary px-2 py-1 rounded-md text-xs font-medium">{CATEGORY_LABELS[product.category]}</span></td>
                  <td className="p-4 font-medium">R$ {product.price.toFixed(2)}</td>
                  <td className="p-4">{product.popular ? <span className="text-amber-500 font-bold text-xs uppercase bg-amber-500/10 px-2 py-1 rounded-full">Popular</span> : '-'}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(product)} className="p-2 text-muted-foreground hover:bg-secondary rounded-lg transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => { if(window.confirm('Excluir?')) deleteProduct(product.id) }} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">Nenhum produto cadastrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-2xl">{editing.isNew ? 'Novo Produto' : 'Editar Produto'}</h3>
              <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <label className="text-sm font-medium">Nome do Produto</label>
                <input
                  value={editing.name || ''}
                  onChange={e => setEditing(prev => ({ ...prev!, name: e.target.value }))}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              
              <div className="col-span-2 space-y-1.5">
                <label className="text-sm font-medium">Descrição</label>
                <textarea
                  value={editing.description || ''}
                  onChange={e => setEditing(prev => ({ ...prev!, description: e.target.value }))}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-sm resize-none h-20 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Preço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editing.price || ''}
                  onChange={e => setEditing(prev => ({ ...prev!, price: parseFloat(e.target.value) || 0 }))}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Categoria</label>
                <select
                  value={editing.category || 'burgers'}
                  onChange={e => setEditing(prev => ({ ...prev!, category: e.target.value as Category }))}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-sm font-medium">URL da Imagem</label>
                <input
                  value={editing.image || ''}
                  onChange={e => setEditing(prev => ({ ...prev!, image: e.target.value }))}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-sm font-medium">Opções de Customização (Separadas por vírgula)</label>
                <p className="text-xs text-muted-foreground mb-1">
                  Ex: Sem Cebola, Sem Picles, Extra Bacon, Extra Cheddar
                </p>
                <input
                  value={customizationsInput}
                  onChange={e => setCustomizationsInput(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Ex: Sem Cebola, Extra Queijo"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Nota: Preços de extras (ex: Extra Bacon) são definidos criando um produto com o mesmo nome na categoria "Adicionais".
                </p>
              </div>

              <div className="col-span-2 flex items-center gap-2 mt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.popular || false}
                    onChange={e => setEditing(prev => ({ ...prev!, popular: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  <span className="ml-3 text-sm font-medium">Destacar como Popular</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors">Cancelar</button>
              <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors">
                Salvar Produto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
