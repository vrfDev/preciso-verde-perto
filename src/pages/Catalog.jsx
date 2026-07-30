import { useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useAdminStore } from "../store/useAdminStore";
import { useProductStore } from "../store/useProductStore";
import { Plus } from "lucide-react";

export default function Catalog() {
  const isAdmin = useAdminStore((state) => state.isAdmin);
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleNewProduct = () => {
    console.log("Mock: abrir formulário de novo produto");
  };

  return (
    <section className="bg-linen py-12 sm:py-16 min-h-[60vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-2xl sm:text-3xl text-ink mb-8">
          Todos os Produtos
        </h1>

        {products.length === 0 ? (
          <p className="text-bark text-center py-10">Nenhum produto encontrado no catálogo.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {products.map((product) => (
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