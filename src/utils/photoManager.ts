/**
 * Utilidad centralizada y robusta para la gestión, desvinculación y guardado
 * de fotografías independientes por ranura y galería.
 */

const STORAGE_KEY = 'aurea_custom_images';

export function getCustomPhotos(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Error al leer fotos personalizadas de localStorage:', err);
    return {};
  }
}

export function saveCustomPhoto(key: string, value: string): void {
  try {
    const current = getCustomPhotos();
    current[key] = value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (err: any) {
    console.warn('Advertencia de cuota en localStorage. Purgando datos pesados en base64...', err);
    // Si la cuota de localStorage se llenó por fotos pesadas previas en base64,
    // purgar las que tengan formato "data:image/" largo y conservar las URLs limpias
    try {
      const current = getCustomPhotos();
      const pruned: Record<string, string> = {};
      for (const [k, v] of Object.entries(current)) {
        if (!v.startsWith('data:image/') || v.length < 20000) {
          pruned[k] = v;
        }
      }
      pruned[key] = value;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pruned));
    } catch {
      // Si todavía falla, guardar solo la clave actual
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ [key]: value }));
      } catch (finalErr) {
        console.error('No se pudo guardar en localStorage tras purga:', finalErr);
      }
    }
  }
}

export function removeCustomPhoto(key: string): void {
  try {
    const current = getCustomPhotos();
    delete current[key];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (err) {
    console.error('Error al remover foto personalizada:', err);
  }
}

export function resetAllCustomPhotos(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error al resetear fotos:', err);
  }
}

export function notifyPhotosUpdated(key?: string): void {
  window.dispatchEvent(new CustomEvent('aurea_photos_updated', { 
    detail: { key, timestamp: Date.now() } 
  }));
}

/**
 * Comprime imágenes en el navegador antes de subirlas al servidor.
 * Convierte archivos de 5-15MB de teléfonos o cámaras en imágenes ultranítidas de ~150-250KB,
 * lo que hace la subida instantánea y evita agotar memoria o cuotas.
 */
export async function compressImage(
  file: File, 
  maxDimension: number = 1600, 
  quality: number = 0.88
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Si no es imagen, leer directo
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      // Calcular proporción
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // Fallback FileReader
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      try {
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      } catch {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    };

    img.src = objectUrl;
  });
}

/**
 * Envía la foto al backend para guardarla en public/images/{filename}
 * y devuelve la URL accesible en el navegador.
 */
export async function uploadPhotoToServer(
  filename: string, 
  base64Data: string
): Promise<string | null> {
  try {
    const res = await fetch('/api/upload-photo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, base64Data })
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.url) {
        return data.url;
      }
    }
    return null;
  } catch (err) {
    console.warn('No se pudo subir al servidor backend (modo offline):', err);
    return null;
  }
}
