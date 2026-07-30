import { ShieldCheck } from "lucide-react";

/* Cada ícone é um SVG próprio, com as cores de marca de cada bandeira,
   dentro de um cartão neutro — assim fica reconhecível sem depender
   de imagens externas (que quebram/ficam lentas) */

const VisaIcon = () => (
  <svg viewBox="0 0 48 16" className="h-4 w-auto">
    <text x="0" y="13" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="700" fontSize="15" fill="#1A1F71">
      VISA
    </text>
  </svg>
);

const MastercardIcon = () => (
  <svg viewBox="0 0 48 30" className="h-6 w-auto">
    <circle cx="18" cy="15" r="11" fill="#EB001B" />
    <circle cx="30" cy="15" r="11" fill="#F79E1B" fillOpacity="0.9" />
    <path d="M24 6.5a11 11 0 0 1 0 17 11 11 0 0 1 0-17z" fill="#FF5F00" />
  </svg>
);

const AmexIcon = () => (
  <svg viewBox="0 0 48 30" className="h-6 w-auto">
    <rect x="1" y="1" width="46" height="28" rx="4" fill="#2E77BC" />
    <text x="24" y="19" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="9" fill="#ffffff">
      AMEX
    </text>
  </svg>
);

const DinersIcon = () => (
  <svg viewBox="0 0 48 24" className="h-5 w-auto">
    <circle cx="24" cy="12" r="11" fill="#0079BE" />
    <rect x="19.5" y="4.5" width="9" height="15" rx="4.5" fill="#ffffff" />
  </svg>
);

const DiscoverIcon = () => (
  <svg viewBox="0 0 60 20" className="h-4 w-auto">
    <text x="0" y="15" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="13" fill="#1B1B1B">
      Discover
    </text>
    <circle cx="55" cy="10" r="7" fill="#F58220" />
  </svg>
);

const AuraIcon = () => (
  <svg viewBox="0 0 30 30" className="h-6 w-auto">
    <circle cx="15" cy="15" r="14" fill="#F7A81B" />
    <circle cx="15" cy="15" r="14" fill="url(#auraGrad)" fillOpacity="0.55" />
    <defs>
      <linearGradient id="auraGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFD86B" />
        <stop offset="100%" stopColor="#E8461C" />
      </linearGradient>
    </defs>
  </svg>
);

const EloIcon = () => (
  <svg viewBox="0 0 30 30" className="h-6 w-auto">
    <circle cx="15" cy="15" r="14" fill="#000000" />
    <path d="M15 4a11 11 0 1 0 0 22" stroke="#FFCB05" strokeWidth="3.2" fill="none" />
    <path d="M15 8a7 7 0 1 0 0 14" stroke="#00A4E0" strokeWidth="3.2" fill="none" />
    <circle cx="15" cy="15" r="3" fill="#EF4136" />
  </svg>
);

const HiperIcon = () => (
  <svg viewBox="0 0 48 16" className="h-4 w-auto">
    <text x="0" y="13" fontFamily="Arial, sans-serif" fontWeight="800" fontStyle="italic" fontSize="14" fill="#E6521F">
      hiper
    </text>
  </svg>
);

const PixIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-auto">
    <g fill="none" stroke="#32BCAD" strokeWidth="2" strokeLinejoin="round">
      <path d="M9 3.6 3.6 9a2 2 0 0 0 0 2.8L9 17.2" />
      <path d="M15 3.6 20.4 9a2 2 0 0 1 0 2.8L15 17.2" />
    </g>
    <rect x="9.3" y="9.3" width="5.4" height="5.4" rx="1.2" fill="#32BCAD" />
  </svg>
);

const PAYMENT_METHODS = [
  { name: "Amex", Icon: AmexIcon },
  { name: "Visa", Icon: VisaIcon },
  { name: "Diners", Icon: DinersIcon },
  { name: "Mastercard", Icon: MastercardIcon },
  { name: "Discover", Icon: DiscoverIcon },
  { name: "Aura", Icon: AuraIcon },
  { name: "Elo", Icon: EloIcon },
  { name: "Hiper", Icon: HiperIcon },
  { name: "Pix", Icon: PixIcon },
];

export default function CheckoutFooter() {
  return (
    <footer className="bg-forest text-linen mt-auto px-4 sm:px-6 py-10 md:py-12">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-8 text-center">

        {/* Formas de pagamento */}
        <div className="w-full">
          <p className="text-xs font-semibold text-linen/60 uppercase tracking-widest mb-4">
            Formas de pagamento
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {PAYMENT_METHODS.map(({ name, Icon }) => (
              <div
                key={name}
                title={name}
                className="w-[74px] h-11 rounded-lg bg-linen flex items-center justify-center shadow-sm"
              >
                <Icon />
              </div>
            ))}
          </div>
        </div>

        {/* Divisor */}
        <div className="w-full h-px bg-linen/15" />

        {/* Dados da empresa */}
        <div className="space-y-1">
          <p className="text-sm font-semibold text-linen">
            Preciso Verde Perto: precisoverdeperto.com.br
          </p>
          <p className="text-xs text-linen/60">
            © 2026 Preciso Verde Perto LTDA · CNPJ: 00.000.000/0001-00
          </p>
          <p className="text-xs text-linen/60">Telefone: (11) 99999-9999</p>
        </div>

        {/* Selo de segurança */}
        <div className="flex items-center gap-2 text-linen/70">
          <ShieldCheck size={16} />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Pagamento 100% seguro
          </span>
        </div>
      </div>
    </footer>
  );
}
