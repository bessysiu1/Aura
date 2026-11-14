import React, { useState } from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  Truck, 
  MessageCircle, 
  ChevronRight, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  Crown, 
  ZoomIn
} from 'lucide-react';
import { PRODUCTS_CATALOG, Product, HERO_CONFIG } from './products';

const WHATSAPP_NUMBER = '593988691800';

interface CartItem {
  product: Product;
  selectedOption: string;
  quantity: number;
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [selectedProductOptions, setSelectedProductOptions] = useState<Record<string, string>>({});

  // Carrito / Pedido múltiple + Zona, Pago y Datos de entrega
  const [cart, setCart] = useState<CartItem[]>([]);
  const [shippingZone, setShippingZone] = useState<'local' | 'nacional'>('local');
  const [paymentMethod, setPaymentMethod] = useState<'contra_entrega' | 'transferencia'>('contra_entrega');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Modal Lightbox para ampliar fotografía en alta resolución
  const [lightbox, setLightbox] = useState<{ url: string; title: string; caption: string } | null>(null);

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

  const handleZoneChange = (zone: 'local' | 'nacional') => {
    setShippingZone(zone);
    if (zone === 'nacional' && paymentMethod === 'contra_entrega') {
      setPaymentMethod('transferencia');
    }
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
    showNotification(`"${product.name}" se agregó a tu lista`);
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

  const subtotalPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shippingCost = shippingZone === 'local' ? 5.00 : 6.00;
  const totalCartPrice = subtotalPrice + (cart.length > 0 ? shippingCost : 0);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const formatPriceUnit = (product: Product) => {
    if (product.priceUnit === 'set') return 'USD el set';
    return 'USD c/u';
  };

  // Mensaje profesional de WhatsApp para pedido directo de 1 producto
  const getDirectWhatsAppUrl = (product: Product) => {
    const selectedOpt = selectedProductOptions[product.id] || product.options?.[0]?.name || '';
    const variantLine = selectedOpt
      ? `• *Opción elegida:* ${selectedOpt}`
      : product.variantPrompt
        ? `• *${product.variantPrompt}:* `
        : null;

    const lines = [
      '*PEDIDO WEB · ÁUREA BY SIU*',
      '',
      'Hola, deseo realizar el siguiente pedido:',
      '',
      `• *Pieza:* ${product.name} (${product.id})`,
      `• *Valor:* $${product.price.toFixed(2)} ${formatPriceUnit(product)}`,
      ...(variantLine ? [variantLine] : []),
      '• *Envío:* $5.00 GYE / Samborondón / Daule | $6.00 Nacional',
      '',
      '*DATOS PARA EL ENVÍO*',
      '• *Nombre:* ',
      '• *Ciudad / Sector:* ',
      '• *Dirección y referencia:* ',
      '• *Método de pago:* ',
      '',
      'Quedo atento/a a su confirmación. ¡Muchas gracias!'
    ];

    return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(lines.join('\n'))}`;
  };

  // Mensaje profesional de WhatsApp desde el carrito completo
  const sendCartToWhatsApp = () => {
    if (cart.length === 0) return;

    const zoneLabel = shippingZone === 'local' 
      ? 'GYE / Samborondón / Daule ($5.00 USD)' 
      : 'Resto del Ecuador - Nacional ($6.00 USD)';

    const paymentLabel = paymentMethod === 'contra_entrega'
      ? 'Pago Contra Entrega (Efectivo)'
      : 'Transferencia Bancaria / DeUna';

    const itemLines = cart.map((item, idx) => {
      const selectedOpt = item.selectedOption !== 'Estándar' ? item.selectedOption : '';
      const detail = selectedOpt
        ? ` — ${selectedOpt}`
        : item.product.variantPrompt
          ? ` — _${item.product.variantPrompt}: (indicar)_`
          : '';
      return `${idx + 1}. *${item.product.name}* (${item.product.id}) x${item.quantity}${detail} — $${(item.product.price * item.quantity).toFixed(2)} USD`;
    });

    const lines = [
      '*PEDIDO WEB · ÁUREA BY SIU*',
      '',
      '*DETALLE DE PIEZAS*',
      '',
      ...itemLines,
      '',
      '*RESUMEN DE PAGO*',
      '',
      `• *Subtotal:* $${subtotalPrice.toFixed(2)} USD`,
      `• *Envío:* ${zoneLabel}`,
      `• *TOTAL A PAGAR:* $${totalCartPrice.toFixed(2)} USD`,
      `• *Forma de pago:* ${paymentLabel}`,
      '',
      '*DATOS DE ENTREGA*',
      '',
      `• *Nombre:* ${customerName.trim() || ''}`,
      `• *Celular:* ${customerPhone.trim() || ''}`,
      `• *Dirección:* ${customerAddress.trim() || ''}`,
      '',
      paymentMethod === 'transferencia'
        ? 'Por favor compártanme los datos de cuenta o DeUna para realizar el pago. ¡Muchas gracias!'
        : 'Quedo atento/a para coordinar el horario de entrega. ¡Muchas gracias!'
    ];

    window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(lines.join('\n'))}`, '_blank');
  };

  const filteredProducts = activeCategory === 'todos' 
    ? PRODUCTS_CATALOG 
    : PRODUCTS_CATALOG.filter(p => p.category === activeCategory);

  const heroProduct = PRODUCTS_CATALOG.find(p => p.id === 'AU03') || PRODUCTS_CATALOG[0];
  const bannerProduct = PRODUCTS_CATALOG.find(p => p.id === 'AU04') || PRODUCTS_CATALOG[1];

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
                Fotografía real · Envíos GYE/Samborondón/Daule ($5) y Nacional ($6)
              </span>
              <a 
                href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(`Hola Áurea by Siu, estoy viendo la fotografía de *${lightbox.title}* y deseo confirmar disponibilidad.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>Pedir este diseño por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <aside className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-amber-200 text-xs py-2 px-4 text-center font-medium tracking-wide border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Truck className="w-3.5 h-3.5 inline shrink-0 text-amber-400" />
          <span>Envíos: <strong>Guayaquil, Samborondón y Daule ($5)</strong> · <strong>Resto del Ecuador ($6)</strong> | WhatsApp: <strong>+593 988 691 800</strong></span>
        </div>
      </aside>

      {/* 2. HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <a href="#" className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-tight text-slate-900">
              ÁUREA <span className="italic font-normal text-amber-700 text-lg">by Siu</span>
            </span>
            <span className="text-[10px] tracking-[0.22em] uppercase text-slate-500 font-semibold -mt-1">
              Detalles que Conectan · Guayaquil, Ecuador
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#catalogo" className="hover:text-amber-700 transition-colors">Catálogo</a>
            <a href="#edicion-nacar" className="hover:text-amber-700 transition-colors font-semibold text-amber-800">Edición Nácar $10</a>
            <a href="#proceso" className="hover:text-amber-700 transition-colors">Envíos & Pagos</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
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
              href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent('Hola Áurea by Siu, deseo consultar disponibilidad de su catálogo.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span className="hidden sm:inline">Pedir por WhatsApp</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION (PIEZA INSIGNIA AU03) */}
      <section className="relative overflow-hidden bg-[#FBF9F5] py-12 sm:py-16 border-b border-stone-200">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300/60 text-amber-900 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
                <span>Guayaquil, Samborondón y Daule ($5) · Envíos Nacionales ($6)</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-slate-900 leading-[1.12] tracking-tight">
                Detalles con encanto que <span className="italic text-amber-700 font-normal">realzan tu estilo</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Descubre nuestra selección de brazaletes esmaltados, pulseras con cordones lisos y ajustables, cristales corte baguette y ear cuffs. Piezas versátiles pensadas para acompañarte cada día o convertirse en un obsequio especial.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <a 
                  href={getDirectWhatsAppUrl(heroProduct)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all text-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Pedir {heroProduct.name} (${heroProduct.price.toFixed(2)} USD c/u)</span>
                </a>

                <a 
                  href="#catalogo"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-slate-800 border border-stone-200 font-medium px-6 py-3.5 rounded-xl transition-all text-sm"
                >
                  <span>Explorar Catálogo ({PRODUCTS_CATALOG.length} Piezas)</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>
              </div>

              <div className="pt-6 border-t border-stone-200 grid grid-cols-3 gap-3 text-left">
                <div>
                  <p className="font-serif font-bold text-slate-900 text-base sm:text-lg">Fotos Reales</p>
                  <p className="text-xs text-slate-500">Lo que ves es lo que recibes</p>
                </div>
                <div>
                  <p className="font-serif font-bold text-slate-900 text-base sm:text-lg">Contra Entrega</p>
                  <p className="text-xs text-slate-500">En GYE, Samborondón y Daule</p>
                </div>
                <div>
                  <p className="font-serif font-bold text-slate-900 text-base sm:text-lg">Tarifa Plana</p>
                  <p className="text-xs text-slate-500">$5 local · $6 resto del país</p>
                </div>
              </div>
            </div>

            {/* CARD HERO DESTACADA */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white p-4 rounded-3xl shadow-lg border border-amber-200/80 overflow-hidden">
                <div className="relative rounded-2xl overflow-hidden bg-stone-900 p-4 text-white">
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold tracking-widest uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full flex items-center gap-1">
                      <Crown className="w-3 h-3 text-amber-400" />
                      <span>Pieza Destacada · {heroProduct.id}</span>
                    </span>
                    <span className="font-serif font-bold text-2xl text-amber-400">
                      ${heroProduct.price.toFixed(2)} <span className="text-xs font-sans text-stone-300 font-normal">USD c/u</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold mb-1 text-white">
                    {heroProduct.name}
                  </h3>
                  <p className="text-xs text-amber-300/90 italic mb-3">
                    "{heroProduct.tagline}"
                  </p>

                  <div 
                    className="relative rounded-xl overflow-hidden bg-stone-800 aspect-square mb-4 group cursor-pointer"
                    onClick={() => setLightbox({
                      url: heroProduct.imagen,
                      title: heroProduct.name,
                      caption: HERO_CONFIG.mainCaption
                    })}
                  >
                    <img 
                      src={heroProduct.imagen} 
                      alt={heroProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      type="button"
                      className="absolute bottom-2.5 right-2.5 bg-stone-900/80 hover:bg-stone-900 text-white text-[11px] font-medium px-2.5 py-1.5 rounded-lg flex items-center gap-1 backdrop-blur-xs"
                    >
                      <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ampliar</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <a 
                      href={getDirectWhatsAppUrl(heroProduct)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl text-xs sm:text-sm transition-all"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>Pedir por WhatsApp</span>
                    </a>

                    <button 
                      onClick={() => { addToCart(heroProduct); setIsCartOpen(true); }}
                      className="px-3 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors text-xs font-medium"
                      title="Agregar a mi pedido y completar dirección"
                    >
                      + Lista
                    </button>
                  </div>

                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 px-1">
                  <span>Valor por unidad · Envío local $5 / Nacional $6</span>
                  <span className="text-emerald-700 font-semibold">Disponible</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. CATÁLOGO COMPLETO DE PRODUCTOS */}
      <section id="catalogo" className="py-16 sm:py-20 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 block mb-2">
              Catálogo Oficial · {PRODUCTS_CATALOG.length} Diseños Disponibles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 font-bold tracking-tight mb-4">
              Colección Completa Áurea
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Pulsa en <strong>Pedir por WhatsApp</strong> para solicitar una pieza o en <strong>+</strong> para armar tu lista con dirección de entrega.
            </p>

            {/* Categorías Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              {[
                { id: 'todos', label: `Todos (${PRODUCTS_CATALOG.length})` },
                { id: 'Brazaletes', label: 'Brazaletes ($10 c/u)' },
                { id: 'Ear Cuffs', label: 'Ear Cuffs ($8 c/u)' },
                { id: 'Pulseras', label: 'Pulseras ($6 c/u)' },
                { id: 'Sets', label: 'Sets ($6 el set)' },
                { id: 'Pulseras Artesanales', label: 'Cordón ($5 - $6 c/u)' }
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
                    {/* Imagen limpia con Zoom */}
                    <div 
                      className="relative rounded-xl overflow-hidden bg-stone-100 aspect-square mb-4 group cursor-pointer border border-stone-200/80"
                      onClick={() => setLightbox({
                        url: product.imagen,
                        title: `${product.name} (${product.id})`,
                        caption: `${product.name} (${product.id}) · $${product.price.toFixed(2)} ${formatPriceUnit(product)}`
                      })}
                    >
                      <img 
                        src={product.imagen} 
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute bottom-2.5 right-2.5 bg-stone-900/75 text-white text-[11px] font-medium px-2.5 py-1 rounded-lg flex items-center gap-1 opacity-90 group-hover:opacity-100">
                        <ZoomIn className="w-3 h-3 text-amber-400" />
                        <span>Ampliar</span>
                      </span>
                    </div>

                    {/* Metadata limpia */}
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className="uppercase tracking-wider font-semibold text-amber-700">
                        {product.promoBadge || `${product.id} · $${product.price.toFixed(2)} ${formatPriceUnit(product)}`}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {product.category}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-slate-900 text-lg mb-1 leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-xs text-amber-800 font-medium mb-2 italic">
                      "{product.tagline}"
                    </p>

                    {/* Descripción breve */}
                    <div className="bg-white p-3 rounded-xl border border-stone-200/80 mb-3 shadow-2xs">
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Opciones Interactivas si existen */}
                    {product.options && product.options.length > 0 && (
                      <div className="mb-4 pt-2 border-t border-stone-200">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
                          {product.optionsName || 'Opciones'}: <span className="text-amber-800 font-medium normal-case">({currentOption})</span>
                        </label>
                        
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
                      </div>
                    )}
                  </div>

                  {/* Acciones de compra */}
                  <div className="pt-3 border-t border-stone-200">
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-xs text-slate-500 font-medium">Precio:</span>
                      <span className="font-serif font-bold text-2xl text-slate-900">
                        ${product.price.toFixed(2)} <span className="text-xs font-sans text-slate-500 font-normal">{formatPriceUnit(product)}</span>
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
                        onClick={() => { addToCart(product); setIsCartOpen(true); }}
                        className="col-span-1 inline-flex items-center justify-center p-2.5 rounded-xl border border-stone-200 hover:border-amber-500 bg-white text-slate-700 hover:text-amber-800 transition-colors"
                        title="Añadir y llenar datos de envío"
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

      {/* 5. BANNER DESTACADO CON SEGUNDA PIEZA ESTRELLA (AU04 EN MODELO) */}
      <section id="edicion-nacar" className="py-14 sm:py-16 bg-[#FAFAF8] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 rounded-3xl p-6 sm:p-10 text-white border border-amber-500/30 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Edición Especial · Código {bannerProduct.id}</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl text-white font-bold leading-tight">
                  {bannerProduct.name}
                </h2>
                
                <p className="text-amber-200/95 font-serif italic text-base sm:text-lg leading-relaxed">
                  "{bannerProduct.designStory}"
                </p>

                <p className="text-xs text-stone-300 leading-relaxed">
                  Acabado nacarado luminoso con relieves marinos y tono dorado suave. Entrega a domicilio en Guayaquil, Samborondón y Daule ($5) o envío seguro al resto del Ecuador ($6).
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif font-bold text-3xl text-amber-400">${bannerProduct.price.toFixed(2)}</span>
                    <span className="text-xs text-stone-300 uppercase tracking-wider">USD c/u</span>
                  </div>

                  <a 
                    href={getDirectWhatsAppUrl(bannerProduct)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-xl text-sm transition-all shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Pedir por WhatsApp al +593 988 691 800</span>
                  </a>

                  <button 
                    onClick={() => { addToCart(bannerProduct); setIsCartOpen(true); }}
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium py-3 px-4 rounded-xl text-sm transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Añadir a mi Lista</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col items-center">
                <div 
                  className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/40 relative group cursor-pointer"
                  onClick={() => setLightbox({
                    url: bannerProduct.imagen,
                    title: bannerProduct.name,
                    caption: `${bannerProduct.name} (${bannerProduct.id}) · $${bannerProduct.price.toFixed(2)} USD c/u`
                  })}
                >
                  <img 
                    src={bannerProduct.imagen} 
                    alt={bannerProduct.name} 
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="bg-stone-900 p-2.5 text-center text-[11px] text-amber-300 flex items-center justify-between px-3">
                    <span>{bannerProduct.name} ({bannerProduct.id}) · ${bannerProduct.price.toFixed(2)} USD c/u</span>
                    <span className="flex items-center gap-1 hover:text-white">
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Ampliar</span>
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 6. PROCESO DE COMPRA & ENVÍOS ECUADOR */}
      <section id="proceso" className="py-16 sm:py-20 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 block mb-2">
              Proceso 100% Seguro
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 font-bold tracking-tight mb-4">
              ¿Cómo Comprar en Áurea by Siu?
            </h2>
            <p className="text-slate-600 text-sm">
              Coordinamos todo contigo a través de WhatsApp con atención directa y tarifas de envío claras.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            <div className="bg-[#FAF9F6] rounded-2xl p-7 border border-stone-200 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 font-serif font-bold text-xl flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="font-serif font-bold text-slate-900 text-lg mb-2">
                Elige tus piezas favoritas
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Añade tus piezas al carrito, elige tu zona de entrega (<strong>GYE / Samborondón / Daule $5</strong> o <strong>Resto del Ecuador $6</strong>) y escribe tu dirección.
              </p>
            </div>

            <div className="bg-[#FAF9F6] rounded-2xl p-7 border border-stone-200 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 font-serif font-bold text-xl flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="font-serif font-bold text-slate-900 text-lg mb-2">
                Pago Flexible
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                <strong>Pago Contra Entrega</strong> en efectivo para GYE, Samborondón y Daule, o transferencia directa por <strong>Banco Pichincha</strong>, <strong>Deuna</strong> o <strong>Banco Guayaquil</strong>.
              </p>
            </div>

            <div className="bg-[#FAF9F6] rounded-2xl p-7 border border-stone-200 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 font-serif font-bold text-xl flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="font-serif font-bold text-slate-900 text-lg mb-2">
                Entrega a Domicilio
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Despacho directo con courier local de confianza en Guayaquil, Samborondón y Daule (24h a 48h) y envío seguro con guía de rastreo para todas las provincias del Ecuador.
              </p>
            </div>

          </div>

          <div className="mt-14 bg-[#FAF9F6] rounded-2xl p-6 border border-stone-200 text-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Medios de Pago Disponibles en Ecuador:
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-xs font-semibold text-slate-700">
              <span className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                Pago Contra Entrega (Solo GYE / Samborondón / Daule)
              </span>
              <span className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                Banco Pichincha
              </span>
              <span className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                App Deuna (Sin recargo)
              </span>
              <span className="px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-900">
                Banco Guayaquil & Produbanco
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800 text-xs">
            
            <div className="space-y-3">
              <span className="font-serif text-2xl font-bold text-white tracking-tight">
                ÁUREA <span className="italic font-normal text-amber-400 text-lg">by Siu</span>
              </span>
              <p className="text-slate-400 leading-relaxed">
                Detalles que conectan · Guayaquil, Ecuador. Piezas con acabados cuidados, cristales corte baguette, cordones ajustables y diseños listos para lucir o regalar.
              </p>
              <div className="pt-2 text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Atención activa en WhatsApp</span>
              </div>
            </div>

            <div>
              <h5 className="font-bold uppercase tracking-wider text-white mb-3">Categorías</h5>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#catalogo" onClick={() => setActiveCategory('Brazaletes')} className="hover:text-amber-400">Brazaletes Esmaltados ($10.00 USD c/u)</a></li>
                <li><a href="#catalogo" onClick={() => setActiveCategory('Ear Cuffs')} className="hover:text-amber-400">Ear Cuffs Ajustables ($8.00 USD c/u)</a></li>
                <li><a href="#catalogo" onClick={() => setActiveCategory('Pulseras')} className="hover:text-amber-400">Pulseras Baguette ($6.00 USD c/u)</a></li>
                <li><a href="#catalogo" onClick={() => setActiveCategory('Sets')} className="hover:text-amber-400">Sets Combinados ($6.00 USD el set)</a></li>
                <li><a href="#catalogo" onClick={() => setActiveCategory('Pulseras Artesanales')} className="hover:text-amber-400">Pulseras de Cordón ($5.00 - $6.00 USD c/u)</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold uppercase tracking-wider text-white mb-3">Envíos & Tarifas</h5>
              <ul className="space-y-2 text-slate-400">
                <li>• Guayaquil, Samborondón y Daule: <strong>$5.00 USD</strong></li>
                <li>• Pago Contra Entrega disponible en zona local</li>
                <li>• Resto del Ecuador (todas las provincias): <strong>$6.00 USD</strong></li>
                <li>• Entrega estimada de 24 a 48 horas</li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold uppercase tracking-wider text-white mb-3">Contacto Directo</h5>
              <p className="text-slate-300 mb-2">WhatsApp Oficial:</p>
              <a 
                href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif font-bold text-amber-400 text-base block hover:underline"
              >
                +593 988 691 800
              </a>
              <p className="text-slate-500 mt-2">Guayaquil, Ecuador · Lunes a Sábado de 09:00 a 19:00</p>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <p>© 2026 Áurea by Siu · Guayaquil, Ecuador. Todos los derechos reservados.</p>
            <p>Venta Directa vía WhatsApp · Envíos Locales y Nacionales</p>
          </div>

        </div>
      </footer>

      {/* 8. BOTÓN FLOTANTE DE WHATSAPP */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center group">
        <div className="hidden sm:flex mr-3 bg-white text-slate-800 text-xs font-semibold py-2 px-3.5 rounded-xl shadow-lg border border-stone-200 items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>¡Escríbenos al WhatsApp!</span>
        </div>

        <a 
          href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent('Hola Áurea by Siu, estoy viendo su catálogo web y deseo hacer una consulta.')}`}
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="Escribir por WhatsApp"
          className="w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all relative"
        >
          <MessageCircle className="w-7 h-7 fill-current" />
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></span>
        </a>
      </div>

      {/* 9. DRAWER / MODAL DEL CARRITO CON ZONA DE ENVÍO, MÉTODO DE PAGO Y DIRECCIÓN */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
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
                  <p className="text-xs mt-1">Agrega tus brazaletes, pulseras o sets favoritos desde el catálogo.</p>
                </div>
              ) : (
                <div className="divide-y divide-stone-100 my-4 space-y-3">
                  {cart.map((item, idx) => (
                    <div key={idx} className="pt-3 flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-xs text-slate-900">{item.product.name} ({item.product.id})</h4>
                        {item.selectedOption !== 'Estándar' && (
                          <p className="text-[11px] text-amber-700 font-medium">{item.selectedOption}</p>
                        )}
                        <p className="text-xs font-serif font-bold text-slate-800 mt-1">
                          ${item.product.price.toFixed(2)} {formatPriceUnit(item.product)}
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
              <div className="pt-4 border-t border-stone-200 space-y-4">
                
                {/* 1. Zona de entrega */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    1. Zona de entrega:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleZoneChange('local')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        shippingZone === 'local'
                          ? 'border-amber-600 bg-amber-50 text-amber-950 font-semibold'
                          : 'border-stone-200 bg-white text-slate-600'
                      }`}
                    >
                      <span className="block text-xs">GYE / Samborondón / Daule</span>
                      <span className="text-[11px] text-amber-700 font-bold">+$5.00 USD</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleZoneChange('nacional')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        shippingZone === 'nacional'
                          ? 'border-amber-600 bg-amber-50 text-amber-950 font-semibold'
                          : 'border-stone-200 bg-white text-slate-600'
                      }`}
                    >
                      <span className="block text-xs">Resto del Ecuador</span>
                      <span className="text-[11px] text-amber-700 font-bold">+$6.00 USD</span>
                    </button>
                  </div>
                </div>

                {/* 2. Método de pago */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    2. ¿Cómo deseas pagar?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={shippingZone === 'nacional'}
                      onClick={() => setPaymentMethod('contra_entrega')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        paymentMethod === 'contra_entrega'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold'
                          : shippingZone === 'nacional'
                            ? 'border-stone-100 bg-stone-50 text-stone-400 cursor-not-allowed'
                            : 'border-stone-200 bg-white text-slate-600'
                      }`}
                    >
                      <span className="block text-xs">Contra Entrega</span>
                      <span className="text-[10px] text-slate-500">Solo GYE / Samb. / Daule</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('transferencia')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        paymentMethod === 'transferencia'
                          ? 'border-amber-600 bg-amber-50 text-amber-950 font-semibold'
                          : 'border-stone-200 bg-white text-slate-600'
                      }`}
                    >
                      <span className="block text-xs">Transferencia / DeUna</span>
                      <span className="text-[10px] text-slate-500">Pichincha / Guayaquil</span>
                    </button>
                  </div>
                </div>

                {/* 3. Datos de entrega */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    3. Datos para tu entrega:
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Tu nombre y apellido"
                    className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Tu número de celular (Ej: 099...)"
                    className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
                  />
                  <textarea
                    rows={2}
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Ciudad, sector, calle / urbanización y referencia"
                    className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                {/* Totales */}
                <div className="space-y-1 text-xs pt-2 border-t border-stone-100">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal productos:</span>
                    <span>${subtotalPrice.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Costo de envío:</span>
                    <span>${shippingCost.toFixed(2)} USD</span>
                  </div>
                  <div className="flex items-center justify-between text-sm pt-1">
                    <span className="text-slate-800 font-bold">Total a pagar:</span>
                    <span className="font-serif font-bold text-xl text-slate-900">${totalCartPrice.toFixed(2)} USD</span>
                  </div>
                </div>

                <button
                  onClick={sendCartToWhatsApp}
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3.5 px-4 rounded-xl text-sm transition-all shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Enviar Pedido Completo a WhatsApp</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
