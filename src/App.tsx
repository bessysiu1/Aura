import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  Check, 
  Truck, 
  ShieldCheck, 
  Heart, 
  MessageCircle, 
  Phone, 
  Instagram, 
  Facebook, 
  ChevronRight, 
  X, 
  ExternalLink,
  Plus,
  Minus,
  Trash2,
  Gift,
  Palette,
  Layers,
  Crown,
  Eye,
  Camera,
  Maximize2,
  ZoomIn,
  Upload,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { PRODUCTS_CATALOG, Product, HERO_CONFIG, DESTACADOS_CONFIG, BANNER_CONFIG } from './products';
import { ProductVisual } from './components/ProductVisual';
import { PhotoManagerModal } from './components/PhotoManagerModal';
import { 
  getCustomPhotos, 
  saveCustomPhoto, 
  compressImage, 
  uploadPhotoToServer, 
  notifyPhotosUpdated 
} from './utils/photoManager';

const WHATSAPP_NUMBER = '593988691800';

interface CartItem {
  product: Product;
  selectedOption: string;
  quantity: number;
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [selectedProductOptions, setSelectedProductOptions] = useState<Record<string, string>>({
    'juego-duo-10': 'Empaque Estándar en bolsita de organza',
    'stack-muneca-combos': 'Stack Rosa (Baguette Rosa + Árbol de la Vida Nácar)',
    'pulseras-baguette-tenis': 'Verde Esmeralda',
    'coleccion-pulseras-moda-6': 'Modelo 1: Mariposa',
    'coleccion-patriotica-cordon': 'Placa Bandera de Ecuador con Escudo',
    'set-regalo-lujo-caja': 'Set Dúo Elegancia con Caja Azul Marino'
  });

  // Carrito / Pedido múltiple
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Modal Lightbox para ampliar fotografía en alta resolución
  const [lightbox, setLightbox] = useState<{ url: string; title: string; caption: string } | null>(null);

  // Modal Administrador de Fotos 1 a 1 por Galerías
  const [isPhotoManagerOpen, setIsPhotoManagerOpen] = useState<boolean>(false);
  const [photoUpdateTrigger, setPhotoUpdateTrigger] = useState<number>(0);

