import React, { useState, useRef, useCallback } from 'react';
import { Bike, Store, UtensilsCrossed, ArrowLeft, CheckCircle, MapPin, QrCode, Keyboard, Loader2 } from 'lucide-react';
import type { OrderType } from '@/types';
import logo from '@/assets/logo.png';
import introVideo from '@/assets/Lanche_com_Recheio_Abundante.mp4';
import { toast } from 'sonner';
import { Scanner } from '@yudiel/react-qr-scanner';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface WelcomeModalProps {
  onSelect: (type: OrderType, extraInfo?: string) => void;
}

type Step = 'video' | 'selection' | 'table' | 'address';

export const WelcomeModal = ({ onSelect }: WelcomeModalProps) => {
  const [step, setStep] = useState<Step>('video');
  const [table, setTable] = useState('');
  
  // Modos de entrada para a Mesa (QR Code ou Digitação)
  const [inputMode, setInputMode] = useState<'qr' | 'manual'>('qr');
  const [isLoadingLoc, setIsLoadingLoc] = useState(false);

  // Estado para guardar os dados do endereço de entrega
  const [address, setAddress] = useState({
    street: '',
    number: '',
    neighborhood: '',
    complement: '',
    reference: ''
  });

  const containerRef   = useRef<HTMLDivElement>(null);
  const videoLayerRef  = useRef<HTMLDivElement>(null);

  // refs das peças animadas na tela de seleção
  const cardRef    = useRef<HTMLDivElement>(null);
  const logoRef    = useRef<HTMLDivElement>(null);
  const titleRef   = useRef<HTMLHeadingElement>(null);
  const descRef    = useRef<HTMLParagraphElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  // ── 1. FADE-IN do vídeo ao montar ───────────────────────────
  useGSAP(() => {
    if (step !== 'video') return;
    gsap.fromTo(
      videoLayerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: 'power2.out' }
    );
  }, { scope: containerRef, dependencies: [step] });

  // ── 2. TRANSIÇÃO: vídeo → seleção ───────────────────────────
  const goToSelection = useCallback(() => {
    if (step !== 'video') return;
    gsap.to(videoLayerRef.current, {
      opacity: 0,
      scale: 1.04,           // leve zoom-out enquanto desaparece
      duration: 0.9,
      ease: 'power2.inOut',
      onComplete: () => setStep('selection'),
    });
  }, [step]);

  // ── 3. ANIMAÇÃO: entrar na tela de seleção ──────────────────
  useGSAP(() => {
    if (step !== 'selection') return;

    // estado inicial invisible
    gsap.set([cardRef.current], { opacity: 0, y: 60, scale: 0.96 });
    gsap.set([logoRef.current, titleRef.current, descRef.current], { opacity: 0, y: 20 });
    gsap.set(optionsRef.current?.querySelectorAll('.option-card') ?? [], { opacity: 0, y: 24 });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // card sobe
    tl.to(cardRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.65 })
      // logo + título + desc em cascata
      .to(logoRef.current,  { opacity: 1, y: 0, duration: 0.45 }, '-=0.3')
      .to(titleRef.current, { opacity: 1, y: 0, duration: 0.4  }, '-=0.3')
      .to(descRef.current,  { opacity: 1, y: 0, duration: 0.4  }, '-=0.3')
      // opções com stagger (efeito dominó)
      .to(
        optionsRef.current?.querySelectorAll('.option-card') ?? [],
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.4, ease: 'back.out(1.5)' },
        '-=0.25'
      );
  }, { scope: containerRef, dependencies: [step] });

  // ── FUNÇÕES DE LOCALIZAÇÃO E QR CODE ────────────────────────
  const compileAddress = () => {
    return `${address.street}, ${address.number} - ${address.neighborhood}${address.complement ? ` (${address.complement})` : ''}${address.reference ? ` | Ref: ${address.reference}` : ''}`;
  };

  const isAddressValid = address.street.trim() !== '' && address.number.trim() !== '' && address.neighborhood.trim() !== '';

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Seu dispositivo não suporta localização.");
      return;
    }

    setIsLoadingLoc(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          
          if (data && data.address) {
            setAddress(prev => ({
              ...prev,
              street: data.address.road || data.address.pedestrian || '',
              neighborhood: data.address.suburb || data.address.neighbourhood || data.address.city_district || '',
              number: data.address.house_number || ''
            }));
            toast.success("Endereço encontrado! Complete com o número da casa.");
          }
        } catch (error) {
          toast.error("Falha ao puxar os dados do GPS.");
        } finally {
          setIsLoadingLoc(false);
        }
      },
      (error) => {
        setIsLoadingLoc(false);
        toast.error("Permissão de localização negada.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleScan = (detected: any) => {
    if (!detected) return;
    
    let text = '';
    if (typeof detected === 'string') text = detected;
    else if (Array.isArray(detected) && detected.length > 0) text = detected[0].rawValue;
    else if (detected.text) text = detected.text;
    
    if (text) {
      if (text.includes('mesa=')) {
        try {
          const url = new URL(text);
          const mesa = url.searchParams.get('mesa');
          if (mesa) onSelect('dine-in', mesa);
        } catch(e) { /* Ignorar link inválido */ }
      } else {
        onSelect('dine-in', text);
      }
    }
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 overflow-hidden bg-black">

      {/* ══ ETAPA 1: VÍDEO ══════════════════════════════════════ */}
      {step === 'video' && (
        <div
          ref={videoLayerRef}
          onClick={goToSelection}
          className="absolute inset-0 z-10 cursor-pointer"
          title="Clique para pular"
        >
          <video
            autoPlay
            playsInline
            muted
            className="w-full h-full object-contain bg-black"
            onEnded={goToSelection}
          >
            <source src={introVideo} type="video/mp4" />
          </video>

          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-widest uppercase select-none pointer-events-none animate-pulse">
            toque para pular
          </p>
        </div>
      )}

      {/* ══ ETAPA 2: SELEÇÃO ════════════════════════════════════ */}
      {step === 'selection' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4 md:p-6 bg-background">

          <div
            ref={cardRef}
            className="w-full max-w-sm flex flex-col items-center bg-card p-8 rounded-[2.5rem] shadow-2xl shadow-black/40 border border-border/50"
          >
            <div ref={logoRef} className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-primary/20 shadow-md mb-6">
              <img src={logo} alt="Garça's Burguer" className="w-full h-full object-cover" />
            </div>

            <h1 ref={titleRef} className="font-bold text-3xl text-foreground text-center tracking-tight mb-1">
              Bem-vindo(a)!
            </h1>
            <p ref={descRef} className="text-muted-foreground text-center text-sm font-medium mb-8">
              Como você deseja fazer o seu pedido hoje?
            </p>

            <div ref={optionsRef} className="w-full space-y-3">

              <button
                onClick={() => setStep('address')}
                className="option-card w-full group flex items-center gap-4 p-4 bg-secondary hover:bg-secondary/70 rounded-2xl border border-border/50 hover:border-primary/40 transition-all duration-200 active:scale-[0.97]"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform duration-200">
                  <Bike className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-bold text-base text-foreground">Delivery</h3>
                  <p className="text-xs text-muted-foreground">Receba no conforto de casa</p>
                </div>
              </button>

              <button
                onClick={() => onSelect('pickup')}
                className="option-card w-full group flex items-center gap-4 p-4 bg-secondary hover:bg-secondary/70 rounded-2xl border border-border/50 hover:border-primary/40 transition-all duration-200 active:scale-[0.97]"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform duration-200">
                  <Store className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-bold text-base text-foreground">Retirar na Loja</h3>
                  <p className="text-xs text-muted-foreground">Pegue seu pedido sem fila</p>
                </div>
              </button>

              <button
                onClick={() => setStep('table')}
                className="option-card w-full group flex items-center gap-4 p-4 bg-secondary hover:bg-secondary/70 rounded-2xl border border-border/50 hover:border-primary/40 transition-all duration-200 active:scale-[0.97]"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform duration-200">
                  <UtensilsCrossed className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-bold text-base text-foreground">Comer no Local</h3>
                  <p className="text-xs text-muted-foreground">Já estou em uma mesa</p>
                </div>
              </button>

            </div>
          </div>
        </div>
      )}

      {/* ══ ETAPA 3: MESA (CÂMERA E MANUAL) ═════════════════════ */}
      {step === 'table' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4 md:p-6 bg-background animate-in fade-in slide-in-from-bottom-6 duration-400">
          <div className="w-full max-w-sm flex flex-col items-center bg-card p-6 md:p-8 rounded-[2.5rem] shadow-2xl shadow-black/40 border border-border/50">

            <button
              onClick={() => setStep('selection')}
              className="self-start -ml-2 mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-xl hover:bg-secondary"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar
            </button>

            {inputMode === 'qr' ? (
              <>
                <QrCode className="w-12 h-12 text-primary mb-3 opacity-80" strokeWidth={1.5} />
                <h3 className="font-bold text-2xl text-foreground text-center tracking-tight mb-2">Escaneie o QR Code</h3>
                <p className="text-sm text-muted-foreground text-center mb-6 font-medium">
                  Aponte a câmera para o QR Code colado na sua mesa.
                </p>

                <div className="w-full max-w-[240px] aspect-square bg-black rounded-3xl overflow-hidden relative mx-auto mb-6 border-4 border-primary/20 shadow-xl">
                  <Scanner onScan={handleScan} />
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                    <div className="w-3/4 h-3/4 border-2 border-white/50 rounded-2xl animate-pulse"></div>
                  </div>
                </div>

                <button onClick={() => setInputMode('manual')} className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 mt-2">
                  <Keyboard className="w-4 h-4" /> Digitar número manualmente
                </button>
              </>
            ) : (
              <>
                <UtensilsCrossed className="w-12 h-12 text-primary mb-3 opacity-80" strokeWidth={1.5} />
                <h3 className="font-bold text-3xl text-foreground text-center tracking-tight mb-2">Quase lá!</h3>
                <p className="text-sm text-muted-foreground text-center mb-8 font-medium">
                  Digite o número da sua mesa para levarmos o pedido até você.
                </p>

                <input
                  type="number"
                  autoFocus
                  value={table}
                  onChange={e => setTable(e.target.value)}
                  placeholder="Ex: 05"
                  className="w-full bg-secondary border-none rounded-2xl p-5 text-center text-5xl font-extrabold text-foreground focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all mb-6 shadow-inner"
                />

                <button
                  onClick={() => { if (table.trim()) onSelect('dine-in', table); }}
                  disabled={!table.trim()}
                  className="w-full group flex items-center justify-center gap-3 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/30 mb-6"
                >
                  <span>Confirmar Mesa</span>
                  <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>

                <button onClick={() => setInputMode('qr')} className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <QrCode className="w-4 h-4" /> Voltar para o leitor de código
                </button>
              </>
            )}

          </div>
        </div>
      )}

      {/* ══ ETAPA 4: ENDEREÇO (DELIVERY) ════════════════════════ */}
      {step === 'address' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4 md:p-6 bg-background animate-in fade-in slide-in-from-bottom-6 duration-400">
          <div className="w-full max-w-sm flex flex-col items-center bg-card p-6 md:p-8 rounded-[2.5rem] shadow-2xl shadow-black/40 border border-border/50 max-h-[90vh] overflow-y-auto custom-scrollbar">

            <div className="w-full flex items-center justify-between mb-4">
              <button
                onClick={() => setStep('selection')}
                className="-ml-2 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-xl hover:bg-secondary"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar
              </button>
            </div>
            
            <h3 className="font-bold text-2xl text-foreground text-center tracking-tight mb-1">Onde vamos entregar?</h3>
            <p className="text-xs text-muted-foreground text-center mb-6 font-medium">
              Preencha os dados ou use sua localização.
            </p>

            {/* Botão de Localização Automática (GPS) */}
            <button
              onClick={handleGetLocation}
              disabled={isLoadingLoc}
              className="w-full mb-4 flex items-center justify-center gap-2 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 py-3.5 rounded-xl font-bold transition-all active:scale-[0.98] border border-blue-500/20"
            >
              {isLoadingLoc ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
              {isLoadingLoc ? 'Buscando satélite...' : 'Usar minha localização atual'}
            </button>

            <div className="flex items-center gap-3 mb-5 w-full px-2">
              <div className="h-px bg-border flex-1"></div>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Ou digite</span>
              <div className="h-px bg-border flex-1"></div>
            </div>

            <div className="w-full space-y-3 mb-6">
              <input
                type="text"
                value={address.street}
                onChange={e => setAddress({ ...address, street: e.target.value })}
                placeholder="Nome da Rua / Avenida *"
                className="w-full bg-secondary/50 border border-border/50 rounded-xl p-3.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
              />
              
              <div className="flex gap-3">
                <input
                  type="text"
                  value={address.number}
                  onChange={e => setAddress({ ...address, number: e.target.value })}
                  placeholder="Número *"
                  className="w-1/3 bg-secondary/50 border border-border/50 rounded-xl p-3.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                />
                <input
                  type="text"
                  value={address.neighborhood}
                  onChange={e => setAddress({ ...address, neighborhood: e.target.value })}
                  placeholder="Bairro *"
                  className="w-2/3 bg-secondary/50 border border-border/50 rounded-xl p-3.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                />
              </div>

              <input
                type="text"
                value={address.complement}
                onChange={e => setAddress({ ...address, complement: e.target.value })}
                placeholder="Complemento (Apto, Bloco...)"
                className="w-full bg-secondary/50 border border-border/50 rounded-xl p-3.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
              />

              <input
                type="text"
                value={address.reference}
                onChange={e => setAddress({ ...address, reference: e.target.value })}
                placeholder="Ponto de Referência"
                className="w-full bg-secondary/50 border border-border/50 rounded-xl p-3.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
              />
            </div>

            <button
              onClick={() => { if (isAddressValid) onSelect('delivery', compileAddress()); }}
              disabled={!isAddressValid}
              className="w-full group flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/30"
            >
              <span>Confirmar Endereço</span>
              <Bike className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

          </div>
        </div>
      )}

    </div>
  );
};