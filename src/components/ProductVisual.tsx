import React from 'react';
import { Product } from '../products';

interface ProductVisualProps {
  product: Product;
  selectedOption?: string;
  className?: string;
}

export const ProductVisual: React.FC<ProductVisualProps> = ({ product, selectedOption, className = '' }) => {
  // 1. DUO BLACK & GOLD ($10 SET)
  if (product.imagePlaceholder.type === 'duo-black') {
    return (
      <div className={`relative w-full aspect-square bg-gradient-to-br from-[#1c1917] via-[#292524] to-[#0c0a09] rounded-xl overflow-hidden p-4 flex flex-col justify-between border border-amber-900/30 ${className}`}>
        {/* Etiqueta flotante dorada */}
        <div className="flex items-center justify-between z-10">
          <span className="text-[10px] font-bold tracking-widest uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
            Dúo 2 Piezas
          </span>
          <span className="text-[11px] font-serif font-bold text-amber-200">
            $10 USD
          </span>
        </div>

        {/* Visual de las 2 pulseras */}
        <div className="my-auto flex flex-col items-center justify-center gap-3 relative py-2">
          {/* Pulsera 1: Cristales Baguette Negros con montura dorada */}
          <div className="w-full flex items-center justify-center">
            <div className="flex items-center gap-1 bg-amber-950/60 p-1.5 rounded-full border border-amber-500/30 shadow-md">
              <span className="text-[10px] text-amber-200 font-semibold px-2">Baguette Cristales:</span>
              <div className="flex items-center gap-0.5">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-2.5 h-5 bg-gradient-to-b from-stone-900 via-stone-800 to-black border border-amber-400/60 rounded-xs shadow-xs transform hover:scale-110 transition-transform"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Pulsera 2: Cuentas de Ónix con dije Trébol Van Cleef */}
          <div className="w-full flex items-center justify-center">
            <div className="flex items-center gap-1.5 bg-black/70 p-2 rounded-full border border-amber-400/40 shadow-lg">
              {/* Cuentas izquierda */}
              <div className="flex items-center -space-x-1">
                <div className="w-3.5 h-3.5 rounded-full bg-stone-800 border border-stone-600 shadow-inner"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-stone-900 border border-amber-400/50"></div>
                <div className="w-3 h-3 rounded-full bg-stone-800"></div>
              </div>

              {/* Dije Trébol de la Suerte Van Cleef negro con borde perlado dorado */}
              <div className="relative w-8 h-8 rounded-md bg-stone-950 border-2 border-amber-400 flex items-center justify-center shadow-md">
                <div className="w-4 h-4 rounded-sm bg-black rotate-45 border border-amber-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-amber-400 text-xs">✦</span>
                </div>
              </div>

              {/* Cuentas derecha */}
              <div className="flex items-center -space-x-1">
                <div className="w-3 h-3 rounded-full bg-stone-800"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-stone-900 border border-amber-400/50"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-stone-800 border border-stone-600 shadow-inner"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Badge inferior */}
        <div className="bg-black/60 backdrop-blur-xs py-1 px-3 rounded-lg border border-amber-400/20 text-center z-10">
          <p className="text-[10px] text-amber-200/90 font-medium">
            Estilo, fuerza y buena energía ♡
          </p>
        </div>
      </div>
    );
  }

  // 2. BAGUETTE MULTICOLOR TENIS
  if (product.imagePlaceholder.type === 'baguette-colors') {
    const colors = [
      { name: 'Esmeralda', bg: 'from-emerald-700 to-emerald-950' },
      { name: 'Ónix Negro', bg: 'from-stone-800 to-black' },
      { name: 'Multicolor', bg: 'from-amber-500 via-rose-500 to-sky-600' },
      { name: 'Rosa Cuarzo', bg: 'from-pink-300 to-rose-400' },
      { name: 'Rojo Rubí', bg: 'from-red-600 to-rose-950' },
      { name: 'Turquesa', bg: 'from-cyan-400 to-teal-600' },
      { name: 'Azul Zafiro', bg: 'from-blue-700 to-indigo-950' },
      { name: 'Diamante', bg: 'from-slate-100 to-slate-300' }
    ];

    return (
      <div className={`relative w-full aspect-square bg-[#FBF9F5] rounded-xl overflow-hidden p-4 flex flex-col justify-between border border-amber-200/80 ${className}`}>
        <div className="flex items-center justify-between z-10">
          <span className="text-[10px] font-bold tracking-wider uppercase bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md">
            8 Tonos Disponibles
          </span>
          <span className="text-xs font-serif font-bold text-amber-800">Ajustable</span>
        </div>

        {/* Muestra gráfica de los 8 cilindros como en la foto */}
        <div className="my-auto py-2">
          <div className="bg-stone-100/90 p-2.5 rounded-xl border border-stone-200 flex items-center justify-between gap-1 shadow-inner">
            {colors.map((c, i) => (
              <div key={i} className="flex flex-col items-center gap-1 group/bar" title={c.name}>
                <div className={`w-3.5 h-14 rounded-xs bg-gradient-to-b ${c.bg} border border-amber-400/60 shadow-xs`}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-center text-slate-500 mt-2 font-medium">
            Desliza o haz clic para pedir tu color favorito
          </p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-600 bg-white/80 px-2.5 py-1 rounded-md border border-stone-200">
          <span>Broche corredizo adaptable</span>
          <span className="text-amber-700 font-bold">$8.50 USD</span>
        </div>
      </div>
    );
  }

  // 3. PULSERAS DE MODA $6.00 (FLYER 6 MODELOS)
  if (product.imagePlaceholder.type === 'moda-flyer') {
    return (
      <div className={`relative w-full aspect-square bg-gradient-to-b from-[#FFFDF9] to-[#F7F2E7] rounded-xl overflow-hidden p-4 flex flex-col justify-between border border-amber-200 ${className}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md">
            Colección Especial
          </span>
          <div className="bg-amber-500 text-white font-serif font-bold text-xs px-2.5 py-0.5 rounded-md shadow-xs">
            $6.00 c/u
          </div>
        </div>

        {/* Mini collage de 4 dijes icónicos */}
        <div className="grid grid-cols-2 gap-2 my-auto p-1">
          <div className="bg-white p-2 rounded-lg border border-amber-100 text-center shadow-2xs">
            <span className="text-lg">🦋</span>
            <p className="text-[9px] font-bold text-slate-700 mt-0.5">Mariposa Cristales</p>
          </div>
          <div className="bg-white p-2 rounded-lg border border-amber-100 text-center shadow-2xs">
            <span className="text-lg">✨</span>
            <p className="text-[9px] font-bold text-slate-700 mt-0.5">Virgen María</p>
          </div>
          <div className="bg-white p-2 rounded-lg border border-amber-100 text-center shadow-2xs">
            <span className="text-lg">✝️</span>
            <p className="text-[9px] font-bold text-slate-700 mt-0.5">Cruz Minimalista</p>
          </div>
          <div className="bg-white p-2 rounded-lg border border-amber-100 text-center shadow-2xs">
            <span className="text-sm font-bold text-amber-700">PEACE</span>
            <p className="text-[9px] font-bold text-slate-700 mt-0.5">Letras con Brillos</p>
          </div>
        </div>

        <div className="text-center bg-amber-50 py-1 rounded-md border border-amber-200/60">
          <span className="text-[10px] font-semibold text-amber-800">
            Promoción: 2 pulseras por solo $10 USD
          </span>
        </div>
      </div>
    );
  }

  // 4. COLECCIÓN ECUADOR & CORDÓN
  if (product.imagePlaceholder.type === 'cordon-ecuador') {
    return (
      <div className={`relative w-full aspect-square bg-[#FDFBF7] rounded-xl overflow-hidden p-4 flex flex-col justify-between border border-amber-200 ${className}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-900 px-2 py-0.5 rounded-md flex items-center gap-1">
            <span>🇪🇨</span> Edición Ecuador
          </span>
          <span className="text-xs font-serif font-bold text-slate-900">$7.00 USD</span>
        </div>

        {/* Visual de los amuletos y bandera */}
        <div className="my-auto space-y-2 py-2">
          {/* Placa Bandera Ecuador */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-amber-200 shadow-2xs">
            <div className="w-10 h-6 rounded-xs overflow-hidden border border-amber-400 flex flex-col">
              <div className="h-3 bg-[#FFDD00]"></div>
              <div className="h-1.5 bg-[#034EA2]"></div>
              <div className="h-1.5 bg-[#ED1C24]"></div>
            </div>
            <div className="text-[11px] font-medium text-slate-800">
              Placa Esmaltada con Escudo Patrio
            </div>
          </div>

          {/* Árbol de la Vida / San Benito */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-amber-200 shadow-2xs">
            <div className="w-6 h-6 rounded-full bg-amber-100 border border-amber-400 flex items-center justify-center text-xs text-amber-800">
              🌳
            </div>
            <div className="text-[11px] font-medium text-slate-800">
              Árbol de la Vida Nácar & San Benito
            </div>
          </div>
        </div>

        <div className="text-center text-[10px] text-slate-500 bg-stone-50 py-1 rounded-md border border-stone-200">
          Cordón impermeable ajustable con terminales de oro 18K
        </div>
      </div>
    );
  }

  // 5. COLLAR PERLA / BARRA PERSONALIZADA
  return (
    <div className={`relative w-full aspect-square bg-[#FBF9F5] rounded-xl overflow-hidden p-4 flex flex-col justify-between border border-amber-200 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
          Personalizable
        </span>
        <span className="text-xs font-serif font-bold text-slate-900">${product.price.toFixed(2)} USD</span>
      </div>

      <div className="my-auto flex flex-col items-center justify-center py-2">
        <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center shadow-md border-2 border-amber-300">
          <span className="font-serif font-bold text-xl text-slate-900">
            {selectedOption ? selectedOption.charAt(0).toUpperCase() : 'A'}
          </span>
        </div>
        <p className="text-[11px] font-medium text-slate-700 mt-2">
          Grabado láser de inicial o nombre
        </p>
      </div>

      <div className="text-center text-[10px] text-amber-800 bg-amber-50 py-1 rounded-md border border-amber-200">
        Incluye estuche de regalo y pañito de brillo
      </div>
    </div>
  );
};
