import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, ShieldCheck, Heart, Sparkles } from "lucide-react";
import bannerBg from "../assets/Bannerpvp.png"; 
// 1. IMPORTANDO A SUA IMAGEM NOVA AQUI:
import mariposaImg from "../assets/HomeAssets/Mariposaverde.png"; 
import EcobagHome from "../assets/HomeAssets/EcobagHome.png"; 
import MoletomHome from "../assets/HomeAssets/MoletomMariposaverde.png"; 
import { useProductStore } from "../store/useProductStore"; 

export default function Home() {
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const featuredProducts = products.slice(0, 3);

  return (
    <div className="bg-linen min-h-screen flex flex-col">
      
      {/* 1. HERO BANNER */}
      <section className="relative bg-forest text-linen min-h-[75vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={bannerBg} 
            alt="Banner Preciso Verde Perto" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Estilo com Consciência
          </span>
          <h1 className="font-display text-4xl sm:text-6xl text-linen leading-[1.1] max-w-3xl drop-shadow-sm">
            Moda que brota do asfalto e defende a terra.
          </h1>
          <p className="font-body text-base sm:text-lg text-linen/80 max-w-xl leading-relaxed">
            Nascida nos muros em forma de stencil, nossa voz agora se espalha no algodão orgânico. Conheça nossa coleção de camisetas e acessórios sustentáveis.
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            <Link 
              to="/produtos" 
              className="group flex items-center gap-2 bg-linen text-forest px-6 py-3.5 rounded-full font-body text-sm font-semibold hover:bg-white transition-all shadow-md"
            >
              Ver Catálogo Completo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/sobre" 
              className="flex items-center gap-2 border border-linen/30 text-linen px-6 py-3.5 rounded-full font-body text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              Nossa História
            </Link>
          </div>
        </div>
      </section>

      {/* 2. VALUE BADGES */}
      <section className="bg-white border-b border-bark/15 py-10 relative z-10 -mt-8 mx-4 sm:mx-8 rounded-2xl shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-bark/15">
            
            <div className="flex items-start gap-4 px-4 pt-4 md:pt-0">
              <div className="p-3 bg-forest/10 rounded-xl text-forest shrink-0">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-body font-semibold text-sm text-ink mb-1">100% Algodão Orgânico</h3>
                <p className="font-body text-xs text-bark">Cultivado sem pesticidas nocivos, cuidando da terra e da sua pele.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 px-4 pt-6 md:pt-0">
              <div className="p-3 bg-forest/10 rounded-xl text-forest shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-body font-semibold text-sm text-ink mb-1">Produção Ética e Local</h3>
                <p className="font-body text-xs text-bark">Garantimos salários justos e apoio às pequenas oficinas artesanais.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 px-4 pt-6 md:pt-0">
              <div className="p-3 bg-forest/10 rounded-xl text-forest shrink-0">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-body font-semibold text-sm text-ink mb-1">Causa Real</h3>
                <p className="font-body text-xs text-bark">Parte de cada venda apoia diretamente projetos de reflorestamento urbano.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CATEGORIAS DE EXPLORAÇÃO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl text-ink">Explore Coleções</h2>
          <p className="font-body text-sm text-bark mt-2">Escolha seu estilo e faça parte do movimento sustentável.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          {/* CATEGORIA 1: CAMISETAS */}
          <Link to="/camisetas" className="group relative h-[380px] rounded-3xl overflow-hidden shadow-md">
            <img 
              src={mariposaImg} 
              alt="Camisetas" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
            <div className="absolute bottom-6 left-6 text-linen">
              <h3 className="font-display text-xl">Camisetas</h3>
              <p className="font-body text-xs text-linen/75 flex items-center gap-1 mt-1 group-hover:text-linen transition-colors">
                Ver Coleção <ArrowRight className="w-3.5 h-3.5" />
              </p>
            </div>
          </Link>

          {/* CATEGORIA 2: MOLETONS */}
          <Link to="/moletons" className="group relative h-[380px] rounded-3xl overflow-hidden shadow-md">
            <img 
              src={MoletomHome} 
              alt="Moletons" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
            <div className="absolute bottom-6 left-6 text-linen">
              <h3 className="font-display text-xl">Moletons</h3>
              <p className="font-body text-xs text-linen/75 flex items-center gap-1 mt-1 group-hover:text-linen transition-colors">
                Ver Coleção <ArrowRight className="w-3.5 h-3.5" />
              </p>
            </div>
          </Link>

          {/* CATEGORIA 3: ECOBAGS */}
          <Link to="/ecobags" className="group relative h-[380px] rounded-3xl overflow-hidden shadow-md">
            <img 
              src={EcobagHome} 
              alt="Ecobags" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
            <div className="absolute bottom-6 left-6 text-linen">
              <h3 className="font-display text-xl">Ecobags</h3>
              <p className="font-body text-xs text-linen/75 flex items-center gap-1 mt-1 group-hover:text-linen transition-colors">
                Ver Coleção <ArrowRight className="w-3.5 h-3.5" />
              </p>
            </div>
          </Link>

        </div>
      </section>

      {/* 4. MAIS VENDIDOS */}
      <section className="bg-white/40 py-20 border-t border-b border-bark/10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="font-body text-xs font-semibold uppercase text-forest tracking-wider">Favoritos da Galera</span>
              <h2 className="font-display text-3xl text-ink mt-1">Nossos Mais Vendidos</h2>
            </div>
            <Link to="/produtos" className="group flex items-center gap-1.5 text-sm font-semibold text-forest hover:text-forest/80 transition-colors">
              Explorar Catálogo Completo <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {featuredProducts.length === 0 ? (
            <p className="text-center text-bark text-sm py-10">Nenhum produto cadastrado ainda.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <div key={product.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-bark/10 shadow-sm transition-all hover:shadow-md">
                  <div className="h-80 w-full overflow-hidden bg-linen relative">
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex flex-col gap-1 flex-1 bg-white">
                    <span className="text-[10px] font-semibold text-bark uppercase tracking-wide">{product.category}</span>
                    <h3 className="font-body font-semibold text-sm text-ink group-hover:text-forest transition-colors">{product.name}</h3>
                    <div className="flex items-center justify-between mt-3">
                      <p className="font-body font-bold text-base text-ink">
                        {product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </p>
                      <Link to={`/produto/${product.id}`} className="text-xs font-bold text-forest hover:underline">
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. FEITO À MÃO & MANIFESTO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 sm:gap-16">
          
          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[450px]">
            <img 
              src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80" 
              alt="Feito à Mão e Arte" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-forest/10 mix-blend-multiply" />
          </div>

          <div className="flex flex-col items-start gap-6">
            <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-forest">
              <span className="w-1.5 h-1.5 rounded-full bg-forest animate-pulse" /> Feito à Mão de Verdade
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-ink leading-[1.2]">
              Estamparia artesanal com alma urbana.
            </h2>
            <div className="font-body text-base text-bark space-y-4 leading-relaxed">
              <p>
                Em 2013, o manifesto <strong>PRECISOVERDEPERTO</strong> nasceu em forma de stencil nas ruas de pedra. Para nós, a arte é ferramenta de manifestação pacífica em defesa da terra e do direito aos espaços urbanos verdes.
              </p>
              <p>
                Hoje, transformamos essa essência em vestuário. Cada peça carrega o processo manual, inspirado no calor da tinta, na precisão do estilete e no compromisso irrevogável com a preservação.
              </p>
            </div>
            <Link 
              to="/sobre" 
              className="inline-flex items-center gap-1.5 font-body text-sm font-bold text-forest hover:text-forest/80 border-b-2 border-forest pb-0.5 transition-colors mt-2"
            >
              Conheça Nossa Jornada
            </Link>
          </div>

        </div>
      </section>

      {/* 6. BANNER DE TRANSIÇÃO */}
      <section className="bg-forest text-linen text-center py-24 relative overflow-hidden w-full">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-ink opacity-30" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 flex flex-col items-center gap-6">
          <h2 className="font-display text-3xl sm:text-5xl max-w-2xl leading-[1.1]">
            Vamos plantar uma nova ideia juntos?
          </h2>
          <p className="font-body text-base text-linen/80 max-w-xl">
            Vista a nossa bandeira e leve a preservação para os muros de onde você mora.
          </p>
          <Link 
            to="/produtos" 
            className="mt-4 bg-linen text-forest px-8 py-4 rounded-full font-body text-sm font-semibold hover:bg-white transition-all shadow-md"
          >
            Começar a Explorar
          </Link>
        </div>
      </section>

    </div>
  );
}