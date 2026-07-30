import { ArrowRight, Leaf } from "lucide-react";
import bannerBg from "../assets/Bannerpvp.png";

export default function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-64px)] flex items-end overflow-hidden bg-ink">
      {/* Imagem de fundo */}
      <div className="absolute inset-0">
        <img
          src={bannerBg}
          alt="Nova coleção Preciso Verde Perto"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      {/* Degradê mais suave - escurece a base para o texto ler bem, sem matar a foto */}
      <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/40 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-r from-ink/60 via-transparent to-transparent" />

      {/* Conteúdo */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20 pt-24">
        <div className="max-w-lg">
          <span className="inline-flex items-center gap-1.5 font-body text-xs font-medium tracking-wide uppercase text-linen/80 mb-4">
            <Leaf className="w-3.5 h-3.5" />
            Entre no modo raiz
          </span>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-linen leading-none mb-8 tracking-tight drop-shadow-lg">
            Nova Coleção
          </h1>

          {/* Card: Efeito Glassmorphism (Vidro Escuro) */}
          <div className="bg-ink/30 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 mb-8 shadow-2xl">
            <p className="font-body text-xs font-medium text-linen/60 uppercase tracking-wide mb-1">
              A partir de
            </p>
            <p className="font-display text-4xl sm:text-5xl text-linen mb-4 drop-shadow-md">
              R$ 59<span className="text-xl align-top">,90</span>
            </p>
            <div className="flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-1.5 font-body text-xs font-medium text-linen bg-forest/40 border border-forest/50 rounded-full px-3 py-1.5 backdrop-blur-sm">
                <Leaf className="w-3 h-3" />
                Algodão 100% orgânico
              </span>
              <span className="inline-flex items-center font-body text-xs font-medium text-linen/90 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm">
                Serigrafia artesanal
              </span>
            </div>
          </div>

          <button className="group inline-flex items-center gap-2 bg-linen text-ink font-body font-semibold px-8 py-4 rounded-full hover:bg-forest hover:text-linen transition-all duration-300 shadow-lg hover:shadow-forest/20">
            Ver Nova Coleção
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}