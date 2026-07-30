import { Leaf } from "lucide-react";
import bannerBg from "../assets/bannerpvp"; 

export default function AboutPage() {
  return (
    // Removido o min-h-screen e reduzido o padding vertical
    <main className="bg-linen pt-6 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Cabeçalho da Página com margens reduzidas */}
        <div className="text-center mb-8 mt-4">
          <span className="inline-flex items-center gap-1.5 font-body text-[11px] font-bold tracking-widest uppercase text-forest mb-3">
            <Leaf className="w-3.5 h-3.5" />
            Nossas Raízes
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-ink leading-tight">
            Nossa História
          </h1>
        </div>

        {/* Imagem de Destaque mais contida (h-48 no celular, h-72 no PC) */}
        <div className="w-full h-48 sm:h-72 rounded-3xl overflow-hidden mb-8 shadow-md border border-bark/10">
          <img 
            src={bannerBg} 
            alt="Essência Preciso Verde Perto" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Texto Original com espaçamento entrelinhas otimizado */}
        <div className="space-y-5 font-body text-base text-ink/80 leading-relaxed text-justify sm:text-left">
          <p>
            <strong>PRECISOVERDEPERTO</strong> surgiu em 2013 como forma de manifestação em defesa do meio ambiente e ao direito de ocupar os espaços que a cidade e a natureza oferece. Desde então, com influência da arte urbana essa expressão passou a ser espalhada nos muros da cidade em forma de stencil com a intenção de despertar alguma curiosidade e/ou algum sentimento para quem passa e vê.
          </p>
          <p>
            <strong>PRECISOVERDEPERTO</strong> vem agora como marca e com o foco principal nas suas camisetas estampadas, inspiradas na natureza para espalhar mensagens de preservação e fortalecer essa luta que é única e legítima!
          </p>
        </div>

      </div>
    </main>
  );
}