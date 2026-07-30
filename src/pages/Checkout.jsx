import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck, CheckCircle2, CreditCard, Barcode, Wallet, QrCode,
  Copy, Check, Loader2,
} from "lucide-react";

import CheckoutFooter from "../components/CheckoutFooter";
import { useCartStore } from "../store/useCartStore";
import { supabase } from "../lib/supabase";

function buildFakePixPayload({ amount, txid }) {
  const valor = amount.toFixed(2);
  return (
    `00020126580014BR.GOV.BCB.PIX0136${txid}` +
    `5204000053039865802BR5913PRECISOVERDE6009SAOPAULO` +
    `6304${valor.replace(".", "")}`
  ).toUpperCase();
}

function seededBit(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x) > 0.5;
}

function PixQrCode({ value }) {
  const size = 21;
  const cell = 8;
  const modules = useMemo(() => {
    const grid = [];
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const inTopLeft = row < 7 && col < 7;
        const inTopRight = row < 7 && col >= size - 7;
        const inBottomLeft = row >= size - 7 && col < 7;
        if (inTopLeft || inTopRight || inBottomLeft) continue;
        const seed = value.charCodeAt((row * size + col) % value.length) * (row + 1) * (col + 3);
        if (seededBit(seed)) grid.push([row, col]);
      }
    }
    return grid;
  }, [value]);

  const FinderPattern = ({ x, y }) => (
    <g transform={`translate(${x * cell}, ${y * cell})`}>
      <rect width={cell * 7} height={cell * 7} fill="#1a2e22" />
      <rect x={cell} y={cell} width={cell * 5} height={cell * 5} fill="#fff" />
      <rect x={cell * 2} y={cell * 2} width={cell * 3} height={cell * 3} fill="#1a2e22" />
    </g>
  );

  return (
    <svg
      viewBox={`0 0 ${size * cell} ${size * cell}`}
      className="w-40 h-40 sm:w-44 sm:h-44"
      role="img"
      aria-label="QR Code Pix"
    >
      <rect width="100%" height="100%" fill="#fff" />
      {modules.map(([row, col]) => (
        <rect key={`${row}-${col}`} x={col * cell} y={row * cell} width={cell} height={cell} fill="#1a2e22" />
      ))}
      <FinderPattern x={0} y={0} />
      <FinderPattern x={size - 7} y={0} />
      <FinderPattern x={0} y={size - 7} />
    </svg>
  );
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function PixPaymentPanel({ amount, onConfirmed }) {
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("waiting");

  const txid = useMemo(
    () => Math.random().toString(36).slice(2, 10).padEnd(8, "0"),
    []
  );
  const pixPayload = useMemo(() => buildFakePixPayload({ amount, txid }), [amount, txid]);

  useEffect(() => {
    if (status !== "waiting") return;
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [status, secondsLeft]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pixPayload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
    }
  };

  const handleSimulateConfirm = () => {
    setStatus("checking");
    setTimeout(() => {
      setStatus("paid");
      onConfirmed?.();
    }, 1800);
  };

  if (status === "paid") {
    return (
      <div className="flex flex-col items-center text-center py-6">
        <div className="w-14 h-14 rounded-full bg-forest/10 flex items-center justify-center mb-4">
          <CheckCircle2 className="text-forest" size={28} />
        </div>
        <h3 className="text-lg font-display text-ink mb-1">Pagamento confirmado!</h3>
        <p className="text-sm text-bark">Recebemos seu Pix de R$ {amount.toFixed(2).replace(".", ",")}. Seu pedido já está sendo preparado.</p>
      </div>
    );
  }

  const expired = secondsLeft <= 0;

  return (
    <div className="max-w-md">
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        <div className="shrink-0 border border-bark/15 rounded-2xl p-3 bg-white">
          <PixQrCode value={pixPayload} />
        </div>

        <div className="flex-1 w-full">
          <p className="text-sm font-medium text-ink mb-1">Escaneie o QR Code com o app do seu banco</p>
          <p className="text-xs text-bark mb-4">
            Ou copie o código abaixo e cole na área "Pix Copia e Cola"
          </p>

          <div className="flex items-center gap-2 border border-bark/20 rounded-xl px-3 py-2.5 bg-linen/40">
            <span className="flex-1 text-[11px] text-bark truncate font-mono">{pixPayload}</span>
            <button
              onClick={handleCopy}
              className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-forest hover:text-forest/80 transition-colors"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copiado" : "Copiar"}
            </button>
          </div>

          <div className="flex items-center justify-between mt-4 text-xs">
            <span className="text-bark">
              {expired ? "Código expirado" : "Expira em"}
            </span>
            <span className={`font-mono font-bold ${expired ? "text-red-500" : "text-ink"}`}>
              {expired ? "00:00" : formatTime(secondsLeft)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-forest/5 border border-forest/15 p-4 text-xs text-bark leading-relaxed">
        Assim que o pagamento for confirmado pelo seu banco, atualizamos seu pedido automaticamente — não é preciso enviar comprovante.
      </div>

      {expired ? (
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-forest hover:bg-forest/90 text-linen font-bold rounded-xl py-4 mt-6 transition-colors shadow-sm"
        >
          GERAR NOVO CÓDIGO
        </button>
      ) : (
        <button
          onClick={handleSimulateConfirm}
          disabled={status === "checking"}
          className="w-full bg-forest hover:bg-forest/90 disabled:opacity-70 text-linen font-bold rounded-xl py-4 mt-6 transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          {status === "checking" ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              VERIFICANDO PAGAMENTO...
            </>
          ) : (
            "JÁ FIZ O PAGAMENTO"
          )}
        </button>
      )}
    </div>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  
  // 🪄 BLINDAGEM DO CARRINHO: Lê o carrinho e o Total na hora!
  const cart = useCartStore((state) => state.items || state.cart || []);
  const total = useCartStore((state) => state.total) || cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  const [step, setStep] = useState(1);
  const [deliveryStage, setDeliveryStage] = useState('cep');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showPixPayment, setShowPixPayment] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const [customer, setCustomer] = useState({ name: "", email: "" });
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [cep, setCep] = useState("");
  
  const [address, setAddress] = useState({
    street: "", number: "", complement: "", neighborhood: "", city: "", state: ""
  });

  useEffect(() => {
    // Só redireciona se o carrinho estiver vazio E o pedido não tiver sido criado
    if (cart.length === 0 && !orderId) {
      navigate("/produtos");
    }
  }, [cart, navigate, orderId]);

  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      setCpf(value);
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4,5})(\d{4})$/, '$1-$2');
      setPhone(value);
    }
  };

  const handleCepChange = async (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 8) {
      value = value.replace(/(\d{5})(\d{1,3})$/, '$1-$2');
      setCep(value);
      
      if (value.replace(/\D/g, '').length === 8) {
        setDeliveryStage('form');
        try {
          const cleanCep = value.replace(/\D/g, '');
          const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
          const data = await res.json();
          if (!data.erro) {
            setAddress({
              street: data.logradouro || "",
              neighborhood: data.bairro || "",
              city: data.localidade || "",
              state: data.uf || "",
              number: "",
              complement: ""
            });
          }
        } catch (err) {
          console.error("Erro ViaCEP:", err);
        }
      }
    }
  };

  const handleCreateOrder = async () => {
    if (!address.number) {
      alert("Por favor, preencha o número do seu endereço.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .insert([{
          customer_name: customer.name,
          customer_email: customer.email,
          customer_cpf: cpf,
          customer_phone: phone,
          shipping_address: { ...address, cep },
          items: cart,
          total_amount: total
        }])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        setOrderId(data[0].id);
        setStep(3);
      }
    } catch (err) {
      console.error("Erro ao gerar pedido:", err);
      alert("Ocorreu um erro ao processar o pedido. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-linen font-body">

      <header className="bg-forest text-linen py-4 px-6 flex justify-between items-center shadow-md">
        <Link to="/" className="font-display text-xl tracking-wider text-linen">PRECISO VERDE PERTO</Link>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <ShieldCheck size={16} /> PAGAMENTO 100% SEGURO
        </div>
      </header>
      
      <div className="bg-white/60 py-2 text-center border-b border-bark/10 text-xs font-semibold text-bark uppercase tracking-wide">
        Frete grátis nas compras acima de R$ 299
      </div>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 mt-8 mb-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 space-y-6">
          
          <div className={`bg-white rounded-3xl p-6 md:p-8 shadow-sm border-2 transition-all ${step === 1 ? 'border-forest' : 'border-transparent opacity-60'}`}>
            <h2 className="text-xl font-display text-ink flex items-center gap-3 mb-2">
              <span className="bg-forest text-linen rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">1</span>
              IDENTIFICAÇÃO
            </h2>
            <p className="text-sm text-bark mb-6">Utilizaremos seu e-mail para: Identificar seu perfil, histórico de compra e carrinho.</p>
            
            <div className="space-y-4 max-w-md">
              <div>
                <label className="text-sm text-ink font-medium mb-1 block">Nome completo</label>
                <input 
                  type="text" placeholder="ex.: Maria de Almeida Cruz" disabled={step !== 1} 
                  value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})}
                  className="w-full border border-bark/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest bg-white" 
                />
              </div>
              <div>
                <label className="text-sm text-ink font-medium mb-1 block">E-mail</label>
                <input 
                  type="email" placeholder="ex.: maria@gmail.com" disabled={step !== 1} 
                  value={customer.email} onChange={e => setCustomer({...customer, email: e.target.value})}
                  className="w-full border border-bark/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest bg-white" 
                />
              </div>
              <div>
                <label className="text-sm text-ink font-medium mb-1 block">CPF</label>
                <input 
                  type="text" 
                  value={cpf}
                  onChange={handleCpfChange}
                  placeholder="000.000.000-00" 
                  disabled={step !== 1} 
                  className="w-full border border-bark/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest bg-white placeholder:text-bark/40" 
                />
              </div>
              <div>
                <label className="text-sm text-ink font-medium mb-1 block">Celular / WhatsApp</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="+55" defaultValue="+55" disabled className="w-16 border border-bark/20 bg-linen/50 rounded-xl px-3 py-3 text-sm text-center text-ink font-medium" />
                  <input 
                    type="text" 
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="(00) 00000-0000" 
                    disabled={step !== 1} 
                    className="flex-1 border border-bark/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest bg-white placeholder:text-bark/40" 
                  />
                </div>
              </div>
              
              {step === 1 && (
                <button 
                  onClick={() => {
                    if(!customer.name || !customer.email || cpf.length < 14 || phone.length < 14) {
                      alert("Preencha todos os dados corretamente.");
                      return;
                    }
                    setStep(2);
                  }} 
                  className="w-full bg-forest hover:bg-forest/90 text-linen font-bold rounded-xl py-4 mt-2 transition-colors shadow-sm"
                >
                  IR PARA ENTREGA
                </button>
              )}
            </div>
          </div>

          <div className={`bg-white rounded-3xl p-6 md:p-8 shadow-sm border-2 transition-all ${step === 2 ? 'border-forest' : 'border-transparent opacity-60'}`}>
            <h2 className="text-xl font-display text-bark flex items-center gap-3 mb-2">
              <span className={`rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold transition-colors ${step >= 2 ? 'bg-forest text-linen' : 'bg-linen border border-bark/20 text-bark'}`}>2</span>
              <span className={step >= 2 ? 'text-ink' : ''}>ENTREGA</span>
            </h2>
            
            {step === 2 && (
              <div className="mt-6 max-w-md">
                <p className="text-sm text-ink mb-6">Cadastre ou selecione um endereço</p>

                {deliveryStage === 'cep' && (
                  <div>
                    <label className="text-sm text-ink font-medium mb-1 block">CEP</label>
                    <input 
                      type="text" 
                      value={cep} 
                      onChange={handleCepChange} 
                      placeholder="00000-000" 
                      className="w-48 border border-bark/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest bg-white placeholder:text-bark/40" 
                    />
                  </div>
                )}

                {deliveryStage === 'form' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                    <div className="flex justify-between items-end">
                       <div className="flex-1 pr-4">
                          <label className="text-sm text-ink font-medium mb-1 block">CEP</label>
                          <div className="relative">
                            <input type="text" value={cep} readOnly className="w-full border border-bark/20 bg-forest/5 rounded-xl px-4 py-3 text-sm text-ink font-medium outline-none" />
                            <CheckCircle2 size={16} className="absolute right-4 top-3.5 text-forest" />
                          </div>
                       </div>
                       <span className="text-sm text-bark pb-3 font-medium">{address.city} / {address.state}</span>
                    </div>
                    
                    <div>
                      <label className="text-sm text-ink font-medium mb-1 block">Endereço</label>
                      <input type="text" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} className="w-full border border-bark/20 bg-white rounded-xl px-4 py-3 text-sm focus:border-forest focus:ring-1 focus:ring-forest outline-none" />
                    </div>

                    <div className="flex gap-4">
                      <div className="w-1/3">
                        <label className="text-sm text-ink font-medium mb-1 block">Número</label>
                        <input type="text" value={address.number} onChange={e => setAddress({...address, number: e.target.value})} className="w-full border border-bark/20 bg-white rounded-xl px-4 py-3 text-sm focus:border-forest focus:ring-1 focus:ring-forest outline-none" />
                      </div>
                      <div className="flex-1">
                        <label className="text-sm text-ink font-medium mb-1 block">Bairro</label>
                        <input type="text" value={address.neighborhood} onChange={e => setAddress({...address, neighborhood: e.target.value})} className="w-full border border-bark/20 bg-white rounded-xl px-4 py-3 text-sm focus:border-forest focus:ring-1 focus:ring-forest outline-none" />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-ink font-medium mb-1 block">Complemento <span className="text-bark text-xs font-normal">(opcional)</span></label>
                      <input type="text" value={address.complement} onChange={e => setAddress({...address, complement: e.target.value})} className="w-full border border-bark/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest bg-white" />
                    </div>

                    <button onClick={() => setDeliveryStage('shipping')} className="w-full bg-forest hover:bg-forest/90 text-linen font-bold rounded-xl py-4 mt-6 transition-colors shadow-sm">
                      CONTINUAR
                    </button>
                  </div>
                )}

                {deliveryStage === 'shipping' && (
                  <div className="animate-in fade-in">
                     <p className="text-sm text-forest font-semibold mb-2">+ NOVO ENDEREÇO</p>
                     
                     <div className="border border-bark/20 rounded-xl p-4 flex gap-3 items-start bg-linen/30 mb-6">
                        <div className="mt-1 w-4 h-4 rounded-full border-[5px] border-forest bg-white shrink-0"></div>
                        <div className="text-sm text-ink font-medium">
                          <p>{address.street}, {address.number} {address.complement && `- ${address.complement}`}</p>
                          <p className="text-bark font-normal mt-0.5">{address.neighborhood} — {address.city}-{address.state} | CEP {cep}</p>
                        </div>
                     </div>

                     <p className="text-sm text-ink font-medium mb-2">Escolha uma forma de entrega:</p>
                     <div className="border border-forest rounded-xl p-4 flex items-center justify-between bg-forest/5 mb-6 cursor-pointer">
                        <div className="flex gap-3 items-center">
                          <div className="w-4 h-4 rounded-full border-[5px] border-forest bg-white shrink-0"></div>
                          <div>
                            <p className="text-sm font-semibold text-ink">Frete Padrão</p>
                            <p className="text-xs text-bark">Chega até a próxima quinta, dia 23</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-forest">R$ 9,45</span>
                     </div>

                     <p className="text-xs text-bark mb-6 leading-relaxed">Nossos envios são feitos de São Paulo e normalmente enviamos o seu pedido em até 5 dias úteis. Você receberá o código de rastreio via e-mail ou poderá acompanhar sua compra na nossa central de rastreio.</p>

                     <button 
                        onClick={handleCreateOrder} 
                        disabled={isSubmitting}
                        className="w-full bg-forest hover:bg-forest/90 disabled:opacity-70 text-linen font-bold rounded-xl py-4 transition-colors shadow-sm flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <><Loader2 className="animate-spin w-4 h-4" /> CRIANDO PEDIDO...</>
                        ) : (
                          "IR PARA PAGAMENTO"
                        )}
                     </button>
                  </div>
                )}

              </div>
            )}
            {step < 2 && (
              <p className="text-sm text-bark">Preencha suas informações pessoais para continuar</p>
            )}
          </div>

          <div className={`bg-white rounded-3xl p-6 md:p-8 shadow-sm border-2 transition-all ${step === 3 ? 'border-forest' : 'border-transparent opacity-60'}`}>
            <h2 className="text-xl font-display text-bark flex items-center gap-3 mb-2">
              <span className={`rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold transition-colors ${step === 3 ? 'bg-forest text-linen' : 'bg-linen border border-bark/20 text-bark'}`}>3</span>
              <span className={step === 3 ? 'text-ink' : ''}>PAGAMENTO</span>
            </h2>
            
            {step === 3 && (
              <div className="mt-6">
                {!showPixPayment ? (
                  <>
                    <p className="text-sm text-ink font-medium mb-4">Escolha uma forma de pagamento</p>

                    <div className="space-y-3">
                      <label className="border border-bark/20 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-forest transition-colors has-[:checked]:border-forest has-[:checked]:bg-forest/5">
                        <input
                          type="radio"
                          name="payment"
                          className="accent-forest w-4 h-4"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-ink flex items-center gap-2">
                            <CreditCard size={18} className="text-forest" />
                            Cartão de Crédito
                          </span>
                          <p className="text-xs text-bark mt-1">Visa, MasterCard, American Express</p>
                        </div>
                      </label>

                      <label className="border border-bark/20 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-forest transition-colors has-[:checked]:border-forest has-[:checked]:bg-forest/5">
                        <input
                          type="radio"
                          name="payment"
                          className="accent-forest w-4 h-4"
                          checked={paymentMethod === 'pix'}
                          onChange={() => setPaymentMethod('pix')}
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-ink flex items-center gap-2">
                            <QrCode size={18} className="text-forest" />
                            Pix
                          </span>
                          <p className="text-xs text-bark mt-1">Aprovação imediata, com 5% de desconto</p>
                        </div>
                      </label>

                      <label className="border border-bark/20 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-forest transition-colors has-[:checked]:border-forest has-[:checked]:bg-forest/5">
                        <input
                          type="radio"
                          name="payment"
                          className="accent-forest w-4 h-4"
                          checked={paymentMethod === 'boleto'}
                          onChange={() => setPaymentMethod('boleto')}
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-ink flex items-center gap-2">
                            <Barcode size={18} className="text-forest" />
                            Boleto Bancário
                          </span>
                          <p className="text-xs text-bark mt-1">Aprovação em até 2 dias úteis</p>
                        </div>
                      </label>

                      <label className="border border-bark/20 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-forest transition-colors has-[:checked]:border-forest has-[:checked]:bg-forest/5">
                        <input
                          type="radio"
                          name="payment"
                          className="accent-forest w-4 h-4"
                          checked={paymentMethod === 'wallet'}
                          onChange={() => setPaymentMethod('wallet')}
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-ink flex items-center gap-2">
                            <Wallet size={18} className="text-forest" />
                            Carteiras Digitais
                          </span>
                          <p className="text-xs text-bark mt-1">Mercado Pago, PayPal, PagSeguro</p>
                        </div>
                      </label>
                    </div>

                    <button
                      onClick={() => {
                        if (paymentMethod === 'pix') setShowPixPayment(true);
                      }}
                      className="w-full bg-forest hover:bg-forest/90 text-linen font-bold rounded-xl py-4 mt-8 transition-colors shadow-sm"
                    >
                      FINALIZAR COMPRA
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setShowPixPayment(false)}
                      className="text-xs font-semibold text-bark hover:text-forest transition-colors mb-4"
                    >
                      ← Escolher outra forma de pagamento
                    </button>
                    <PixPaymentPanel amount={total} onConfirmed={() => {}} />
                  </>
                )}
              </div>
            )}
            {step < 3 && (
              <p className="text-sm text-bark">Preencha suas informações de entrega para continuar</p>
            )}
          </div>

        </div>

        {/* COLUNA DIREITA: RESUMO (Renderizando itens reais formatados) */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm sticky top-6 border border-bark/10">
            <h3 className="text-sm font-bold text-ink mb-4 uppercase tracking-wide">Resumo</h3>
            
            <div className="mb-6">
              <p className="text-xs text-bark font-medium mb-2">Tem um cupom?</p>
              <div className="flex gap-2">
                <input type="text" placeholder="Código do cupom" className="flex-1 border border-bark/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest" />
                <button className="text-forest text-xs font-bold px-2 hover:underline">ADICIONAR</button>
              </div>
            </div>

            <div className="bg-linen/50 rounded-xl p-4 mb-6 border border-bark/10">
              <div className="flex justify-between text-sm mb-2 text-ink">
                <span>Produtos</span>
                <span>{total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-forest border-t border-bark/10 pt-2 mt-2">
                <span>Total</span>
                <span>{total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              </div>
            </div>

            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 scrollbar-hide">
              {cart.map((item, idx) => (
                <div key={item.cartId || idx} className="flex gap-4 items-start">
                  <div className="w-16 h-16 bg-linen rounded-lg overflow-hidden shrink-0 border border-bark/10">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-ink leading-tight mb-1">{item.name}</h4>
                    
                    <div className="text-[11px] text-bark space-y-0.5 mb-1">
                      {item.color && (
                        <p>Cor: <span className="font-semibold text-ink">{item.color}</span></p>
                      )}
                      {item.size && item.size !== "Único" && (
                        <p>Tamanho: <span className="font-semibold text-ink">{item.size}</span></p>
                      )}
                      <p>Quantidade: <span className="font-semibold text-ink">{item.quantity || 1}</span></p>
                    </div>

                    <p className="text-xs font-bold text-forest">
                      {((item.price) * (item.quantity || 1)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </main>

      <CheckoutFooter />
    </div>
  );
}