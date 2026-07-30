import { useState } from "react";
import { Mail, Plus, Minus, ArrowRight } from "lucide-react";
import treePerson from "../assets/tree-person.png"; // PNG transparente, só a ilustração (sem fundo/chão)
import { Link } from "react-router-dom";

// 1. Ícone Minimalista do WhatsApp
const WhatsAppIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

// 2. Ícone Minimalista do Instagram
const InstagramIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

// 3. Onda do "chão" em SVG puro — escala 100% de largura sem nunca distorcer
//    visualmente nem depender do tamanho do monitor. preserveAspectRatio="none"
//    permite esticar horizontalmente à vontade (é só uma linha orgânica).
const GroundWave = ({ className = "" }) => (
  <svg
    viewBox="0 0 1920 90"
    preserveAspectRatio="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0,45 C40,30 80,55 130,42 C180,28 230,50 280,40
         C330,30 380,52 430,44 C480,36 530,48 580,38
         C630,28 680,50 730,42 C780,34 830,46 880,40
         C930,34 980,50 1030,42 C1080,34 1130,48 1180,40
         C1230,32 1280,50 1330,42 C1380,34 1430,46 1480,38
         C1530,30 1580,50 1630,42 C1680,34 1730,48 1780,40
         C1830,32 1880,46 1920,40
         L1920,90 L0,90 Z"
      fill="#1c2a23"
    />
  </svg>
);

const FOOTER_LINKS = {
  "LOJA": [
    { name: "Camisetas", path: "/camisetas" },
    { name: "Moletons", path: "/moletons" },
    { name: "Ecobags", path: "/ecobags" }
  ],
  "SOBRE": [
    { name: "Nossa História", path: "/sobre" },
    { name: "Sustentabilidade", path: "/sobre" },
    { name: "Contato", path: "#" }
  ],
  "AJUDA": [
    { name: "Trocas e Devoluções", path: "#" },
    { name: "Entrega", path: "#" },
    { name: "Perguntas Frequentes", path: "#" }
  ]
};

