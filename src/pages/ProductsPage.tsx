import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import type { Category, Product } from '@/types';
import { CATEGORY_LABELS } from '@/types';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

const emptyProduct = { name: '', description: '', price: 0, category: 'burgers' as Category, image: '', popular: false };

const ProductsPage = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [editing, setEditing] = useState<Partial<Product> & { isNew?: boolean } | null>(null);

  // 1. Transformámos a função em 'async'
  const handleSave = async () => {
    if (!editing?.name || !editing.price) {
      toast.error('Preencha nome e preço');
      return;
    }
    
    // 2. Usamos try...catch para apanhar erros reais
    try {
      if (editing.isNew) {
        const { isNew, id, ...rest } = editing as any;
        await addProduct(rest); // Espera o servidor confirmar
        toast.success('Produto criado!');
      } else if (editing.id) {
        const { isNew, ...rest } = editing as any;
        await updateProduct(editing.id, rest); // Espera o servidor confirmar
        toast.success('Produto atualizado!');
      }
      
      // 3. Só fecha a janela se NÃO houver erro
      setEditing(null);
      
    } catch (error: any) {
      // 4. Se falhar, mostra o erro exato que veio da tua API
      console.error(error);
      toast.error(`Erro: ${error.message || 'Falha ao salvar produto'}`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      toast.success('Produto removido');
    } catch (error: any) {
      toast.error(`Erro ao remover: ${error.message}`);
    }
  };

  const grouped = (['burgers', 'combos', 'sides', 'drinks', 'extras'] as Category[]).map(cat => ({
    category: cat,
    items: products.filter(p => p.category === cat),
  }));

  return (
    <div className="p-4 lg:p-8 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-4xl text-primary">Gestão de Produtos</h1>
        <button
          onClick={() => setEditing({ ...emptyProduct, isNew: true })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Novo Produto
        </button>
      </div>

      {grouped.map(({ category, items }) => items.length > 0 && (
        <div key={category} className="mb-6">
          <h2 className="font-display text-2xl text-muted-foreground mb-3">{CATEGORY_LABELS[category]}</h2>
          <div className="space-y-2">
            {items.map(product => (
              <div key={product.id} className="glass-card p-3 flex items-center gap-4">
                <img src={product.image} alt={product.name} className="w-14 h-14 rounded-lg object-cover" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{product.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{product.description}</p>
                </div>
                <span className="font-display text-xl text-primary shrink-0">R$ {product.price.toFixed(2)}</span>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => setEditing(product)} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="p-2 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-display text-2xl">{editing.isNew ? 'Novo Produto' : 'Editar Produto'}</h3>
              <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              placeholder="Nome"
              value={editing.name || ''}
              onChange={e => setEditing(prev => ({ ...prev!, name: e.target.value }))}
              className="w-full bg-secondary rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <textarea
              placeholder="Descrição"
              value={editing.description || ''}
              onChange={e => setEditing(prev => ({ ...prev!, description: e.target.value }))}
              className="w-full bg-secondary rounded-lg p-3 text-sm resize-none h-20 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="number"
              placeholder="Preço"
              value={editing.price || ''}
              onChange={e => setEditing(prev => ({ ...prev!, price: parseFloat(e.target.value) || 0 }))}
              className="w-full bg-secondary rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <select
              value={editing.category || 'burgers'}
              onChange={e => setEditing(prev => ({ ...prev!, category: e.target.value as Category }))}
              className="w-full bg-secondary rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <input
              placeholder="URL da imagem"
              value={editing.image || ''}
              onChange={e => setEditing(prev => ({ ...prev!, image: e.target.value }))}
              className="w-full bg-secondary rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editing.popular || false}
                onChange={e => setEditing(prev => ({ ...prev!, popular: e.target.checked }))}
                className="accent-primary"
              />
              Produto popular
            </label>
            <button onClick={handleSave} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              Salvar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
