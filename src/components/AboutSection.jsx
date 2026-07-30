import { Leaf, Hand, Recycle } from "lucide-react";

const HIGHLIGHTS = [
  {
    icon: Leaf,
    title: "100% Algodão Ecológico",
    text: "Fibras cultivadas sem agrotóxicos, do plantio à colheita.",
  },
  {
    icon: Hand,
    title: "Produção Manual",
    text: "Cada estampa é feita à mão, tela por tela, em pequenos lotes.",
  },
  {
    icon: Recycle,
    title: "Baixo Impacto",
    text: "Tintas à base de água e processos que devolvem mais do que retiram.",
  },
];

export default function AboutSection() {
  return (
    <section className="bg-forest/5 py-14 sm:py-20 border-y border-bark/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-display text-2xl sm:text-3xl text-ink mb-3">
            Feito à mão, pensado pra natureza
          </h2>
          <p className="font-body text-ink/70 text-sm sm:text-base">
            Cada peça da Preciso Verde Perto nasce de algodão orgânico e passa
            por mãos, não máquinas — da estamparia até a costura final.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="text-center sm:text-left bg-linen/60 border border-dashed border-bark/30 rounded-xl p-6"
            >
              <Icon className="w-7 h-7 text-forest mx-auto sm:mx-0 mb-3" />
              <h3 className="font-body font-semibold text-ink mb-1.5">
                {title}
              </h3>
              <p className="font-body text-sm text-ink/60">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}