export default function Footer() {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="w-full mt-auto">

      {/* =======================================================================
          1. CONFIGURAÇÃO DE DESKTOP / TABLET (md e acima)
          Fundo 100% vetorial: a onda (SVG) escala infinitamente sem distorcer.
          A ilustração (pessoa + árvore) é um elemento decorativo de TAMANHO
          FIXO, plantado em cima — nunca infla no ultrawide, nunca some no crop.
          ======================================================================= */}
      <div className="hidden md:block relative w-full bg-linen overflow-hidden h-[220px] lg:h-[260px] xl:h-[300px]">

        {/* Ilustração fixa — tamanho não depende da largura da tela */}
        <img
          src={treePerson}
          alt="Plantando uma nova ideia"
          className="absolute z-10 bottom-[-10%] left-1/2 -translate-x-1/2
                     w-[260px] lg:w-[320px] xl:w-[380px] h-auto pointer-events-none select-none"
        />

        {/* Onda do chão — escala 100% de largura sempre */}
        <GroundWave className="absolute bottom-0 left-0 w-full h-[35%]" />
      </div>

      <footer className="hidden md:block relative w-full bg-[#1c2a23] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-10 pb-12">

          {/* Grid responsivo: 2 colunas no tablet, 4 no desktop grande */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 mb-10">

            {/* Coluna 1: Newsletter Horizontal */}
            <div className="col-span-2 lg:col-span-1">
              <h3 className="font-display text-xl mb-2 text-white uppercase">Preciso Verde Perto</h3>
              <p className="font-body text-sm text-white/80 mb-4">
                Novidades da coleção, direto na sua caixa de entrada.
              </p>
              <form
                className="flex items-center gap-2 max-w-sm"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="flex-1 bg-white/10 border border-white/30 rounded-full px-4 py-2 text-sm font-body text-white placeholder:text-white/60 focus:outline-none focus:border-white backdrop-blur-md"
                />
                <button
                  type="submit"
                  aria-label="Inscrever"
                  className="bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors shrink-0 border border-white/30 backdrop-blur-md"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Colunas de Links */}
            {Object.entries(FOOTER_LINKS).map(([section, links]) => (
              <div key={section}>
                <h4 className="font-body font-semibold text-sm mb-4 text-white uppercase tracking-wider">
                  {section}
                </h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="font-body text-sm text-white/70 hover:text-white transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          </div>

          {/* Linha inferior de Copyright e Redes Sociais */}
          <div className="flex flex-row items-center justify-between gap-4 pt-6 border-t border-white/20">
            <p className="font-body text-xs text-white/60">
              © {new Date().getFullYear()} Preciso Verde Perto. Todos os direitos reservados.
            </p>

            <div className="flex items-center gap-5">
              <a href="https://wa.me/5511999999999" aria-label="WhatsApp" className="text-white/70 hover:text-white transition-colors" target="_blank" rel="noreferrer">
                <WhatsAppIcon size={18} />
              </a>
              <a href="https://instagram.com/precisoverdeperto" aria-label="Instagram" className="text-white/70 hover:text-white transition-colors" target="_blank" rel="noreferrer">
                <InstagramIcon size={18} />
              </a>
              <a href="mailto:contato@precisoverdeperto.com.br" aria-label="E-mail" className="text-white/70 hover:text-white transition-colors">
                <Mail className="w-[18px] h-[18px]" />
              </a>
            </div>
          </div>

        </div>
      </footer>


      {/* =======================================================================
          2. CONFIGURAÇÃO MOBILE — mesma lógica: onda em SVG + ilustração fixa
          ======================================================================= */}
      <div className="block md:hidden relative w-full bg-linen overflow-hidden h-[160px]">
        <img
          src={treePerson}
          alt="Plantando uma nova ideia"
          className="absolute z-10 bottom-[-10%] left-1/2 -translate-x-1/2 w-[190px] h-auto pointer-events-none select-none"
        />
        <GroundWave className="absolute bottom-0 left-0 w-full h-[40%]" />
      </div>

      <footer className="block md:hidden w-full bg-[#1c2a23] text-linen pt-6 pb-16">
        <div className="max-w-3xl mx-auto px-6 flex flex-col items-center">

          <div className="w-full flex flex-col items-center text-center mb-10">
            <h3 className="font-display text-2xl mb-2 uppercase tracking-wide">
              Entre no nosso universo
            </h3>
            <p className="font-body text-sm text-linen/80 mb-6">
              Receba novidades, promoções e lançamentos.
            </p>
            <form
              className="w-full max-w-sm flex flex-col gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Escreva seu e-mail"
                className="w-full bg-black/20 border border-linen/30 rounded-md px-4 py-3 text-sm font-body text-linen placeholder:text-linen/60 focus:outline-none focus:border-linen transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-linen text-[#1B271A] font-bold text-sm py-3 rounded-md hover:bg-white transition-colors shadow-md"
              >
                Cadastrar
              </button>
            </form>
          </div>

          <div className="w-full border-t border-linen/20 mb-12">
            {Object.entries(FOOTER_LINKS).map(([section, links]) => {
              const isOpen = openSection === section;

              return (
                <div key={section} className="border-b border-linen/20">
                  <button
                    onClick={() => toggleSection(section)}
                    className="w-full py-5 flex items-center justify-between text-left focus:outline-none group"
                  >
                    <span className="font-body font-bold text-sm tracking-widest text-linen">
                      {section}
                    </span>
                    <span className="text-linen/60 group-hover:text-linen transition-colors">
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </span>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <ul className="overflow-hidden flex flex-col gap-3">
                      {links.map((link) => (
                        <li key={link.name}>
                          <Link
                            to={link.path}
                            className="font-body text-sm text-linen/70 hover:text-linen transition-colors block"
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="w-full flex flex-col items-center">
            <h4 className="font-body font-bold text-xs uppercase tracking-widest text-linen mb-6">
              Nossas Redes Sociais
            </h4>
            <div className="flex items-center gap-6">
              <a href="https://wa.me/5511999999999" aria-label="WhatsApp" className="flex items-center justify-center w-11 h-11 rounded-full border border-linen/30 text-linen/80 hover:text-linen hover:border-linen transition-all" target="_blank" rel="noreferrer">
                <WhatsAppIcon />
              </a>
              <a href="https://instagram.com/precisoverdeperto" aria-label="Instagram" className="flex items-center justify-center w-11 h-11 rounded-full border border-linen/30 text-linen/80 hover:text-linen hover:border-linen transition-all" target="_blank" rel="noreferrer">
                <InstagramIcon />
              </a>
              <a href="mailto:contato@precisoverdeperto.com.br" aria-label="E-mail" className="flex items-center justify-center w-11 h-11 rounded-full border border-linen/30 text-linen/80 hover:text-linen hover:border-linen transition-all">
                <Mail size={18} />
              </a>
            </div>

            <p className="w-full font-body text-[10px] text-linen/60 text-center uppercase tracking-wider mt-10 border-t border-linen/20 pt-8">
              © {new Date().getFullYear()} Preciso Verde Perto ® - Todos os direitos reservados.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}