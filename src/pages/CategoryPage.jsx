import { useEffect } from "react";
import { Leaf } from "lucide-react";
import bannerBg from "../assets/bannerpvp.png";
import ProductCard from "../components/ProductCard";
import { useProductStore } from "../store/useProductStore";

export default function CategoryPage({ title }) {
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filtra os produtos para mostrar apenas os da categoria atual
  // Remove acentos e joga para minúsculo para evitar erros de digitação (ex: Boné vs bone)
  const normalize = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  
  const categoryProducts = products.filter(
    (product) => normalize(product.category) === normalize(title)
  );

  return (
    <main className="bg-linen min-h-screen">
      <section className="relative h-[40vh] min-h-[300px] flex items-end overflow-hidden bg-ink">
        <div className="absolute inset-0">
          <img
            src={bannerBg}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-transparent" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-20">
          <div className="inline-block bg-ink/30 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:px-8 shadow-2xl">
            <span className="inline-flex items-center gap-1.5 font-body text-xs font-medium tracking-wide uppercase text-linen/80 mb-2">
              <Leaf className="w-3.5 h-3.5" />
              Preciso Verde Perto
            </span>
            <h1 className="font-display text-4xl sm:text-5xl text-linen leading-none tracking-tight drop-shadow-md">
              {title}
            </h1>
          </div>
        </div>
      </section>

      {/* Grid de produtos da categoria */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {categoryProducts.length === 0 ? (
          <p className="text-bark text-center py-10">Nenhum produto cadastrado na categoria {title} ainda.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {categoryProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image_url}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}