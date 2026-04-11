import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import type { Category, Product } from '@/types';
import { CATEGORY_LABELS } from '@/types';
import { Plus, Pencil, Trash2, X, Search, Image as ImageIcon, Check } from 'lucide-react';
import { toast } from 'sonner';

const emptyProduct: Partial<Product> = { name: '', description: '', price: 0, category: 'burgers', image: '', popular: false, customizations: [] };

export const ProductsPage = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [editing, setEditing] = useState<Partial<Product> & { isNew?: boolean } | null>(null);
  
  // Estados para Gestão Inteligente de Customizações
  const [removableIngredients, setRemovableIngredients] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [ingredientInput, setIngredientInput] = useState('');

  // NOVOS ESTADOS: Para Criação Rápida de Adicionais
  const [newExtraName, setNewExtraName] = useState('');
  const [newExtraPrice, setNewExtraPrice] = useState('');

  // Estados para Busca e Filtros
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Estado para controlar o modal de confirmação de exclusão
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // CATÁLOGO DE EXTRAS: Pega todos os produtos que são "Adicionais"
  const availableExtrasCatalogue = products.filter(p => p.category === 'extras');

  const openEdit = (prod: Product | null) => {
    if (prod) {
      setEditing(prod);
      
      // SEPARAÇÃO INTELIGENTE: Divide as customizações em "Removíveis" e "Adicionais Pagos"
      const extrasNames = availableExtrasCatalogue.map(e => e.name.toLowerCase());
      const rems: string[] = [];
      const exts: string[] = [];
      
      (prod.customizations || []).forEach(item => {
        if (extrasNames.includes(item.toLowerCase())) {
          exts.push(item); // É um adicional pago
        } else {
          rems.push(item); // É um ingrediente removível grátis
        }
      });
      
      setRemovableIngredients(rems);
      setSelectedExtras(exts);
    } else {
      setEditing({ ...emptyProduct, isNew: true });
      setRemovableIngredients([]);
      setSelectedExtras([]);
    }
    setIngredientInput('');
    setNewExtraName('');
    setNewExtraPrice('');
  };

  // 👇 CORREÇÃO 1: Transformado em async com try...catch + ALARME
  const handleSave = async () => {
    // 🚨 ALARME DE DETETIVE AQUI! 🚨
    alert("🚨 TESTE DE LIGAÇÃO: O botão Salvar foi clicado e o código novo está a rodar!");
    console.log("Tentando salvar o produto:", editing);

    if (!editing?.name || editing.price === undefined) {
      toast.error('Preencha nome e preço');
      return;
    }
    
    // UNIFICAÇÃO: Junta as tags e os checkboxes selecionados numa única lista antes de salvar
    const finalProduct = { 
      ...editing, 
      customizations: [...removableIngredients, ...selectedExtras] 
    };

    try {
      if (finalProduct.isNew) {
        const { isNew, id, ...rest } = finalProduct as any;
        console.log("A enviar para a API (Criar):", rest); // Registo na consola
        await addProduct(rest); // ⏳ Espera o servidor!
        toast.success('Produto adicionado ao cardápio!');
      } else if (finalProduct.id) {
        const { isNew, ...rest } = finalProduct as any;
        console.log("A enviar para a API (Atualizar):", rest); // Registo na consola
        await updateProduct(finalProduct.id, rest); // ⏳ Espera o servidor!
        toast.success('Produto atualizado!');
      }
      
      // Só fecha se gravar no servidor
      setEditing(null);
      
    } catch (error: any) {
      console.error("ERRO DETETADO NO CATCH:", error);
      toast.error(`Erro: ${error.message || 'Falha ao salvar produto no servidor.'}`);
    }
  };

  // 👇 CORREÇÃO 2: Transformado em async com try...catch
  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete.id); // ⏳ Espera o servidor!
        toast.success(`${productToDelete.name} foi removido.`);
        setProductToDelete(null);
      } catch (error: any) {
        console.error(error);
        toast.error(`Erro: ${error.message || 'Falha ao excluir produto.'}`);
      }
    }
  };

  // --- FUNÇÕES DE CONTROLO DAS TAGS E CHECKBOXES ---
  const addIngredientTag = () => {
    const val = ingredientInput.trim();
    if (val && !removableIngredients.includes(val)) {
      setRemovableIngredients([...removableIngredients, val]);
    }
    setIngredientInput('');
  };

  const removeIngredientTag = (ing: string) => {
    setRemovableIngredients(prev => prev.filter(i => i !== ing));
  };

  const toggleExtraSelection = (extraName: string) => {
    setSelectedExtras(prev => 
      prev.includes(extraName) ? prev.filter(e => e !== extraName) : [...prev, extraName]
    );
  };

  // 👇 CORREÇÃO 3: Adicionado async e try...catch para a criação rápida
  const handleCreateQuickExtra = async () => {
    if (!newExtraName.trim()) {
      toast.error('Escreva o nome do adicional.');
      return;
    }
    const parsedPrice = parseFloat(newExtraPrice.replace(',', '.'));
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      toast.error('Digite um valor válido para o adicional.');
      return;
    }

    if (availableExtrasCatalogue.some(e => e.name.toLowerCase() === newExtraName.trim().toLowerCase())) {
      toast.error('Este adicional já existe no catálogo!');
      return;
    }

    try {
      await addProduct({ // ⏳ Espera o servidor gravar o novo extra
        name: newExtraName.trim(),
        price: parsedPrice,
        category: 'extras',
        description: 'Item adicional',
        image: '',
        customizations: [],
      });

      setSelectedExtras(prev => [...prev, newExtraName.trim()]);
      setNewExtraName('');
      setNewExtraPrice('');
      toast.success(`${newExtraName} adicionado!`);
    } catch (error: any) {
      console.error(error);
      toast.error(`Erro: ${error.message || 'Falha ao gravar adicional.'}`);
    }
  };

  // Filtragem
  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 lg:p-8 min-h-full pb-32 lg:pb-12 bg-background flex flex-col">
      
      {/* Cabeçalho */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in slide-in-from-left-4 fade-in duration-500 shrink-0">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-foreground font-bold tracking-tight">Cardápio</h1>
          <p className="text-muted-foreground text-sm font-medium mt-1">Gerencie produtos, preços e detalhes</p>
        </div>
        <button
          onClick={() => openEdit(null)}
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-full font-bold hover:bg-primary/90 transition-transform active:scale-95 shadow-sm shadow-primary/30"
        >
          <Plus className="w-5 h-5" /> Novo Produto
        </button>
      </div>

      {/* Busca e Filtros */}
      <div className="flex flex-col gap-4 mb-6 shrink-0 animate-in fade-in duration-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Buscar produto pelo nome..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow shadow-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 active:scale-95 ${
              activeCategory === 'all' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-card text-muted-foreground border border-border/50 hover:text-foreground shadow-sm'
            }`}
          >
            Todos
          </button>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key as Category)}
              className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 active:scale-95 ${
                activeCategory === key ? 'bg-primary text-primary-foreground shadow-md' : 'bg-card text-muted-foreground border border-border/50 hover:text-foreground shadow-sm'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground animate-in fade-in">
            <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
            <p className="font-bold text-lg text-foreground">Nenhum produto encontrado</p>
            <p className="text-sm">Tente mudar a categoria ou termo de busca.</p>
          </div>
        ) : (
          filteredProducts.map((product, index) => (
            <div 
              key={product.id} 
              style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
              className="bg-card border border-border/50 rounded-2xl p-4 flex gap-4 shadow-sm hover:shadow-md transition-all duration-300 animate-in slide-in-from-bottom-4 fade-in"
            >
              <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-secondary/50 relative border border-border/30">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ImageIcon className="w-8 h-8 opacity-20" />
                  </div>
                )}
                {product.popular && (
                  <div className="absolute top-0 left-0 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg z-10 shadow-sm">
                    POPULAR
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col min-w-0">
                <h3 className="font-bold text-foreground truncate">{product.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{product.description}</p>
                
                <div className="mt-auto pt-3 flex items-center justify-between">
                  <span className="font-display font-bold text-primary text-lg">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => openEdit(product)} 
                      className="p-2 bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors shadow-sm"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setProductToDelete(product)} 
                      className="p-2 bg-secondary text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-lg transition-colors shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL DE CRIAÇÃO / EDIÇÃO */}
      {editing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border sm:rounded-2xl rounded-t-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-300">
            
            {/* Cabeçalho Fixo do Modal */}
            <div className="flex justify-between items-center p-6 border-b border-border/50 shrink-0">
              <h3 className="font-display text-2xl font-bold text-foreground">{editing.isNew ? 'Novo Produto' : 'Editar Produto'}</h3>
              <button onClick={() => setEditing(null)} className="p-2 bg-secondary rounded-full text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Corpo Rolável */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-secondary/5">
              
              {/* INFORMAÇÕES BÁSICAS */}
              <div className="space-y-4 bg-card p-5 rounded-2xl border border-border/50 shadow-sm">
                <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary"/> Informações Básicas
                </h4>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-muted-foreground">Nome do Produto</label>
                  <input
                    value={editing.name || ''}
                    onChange={e => setEditing(prev => ({ ...prev!, name: e.target.value }))}
                    placeholder="Ex: X-Bacon Supremo"
                    className="w-full bg-background border border-border/50 rounded-xl p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-muted-foreground">Preço (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editing.price || ''}
                      onChange={e => setEditing(prev => ({ ...prev!, price: parseFloat(e.target.value) || 0 }))}
                      className="w-full bg-background border border-border/50 rounded-xl p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-muted-foreground">Categoria</label>
                    <select
                      value={editing.category || 'burgers'}
                      onChange={e => setEditing(prev => ({ ...prev!, category: e.target.value as Category }))}
                      className="w-full bg-background border border-border/50 rounded-xl p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                    >
                      {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-muted-foreground">Descrição</label>
                  <textarea
                    value={editing.description || ''}
                    onChange={e => setEditing(prev => ({ ...prev!, description: e.target.value }))}
                    placeholder="Ingredientes e detalhes apetitosos..."
                    className="w-full bg-background border border-border/50 rounded-xl p-3 text-foreground resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-muted-foreground">URL da Imagem</label>
                  <div className="flex gap-3 items-center">
                    <div className="w-14 h-14 shrink-0 bg-secondary/50 rounded-lg overflow-hidden border border-border flex items-center justify-center">
                      {editing.image ? (
                        <img src={editing.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-muted-foreground opacity-50" />
                      )}
                    </div>
                    <input
                      value={editing.image || ''}
                      onChange={e => setEditing(prev => ({ ...prev!, image: e.target.value }))}
                      placeholder="Cole o link (https://...)"
                      className="flex-1 bg-background border border-border/50 rounded-xl p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 p-3 border border-border/50 rounded-xl cursor-pointer hover:bg-secondary/20 transition-colors">
                    <div className="relative inline-flex items-center">
                      <input type="checkbox" checked={editing.popular || false} onChange={e => setEditing(prev => ({ ...prev!, popular: e.target.checked }))} className="sr-only peer" />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </div>
                    <span className="text-sm font-bold text-foreground">Destacar como Produto Popular na Loja</span>
                  </label>
                </div>
              </div>

              {/* SEPARAÇÃO VISUAL */}
              <div className="w-full h-px bg-border/50 my-6"></div>

              {/* GESTÃO DE CUSTOMIZAÇÕES AVANÇADA (Apenas se não for um Extra) */}
              {editing.category !== 'extras' && (
                <div className="space-y-6 bg-card p-5 rounded-2xl border border-border/50 shadow-sm">
                  
                  {/* PARTE 1: Ingredientes Removíveis (Sistema de Tags) */}
                  <div>
                    <h4 className="font-bold text-foreground mb-1 text-lg">Retirar Ingredientes</h4>
                    <p className="text-xs text-muted-foreground mb-4">O que o cliente pode pedir para retirar sem custo?</p>
                    
                    <div className="flex gap-2">
                      <input 
                        value={ingredientInput} 
                        onChange={e => setIngredientInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addIngredientTag())}
                        placeholder="Ex: Cebola, Maionese..." 
                        className="flex-1 bg-background border border-border/50 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" 
                      />
                      <button type="button" onClick={addIngredientTag} className="bg-secondary text-foreground px-4 rounded-xl font-bold hover:bg-secondary/80 transition-colors">
                        Add
                      </button>
                    </div>

                    {removableIngredients.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {removableIngredients.map(ing => (
                          <span key={ing} className="bg-secondary/50 border border-border/50 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium animate-in zoom-in duration-200">
                            {ing} 
                            <X size={14} onClick={() => removeIngredientTag(ing)} className="cursor-pointer text-muted-foreground hover:text-destructive transition-colors" />
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="w-full h-px bg-border/50 my-4"></div>

                  {/* PARTE 2: Adicionais Pagos */}
                  <div>
                    <h4 className="font-bold text-foreground mb-1 text-lg">Adicionais Pagos</h4>
                    <p className="text-xs text-muted-foreground mb-4">Selecione ou crie itens extras para este lanche.</p>
                    
                    {/* Criação Rápida de Adicional */}
                    <div className="flex gap-2 mb-4 bg-secondary/30 p-3 rounded-xl border border-border/50">
                      <div className="flex-1">
                        <input 
                          value={newExtraName}
                          onChange={e => setNewExtraName(e.target.value)}
                          placeholder="Novo adicional (ex: Ovo Frito)" 
                          className="w-full bg-background border border-border/50 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" 
                        />
                      </div>
                      <div className="w-28 shrink-0">
                        <input 
                          type="number" step="0.01"
                          value={newExtraPrice}
                          onChange={e => setNewExtraPrice(e.target.value)}
                          placeholder="R$ 0,00" 
                          className="w-full bg-background border border-border/50 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" 
                        />
                      </div>
                      <button type="button" onClick={handleCreateQuickExtra} className="bg-primary text-primary-foreground px-3 rounded-lg font-bold hover:bg-primary/90 transition-colors flex items-center justify-center shrink-0">
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    {availableExtrasCatalogue.length === 0 ? (
                      <div className="bg-warning/10 border border-warning/20 p-4 rounded-xl">
                        <p className="text-sm font-medium text-warning-foreground text-center">
                          Nenhum produto cadastrado na categoria "Adicionais".
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 max-h-60 overflow-y-auto pr-1">
                        {availableExtrasCatalogue.map(extra => {
                          const isSelected = selectedExtras.includes(extra.name);
                          return (
                            <label key={extra.id} className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all active:scale-95 ${isSelected ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/30'}`}>
                              <div className="flex flex-col">
                                <span className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>{extra.name}</span>
                                <span className="text-xs font-medium text-muted-foreground">+ R$ {extra.price.toFixed(2)}</span>
                              </div>
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30 text-transparent'}`}>
                                <Check className="w-3 h-3" />
                              </div>
                              <input type="checkbox" className="hidden" checked={isSelected} onChange={() => toggleExtraSelection(extra.name)} />
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Rodapé Fixo do Modal */}
            <div className="p-5 border-t border-border/50 bg-background shrink-0 flex flex-col-reverse sm:flex-row justify-end gap-3 rounded-b-3xl">
              <button onClick={() => setEditing(null)} className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold bg-secondary text-foreground hover:bg-secondary/80 transition-colors">
                Cancelar
              </button>
              <button onClick={handleSave} className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors shadow-sm shadow-primary/30">
                Salvar Produto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {productToDelete && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-5 mx-auto">
              <Trash2 className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-bold text-center text-foreground mb-2">Excluir Produto?</h3>
            <p className="text-center text-muted-foreground text-sm mb-6">
              Tem certeza que deseja excluir <strong className="text-foreground">{productToDelete.name}</strong>? Esta ação não pode ser desfeita.
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setProductToDelete(null)} 
                className="flex-1 px-4 py-3 rounded-xl bg-secondary text-foreground hover:bg-secondary/80 font-bold text-sm transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 px-4 py-3 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold text-sm transition-colors shadow-sm"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
