import { useEffect } from "react";
import { Plus } from "lucide-react";
import ProductCard from "./ProductCard";
import { useAdminStore } from "../store/useAdminStore";
import { useProductStore } from "../store/useProductStore";

export default function ProductGrid() {
  const isAdmin = useAdminStore((state) => state.isAdmin);
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const displayProducts = products.slice(0, 4);

  const handleNewProduct = () => {
    console.log("Mock: abrir formulário de novo produto");
  };

  return (
    <section className="bg-linen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-2xl sm:text-3xl text-ink">
            Mais Vendidos
          </h2>
        </div>

        {displayProducts.length === 0 ? (
          <p className="text-bark text-center">Nenhum produto cadastrado.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {displayProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image_url} // Atualizado para Supabase
              />
            ))}

            {isAdmin && (
              <button
                onClick={handleNewProduct}
                className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-bark/40 rounded-xl aspect-square hover:border-forest hover:bg-forest/5 transition-colors"
              >
                <Plus className="w-6 h-6 text-bark" />
                <span className="font-body text-sm font-medium text-bark">
                  Adicionar Novo Produto
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}