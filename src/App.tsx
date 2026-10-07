import React, { useState } from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  Check, 
  Truck, 
  ShieldCheck, 
  Heart, 
  MessageCircle, 
  Phone, 
  ExternalLink,
  Plus,
  Minus,
  Trash2,
  Gift,
  ZoomIn,
  X,
  ChevronRight,
  Eye
} from 'lucide-react';
import { PRODUCTS_CATALOG, Product } from './products';

const WHATSAPP_NUMBER = '593988691800';

interface CartItem {
  product: Product;
  selectedOption: string;
  quantity: number;
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [selectedProductOptions, setSelectedProductOptions] = useState<Record<string, string>>({
    'juego-duo-10': 'Empaque Estándar con bolsita de organza',
    'pulseras-baguette-tenis': 'Verde Esmeralda',
    'coleccion-pulseras-moda-6': 'Modelo 1: Mariposa',
    'coleccion-patriotica-cordon': 'Placa Bandera de Ecuador con Escudo Nacional',
    'combo-stack-duo-mix': 'Stack Rosa (Baguette Rosa + Árbol de la Vida)',
    'caja-regalo-lujo-presentacion': 'Caja Azul Marino con inserto de terciopelo'
  });

  // Modal Lightbox para ver fotografías en alta resolución
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string; subtitle?: string; price?: number } | null>(null);

  // Carrito / Pedido múltiple
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Simulador de Grabado
  const [simulatorText, setSimulatorText] = useState<string>('CAMILA');
  const [simulatorFont, setSimulatorFont] = useState<'serif' | 'sans' | 'italic'>('serif');
  const [simulatorMetal, setSimulatorMetal] = useState<string>('Baño de Oro 18K');

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
    showNotification(`¡"${product.name}" agregado a tu lista!`);
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
    const message = `${product.whatsappMessage}${selectedOpt ? ` (${selectedOpt})` : ''}. Por favor confirmarme costo de envío a mi ciudad y datos bancarios (Banco Pichincha / Deuna).`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  const sendCartToWhatsApp = () => {
    if (cart.length === 0) return;
    let text = `Hola Áurea Joyería! 💛 Deseo realizar el siguiente pedido para envío en Ecuador:\n\n`;
    cart.forEach((item, idx) => {
      text += `${idx + 1}. *${item.product.name}* (x${item.quantity})\n   - Selección: ${item.selectedOption}\n   - Subtotal: $${(item.product.price * item.quantity).toFixed(2)} USD\n\n`;
    });
    text += `💰 *TOTAL A PAGAR: $${totalCartPrice.toFixed(2)} USD*\n`;
    text += `📍 Envío a través de Servientrega\n\n¿Me podrían facilitar su número de cuenta de Banco Pichincha o Deuna para realizar el pago? ¡Gracias!`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const sendSimulatorToWhatsApp = () => {
    const fontLabel = simulatorFont === 'serif' ? 'Elegante (Serif)' : simulatorFont === 'sans' ? 'Moderna (Sans)' : 'Cursiva Romántica';
    const text = `Hola Áurea Joyería! ✨\nCreé mi diseño en el simulador de su página web y deseo encargarlo:\n- Texto a grabar: "${simulatorText || 'INICIALES'}"\n- Tipografía: ${fontLabel}\n- Acabado: ${simulatorMetal}\n- Destino: Envío por Servientrega en Ecuador\n\n¿Cuál es el valor final y los datos para transferir?`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const filteredProducts = activeCategory === 'todos' 
    ? PRODUCTS_CATALOG 
    : PRODUCTS_CATALOG.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-slate-800 font-sans selection:bg-amber-200">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white text-xs sm:text-sm px-4 py-3 rounded-xl shadow-xl border border-amber-500/40 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <aside className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 text-amber-50 text-xs py-2.5 px-4 text-center font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Truck className="w-3.5 h-3.5 inline shrink-0" />
          <span>Envíos asegurados a todo el Ecuador por <strong>Servientrega</strong> | WhatsApp Directo: <strong>+593 988 691 800</strong></span>
        </div>
      </aside>

      {/* 2. TOP BAR */}
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
            <a href="#duo-estrella" className="hover:text-amber-700 transition-colors font-semibold text-amber-800">Dúo $10</a>
            <a href="#baguettes" className="hover:text-amber-700 transition-colors">Baguettes (8 Colores)</a>
            <a href="#moda-6" className="hover:text-amber-700 transition-colors">Pulseras de Moda $6</a>
            <a href="#ecuador-cordon" className="hover:text-amber-700 transition-colors">Edición Ecuador</a>
            <a href="#simulador" className="hover:text-amber-700 transition-colors">Simulador</a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Botón Carrito */}
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

            {/* Direct WhatsApp CTA */}
            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20Áurea%20Joyería!%20Deseo%20ver%20el%20catálogo%20y%20precios%20de%20sus%20pulseras%20y%20accesorios`}
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

      {/* 3. HERO SECTION REORGANIZADA CON FOTO ESTRELLA */}
      <section className="relative overflow-hidden bg-[#FBF9F5] py-12 sm:py-18 border-b border-stone-200">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
                <span>Bisutería Fina y Pulseras de Moda en Ecuador</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-slate-900 leading-[1.12] tracking-tight">
                Elegancia, fe y estilo <span className="italic text-amber-700 font-normal">hechos a mano</span> para tu día a día
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Nuestras piezas más pedidas: el <strong>Juego Dúo de 2 Pulseras por $10</strong>, la colección <strong>Baguette Tenis en 8 colores</strong> y los amuletos con la <strong>Bandera de Ecuador</strong>.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <a 
                  href="#duo-estrella"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-medium px-7 py-3 rounded-xl shadow-sm hover:shadow-md transition-all text-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Ver Oferta Dúo por $10</span>
                </a>

                <a 
                  href="#catalogo"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-slate-800 border border-stone-200 font-medium px-6 py-3 rounded-xl transition-all text-sm"
                >
                  <span>Explorar Colecciones</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>
              </div>

              {/* Tira de Miniaturas Reales para navegación rápida */}
              <div className="pt-6 border-t border-stone-200">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 text-center lg:text-left">
                  Explora las fotografías de cada modelo:
                </p>
                <div className="grid grid-cols-5 gap-2 sm:gap-3 max-w-md mx-auto lg:mx-0">
                  {[
                    { src: '/images/promo-duo-10.jpg', label: 'Dúo $10' },
                    { src: '/images/baguettes-8-colores.jpg', label: '8 Colores' },
                    { src: '/images/pulseras-moda-6.jpg', label: '$6.00 c/u' },
                    { src: '/images/coleccion-ecuador.jpg', label: 'Ecuador' },
                    { src: '/images/caja-regalo-lujo.jpg', label: 'Caja Regalo' }
                  ].map((thumb, idx) => (
                    <button
                      key={idx}
                      onClick={() => setLightboxImage({ src: thumb.src, title: thumb.label })}
                      className="group relative rounded-xl overflow-hidden aspect-square border border-stone-200 hover:border-amber-500 transition-all shadow-2xs hover:scale-105"
                      title={`Ver foto ampliada de ${thumb.label}`}
                    >
                      <img src={thumb.src} alt={thumb.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors flex items-center justify-center">
                        <ZoomIn className="w-3.5 h-3.5 text-white opacity-80 group-hover:opacity-100" />
                      </div>
                      <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-white py-0.5 text-center truncate">
                        {thumb.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* FOTOGRAFÍA HERO: JUEGO DÚO $10 EN MUÑECA */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white p-3 sm:p-4 rounded-3xl shadow-md border border-stone-200 overflow-hidden">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-stone-900 group cursor-pointer"
                     onClick={() => setLightboxImage({ src: '/images/promo-duo-10.jpg', title: 'Juego de 2 Pulseras Elegancia', subtitle: 'Estilo, fuerza y buena energía ♡', price: 10.00 })}>
                  <img 
                    src="/images/promo-duo-10.jpg" 
                    alt="Juego de 2 Pulseras Elegancia en muñeca" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  
                  {/* Badge flotante en la foto */}
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/40 text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>SOLO $10 EL JUEGO</span>
                  </div>

                  <div className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-md text-slate-800">
                    <ZoomIn className="w-4 h-4" />
                  </div>

                  <div className="absolute bottom-3 inset-x-3 bg-black/85 backdrop-blur-md p-3 rounded-xl border border-white/10 text-white flex items-center justify-between">
                    <div>
                      <p className="font-serif font-bold text-sm text-amber-300">Juego de 2 Pulseras</p>
                      <p className="text-[10px] text-stone-300">Baguette Negra + Trébol Ónix</p>
                    </div>
                    <span className="font-serif font-bold text-xl text-white">$10 USD</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 px-1">
                  <span className="flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5 text-amber-600" />
                    <span>Incluye 2 pulseras combinables</span>
                  </span>
                  <span className="text-emerald-700 font-semibold">Envíos a todo Ecuador</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. SECCIÓN DESTACADA REORGANIZADA: DÚO $10 Y CAJA DE REGALO */}
      <section id="duo-estrella" className="py-16 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 rounded-3xl p-6 sm:p-10 text-white border border-amber-500/30 shadow-lg">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Oferta Principal del Catálogo</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl text-white font-bold leading-tight">
                  Juego de 2 Pulseras Elegancia
                </h2>
                <p className="text-amber-200/90 font-serif italic text-lg">
                  "Estilo, fuerza y buena energía ♡"
                </p>

                <p className="text-sm text-stone-300 leading-relaxed">
                  El conjunto más deseado en Ecuador: incluye la pulsera tenis de <strong>cristales baguette negros</strong> de alto brillo con montura dorada y cadena ajustable + la pulsera de cuentas de <strong>ónix negro con el dije de trébol de cuatro hojas</strong> estilo Van Cleef con borde perlado dorado.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-xs">
                    <span className="font-bold text-amber-400 block mb-0.5">✦ Diseño Moderno</span>
                    <span className="text-stone-300">Inspirado en alta joyería</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-xs">
                    <span className="font-bold text-amber-400 block mb-0.5">✦ Alta Calidad</span>
                    <span className="text-stone-300">Brillo duradero y pulido</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-xs">
                    <span className="font-bold text-amber-400 block mb-0.5">✦ Ajustable</span>
                    <span className="text-stone-300">Broche bolo corredizo</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-stone-400 text-sm line-through">$16.00</span>
                    <span className="font-serif font-bold text-3xl text-amber-400">SOLO $10</span>
                    <span className="text-xs text-stone-300 uppercase tracking-wider">USD</span>
                  </div>

                  <a 
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20Áurea!%20Deseo%20pedir%20el%20*Juego%20de%202%20Pulseras%20Elegancia%20por%20$10%20USD*%20visto%20en%20su%20web.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-xl text-sm transition-all shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Pedir este Dúo por WhatsApp</span>
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

              {/* DOS FOTOGRAFÍAS: MUÑECA Y CAJA DE REGALO */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Foto 1: En la muñeca */}
                <div 
                  onClick={() => setLightboxImage({ src: '/images/promo-duo-10.jpg', title: 'Juego de 2 Pulseras en Mano', subtitle: 'Puestas en conjunto' })}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/5] border border-amber-500/40 bg-black cursor-pointer shadow-md"
                >
                  <img src="/images/promo-duo-10.jpg" alt="Dúo de pulseras en la mano" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute bottom-2 inset-x-2 bg-black/75 p-2 rounded-lg text-center">
                    <p className="text-[11px] font-bold text-amber-300">Puestas en muñeca</p>
                  </div>
                </div>

                {/* Foto 2: En la caja de regalo azul marino */}
                <div 
                  onClick={() => setLightboxImage({ src: '/images/caja-regalo-lujo.jpg', title: 'Presentación en Caja de Regalo', subtitle: 'Estuche rígido azul marino con terciopelo' })}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/5] border border-amber-500/40 bg-black cursor-pointer shadow-md"
                >
                  <img src="/images/caja-regalo-lujo.jpg" alt="Dúo en caja de regalo azul marino" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute bottom-2 inset-x-2 bg-black/75 p-2 rounded-lg text-center">
                    <p className="text-[11px] font-bold text-amber-300">Empaque de regalo</p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 5. SECCIÓN COLECCIÓN: PULSERAS BAGUETTE EN 8 COLORES */}
      <section id="baguettes" className="py-16 bg-[#FAF9F6] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Foto Real del cilindro de terciopelo con los 8 colores */}
            <div className="lg:col-span-7">
              <div 
                onClick={() => setLightboxImage({ src: '/images/baguettes-8-colores.jpg', title: 'Pulseras Baguette Tenis en 8 Colores', subtitle: 'Exhibidor de terciopelo con gama completa', price: 8.50 })}
                className="group relative rounded-3xl overflow-hidden aspect-[16/9] border border-stone-200 shadow-md bg-stone-100 cursor-pointer"
              >
                <img 
                  src="/images/baguettes-8-colores.jpg" 
                  alt="8 Colores de Pulseras Baguette en cilindro" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-xs">
                  Foto Real · 8 Tonos en Stock
                </div>
                <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ver Foto Ampliada</span>
                </div>
              </div>
            </div>

            {/* Selector de color y compra */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700 block">
                Colección Baguette Tenis
              </span>
              <h2 className="font-serif text-3xl font-bold text-slate-900 leading-tight">
                Cristales Facetados Corte Baguette ($8.50 USD)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Cristales rectangulares de alta refracción engastados en cadena dorada con broche bolo ajustable.
              </p>

              {/* Botones de colores interactivos */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Elige tu color: <span className="text-amber-800 font-serif normal-case">({selectedProductOptions['pulseras-baguette-tenis']})</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {PRODUCTS_CATALOG[1].options?.map((col, idx) => {
                    const isSelected = selectedProductOptions['pulseras-baguette-tenis'] === col.name;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionChange('pulseras-baguette-tenis', col.name)}
                        className={`p-2 rounded-xl text-left border text-[11px] transition-all flex flex-col items-center text-center ${
                          isSelected
                            ? 'border-amber-600 bg-amber-50 shadow-xs scale-102 font-bold'
                            : 'border-stone-200 bg-white hover:bg-stone-50'
                        }`}
                      >
                        <span 
                          className="w-4 h-4 rounded-full border border-stone-300 mb-1" 
                          style={{ backgroundColor: col.colorCode }}
                        />
                        <span className="truncate w-full">{col.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <a 
                  href={getDirectWhatsAppUrl(PRODUCTS_CATALOG[1])}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Pedir este Color por WhatsApp</span>
                </a>

                <button
                  onClick={() => addToCart(PRODUCTS_CATALOG[1])}
                  className="p-3 rounded-xl border border-stone-200 hover:border-amber-500 bg-white text-slate-700 hover:text-amber-800 transition-colors"
                  title="Añadir a mi lista de compra"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 6. SECCIÓN REORGANIZADA: PULSERAS DE MODA $6.00 (FLYER 6 MODELOS) */}
      <section id="moda-6" className="py-16 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700 block">
                Catálogo de Moda & Fe
              </span>
              <h2 className="font-serif text-3xl font-bold text-slate-900 leading-tight">
                Pulseras de Moda: $6.00 c/u (Promoción 2 por $10)
              </h2>
              <p className="text-amber-800 font-serif italic text-base">
                "Detalles que hacen la diferencia · Luce tu mejor versión"
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Cadena dorada fina con esferas pulidas y dijes centrales con cristales y símbolos sagrados. Ideal para obsequiar a personas especiales.
              </p>

              {/* Lista interactiva de los 6 modelos */}
              <div className="space-y-1.5 pt-1">
                {PRODUCTS_CATALOG[2].options?.map((mod, idx) => {
                  const isSelected = selectedProductOptions['coleccion-pulseras-moda-6'] === mod.name;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionChange('coleccion-pulseras-moda-6', mod.name)}
                      className={`w-full text-left px-3.5 py-2 rounded-xl text-xs border transition-all flex items-center justify-between ${
                        isSelected 
                          ? 'border-amber-600 bg-amber-50 font-bold text-amber-950 shadow-2xs' 
                          : 'border-stone-200 bg-stone-50 hover:bg-white text-slate-700'
                      }`}
                    >
                      <span>{mod.name}</span>
                      <span className="text-[11px] text-slate-500 font-normal">{mod.detail}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 flex items-center gap-3">
                <a 
                  href={getDirectWhatsAppUrl(PRODUCTS_CATALOG[2])}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Pedir Modelo por WhatsApp</span>
                </a>

                <button
                  onClick={() => addToCart(PRODUCTS_CATALOG[2])}
                  className="p-3 rounded-xl border border-stone-200 hover:border-amber-500 bg-stone-50 text-slate-700 hover:text-amber-800 transition-colors"
                  title="Añadir a mi lista de compra"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Foto Real del Flyer de 6 Modelos */}
            <div className="lg:col-span-7">
              <div 
                onClick={() => setLightboxImage({ src: '/images/pulseras-moda-6.jpg', title: 'Catálogo Pulseras de Moda $6.00', subtitle: 'Flyer con los 6 modelos en estuche', price: 6.00 })}
                className="group relative rounded-3xl overflow-hidden aspect-square border border-stone-200 shadow-md bg-stone-100 cursor-pointer"
              >
                <img 
                  src="/images/pulseras-moda-6.jpg" 
                  alt="Catálogo Pulseras de Moda $6.00" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-xs">
                  $6.00 Cada Una (2 x $10)
                </div>
                <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ver Flyer Completo</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. SECCIÓN REORGANIZADA: PULSERAS DE CORDÓN & EDICIÓN ECUADOR */}
      <section id="ecuador-cordon" className="py-16 bg-[#FAF9F6] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Foto Real del exhibidor vertical de pulseras de cordón */}
            <div className="lg:col-span-6">
              <div 
                onClick={() => setLightboxImage({ src: '/images/coleccion-ecuador.jpg', title: 'Pulseras de Cordón y Edición Ecuador', subtitle: 'Exhibidor con Bandera, Escudo, San Benito y Árbol de la Vida', price: 7.00 })}
                className="group relative rounded-3xl overflow-hidden aspect-[3/4] border border-stone-200 shadow-md bg-stone-100 cursor-pointer max-w-md mx-auto"
              >
                <img 
                  src="/images/coleccion-ecuador.jpg" 
                  alt="Exhibidor de pulseras de cordón con Bandera de Ecuador y símbolos" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-xs flex items-center gap-1">
                  <span>🇪🇨</span> Edición Ecuador & Amuletos
                </div>
                <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ver Foto Vertical</span>
                </div>
              </div>
            </div>

            {/* Detalle y selección */}
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700 block">
                Orgullo & Protección
              </span>
              <h2 className="font-serif text-3xl font-bold text-slate-900 leading-tight">
                Pulseras de Cordón Trenzado ($7.00 USD)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Elaboradas en cordón náutico de alta durabilidad con terminales bañados en oro de 18k y dijes esmaltados al horno que conservan su color vivo para siempre.
              </p>

              {/* Selección de dijes patrióticos y espirituales */}
              <div className="space-y-1.5 pt-1">
                {PRODUCTS_CATALOG[3].options?.map((dije, idx) => {
                  const isSelected = selectedProductOptions['coleccion-patriotica-cordon'] === dije.name;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionChange('coleccion-patriotica-cordon', dije.name)}
                      className={`w-full text-left px-3.5 py-2 rounded-xl text-xs border transition-all flex items-center justify-between ${
                        isSelected 
                          ? 'border-amber-600 bg-amber-50 font-bold text-amber-950 shadow-2xs' 
                          : 'border-stone-200 bg-white hover:bg-stone-50 text-slate-700'
                      }`}
                    >
                      <span>{dije.name}</span>
                      <span className="text-[11px] text-slate-500 font-normal truncate max-w-[180px]">{dije.detail}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 flex items-center gap-3">
                <a 
                  href={getDirectWhatsAppUrl(PRODUCTS_CATALOG[3])}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Pedir Dije de Cordón por WhatsApp</span>
                </a>

                <button
                  onClick={() => addToCart(PRODUCTS_CATALOG[3])}
                  className="p-3 rounded-xl border border-stone-200 hover:border-amber-500 bg-white text-slate-700 hover:text-amber-800 transition-colors"
                  title="Añadir a mi lista de compra"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 8. SECCIÓN GALERÍA DE STACKING EN MANO */}
      <section className="py-16 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 block mb-2">
              Inspiración de Estilo
            </span>
            <h2 className="font-serif text-3xl font-bold text-slate-900 tracking-tight">
              ¿Cómo Combinar tus Pulseras en la Muñeca?
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Combina el brillo del corte baguette con la calidez del cordón artesanal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#FBF9F5] p-6 sm:p-8 rounded-3xl border border-stone-200">
            <div className="md:col-span-7">
              <div 
                onClick={() => setLightboxImage({ src: '/images/duos-muneca-stack.jpg', title: 'Dúos de Pulseras en la Mano (Stacking)', subtitle: 'Combinaciones reales en muñeca' })}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] border border-stone-200 shadow-md bg-stone-100 cursor-pointer"
              >
                <img 
                  src="/images/duos-muneca-stack.jpg" 
                  alt="Dúos de Pulseras en la Mano (Stacking)" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ver Foto en Mano</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 space-y-4">
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                Lleva el Combo Dúo Stacking por $13.50 USD
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Elige tu pulsera Baguette favorita + 1 pulsera de cordón (Árbol de la Vida en nácar, Medalla de San Benito o Bandera del Ecuador) y ahorra en tu compra.
              </p>

              <div className="space-y-2">
                {PRODUCTS_CATALOG[4].options?.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleOptionChange('combo-stack-duo-mix', opt.name)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                      selectedProductOptions['combo-stack-duo-mix'] === opt.name
                        ? 'border-amber-600 bg-amber-50 font-bold text-amber-950'
                        : 'border-stone-200 bg-white text-slate-700'
                    }`}
                  >
                    <p>{opt.name}</p>
                    <p className="text-[11px] text-slate-500 font-normal">{opt.detail}</p>
                  </button>
                ))}
              </div>

              <a 
                href={getDirectWhatsAppUrl(PRODUCTS_CATALOG[4])}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Pedir este Combo por WhatsApp</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 9. SIMULADOR DE GRABADO PERSONALIZADO */}
      <section id="simulador" className="py-20 bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 block mb-2">
              Personalización Exclusiva
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 font-bold tracking-tight">
              Simulador de Medalla Grabada
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Escribe tu nombre o inicial, elige la tipografía y envía tu pedido por WhatsApp.
            </p>
          </div>

          <div className="bg-[#FAF9F6] rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Visual Medallón */}
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-stone-200 min-h-[280px]">
              <div className="w-1 h-12 bg-gradient-to-b from-stone-300 to-amber-500"></div>
              
              <div 
                className="w-44 h-44 rounded-full shadow-lg flex items-center justify-center border-4 border-amber-300/40 relative"
                style={{
                  background: simulatorMetal.includes('Plata') 
                    ? 'linear-gradient(135deg, #E5E7EB 0%, #FFFFFF 50%, #D1D5DB 100%)'
                    : 'linear-gradient(135deg, #D4AF37 0%, #F5E6B3 50%, #C59B2D 100%)'
                }}
              >
                <div className="w-36 h-36 rounded-full border border-amber-700/20 flex items-center justify-center p-3 text-center">
                  <span 
                    className={`text-slate-900 text-2xl font-bold tracking-wider drop-shadow-xs break-all ${
                      simulatorFont === 'serif' ? 'font-serif' : simulatorFont === 'sans' ? 'font-sans' : 'font-serif italic'
                    }`}
                  >
                    {simulatorText.toUpperCase() || 'INICIAL'}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-4 tracking-wide uppercase font-medium">
                Vista previa con grabado láser indeleble
              </p>
            </div>

            {/* Controles del Simulador */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Texto o Inicial:
                </label>
                <input 
                  type="text"
                  value={simulatorText}
                  onChange={(e) => setSimulatorText(e.target.value.slice(0, 16))}
                  placeholder="Ej: CAMILA, J&M, 14.02.24..."
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-amber-600 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Estilo de Letra:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'serif', label: 'Elegante' },
                    { id: 'sans', label: 'Moderna' },
                    { id: 'italic', label: 'Cursiva' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setSimulatorFont(f.id as any)}
                      className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all ${
                        simulatorFont === f.id
                          ? 'bg-amber-100 border-amber-600 text-amber-900 font-bold'
                          : 'bg-white border-stone-200 text-slate-600'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Material:
                </label>
                <select
                  value={simulatorMetal}
                  onChange={(e) => setSimulatorMetal(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm font-medium focus:outline-none focus:border-amber-600"
                >
                  <option value="Baño de Oro 18K">Baño de Oro 18K (Brillo cálido tradicional)</option>
                  <option value="Acero Quirúrgico Dorado">Acero Quirúrgico Dorado (Resistente al agua)</option>
                  <option value="Plata 925 / Acero Plateado">Plata 925 / Acero Plateado</option>
                </select>
              </div>

              <button
                onClick={sendSimulatorToWhatsApp}
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-amber-700 text-white font-medium py-3.5 px-6 rounded-xl text-sm transition-all duration-300 shadow-sm mt-2"
              >
                <MessageCircle className="w-4 h-4 fill-current text-emerald-400" />
                <span>Pedir este Grabado por WhatsApp</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 10. ENLACE DIRECTO A MEDIOS DE PAGO & SERVIENTREGA */}
      <section className="py-14 bg-[#FBF9F5] border-b border-stone-200 text-center">
        <div className="max-w-5xl mx-auto px-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
            Facilidades de Pago & Envíos para Ecuador:
          </h4>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-700">
            <span className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 shadow-2xs">
              🟡 Banco Pichincha (Transferencias y Depósitos)
            </span>
            <span className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-2xs">
              🟢 Deuna (Pago móvil instantáneo)
            </span>
            <span className="px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 shadow-2xs">
              🔵 Banco Guayaquil & Produbanco
            </span>
            <span className="px-3.5 py-2 rounded-xl bg-stone-100 border border-stone-200 text-slate-800 shadow-2xs">
              🚚 Envíos Nacionales con Servientrega en 24-48h
            </span>
          </div>
        </div>
      </section>

      {/* 11. FOOTER */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800 text-xs">
            <div className="space-y-3">
              <span className="font-serif text-2xl font-bold text-white tracking-tight">ÁUREA</span>
              <p className="text-slate-400 leading-relaxed">
                Bisutería de autor y pulseras de moda en Ecuador. Piezas hechas a mano con baño de oro de 18k, ónix, cristales baguette y acero hipoalergénico.
              </p>
            </div>
            <div>
              <h5 className="font-bold uppercase tracking-wider text-white mb-3">Modelos Reales</h5>
              <ul className="space-y-2 text-slate-400">
                <li>• Juego Dúo $10 (Baguette + Trébol)</li>
                <li>• Baguettes Tenis en 8 Colores ($8.50)</li>
                <li>• Pulseras de Moda con Dijes ($6.00)</li>
                <li>• Edición Cordón y Bandera Ecuador ($7.00)</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold uppercase tracking-wider text-white mb-3">Logística Ecuador</h5>
              <ul className="space-y-2 text-slate-400">
                <li>• Envíos asegurados por Servientrega</li>
                <li>• Cobertura nacional en 24-48 horas</li>
                <li>• Empaques en caja de regalo disponibles</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold uppercase tracking-wider text-white mb-3">Contacto WhatsApp</h5>
              <p className="font-serif font-bold text-amber-400 text-base mb-1">+593 988 691 800</p>
              <p className="text-slate-400">Atención personalizada y asesoría de tallas inmediata.</p>
            </div>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <p>© 2026 Áurea Bisutería Personalizada · Ecuador. Todos los derechos reservados.</p>
            <p>Ventas Directas vía WhatsApp</p>
          </div>
        </div>
      </footer>

      {/* 12. BOTÓN FLOTANTE WHATSAPP */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center group">
        <div className="hidden sm:flex mr-3 bg-white text-slate-800 text-xs font-semibold py-2 px-3.5 rounded-xl shadow-lg border border-stone-200 items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>¡Escríbenos al WhatsApp!</span>
        </div>

        <a 
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20Áurea,%20estoy%20viendo%20la%20página%20web%20y%20deseo%20hacer%20un%20pedido`}
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="Escribir por WhatsApp"
          className="w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all relative"
        >
          <MessageCircle className="w-7 h-7 fill-current" />
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></span>
        </a>
      </div>

      {/* 13. MODAL LIGHTBOX PARA VER FOTOGRAFÍAS AMPLIADAS */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-stone-900 rounded-3xl overflow-hidden border border-stone-800 shadow-2xl flex flex-col"
          >
            <button 
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] overflow-hidden flex items-center justify-center bg-black">
              <img src={lightboxImage.src} alt={lightboxImage.title} className="w-full h-auto object-contain max-h-[70vh]" />
            </div>

            <div className="p-5 bg-stone-900 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-serif font-bold text-white text-lg">{lightboxImage.title}</h4>
                {lightboxImage.subtitle && (
                  <p className="text-xs text-amber-300 mt-0.5">{lightboxImage.subtitle}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {lightboxImage.price && (
                  <span className="font-serif font-bold text-xl text-amber-400">
                    ${lightboxImage.price.toFixed(2)} USD
                  </span>
                )}
                <a 
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20Áurea!%20Estoy%20viendo%20la%20fotografía%20de%20*${encodeURIComponent(lightboxImage.title)}*%20y%20deseo%20ordenarla.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-xl text-xs transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Pedir esta Joya por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 14. DRAWER / CARRITO DE COMPRA */}
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
                  <p className="text-xs mt-1">Agrega tus pulseras o dúos favoritos desde el catálogo.</p>
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
                  * El costo de envío por Servientrega se coordina según tu cantón/ciudad.
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
