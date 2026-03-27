import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  onAddProduct: (productId: string) => void;
}

export const ProductGrid = ({ products, onAddProduct }: ProductGridProps) => {
  return (
    <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 content-start pr-2 pb-4">
      {products.map(product => (
        <button
          key={product.id}
          onClick={() => onAddProduct(product.id)}
          className="bg-card border border-border shadow-sm rounded-xl p-4 text-left hover:border-primary/50 transition-all group flex justify-between gap-4 h-[140px]"
        >
          <div className="flex-1 flex flex-col overflow-hidden py-0.5">
            <p className="font-semibold text-base mb-1 truncate">{product.name}</p>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">
              {product.description}
            </p>
            <p className="text-foreground font-medium mt-2">
              R$ {product.price.toFixed(2)}
            </p>
          </div>
          <div className="shrink-0 relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-28 h-28 object-cover rounded-xl"
              loading="lazy"
            />
            {product.popular && (
              <span className="absolute -top-2 -left-3 text-[10px] uppercase font-bold tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded-full shadow-md">
                Popular
              </span>
            )}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
              <span className="text-xl leading-none mb-0.5">+</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};
