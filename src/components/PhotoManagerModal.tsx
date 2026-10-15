import React, { useState, useEffect, useRef } from 'react';
import { PRODUCTS_CATALOG, Product, HERO_CONFIG, DESTACADOS_CONFIG, BANNER_CONFIG } from '../products';
import { Camera, Upload, X, Check, RotateCcw, Image as ImageIcon, Sparkles, ShieldCheck, Layers, Eye, RefreshCw, AlertCircle } from 'lucide-react';
import { 
  getCustomPhotos, 
  saveCustomPhoto, 
  removeCustomPhoto, 
  resetAllCustomPhotos, 
  notifyPhotosUpdated, 
  compressImage, 
  uploadPhotoToServer 
} from '../utils/photoManager';

interface PhotoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoUpdated?: () => void;
}

type GalleryTab = 'todas' | 'hero' | 'destacados' | 'banner' | 'catalogo';

export const PhotoManagerModal: React.FC<PhotoManagerModalProps> = ({
  isOpen,
  onClose,
  onPhotoUpdated
}) => {
  const [activeGalleryTab, setActiveGalleryTab] = useState<GalleryTab>('todas');
  const [customPhotos, setCustomPhotos] = useState<Record<string, string>>({});
  const [activeUploadKey, setActiveUploadKey] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingSlot, setPendingSlot] = useState<{ 
    key: string; 
    defaultFilename: string; 
    label: string 
  } | null>(null);

  // Cargar fotos guardadas
  const loadCustomPhotos = () => {
    setCustomPhotos(getCustomPhotos());
  };

  useEffect(() => {
    if (isOpen) {
      loadCustomPhotos();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const triggerUpload = (key: string, defaultFilename: string, label: string) => {
    setPendingSlot({ key, defaultFilename, label });
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pendingSlot) return;

    const { key, defaultFilename, label } = pendingSlot;
    setActiveUploadKey(key);

    try {
      // 1. Comprimir antes de enviar
      const compressedBase64 = await compressImage(file, 1600, 0.88);

      // Previsualización inmediata
      setCustomPhotos(prev => ({
        ...prev,
        [key]: compressedBase64
      }));

      // 2. Subir al servidor backend en disco
      const serverUrl = await uploadPhotoToServer(defaultFilename, compressedBase64);

      // 3. Guardar en localStorage de forma segura
      const finalUrl = serverUrl || compressedBase64;
      saveCustomPhoto(key, finalUrl);

      setCustomPhotos(prev => ({
        ...prev,
        [key]: finalUrl
      }));

      setActiveUploadKey(null);
      setPendingSlot(null);
      setSuccessMessage(`¡${label} actualizada con éxito! Las demás fotos se mantienen intactas.`);
      setTimeout(() => setSuccessMessage(null), 3500);

      notifyPhotosUpdated(key);
      if (onPhotoUpdated) onPhotoUpdated();
    } catch (err) {
      console.error('Error al actualizar foto en modal:', err);
      setActiveUploadKey(null);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Restaurar una foto individual específica
  const handleResetSingle = (key: string, label: string) => {
    removeCustomPhoto(key);
    setCustomPhotos(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setSuccessMessage(`${label} restaurada a su imagen original.`);
    setTimeout(() => setSuccessMessage(null), 3000);

    notifyPhotosUpdated(key);
    if (onPhotoUpdated) onPhotoUpdated();
  };

  const handleResetAll = () => {
    if (window.confirm('¿Deseas restaurar todas las fotografías a sus versiones predeterminadas de fábrica?')) {
      resetAllCustomPhotos();
      setCustomPhotos({});
      setSuccessMessage('Todas las galerías han sido restauradas a su estado original.');
      setTimeout(() => setSuccessMessage(null), 3000);

      notifyPhotosUpdated();
      if (onPhotoUpdated) onPhotoUpdated();
    }
  };

  const customCount = Object.keys(customPhotos).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      
      {/* Input oculto */}
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="bg-stone-900 border border-amber-500/30 rounded-3xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden text-stone-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabecera del Modal */}
        <div className="p-4 sm:p-6 bg-stone-950 border-b border-stone-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-white">
                  Administrador de Fotos por Galerías
                </h2>
                <span className="text-[10px] bg-emerald-500 text-stone-950 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>100% Desvinculadas</span>
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Cada galería y cada ranura de foto tiene su propio archivo e ID independiente. Cambiar una foto nunca afectará a las demás.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Filtro de Galerías */}
        <div className="bg-stone-950/80 border-b border-stone-800 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {[
              { id: 'todas', label: 'Todas las Galerías', icon: Layers },
              { id: 'hero', label: '1. Portada Inicio', icon: Sparkles },
              { id: 'destacados', label: '2. Destacados Modelos', icon: Eye },
              { id: 'banner', label: '3. Banner Promo $10', icon: ImageIcon },
              { id: 'catalogo', label: '4. Catálogo Completo', icon: Camera }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeGalleryTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveGalleryTab(tab.id as GalleryTab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                      : 'bg-stone-800/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-stone-400 flex items-center gap-2">
            {customCount > 0 && (
              <span className="text-[11px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                {customCount} {customCount === 1 ? 'foto personalizada' : 'fotos personalizadas'}
              </span>
            )}
          </div>
        </div>

        {/* Toast de éxito dentro del modal */}
        {successMessage && (
          <div className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 flex items-center justify-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Contenido con Scroll */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8">
          
          {/* ============================================================== */}
          {/* GALERÍA 1: PORTADA PRINCIPAL DE INICIO (HERO)                  */}
          {/* ============================================================== */}
          {(activeGalleryTab === 'todas' || activeGalleryTab === 'hero') && (
            <div className="bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950/40 border-2 border-amber-500/50 rounded-3xl p-5 sm:p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-amber-500/20">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500 text-stone-950 font-sans">
                      🌟 GALERÍA 1: PORTADA PRINCIPAL DE INICIO
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Ranura Exclusiva Hero</span>
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-white mt-1">
                    Tarjeta de Bienvenida en la Cabecera de la Tienda
                  </h3>
                  <p className="text-xs text-stone-400">
                    Esta tarjeta aparece grande en la parte superior al entrar a la app. Cuenta con 3 fotos independientes (Principal, En Modelo, Con Caja).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1.1 Hero Principal */}
                {(() => {
                  const key = 'hero_portada_main';
                  const url = customPhotos[key] || HERO_CONFIG.defaultImage;
                  const isCustom = !!customPhotos[key];
                  const isUploadingThis = activeUploadKey === key;
                  return (
                    <div className="bg-stone-900 rounded-2xl p-3.5 border border-amber-500/30 flex flex-col justify-between gap-2 shadow-sm">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-amber-300 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Foto Principal Hero</span>
                        </span>
                        {isCustom ? (
                          <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                            Personalizada
                          </span>
                        ) : (
                          <span className="text-[10px] text-stone-400">Original</span>
                        )}
                      </div>

                      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-950 border border-stone-800 flex items-center justify-center">
                        <img 
                          src={url} 
                          alt="Foto Principal Hero" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <p className="text-[10px] text-stone-400">
                        Archivo: <code className="text-amber-400 font-mono">hero-principal.jpg</code>
                      </p>

                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => triggerUpload(key, 'hero-principal.jpg', 'Foto Principal de Portada')}
                          disabled={isUploadingThis}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2.5 px-3 rounded-xl text-xs transition-all shadow-xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isUploadingThis ? 'Subiendo...' : 'Cambiar Foto'}</span>
                        </button>

                        {isCustom && (
                          <button
                            type="button"
                            onClick={() => handleResetSingle(key, 'Foto Principal de Portada')}
                            className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition-colors"
                            title="Restaurar a original"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* 1.2 Hero Modelo */}
                {(() => {
                  const key = 'hero_portada_model';
                  const url = customPhotos[key] || HERO_CONFIG.defaultModelImage;
                  const isCustom = !!customPhotos[key];
                  const isUploadingThis = activeUploadKey === key;
                  return (
                    <div className="bg-stone-900 rounded-2xl p-3.5 border border-stone-800 flex flex-col justify-between gap-2 shadow-sm">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-stone-300 flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-amber-400" />
                          <span>Hero En Modelo</span>
                        </span>
                        {isCustom ? (
                          <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                            Personalizada
                          </span>
                        ) : (
                          <span className="text-[10px] text-stone-400">Original</span>
                        )}
                      </div>

                      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-950 border border-stone-800 flex items-center justify-center">
                        <img 
                          src={url} 
                          alt="Foto Modelo Hero" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <p className="text-[10px] text-stone-400">
                        Archivo: <code className="text-amber-400 font-mono">hero-modelo.jpg</code>
                      </p>

                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => triggerUpload(key, 'hero-modelo.jpg', 'Foto en Modelo de Portada')}
                          disabled={isUploadingThis}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white font-medium py-2.5 px-3 rounded-xl text-xs transition-all border border-stone-700"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isUploadingThis ? 'Subiendo...' : 'Cambiar Modelo'}</span>
                        </button>

                        {isCustom && (
                          <button
                            type="button"
                            onClick={() => handleResetSingle(key, 'Foto en Modelo de Portada')}
                            className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition-colors"
                            title="Restaurar a original"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* 1.3 Hero Caja */}
                {(() => {
                  const key = 'hero_portada_box';
                  const url = customPhotos[key] || HERO_CONFIG.defaultBoxImage;
                  const isCustom = !!customPhotos[key];
                  const isUploadingThis = activeUploadKey === key;
                  return (
                    <div className="bg-stone-900 rounded-2xl p-3.5 border border-stone-800 flex flex-col justify-between gap-2 shadow-sm">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-stone-300 flex items-center gap-1">
                          <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                          <span>Hero Con Caja</span>
                        </span>
                        {isCustom ? (
                          <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                            Personalizada
                          </span>
                        ) : (
                          <span className="text-[10px] text-stone-400">Original</span>
                        )}
                      </div>

                      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-950 border border-stone-800 flex items-center justify-center">
                        <img 
                          src={url} 
                          alt="Foto Caja Hero" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <p className="text-[10px] text-stone-400">
                        Archivo: <code className="text-amber-400 font-mono">hero-caja.jpg</code>
                      </p>

                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => triggerUpload(key, 'hero-caja.jpg', 'Foto de Caja de Portada')}
                          disabled={isUploadingThis}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white font-medium py-2.5 px-3 rounded-xl text-xs transition-all border border-stone-700"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isUploadingThis ? 'Subiendo...' : 'Cambiar Caja'}</span>
                        </button>

                        {isCustom && (
                          <button
                            type="button"
                            onClick={() => handleResetSingle(key, 'Foto de Caja de Portada')}
                            className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition-colors"
                            title="Restaurar a original"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}

              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* GALERÍA 2: SECCIÓN MODELOS DESTACADAS                         */}
          {/* ============================================================== */}
          {(activeGalleryTab === 'todas' || activeGalleryTab === 'destacados') && (
            <div className="bg-stone-950/80 border border-stone-800 rounded-3xl p-5 sm:p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      ⭐ GALERÍA 2: SECCIÓN MODELOS DESTACADAS
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Desvinculadas del Catálogo</span>
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-white mt-1">
                    Tarjetas de la Sección "Nuestras Modelos con su Respectiva Caja"
                  </h3>
                  <p className="text-xs text-stone-400">
                    Estas 2 tarjetas tienen sus propias 6 fotos independientes. Cualquier cambio aquí NO modifica los productos del catálogo ni la portada.
                  </p>
                </div>
              </div>

              {/* Destacado 1: Dúo Elegancia */}
              <div className="bg-stone-900/90 rounded-2xl p-4 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-sm sm:text-base text-amber-300">
                    1. Juego de 2 Pulseras "Elegancia en Cada Detalle" ($15 USD)
                  </h4>
                  <span className="text-[11px] text-stone-400 font-mono">prefix: destacado_duo</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { slot: 'main', label: 'Foto Principal', file: 'destacado-duo-principal.jpg', def: DESTACADOS_CONFIG.duo.defaultMain },
                    { slot: 'model', label: 'En Modelo', file: 'destacado-duo-modelo.jpg', def: DESTACADOS_CONFIG.duo.defaultModel },
                    { slot: 'box', label: 'Con su Caja', file: 'destacado-duo-caja.jpg', def: DESTACADOS_CONFIG.duo.defaultBox }
                  ].map((item) => {
                    const key = `destacado_duo_${item.slot}`;
                    const url = customPhotos[key] || item.def;
                    const isCustom = !!customPhotos[key];
                    const isUploadingThis = activeUploadKey === key;
                    return (
                      <div key={item.slot} className="bg-stone-950 rounded-xl p-3 border border-stone-800 flex flex-col justify-between gap-2">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-stone-300">
                          <span>{item.label}</span>
                          {isCustom ? (
                            <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded font-bold">
                              Personalizada
                            </span>
                          ) : (
                            <span className="text-[9px] text-stone-500">Original</span>
                          )}
                        </div>

                        <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-stone-900 border border-stone-800 flex items-center justify-center">
                          <img src={url} alt={`Destacado Dúo ${item.label}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </div>

                        <p className="text-[9px] text-stone-500 font-mono truncate">{item.file}</p>

                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() => triggerUpload(key, item.file, `Destacado Dúo (${item.label})`)}
                            disabled={isUploadingThis}
                            className="flex-1 inline-flex items-center justify-center gap-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2 px-2 rounded-lg text-xs transition-all"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{isUploadingThis ? 'Subiendo...' : 'Subir Foto'}</span>
                          </button>
                          {isCustom && (
                            <button
                              type="button"
                              onClick={() => handleResetSingle(key, `Destacado Dúo (${item.label})`)}
                              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700"
                              title="Restaurar a original"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Destacado 2: Dúos Stacking */}
              <div className="bg-stone-900/90 rounded-2xl p-4 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-sm sm:text-base text-amber-300">
                    2. Dúos Stacking en Muñeca (Baguette + Cordón Amuletos) ($13.50 USD)
                  </h4>
                  <span className="text-[11px] text-stone-400 font-mono">prefix: destacado_stack</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { slot: 'main', label: 'Foto Principal', file: 'destacado-stack-principal.jpg', def: DESTACADOS_CONFIG.stack.defaultMain },
                    { slot: 'model', label: 'En Modelo', file: 'destacado-stack-modelo.jpg', def: DESTACADOS_CONFIG.stack.defaultModel },
                    { slot: 'box', label: 'Con su Caja', file: 'destacado-stack-caja.jpg', def: DESTACADOS_CONFIG.stack.defaultBox }
                  ].map((item) => {
                    const key = `destacado_stack_${item.slot}`;
                    const url = customPhotos[key] || item.def;
                    const isCustom = !!customPhotos[key];
                    const isUploadingThis = activeUploadKey === key;
                    return (
                      <div key={item.slot} className="bg-stone-950 rounded-xl p-3 border border-stone-800 flex flex-col justify-between gap-2">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-stone-300">
                          <span>{item.label}</span>
                          {isCustom ? (
                            <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded font-bold">
                              Personalizada
                            </span>
                          ) : (
                            <span className="text-[9px] text-stone-500">Original</span>
                          )}
                        </div>

                        <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-stone-900 border border-stone-800 flex items-center justify-center">
                          <img src={url} alt={`Destacado Stack ${item.label}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </div>

                        <p className="text-[9px] text-stone-500 font-mono truncate">{item.file}</p>

                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() => triggerUpload(key, item.file, `Destacado Stack (${item.label})`)}
                            disabled={isUploadingThis}
                            className="flex-1 inline-flex items-center justify-center gap-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2 px-2 rounded-lg text-xs transition-all"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{isUploadingThis ? 'Subiendo...' : 'Subir Foto'}</span>
                          </button>
                          {isCustom && (
                            <button
                              type="button"
                              onClick={() => handleResetSingle(key, `Destacado Stack (${item.label})`)}
                              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700"
                              title="Restaurar a original"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* GALERÍA 3: BANNER PROMOCIONAL DÚO $15 USD                      */}
          {/* ============================================================== */}
          {(activeGalleryTab === 'todas' || activeGalleryTab === 'banner') && (
            <div className="bg-stone-950/80 border border-stone-800 rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      🏷️ GALERÍA 3: BANNER PROMOCIONAL DÚO $15 USD
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Ranura Exclusiva de Banner</span>
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-white mt-1">
                    Fotografía Promocional del Banner de Oferta
                  </h3>
                  <p className="text-xs text-stone-400">
                    Esta imagen se muestra en la sección oscura del banner de oferta especial de $15 USD.
                  </p>
                </div>
              </div>

              {(() => {
                const key = BANNER_CONFIG.slotKey;
                const url = customPhotos[key] || BANNER_CONFIG.defaultImage;
                const isCustom = !!customPhotos[key];
                const isUploadingThis = activeUploadKey === key;
                return (
                  <div className="bg-stone-900 rounded-2xl p-4 border border-stone-800 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                    <div className="sm:col-span-4 relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-950 border border-stone-800 flex items-center justify-center">
                      <img src={url} alt="Banner Promocional Dúo" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      {isCustom && (
                        <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                          Personalizada
                        </span>
                      )}
                    </div>

                    <div className="sm:col-span-8 space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm text-white">Imagen de la Oferta Promocional</h4>
                        <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                          Sube aquí cualquier imagen especial para el banner promocional. Se guardará de manera independiente en <code className="text-amber-400 font-mono">banner-promo-duo.jpg</code> sin alterar las fotos de catálogo ni los destacados.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => triggerUpload(key, BANNER_CONFIG.defaultFilename, 'Foto del Banner Promocional')}
                          disabled={isUploadingThis}
                          className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-xs"
                        >
                          <Upload className="w-4 h-4" />
                          <span>{isUploadingThis ? 'Subiendo...' : 'Cambiar Foto del Banner'}</span>
                        </button>

                        {isCustom && (
                          <button
                            type="button"
                            onClick={() => handleResetSingle(key, 'Foto del Banner Promocional')}
                            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 text-xs transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Restaurar Original</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ============================================================== */}
          {/* GALERÍA 4: CATÁLOGO COMPLETO DE PRODUCTOS (6 PRODUCTOS)        */}
          {/* ============================================================== */}
          {(activeGalleryTab === 'todas' || activeGalleryTab === 'catalogo') && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      🛍️ GALERÍA 4: CATÁLOGO COMPLETO DE PRODUCTOS
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>6 Productos · 18 Ranuras Autónomas</span>
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-white mt-1">
                    Fotografías Individuales de Cada Producto del Catálogo
                  </h3>
                  <p className="text-xs text-stone-400">
                    Cada producto tiene sus propias 3 fotos independientes (Catálogo, En Modelo, Con Caja) con prefijo <code className="text-amber-400 font-mono">catalogo_[id]</code>.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {PRODUCTS_CATALOG.map((product, pIndex) => (
                  <div 
                    key={product.id}
                    className="bg-stone-950/70 border border-stone-800 rounded-2xl p-4 sm:p-5 hover:border-amber-500/40 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-stone-800/80">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            #{pIndex + 1} {product.category.toUpperCase()}
                          </span>
                          <h3 className="font-serif font-bold text-sm sm:text-base text-white">
                            {product.name}
                          </h3>
                        </div>
                        <p className="text-xs text-stone-400 mt-0.5">{product.tagline}</p>
                      </div>
                      <span className="font-serif text-amber-400 font-bold text-base sm:text-lg">
                        ${product.price.toFixed(2)} USD
                      </span>
                    </div>

                    {/* Los 3 Slots de Fotos para este Producto de Catálogo */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { slot: 'main', label: 'Foto Catálogo', file: `catalogo-${product.id}-principal.jpg`, def: product.media.mainImage },
                        { slot: 'model', label: 'En Modelo', file: `catalogo-${product.id}-modelo.jpg`, def: product.media.modelImage },
                        { slot: 'box', label: 'Con su Caja', file: `catalogo-${product.id}-caja.jpg`, def: product.media.boxImage }
                      ].map((item) => {
                        const slotKey = `catalogo_${product.id}_${item.slot}`;
                        const url = customPhotos[slotKey] || item.def;
                        const isCustom = !!customPhotos[slotKey];
                        const isUploadingThis = activeUploadKey === slotKey;
                        return (
                          <div key={item.slot} className="bg-stone-900 rounded-xl p-3 border border-stone-800 flex flex-col justify-between gap-2">
                            <div className="flex items-center justify-between text-[11px] font-semibold text-stone-300">
                              <span className="flex items-center gap-1">
                                <ImageIcon className="w-3 h-3 text-amber-400" />
                                <span>{item.label}</span>
                              </span>
                              {isCustom ? (
                                <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded font-bold">
                                  Personalizada
                                </span>
                              ) : (
                                <span className="text-[9px] text-stone-500">Original</span>
                              )}
                            </div>

                            <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-stone-950 border border-stone-800 flex items-center justify-center">
                              <img 
                                src={url} 
                                alt={`${product.name} ${item.label}`}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <p className="text-[9px] text-stone-500 font-mono truncate">{item.file}</p>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => triggerUpload(slotKey, item.file, `${item.label} de ${product.name}`)}
                                disabled={isUploadingThis}
                                className="flex-1 inline-flex items-center justify-center gap-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2 px-2 rounded-lg text-xs transition-all shadow-xs"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>{isUploadingThis ? 'Subiendo...' : 'Subir Foto'}</span>
                              </button>

                              {isCustom && (
                                <button
                                  type="button"
                                  onClick={() => handleResetSingle(slotKey, `${item.label} de ${product.name}`)}
                                  className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700"
                                  title="Restaurar a original"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Pie del modal */}
        <div className="p-4 sm:p-5 bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetAll}
            className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar todas las galerías a fábrica</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all"
          >
            Listo / Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
