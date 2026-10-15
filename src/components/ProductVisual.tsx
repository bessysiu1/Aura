import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../products';
import { Gift, Sparkles, Maximize2, User, Image as ImageIcon, Camera, RotateCcw, Check, ShieldCheck } from 'lucide-react';
import { 
  getCustomPhotos, 
  saveCustomPhoto, 
  removeCustomPhoto, 
  notifyPhotosUpdated, 
  compressImage, 
  uploadPhotoToServer 
} from '../utils/photoManager';

interface ProductVisualProps {
  product: Product;
  selectedOption?: string;
  className?: string;
  initialTab?: 'main' | 'model' | 'box';
  slotPrefix?: string; // Para desvincular cada galería (hero_portada, destacado_duo, destacado_stack, catalogo_id)
  overrideDefaults?: {
    main?: string;
    model?: string;
    box?: string;
    mainCaption?: string;
    modelCaption?: string;
    boxCaption?: string;
  };
  onOpenZoom?: (imageUrl: string, title: string, caption: string) => void;
  onPhotoChanged?: (slot: string, newUrl: string) => void;
}

export const ProductVisual: React.FC<ProductVisualProps> = ({ 
  product, 
  selectedOption, 
  className = '',
  initialTab = 'main',
  slotPrefix,
  overrideDefaults,
  onOpenZoom,
  onPhotoChanged
}) => {
  const [activeTab, setActiveTab] = useState<'main' | 'model' | 'box'>(initialTab);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [customPhotos, setCustomPhotos] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clave única 100% desvinculada para esta ranura específica de esta galería
  const effectivePrefix = slotPrefix || `catalogo_${product.id}`;
  const currentKey = `${effectivePrefix}_${activeTab}`;

  // Cargar fotos personalizadas
  const refreshStorage = () => {
    setCustomPhotos(getCustomPhotos());
  };

  useEffect(() => {
    refreshStorage();

    const handleGlobalUpdate = () => {
      refreshStorage();
    };

    window.addEventListener('storage', handleGlobalUpdate);
    window.addEventListener('aurea_photos_updated', handleGlobalUpdate);

    return () => {
      window.removeEventListener('storage', handleGlobalUpdate);
      window.removeEventListener('aurea_photos_updated', handleGlobalUpdate);
    };
  }, [currentKey]);

  // Nombre de archivo independiente normalizado
  const getSlotFilename = (tab: 'main' | 'model' | 'box') => {
    const tabSuffix = tab === 'model' ? 'modelo' : tab === 'box' ? 'caja' : 'principal';
    if (slotPrefix === 'hero_portada') {
      return `hero-${tabSuffix}.jpg`;
    }
    if (slotPrefix === 'destacado_duo') {
      return `destacado-duo-${tabSuffix}.jpg`;
    }
    if (slotPrefix === 'destacado_stack') {
      return `destacado-stack-${tabSuffix}.jpg`;
    }
    if (slotPrefix?.startsWith('catalogo_') || slotPrefix?.startsWith('catalogo-')) {
      const prodId = slotPrefix.replace(/^catalogo[_|-]/, '');
      return `catalogo-${prodId}-${tabSuffix}.jpg`;
    }
    return `catalogo-${product.id}-${tabSuffix}.jpg`;
  };

  // Obtener la imagen activa según la pestaña seleccionada
  const getCurrentImage = () => {
    const customUrl = customPhotos[currentKey];

    switch (activeTab) {
      case 'model':
        return {
          url: customUrl || overrideDefaults?.model || product.media.modelImage,
          caption: overrideDefaults?.modelCaption || product.media.modelCaption,
          badge: '👩‍🦰 Foto en Modelo',
          slotName: 'Foto en Modelo',
          defaultFilename: getSlotFilename('model'),
          isCustom: !!customUrl
        };
      case 'box':
        return {
          url: customUrl || overrideDefaults?.box || product.media.boxImage,
          caption: overrideDefaults?.boxCaption || product.media.boxCaption,
          badge: '🎁 Con su Caja de Joyería',
          slotName: 'Foto con Caja',
          defaultFilename: getSlotFilename('box'),
          isCustom: !!customUrl
        };
      case 'main':
      default:
        return {
          url: customUrl || overrideDefaults?.main || product.media.mainImage,
          caption: overrideDefaults?.mainCaption || product.media.mainCaption,
          badge: slotPrefix?.startsWith('hero') 
            ? '🌟 Portada Inicio (Desvinculada)' 
            : slotPrefix?.startsWith('destacado')
              ? '⭐ Sección Destacada'
              : '📸 Foto Catálogo',
          slotName: slotPrefix?.startsWith('hero') 
            ? 'Foto de Portada' 
            : slotPrefix?.startsWith('destacado')
              ? 'Foto Destacada'
              : 'Foto Principal',
          defaultFilename: getSlotFilename('main'),
          isCustom: !!customUrl
        };
    }
  };

  const current = getCurrentImage();

  // Manejo de subida directa de nueva fotografía
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // 1. Comprimir en cliente para evitar consumo excesivo y acelerar subida
      const compressedBase64 = await compressImage(file, 1600, 0.88);
      
      // Mostrar preview inmediato
      setCustomPhotos(prev => ({
        ...prev,
        [currentKey]: compressedBase64
      }));

      // 2. Guardar en el servidor backend (disco persistente)
      const filename = current.defaultFilename;
      const serverUrl = await uploadPhotoToServer(filename, compressedBase64);

      // 3. Guardar URL limpia o base64 seguro en localStorage
      const finalUrl = serverUrl || compressedBase64;
      saveCustomPhoto(currentKey, finalUrl);

      setCustomPhotos(prev => ({
        ...prev,
        [currentKey]: finalUrl
      }));

      setIsUploading(false);
      setImageLoaded(false);
      setUploadSuccess(`¡${current.slotName} actualizada con éxito!`);
      setTimeout(() => setUploadSuccess(null), 3500);

      // 4. Notificar globalmente a todas las galerías
      notifyPhotosUpdated(currentKey);
      if (onPhotoChanged) onPhotoChanged(currentKey, finalUrl);
    } catch (err) {
      console.error('Error al actualizar foto:', err);
      setIsUploading(false);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Restaurar foto individual de esta ranura
  const handleResetSinglePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeCustomPhoto(currentKey);
    setCustomPhotos(prev => {
      const next = { ...prev };
      delete next[currentKey];
      return next;
    });
    setImageLoaded(false);
    setUploadSuccess(`Foto restaurada a su versión original.`);
    setTimeout(() => setUploadSuccess(null), 3000);

    notifyPhotosUpdated(currentKey);
    if (onPhotoChanged) onPhotoChanged(currentKey, '');
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-stone-200 bg-stone-900 shadow-md group flex flex-col ${className}`}>
      
      {/* Input oculto para subir fotografía */}
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Selector de Vistas: Principal | En Modelo | Con su Caja */}
      <div className="z-20 bg-stone-900/90 backdrop-blur-md p-1.5 border-b border-stone-800 flex items-center justify-between gap-1">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setActiveTab('main'); setImageLoaded(false); }}
          className={`flex-1 py-1.5 px-2 text-[10px] sm:text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'main'
              ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
              : 'text-stone-300 hover:text-white hover:bg-stone-800'
          }`}
          title="Ver fotografía original principal"
        >
          <ImageIcon className="w-3 h-3" />
          <span>Principal</span>
        </button>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setActiveTab('model'); setImageLoaded(false); }}
          className={`flex-1 py-1.5 px-2 text-[10px] sm:text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'model'
              ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
              : 'text-stone-300 hover:text-white hover:bg-stone-800'
          }`}
          title="Ver cómo luce la modelo con la joyería"
        >
          <User className="w-3 h-3" />
          <span>En Modelo</span>
        </button>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setActiveTab('box'); setImageLoaded(false); }}
          className={`flex-1 py-1.5 px-2 text-[10px] sm:text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'box'
              ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
              : 'text-stone-300 hover:text-white hover:bg-stone-800'
          }`}
          title="Ver la respectiva caja de presentación"
        >
          <Gift className="w-3 h-3" />
          <span>Con su Caja</span>
        </button>
      </div>

      {/* Contenedor de la Imagen con Alta Nitidez */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[1/1] bg-stone-950 overflow-hidden flex items-center justify-center">
        
        {/* Placeholder mientras carga */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-stone-900 animate-pulse flex items-center justify-center">
            <span className="text-xs text-stone-400 font-medium">Cargando imagen nítida...</span>
          </div>
        )}

        <img
          src={current.url}
          alt={`${product.name} - ${current.caption}`}
          referrerPolicy="no-referrer"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover sm:object-contain transition-all duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
        />

        {/* Notificación de Éxito al Subir */}
        {uploadSuccess && (
          <div className="absolute inset-x-3 top-12 z-30 bg-emerald-600/95 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-lg flex items-center justify-center gap-1.5 animate-fadeIn">
            <Check className="w-4 h-4 text-white" />
            <span>{uploadSuccess}</span>
          </div>
        )}

        {/* Badge Flotante de Vista y Desvinculación */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-1.5">
          <span className="bg-stone-900/85 backdrop-blur-md text-amber-300 border border-amber-500/40 text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
            <span>{current.badge}</span>
          </span>
          {current.isCustom ? (
            <span className="bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              Personalizada
            </span>
          ) : (
            <span className="bg-stone-900/70 text-stone-400 text-[9px] px-2 py-0.5 rounded-full border border-stone-700 flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
              <span>Desvinculada</span>
            </span>
          )}
        </div>

        {/* Botones de Acción sobre la imagen */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5">
          {/* Botón para Restaurar si fue personalizada */}
          {current.isCustom && (
            <button
              type="button"
              onClick={handleResetSinglePhoto}
              className="p-2 rounded-xl bg-stone-800/90 hover:bg-stone-700 text-stone-200 hover:text-white border border-stone-600 transition-all shadow-md flex items-center gap-1 text-[11px]"
              title="Restaurar a la foto original de esta ranura"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restaurar</span>
            </button>
          )}

          {/* Botón para Cambiar / Subir Foto directamente */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            disabled={isUploading}
            className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-all duration-300 shadow-md flex items-center gap-1 text-[11px]"
            title={`Cambiar exclusivamente esta foto (${current.slotName}) sin tocar ninguna otra galería`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isUploading ? 'Subiendo...' : 'Cambiar Foto'}</span>
          </button>

          {/* Botón de Zoom / Pantalla Completa */}
          {onOpenZoom && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenZoom(current.url, product.name, current.caption);
              }}
              className="p-2 rounded-xl bg-stone-900/80 hover:bg-amber-600 text-white border border-white/20 transition-all duration-300 shadow-md group-hover:opacity-100 opacity-90"
              title="Ampliar fotografía en alta resolución"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* Pie de foto descriptivo */}
      <div className="p-3 bg-stone-900 border-t border-stone-800 text-left flex items-center justify-between gap-2">
        <p className="text-[11px] text-stone-300 leading-snug font-medium flex items-start gap-1.5">
          <span className="text-amber-400 shrink-0 font-bold">•</span>
          <span>{current.caption}</span>
        </p>
      </div>

    </div>
  );
};