  // Foto desacoplada del Banner Promocional
  const [bannerPhoto, setBannerPhoto] = useState<string>(() => {
    const custom = getCustomPhotos();
    return custom[BANNER_CONFIG.slotKey] || BANNER_CONFIG.defaultImage;
  });
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingBanner, setIsUploadingBanner] = useState<boolean>(false);

  // Sincronización global cuando se actualiza cualquier foto
  useEffect(() => {
    const handlePhotoUpdate = () => {
      setPhotoUpdateTrigger(prev => prev + 1);
      const custom = getCustomPhotos();
      setBannerPhoto(custom[BANNER_CONFIG.slotKey] || BANNER_CONFIG.defaultImage);
    };

    window.addEventListener('aurea_photos_updated', handlePhotoUpdate);
    window.addEventListener('storage', handlePhotoUpdate);
    return () => {
      window.removeEventListener('aurea_photos_updated', handlePhotoUpdate);
      window.removeEventListener('storage', handlePhotoUpdate);
    };
  }, []);

  const handleBannerFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingBanner(true);
    try {
      const compressed = await compressImage(file, 1600, 0.88);
      setBannerPhoto(compressed);
      const serverUrl = await uploadPhotoToServer(BANNER_CONFIG.defaultFilename, compressed);
      const finalUrl = serverUrl || compressed;
      saveCustomPhoto(BANNER_CONFIG.slotKey, finalUrl);
      setBannerPhoto(finalUrl);
      notifyPhotosUpdated(BANNER_CONFIG.slotKey);
      showNotification('¡Fotografía del banner actualizada con éxito!');
    } catch (err) {
      console.error('Error al actualizar banner:', err);
    } finally {
      setIsUploadingBanner(false);
      if (bannerFileInputRef.current) bannerFileInputRef.current.value = '';
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOptionChange = (productId: string, optionName: string) => {
    setSelectedProductOptions(prev => ({
      ...prev,
      [productId]: optionName
    }));
  };

  const addToCart = (product: Product) => {
    const selectedOption = selectedProductOptions[product.id] || (product.options?.[0]?.name || 'Estándar');
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id && item.selectedOption === selectedOption);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += 1;
        return next;
      }
      return [...prev, { product, selectedOption, quantity: 1 }];
    });
    showNotification(`¡"${product.name}" se agregó a tu lista!`);
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart(prev => {
      const next = [...prev];
      const newQty = next[index].quantity + delta;
      if (newQty <= 0) {
        next.splice(index, 1);
      } else {
        next[index].quantity = newQty;
      }
      return next;
    });
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const totalCartPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getDirectWhatsAppUrl = (product: Product) => {
    const selectedOpt = selectedProductOptions[product.id] || product.options?.[0]?.name || '';
    const message = `${product.whatsappMessage}${selectedOpt ? ` (${selectedOpt})` : ''}. ¿Me confirman disponibilidad para envío en Ecuador por Servientrega?`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  const sendCartToWhatsApp = () => {
    if (cart.length === 0) return;
    let text = `Hola Áurea Joyería! 💛 Deseo realizar el siguiente pedido para envío en Ecuador:\n\n`;
    cart.forEach((item, idx) => {
      text += `${idx + 1}. *${item.product.name}* (x${item.quantity})\n   - Selección: ${item.selectedOption}\n   - Subtotal: $${(item.product.price * item.quantity).toFixed(2)} USD\n\n`;
    });
    text += `💰 *TOTAL ESTIMADO: $${totalCartPrice.toFixed(2)} USD*\n`;
    text += `📍 Envío nacional asegurado con Servientrega\n\n¿Me facilitan su número de cuenta de Banco Pichincha o Deuna para realizar el pago? ¡Muchas gracias!`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const filteredProducts = activeCategory === 'todos' 
    ? PRODUCTS_CATALOG 
    : PRODUCTS_CATALOG.filter(p => p.category === activeCategory);

  const heroProduct = PRODUCTS_CATALOG[0]; // Juego Dúo $15 USD con foto promocional oficial

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-slate-800 font-sans selection:bg-amber-200">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white text-xs sm:text-sm px-4 py-3 rounded-xl shadow-xl border border-amber-500/40 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Lightbox Modal para Fotografías en Alta Resolución */}
      {lightbox && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] bg-stone-950 rounded-2xl overflow-hidden border border-stone-800 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 bg-stone-900 border-b border-stone-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-serif font-bold text-white">{lightbox.title}</h4>
                <p className="text-[11px] text-amber-400">{lightbox.caption}</p>
              </div>
              <button 
                onClick={() => setLightbox(null)}
                className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white"
                title="Cerrar vista ampliada"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-auto max-h-[75vh] flex items-center justify-center p-2 bg-stone-950">
              <img 
                src={lightbox.url} 
                alt={lightbox.title}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
              />
            </div>

            <div className="p-3 bg-stone-900 border-t border-stone-800 flex items-center justify-between gap-3">
              <span className="text-[11px] text-stone-400">
                ✨ Fotografía original nítida · Joyería en tono dorado de alta gama
              </span>
              <a 
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20Áurea%20Joyería!%20Estoy%20viendo%20la%20fotografía%20de%20*${encodeURIComponent(lightbox.title)}*%20y%20deseo%20hacer%20un%20pedido.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>Pedir este modelo en WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <aside className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-amber-200 text-xs py-2 px-4 text-center font-medium tracking-wide border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Truck className="w-3.5 h-3.5 inline shrink-0 text-amber-400" />
          <span>🚚 Envíos asegurados a todo el Ecuador por <strong>Servientrega</strong> | WhatsApp directo: <strong>+593 988 691 800</strong></span>
        </div>
      </aside>

      {/* 2. HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <a href="#" className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-tight text-slate-900">
              ÁUREA
            </span>
            <span className="text-[10px] tracking-[0.25em] uppercase text-amber-700 font-semibold -mt-1">
              Bisutería de Autor · Ecuador
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#catalogo" className="hover:text-amber-700 transition-colors">Colección</a>
            <a href="#duo-estrella" className="hover:text-amber-700 transition-colors font-semibold text-amber-800">Dúo $15 USD</a>
            <a href="#sets-modelos" className="hover:text-amber-700 transition-colors">Modelos & Cajas</a>
            <a href="#proceso" className="hover:text-amber-700 transition-colors">Envíos Servientrega</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsPhotoManagerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-900 bg-amber-100/90 hover:bg-amber-200 border border-amber-300 rounded-xl transition-all shadow-2xs"
              title="Cambiar fotos 1 a 1 en cada galería de forma desvinculada"
            >
              <Camera className="w-3.5 h-3.5 text-amber-800" />
              <span>Fotos por Galerías</span>
            </button>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl border border-stone-200 hover:border-amber-400 text-slate-700 hover:text-amber-800 bg-stone-50 transition-colors"
              title="Ver mi lista de pedido"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </button>

            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20Áurea%20Joyería!%20Deseo%20ver%20el%20catálogo%20y%20precios%20de%20sus%20pulseras%20y%20sets%20con%20caja`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-amber-700 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400 fill-current" />
              <span className="hidden sm:inline">Pedir por WhatsApp</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION - CON LA IMAGEN ORIGINAL ADJUNTA COMO PRINCIPAL */}
      <section className="relative overflow-hidden bg-[#FBF9F5] py-12 sm:py-16 border-b border-stone-200">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300/60 text-amber-900 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
                <span>Bisutería Fina & Juegos Dúo en Ecuador · Envíos Nacionales</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-slate-900 leading-[1.12] tracking-tight">
                Elegancia en cada detalle con bisutería que <span className="italic text-amber-700 font-normal">resalta tu luz</span>
              </h1>

              {/* Explicación enganchadora del diseño */}
              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Descubre nuestra colección de pulseras en tonalidad dorada pulida, cristales baguette facetados y amuletos con significado. Fotografías reales de nuestras modelos luciendo cada pieza y su respectiva caja de presentación rígida de lujo.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <a 
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20Áurea!%20Deseo%20pedir%20el%20*Juego%20de%202%20Pulseras%20Elegancia%20por%20$15%20USD*%20que%20vi%20en%20su%20página%20web.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all text-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Pedir Dúo Estrella por WhatsApp ($15 USD)</span>
                </a>

                <a 
                  href="#catalogo"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-slate-800 border border-stone-200 font-medium px-6 py-3.5 rounded-xl transition-all text-sm"
                >
                  <span>Ver Catálogo Completo</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>
              </div>

              <div className="pt-6 border-t border-stone-200 grid grid-cols-3 gap-3 text-left">
                <div>
                  <p className="font-serif font-bold text-slate-900 text-base sm:text-lg">Fotos Reales</p>
                  <p className="text-xs text-slate-500">En modelo y piel</p>
                </div>
                <div>
                  <p className="font-serif font-bold text-slate-900 text-base sm:text-lg">Con su Caja</p>
                  <p className="text-xs text-slate-500">Estuche de joyería listo</p>
                </div>
                <div>
                  <p className="font-serif font-bold text-slate-900 text-base sm:text-lg">Servientrega</p>
                  <p className="text-xs text-slate-500">Entrega rápida en 48h</p>
                </div>
              </div>
            </div>

            {/* IMAGEN PRINCIPAL ADJUNTA - CARD HERO DESTACADA CON LA FOTO ORIGINAL */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white p-4 rounded-3xl shadow-lg border border-amber-200/80 overflow-hidden">
                <div className="relative rounded-2xl overflow-hidden bg-stone-900 p-4 text-white">
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold tracking-widest uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full flex items-center gap-1">
                      <Crown className="w-3 h-3 text-amber-400" />
                      <span>Imagen Principal · Más Vendida</span>
                    </span>
                    <span className="font-serif font-bold text-2xl text-amber-400">
                      $15.00 <span className="text-xs font-sans text-stone-300 font-normal">USD</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold mb-1 text-white">
                    {heroProduct.name}
                  </h3>
                  <p className="text-xs text-amber-300/90 italic mb-3">
                    "{heroProduct.tagline}"
                  </p>

                  {/* Componente Visual de Alta Resolución con pestañas para alternar Modelo, Caja y Foto Original */}
                  <div className="mb-4">
                    <ProductVisual 
                      key="hero_portada"
                      product={heroProduct} 
                      slotPrefix="hero_portada"
                      overrideDefaults={{
                        main: HERO_CONFIG.defaultImage,
                        model: HERO_CONFIG.defaultModelImage,
                        box: HERO_CONFIG.defaultBoxImage,
                        mainCaption: HERO_CONFIG.mainCaption,
                        modelCaption: HERO_CONFIG.modelCaption,
                        boxCaption: HERO_CONFIG.boxCaption,
                      }}
                      onOpenZoom={(url, title, caption) => setLightbox({ url, title, caption })}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <a 
                      href={getDirectWhatsAppUrl(heroProduct)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl text-xs sm:text-sm transition-all"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>Pedir este Dúo por WhatsApp</span>
                    </a>

                    <button 
                      onClick={() => addToCart(heroProduct)}
                      className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
                      title="Agregar a mi pedido"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 px-1">
                  <span className="flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5 text-amber-600" />
                    <span>Caja rígida de presentación disponible</span>
                  </span>
                  <span className="text-emerald-700 font-semibold">Tono dorado antialérgico</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. SECCIÓN DESTACADA: MODELOS LUCIENDO LAS JOYAS CON SU CAJA RESPECTIVA */}
      <section id="sets-modelos" className="py-16 sm:py-20 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 block mb-2">
              Galería en Piel & Empaque de Lujo
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 font-bold tracking-tight mb-4">
              Nuestras Modelos con su Respectiva Caja
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Mira con total nitidez cómo luce cada diseño en la muñeca de nuestras modelos y cómo viene presentado en su caja rígida de joyería. Puedes alternar las pestañas de cada tarjeta o pulsar la lupa para ver la foto en alta resolución.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* DESTACADO 1: JUEGO DÚO ELEGANCIA ($15 USD) */}
            <div className="bg-[#FAF9F6] rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col justify-between hover:border-amber-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Juego Dúo Estrella
                  </span>
                  <span className="font-serif font-bold text-2xl text-slate-900">$15.00 USD</span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-slate-900 mb-2">
                  Juego de 2 Pulseras "Elegancia en Cada Detalle"
                </h3>
                
                {/* Breve explicación enganchadora de su diseño */}
                <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200 mb-5">
                  <p className="text-xs text-amber-950 font-serif italic leading-relaxed">
                    "{PRODUCTS_CATALOG[0].designStory}"
                  </p>
                </div>

                {/* Visual con Pestañas: Principal | En Modelo | Con su Caja */}
                <div className="mb-5">
                  <ProductVisual 
                    key="destacado_duo"
                    product={PRODUCTS_CATALOG[0]} 
                    slotPrefix={DESTACADOS_CONFIG.duo.slotPrefix}
                    overrideDefaults={{
                      main: DESTACADOS_CONFIG.duo.defaultMain,
                      model: DESTACADOS_CONFIG.duo.defaultModel,
                      box: DESTACADOS_CONFIG.duo.defaultBox,
                      mainCaption: DESTACADOS_CONFIG.duo.mainCaption,
                      modelCaption: DESTACADOS_CONFIG.duo.modelCaption,
                      boxCaption: DESTACADOS_CONFIG.duo.boxCaption
                    }}
                    onOpenZoom={(url, title, caption) => setLightbox({ url, title, caption })}
                  />
                </div>

                <ul className="text-xs text-slate-600 space-y-1.5 mb-5">
                  <li className="flex items-center gap-1.5">
                    <span className="text-amber-600 font-bold">✓</span>
                    <span><strong>En Modelo:</strong> Pulsera baguette de cristales negros + pulsera de ónix con dije de trébol.</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-amber-600 font-bold">✓</span>
                    <span><strong>Con su Caja:</strong> Estuche rígido azul marino con almohadilla de terciopelo.</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-amber-600 font-bold">✓</span>
                    <span>Herrajes en tono dorado pulido hipoalergénico que no manchan la piel.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center gap-3">
                <a 
                  href={getDirectWhatsAppUrl(PRODUCTS_CATALOG[0])}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Pedir este Dúo por WhatsApp ($10)</span>
                </a>
                <button 
                  onClick={() => addToCart(PRODUCTS_CATALOG[0])}
                  className="p-3 rounded-xl bg-stone-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-stone-200 transition-colors"
                  title="Agregar a mi lista"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* DESTACADO 2: DÚOS STACKING EN MUÑECA */}
            <div className="bg-[#FAF9F6] rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col justify-between hover:border-amber-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Combinación en Tendencia
                  </span>
                  <span className="font-serif font-bold text-2xl text-slate-900">$13.50 USD</span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-slate-900 mb-2">
                  Dúos Stacking en Muñeca (Baguette + Cordón Amuletos)
                </h3>
                
                {/* Breve explicación enganchadora de su diseño */}
                <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200 mb-5">
                  <p className="text-xs text-amber-950 font-serif italic leading-relaxed">
                    "{PRODUCTS_CATALOG[1].designStory}"
                  </p>
                </div>

                {/* Visual con Pestañas: Principal | En Modelo | Con su Caja */}
                <div className="mb-5">
                  <ProductVisual 
                    key="destacado_stack"
                    product={PRODUCTS_CATALOG[1]} 
                    slotPrefix={DESTACADOS_CONFIG.stack.slotPrefix}
                    overrideDefaults={{
                      main: DESTACADOS_CONFIG.stack.defaultMain,
                      model: DESTACADOS_CONFIG.stack.defaultModel,
                      box: DESTACADOS_CONFIG.stack.defaultBox,
                      mainCaption: DESTACADOS_CONFIG.stack.mainCaption,
                      modelCaption: DESTACADOS_CONFIG.stack.modelCaption,
                      boxCaption: DESTACADOS_CONFIG.stack.boxCaption
                    }}
                    onOpenZoom={(url, title, caption) => setLightbox({ url, title, caption })}
                  />
                </div>

                <ul className="text-xs text-slate-600 space-y-1.5 mb-5">
                  <li className="flex items-center gap-1.5">
                    <span className="text-amber-600 font-bold">✓</span>
                    <span><strong>En Modelo:</strong> Tres opciones reales lucidas en muñeca (Rosa, Negro protector o Tricolor Ecuador).</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-amber-600 font-bold">✓</span>
                    <span><strong>Con su Caja:</strong> Caja rígida acolchada lista para entregar a esa persona especial.</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-amber-600 font-bold">✓</span>
                    <span>Cordón náutico de tacto suave e impermeable que no pierde el color.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center gap-3">
                <a 
                  href={getDirectWhatsAppUrl(PRODUCTS_CATALOG[1])}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Pedir Dúo Stacking por WhatsApp</span>
                </a>
                <button 
                  onClick={() => addToCart(PRODUCTS_CATALOG[1])}
                  className="p-3 rounded-xl bg-stone-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-stone-200 transition-colors"
                  title="Agregar a mi lista"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. BANNER DÚO $15 USD CON IMAGEN PROMOCIONAL REAL */}
      <section id="duo-estrella" className="py-14 sm:py-16 bg-[#FAFAF8] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 rounded-3xl p-6 sm:p-10 text-white border border-amber-500/30 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Promoción Más Solicitada</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl text-white font-bold leading-tight">
                  Juego de 2 Pulseras "Elegancia en Cada Detalle"
                </h2>
                
                <p className="text-amber-200/95 font-serif italic text-base sm:text-lg leading-relaxed">
                  "Estilo, fuerza y buena energía ♡ — El balance ideal entre los destellos geométricos baguette y el amuleto de trébol perlado en tono dorado resplandeciente."
                </p>

                <p className="text-xs text-stone-300 leading-relaxed">
                  Aprovecha el valor promocional de solo $15 USD por el dúo de pulseras. Incluye broche ajustable para adaptarse a cualquier tamaño de muñeca. Envíos con Servientrega asegurados en todo el territorio ecuatoriano.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-stone-400 text-sm line-through">$24.00</span>
                    <span className="font-serif font-bold text-3xl text-amber-400">SOLO $15</span>
                    <span className="text-xs text-stone-300 uppercase tracking-wider">USD el juego completo</span>
                  </div>

                  <a 
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20Áurea!%20Deseo%20el%20*Juego%20de%202%20Pulseras%20Elegancia%20por%20$15%20USD*%20que%20vi%20en%20su%20web.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-xl text-sm transition-all shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Pedir por WhatsApp al +593 988 691 800</span>
                  </a>

                  <button 
                    onClick={() => addToCart(PRODUCTS_CATALOG[0])}
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium py-3 px-4 rounded-xl text-sm transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Añadir a mi Lista</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/40 relative group">
                  <input
                    type="file"
                    ref={bannerFileInputRef}
                    onChange={handleBannerFileSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  <img 
                    src={bannerPhoto} 
                    alt="Juego de 2 Pulseras Elegancia $15 USD" 
                    className="w-full h-auto object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                    onClick={() => setLightbox({
                      url: bannerPhoto,
                      title: 'Juego de 2 Pulseras Elegancia $15 USD (Banner Promocional)',
                      caption: BANNER_CONFIG.caption
                    })}
                  />

                  {/* Botón flotante para cambiar foto del banner directamente */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => bannerFileInputRef.current?.click()}
                      disabled={isUploadingBanner}
                      className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1 shadow-lg cursor-pointer"
                      title="Cambiar fotografía del banner de promoción de forma desvinculada"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{isUploadingBanner ? 'Subiendo...' : 'Cambiar Foto'}</span>
                    </button>
                  </div>

                  <div className="bg-stone-900 p-2.5 text-center text-[10px] text-amber-300 flex items-center justify-between px-3">
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Galería Desvinculada</span>
                    </span>
                    <span 
                      className="flex items-center gap-1 cursor-pointer hover:text-white"
                      onClick={() => setLightbox({
                        url: bannerPhoto,
                        title: 'Juego de 2 Pulseras Elegancia $15 USD',
                        caption: BANNER_CONFIG.caption
                      })}
                    >
                      <ZoomIn className="w-3 h-3" />
                      <span>Ampliar en HD</span>
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 6. CATÁLOGO COMPLETO DE PRODUCTOS */}
      <section id="catalogo" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 block mb-2">
              Catálogo Oficial · Fotografías Originales
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 font-bold tracking-tight mb-4">
              Colección Completa de Pulseras & Sets
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Cada accesorio cuenta con una explicación de su diseño para que conozcas su significado y cómo combinarlo. Todas las imágenes corresponden a nuestras piezas reales.
            </p>

            {/* Categorías Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              {[
                { id: 'todos', label: 'Todos los Productos' },
                { id: 'duos', label: 'Dúos de Pulseras ($15 USD)' },
                { id: 'sets', label: 'Collar con Pulsera y Aritos ($20 USD)' },
                { id: 'baguette', label: 'Baguette Tenis (8 Tonos)' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 text-xs font-medium rounded-xl transition-all border ${
                    activeCategory === cat.id
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                      : 'bg-white text-slate-600 border-stone-200 hover:bg-stone-50 hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => {
              const currentOption = selectedProductOptions[product.id] || (product.options?.[0]?.name || '');

              return (
                <article 
                  key={product.id}
                  className="bg-[#FAFAF8] rounded-2xl p-5 border border-stone-200 hover:border-amber-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Visual Asset con Modelo o Caja y Zoom */}
                    <div className="mb-4">
                      <ProductVisual 
                        key={`catalogo_${product.id}`}
                        product={product} 
                        slotPrefix={`catalogo_${product.id}`}
                        selectedOption={currentOption}
                        onOpenZoom={(url, title, caption) => setLightbox({ url, title, caption })}
                      />
                    </div>

                    {/* Metadata limpia */}
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className="uppercase tracking-wider font-semibold text-amber-700">
                        {product.promoBadge || 'Colección Áurea'}
                      </span>
                      {product.originalPrice && (
                        <span className="line-through">${product.originalPrice.toFixed(2)} USD</span>
                      )}
                    </div>

                    <h3 className="font-serif font-bold text-slate-900 text-lg mb-1 leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-xs text-amber-800 font-medium mb-2 italic">
                      "{product.tagline}"
                    </p>

                    {/* Explicación enganchadora del diseño */}
                    <div className="bg-white p-3 rounded-xl border border-stone-200/80 mb-3 shadow-2xs">
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {product.designStory}
                      </p>
                    </div>

                    {/* Opciones Interactivas */}
                    {product.options && product.options.length > 0 && (
                      <div className="mb-4 pt-2 border-t border-stone-200">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
                          {product.optionsName || 'Opciones'}: <span className="text-amber-800 font-medium normal-case">({currentOption})</span>
                        </label>
                        
                        {product.category === 'baguette' ? (
                          <div className="flex flex-wrap gap-1.5">
                            {product.options.map((opt, i) => (
                              <button
                                key={i}
                                onClick={() => handleOptionChange(product.id, opt.name)}
                                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                                  currentOption === opt.name 
                                    ? 'border-amber-600 scale-110 shadow-xs' 
                                    : 'border-white hover:scale-105'
                                }`}
                                style={{ backgroundColor: opt.colorCode || '#D4AF37' }}
                                title={opt.name}
                              />
                            ))}
                          </div>
                        ) : (
                          <select
                            value={currentOption}
                            onChange={(e) => handleOptionChange(product.id, e.target.value)}
                            className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-amber-500"
                          >
                            {product.options.map((opt, i) => (
                              <option key={i} value={opt.name}>
                                {opt.name} {opt.detail ? `· ${opt.detail}` : ''}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Acciones de compra */}
                  <div className="pt-3 border-t border-stone-200">
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-xs text-slate-500 font-medium">Precio:</span>
                      <span className="font-serif font-bold text-2xl text-slate-900">
                        ${product.price.toFixed(2)} <span className="text-xs font-sans text-slate-500 font-normal">USD</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      <a 
                        href={getDirectWhatsAppUrl(product)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="col-span-4 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-3 rounded-xl text-xs transition-all shadow-xs"
                      >
                        <MessageCircle className="w-4 h-4 fill-current shrink-0" />
                        <span className="truncate">Pedir por WhatsApp</span>
                      </a>

                      <button
                        onClick={() => addToCart(product)}
                        className="col-span-1 inline-flex items-center justify-center p-2.5 rounded-xl border border-stone-200 hover:border-amber-500 bg-white text-slate-700 hover:text-amber-800 transition-colors"
                        title="Añadir a mi lista de compra"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

        </div>
      </section>

      {/* 7. PROCESO DE COMPRA & ENVÍOS ECUADOR */}
      <section id="proceso" className="py-16 sm:py-20 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 block mb-2">
              Proceso 100% Seguro
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 font-bold tracking-tight mb-4">
              ¿Cómo Comprar en Áurea Ecuador?
            </h2>
            <p className="text-slate-600 text-sm">
              Coordinamos todo contigo a través de WhatsApp con atención humana y personalizada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            <div className="bg-[#FAF9F6] rounded-2xl p-7 border border-stone-200 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 font-serif font-bold text-xl flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="font-serif font-bold text-slate-900 text-lg mb-2">
                Elige tus piezas o set
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Selecciona tu dúo de $10, pulseras de moda o set con caja respectiva y pulsa en "Pedir por WhatsApp".
              </p>
            </div>

            <div className="bg-[#FAF9F6] rounded-2xl p-7 border border-stone-200 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 font-serif font-bold text-xl flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="font-serif font-bold text-slate-900 text-lg mb-2">
                Confirma y abona por banco
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Aceptamos transferencias y depósitos directos en <strong>Banco Pichincha</strong>, <strong>Deuna</strong> o <strong>Banco Guayaquil</strong>.
              </p>
            </div>

            <div className="bg-[#FAF9F6] rounded-2xl p-7 border border-stone-200 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 font-serif font-bold text-xl flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="font-serif font-bold text-slate-900 text-lg mb-2">
                Recibe por Servientrega
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Despachamos tu pedido con número de guía en 24-48h hábiles directamente a tu domicilio o agencia Servientrega en cualquier provincia de Ecuador.
              </p>
            </div>

          </div>

          <div className="mt-14 bg-[#FAF9F6] rounded-2xl p-6 border border-stone-200 text-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Medios de Pago Populares en Ecuador:
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-semibold text-slate-700">
              <span className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
                🟡 Banco Pichincha
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                🟢 App Deuna (Sin recargo)
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900">
                🔵 Banco Guayaquil & Produbanco
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-stone-100 border border-stone-200 text-slate-800">
                💳 Tarjetas de Crédito / Débito
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800 text-xs">
            
            <div className="space-y-3">
              <span className="font-serif text-2xl font-bold text-white tracking-tight">
                ÁUREA
              </span>
              <p className="text-slate-400 leading-relaxed">
                Bisutería de autor y accesorios en Ecuador. Piezas con acabado en tono dorado de alta durabilidad, ónix, cristales baguette y metales hipoalergénicos.
              </p>
              <div className="pt-2 text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Atención activa en WhatsApp</span>
              </div>
            </div>

            <div>
              <h5 className="font-bold uppercase tracking-wider text-white mb-3">Colecciones Populares</h5>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#duo-estrella" className="hover:text-amber-400">Juego Dúo Elegancia ($15 USD)</a></li>
                <li><a href="#sets-modelos" className="hover:text-amber-400">Dúos Stacking en Muñeca ($15 USD)</a></li>
                <li><a href="#catalogo" className="hover:text-amber-400">Dúo Rojo Rubí & Cuentas ($15 USD)</a></li>
                <li><a href="#catalogo" className="hover:text-amber-400">Dúo Corazón Dorado & Zafiro ($15 USD)</a></li>
                <li><a href="#catalogo" className="hover:text-amber-400">Set Trío: Collar, Pulsera y Aritos ($20 USD)</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold uppercase tracking-wider text-white mb-3">Envíos & Logística</h5>
              <ul className="space-y-2 text-slate-400">
                <li>• Servientrega Nacional asegurado</li>
                <li>• Cobertura a Quito, Guayaquil, Cuenca, Ambato, Manta, Machala y todo Ecuador</li>
                <li>• Tiempo estimado: 24 a 48 horas</li>
                <li>• Empaques rígidos listos para regalo</li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold uppercase tracking-wider text-white mb-3">Contacto Directo</h5>
              <p className="text-slate-300 mb-2">WhatsApp Oficial:</p>
              <a 
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif font-bold text-amber-400 text-base block hover:underline"
              >
                +593 988 691 800
              </a>
              <p className="text-slate-500 mt-2">Horario: Lunes a Sábado de 09:00 a 19:00</p>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <p>© 2026 Áurea Bisutería Personalizada · Ecuador. Todos los derechos reservados.</p>
            <p>Venta Directa vía WhatsApp · Logística Servientrega</p>
          </div>

        </div>
      </footer>

      {/* 10. BOTONES FLOTANTES: FOTOS Y WHATSAPP */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        
        {/* Botón flotante para Administrar Fotos 1 a 1 */}
        <button
          onClick={() => setIsPhotoManagerOpen(true)}
          className="bg-stone-900/90 hover:bg-amber-600 text-white py-2.5 px-4 rounded-full shadow-lg border border-amber-400/40 flex items-center gap-2 text-xs font-semibold backdrop-blur-md transition-all hover:scale-105 active:scale-95"
          title="Administrar y cambiar fotos 1 a 1 con tus fotos de WhatsApp"
        >
          <Camera className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Cambiar Fotos</span>
        </button>

        <div className="flex items-center group">
          <div className="hidden sm:flex mr-3 bg-white text-slate-800 text-xs font-semibold py-2 px-3.5 rounded-xl shadow-lg border border-stone-200 items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>¡Escríbenos al WhatsApp!</span>
          </div>

          <a 
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20Áurea,%20estoy%20viendo%20la%20página%20web%20y%20deseo%20hacer%20una%20consulta%20sobre%20sus%20pulseras%20y%20cajas%20de%20joyería`}
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Escribir por WhatsApp"
            className="w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all relative"
          >
            <MessageCircle className="w-7 h-7 fill-current" />
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></span>
          </a>
        </div>
      </div>

      {/* MODAL ADMINISTRADOR DE FOTOS 1 A 1 */}
      <PhotoManagerModal 
        isOpen={isPhotoManagerOpen}
        onClose={() => setIsPhotoManagerOpen(false)}
        onPhotoUpdated={() => setPhotoUpdateTrigger(prev => prev + 1)}
      />

      {/* 11. DRAWER / MODAL DEL CARRITO DE COMPRA */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-700" />
                  <h3 className="font-serif font-bold text-slate-900 text-lg">Tu Lista de Pedido</h3>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-16 text-center text-slate-500">
                  <ShoppingBag className="w-12 h-12 mx-auto text-stone-300 mb-3" />
                  <p className="font-serif text-base text-slate-800 font-bold">Tu lista está vacía</p>
                  <p className="text-xs mt-1">Agrega tus pulseras o sets favoritos desde el catálogo.</p>
                </div>
              ) : (
                <div className="divide-y divide-stone-100 my-4 space-y-3">
                  {cart.map((item, idx) => (
                    <div key={idx} className="pt-3 flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-xs text-slate-900">{item.product.name}</h4>
                        <p className="text-[11px] text-amber-700 font-medium">{item.selectedOption}</p>
                        <p className="text-xs font-serif font-bold text-slate-800 mt-1">
                          ${item.product.price.toFixed(2)} USD c/u
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <button 
                            onClick={() => updateQuantity(idx, -1)}
                            className="w-6 h-6 rounded-md bg-stone-100 flex items-center justify-center text-slate-600 hover:bg-stone-200"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold px-1">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(idx, 1)}
                            className="w-6 h-6 rounded-md bg-stone-100 flex items-center justify-center text-slate-600 hover:bg-stone-200"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-serif font-bold text-sm text-slate-900 block">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        <button 
                          onClick={() => removeFromCart(idx)}
                          className="text-stone-400 hover:text-red-500 text-xs mt-2"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-stone-200 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 font-medium">Subtotal estimado:</span>
                  <span className="font-serif font-bold text-xl text-slate-900">${totalCartPrice.toFixed(2)} USD</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  * El costo de envío por Servientrega se coordina según tu cantón o ciudad.
                </p>

                <button
                  onClick={sendCartToWhatsApp}
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3.5 px-4 rounded-xl text-sm transition-all shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Enviar Pedido a WhatsApp (+593 988 691 800)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
