export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  promoBadge?: string;
  tagline: string;
  designStory: string;
  description: string;
  features?: string[];
  optionsName?: string;
  options?: { name: string; colorCode?: string; detail?: string }[];
  whatsappMessage: string;
  imagen: string;
  disponible: boolean;
  media: {
    mainImage: string;
    modelImage: string;
    boxImage: string;
    mainCaption: string;
    modelCaption: string;
    boxCaption: string;
  };
  includesBox?: boolean;
}

// 🌟 CONFIGURACIÓN DE PORTADA HERO
export const HERO_CONFIG = {
  id: 'hero_portada',
  productId: 'AU03',
  title: 'Brazalete Óvalos Alma Marina',
  tagline: 'Eslabones ovalados con relieves marinos y esmalte en vino, rojo y negro.',
  price: 10.00,
  promoBadge: '✨ CÓDIGO AU03 · $10.00 USD',
  defaultImage: './assets/images/productos/brazalete-au03-marina-esmalte-ovalos.webp',
  defaultModelImage: './assets/images/productos/pulsera-au05-tennis-baguette-colores.webp',
  defaultBoxImage: './assets/images/productos/earcuff-au06-set-plata-hojas.webp',
  mainCaption: 'Brazalete Óvalos Alma Marina (AU03) · $10.00 USD',
  modelCaption: 'Pulsera Tennis Baguette Ajustable (AU05) · $6.00 USD',
  boxCaption: 'Set de Ear Cuffs Plateados (AU06) · $8.00 USD'
};

// ⭐ CONFIGURACIÓN SECCIÓN DESTACADOS
export const DESTACADOS_CONFIG = {
  duo: {
    slotPrefix: 'destacado_duo',
    name: 'Brazalete Óvalos Alma Marina',
    price: 10.00,
    defaultMain: './assets/images/productos/brazalete-au03-marina-esmalte-ovalos.webp',
    defaultModel: './assets/images/productos/brazalete-au03-marina-esmalte-ovalos.webp',
    defaultBox: './assets/images/productos/brazalete-au03-marina-esmalte-ovalos.webp',
    mainCaption: 'Eslabones ovalados articulados con relieves marinos y esmalte satinado.',
    modelCaption: 'Acabado dorado con detalles en vino, rojo y negro.',
    boxCaption: 'Presentación en estuche protector lista para obsequio.'
  },
  stack: {
    slotPrefix: 'destacado_stack',
    name: 'Pulsera Tennis Baguette Ajustable',
    price: 6.00,
    defaultMain: './assets/images/productos/pulsera-au05-tennis-baguette-colores.webp',
    defaultModel: './assets/images/productos/pulsera-au05-tennis-baguette-colores.webp',
    defaultBox: './assets/images/productos/pulsera-au05-tennis-baguette-colores.webp',
    mainCaption: 'Cristales rectangulares corte baguette con cadena corrediza dorada.',
    modelCaption: 'Broche deslizable suave que se adapta a cualquier muñeca.',
    boxCaption: 'Empaque protector listo para regalar o llevar contigo.'
  }
};

// 🏷️ BANNER PROMOCIONAL
export const BANNER_CONFIG = {
  slotKey: 'banner_promo_main',
  productId: 'AU03',
  defaultImage: './assets/images/productos/brazalete-au03-marina-esmalte-ovalos.webp',
  defaultFilename: 'brazalete-au03-marina-esmalte-ovalos.webp',
  caption: 'Brazalete Óvalos Alma Marina (AU03) · $10.00 USD'
};

// 🛍️ CATÁLOGO COMPLETO DE 10 PRODUCTOS
export const PRODUCTS_CATALOG: Product[] = [
  {
    id: 'AU03',
    name: 'Brazalete Óvalos Alma Marina',
    category: 'Brazaletes',
    price: 10.00,
    promoBadge: 'AU03 · $10.00 USD',
    tagline: 'Eslabones ovalados con relieves marinos y esmalte en vino, rojo y negro.',
    designStory: 'Eslabones ovalados en tono dorado con sutiles relieves marinos y esmalte en vino, rojo y negro. Una pieza con carácter sereno para lucir o regalar.',
    description: 'Eslabones ovalados en tono dorado con sutiles relieves marinos y esmalte en vino, rojo y negro. Una pieza con carácter sereno para lucir o regalar.',
    imagen: './assets/images/productos/brazalete-au03-marina-esmalte-ovalos.webp',
    disponible: true,
    whatsappMessage: '¡Hola Áurea by Siu! ✨ Deseo pedir el *Brazalete Óvalos Alma Marina (AU03)* por *$10.00 USD*.',
    media: {
      mainImage: './assets/images/productos/brazalete-au03-marina-esmalte-ovalos.webp',
      modelImage: './assets/images/productos/brazalete-au03-marina-esmalte-ovalos.webp',
      boxImage: './assets/images/productos/brazalete-au03-marina-esmalte-ovalos.webp',
      mainCaption: 'Brazalete Óvalos Alma Marina (AU03) · $10.00 USD',
      modelCaption: 'Detalle de eslabones ovalados con relieves marinos',
      boxCaption: 'Presentado en estuche protector listo para regalo'
    },
    includesBox: true
  },
  {
    id: 'AU04',
    name: 'Brazalete Marina Nácar en Relieve',
    category: 'Brazaletes',
    price: 10.00,
    promoBadge: 'AU04 · $10.00 USD',
    tagline: 'Acabado nacarado con motivos marinos en relieve y brillo sutil.',
    designStory: 'Superficie nacarada con delicados relieves inspirados en el mar y destellos luminosos. Un detalle distinguido que aporta frescura y calidez a tu muñeca.',
    description: 'Superficie nacarada con delicados relieves inspirados en el mar y destellos luminosos. Un detalle distinguido que aporta frescura y calidez.',
    imagen: './assets/images/productos/brazalete-au04-marina-nacar-relieve.webp',
    disponible: true,
    whatsappMessage: '¡Hola Áurea by Siu! ✨ Deseo pedir el *Brazalete Marina Nácar en Relieve (AU04)* por *$10.00 USD*.',
    media: {
      mainImage: './assets/images/productos/brazalete-au04-marina-nacar-relieve.webp',
      modelImage: './assets/images/productos/brazalete-au04-marina-nacar-relieve.webp',
      boxImage: './assets/images/productos/brazalete-au04-marina-nacar-relieve.webp',
      mainCaption: 'Brazalete Marina Nácar en Relieve (AU04) · $10.00 USD',
      modelCaption: 'Textura nacarada con relieves marinos definidos',
      boxCaption: 'Presentado en estuche protector listo para regalo'
    },
    includesBox: true
  },
  {
    id: 'AU05',
    name: 'Pulsera Tennis Baguette Ajustable',
    category: 'Pulseras',
    price: 6.00,
    promoBadge: 'AU05 · $6.00 USD',
    tagline: 'Cristales corte baguette en distintos tonos con cadena corrediza dorada.',
    designStory: 'Cristales rectangulares corte baguette sobre cadena fina con broche deslizable a tu medida. Un toque sutil de brillo para tu día o para regalar.',
    description: 'Cristales rectangulares corte baguette sobre cadena fina con broche deslizable a tu medida. Un toque sutil de brillo para tu día o para regalar.',
    imagen: './assets/images/productos/pulsera-au05-tennis-baguette-colores.webp',
    disponible: true,
    whatsappMessage: '¡Hola Áurea by Siu! ✨ Deseo pedir la *Pulsera Tennis Baguette Ajustable (AU05)* por *$6.00 USD*.',
    media: {
      mainImage: './assets/images/productos/pulsera-au05-tennis-baguette-colores.webp',
      modelImage: './assets/images/productos/pulsera-au05-tennis-baguette-colores.webp',
      boxImage: './assets/images/productos/pulsera-au05-tennis-baguette-colores.webp',
      mainCaption: 'Pulsera Tennis Baguette Ajustable (AU05) · $6.00 USD',
      modelCaption: 'Cristales corte baguette luminosos en cadena dorada',
      boxCaption: 'Empaque protector individual para conservar su brillo'
    },
    includesBox: false
  },
  {
    id: 'AU06',
    name: 'Set de Ear Cuffs Plateados',
    category: 'Ear Cuffs',
    price: 8.00,
    promoBadge: 'AU06 · $8.00 USD',
    tagline: 'Cuatro ear cuffs ajustables en tono plateado con hojas, circones y bandas lisas.',
    designStory: 'Cuatro piezas ajustables en tono plateado con hojas, circones y líneas finas sin perforación. Versátil para combinar a diario o dar un detalle actual.',
    description: 'Cuatro piezas ajustables en tono plateado con hojas, circones y líneas finas sin perforación. Versátil para combinar a diario o dar un detalle actual.',
    imagen: './assets/images/productos/earcuff-au06-set-plata-hojas.webp',
    disponible: true,
    whatsappMessage: '¡Hola Áurea by Siu! ✨ Deseo pedir el *Set de Ear Cuffs Plateados (AU06)* por *$8.00 USD*.',
    media: {
      mainImage: './assets/images/productos/earcuff-au06-set-plata-hojas.webp',
      modelImage: './assets/images/productos/earcuff-au06-set-plata-hojas.webp',
      boxImage: './assets/images/productos/earcuff-au06-set-plata-hojas.webp',
      mainCaption: 'Set de Ear Cuffs Plateados (AU06) · $8.00 USD',
      modelCaption: 'Diseño adaptable con hojas, circones y bandas lisas',
      boxCaption: 'Presentación cuidada lista para entregar'
    },
    includesBox: false
  },
  {
    id: 'AU07',
    name: 'Set de Pulseras Turquesa',
    category: 'Sets',
    price: 6.00,
    promoBadge: 'AU07 · $6.00 USD',
    tagline: 'Combinación armoniosa en tonos turquesa con detalles dorados y ajuste cómodo.',
    designStory: 'Juego de pulseras con cuentas en tono turquesa y acentos luminosos que realzan cualquier look. Una propuesta fresca y encantadora para lucir juntas o por separado.',
    description: 'Juego de pulseras con cuentas en tono turquesa y acentos luminosos que realzan cualquier look. Una propuesta fresca para lucir juntas o por separado.',
    imagen: './assets/images/productos/set-au07-turquesa-modelo.webp',
    disponible: true,
    whatsappMessage: '¡Hola Áurea by Siu! ✨ Deseo pedir el *Set de Pulseras Turquesa (AU07)* por *$6.00 USD*.',
    media: {
      mainImage: './assets/images/productos/set-au07-turquesa-modelo.webp',
      modelImage: './assets/images/productos/set-au07-turquesa-modelo.webp',
      boxImage: './assets/images/productos/set-au07-turquesa-modelo.webp',
      mainCaption: 'Set de Pulseras Turquesa (AU07) · $6.00 USD',
      modelCaption: 'Combinación ligera en tonos turquesa',
      boxCaption: 'Empaque protector listo para obsequio'
    },
    includesBox: false
  },
  {
    id: 'AU08',
    name: 'Set de Pulseras Mariposas Negro',
    category: 'Sets',
    price: 6.00,
    promoBadge: 'AU08 · $6.00 USD',
    tagline: 'Dúo en tono negro con delicados dijes de mariposa y acabado sutil.',
    designStory: 'Set en contraste negro y detalles de mariposa que simbolizan ligereza y renovación. Ideal para acompañar tu estilo diario o sorprender con un detalle especial.',
    description: 'Set en contraste negro con delicados dijes de mariposa que simbolizan ligereza. Ideal para acompañar tu estilo diario o sorprender con un detalle.',
    imagen: './assets/images/productos/set-au08-mariposas-negro-modelo.webp',
    disponible: true,
    whatsappMessage: '¡Hola Áurea by Siu! ✨ Deseo pedir el *Set de Pulseras Mariposas Negro (AU08)* por *$6.00 USD*.',
    media: {
      mainImage: './assets/images/productos/set-au08-mariposas-negro-modelo.webp',
      modelImage: './assets/images/productos/set-au08-mariposas-negro-modelo.webp',
      boxImage: './assets/images/productos/set-au08-mariposas-negro-modelo.webp',
      mainCaption: 'Set de Pulseras Mariposas Negro (AU08) · $6.00 USD',
      modelCaption: 'Detalles de mariposa sobre diseño ajustable',
      boxCaption: 'Empaque protector individual'
    },
    includesBox: false
  },
  {
    id: 'AU09',
    name: 'Pulsera Cordón Dorado con Dijes',
    category: 'Pulseras Artesanales',
    price: 5.00,
    promoBadge: 'AU09 · $5.00 USD',
    tagline: 'Cordón satinado dorado ajustable con dije de clave de sol, gato o virgen.',
    designStory: 'Tejida en cordón satinado dorado con extensión graduable y dije de clave de sol, gatito o virgen. Un detalle cercano con encanto propio para llevar o compartir.',
    description: 'Tejida en cordón satinado dorado con extensión graduable y dije de clave de sol, gatito o virgen. Un detalle cercano para llevar contigo o compartir.',
    imagen: './assets/images/productos/pulsera-au09-cordon-dorado-dijes.webp',
    disponible: true,
    optionsName: 'Elige tu Dije',
    options: [
      { name: 'Clave de Sol', detail: 'Símbolo de música y armonía' },
      { name: 'Gatito', detail: 'Detalle tierno de compañía' },
      { name: 'Virgencita', detail: 'Símbolo de fe y cuidado' }
    ],
    whatsappMessage: '¡Hola Áurea by Siu! ✨ Deseo pedir la *Pulsera Cordón Dorado con Dijes (AU09)* por *$5.00 USD*.',
    media: {
      mainImage: './assets/images/productos/pulsera-au09-cordon-dorado-dijes.webp',
      modelImage: './assets/images/productos/pulsera-au09-cordon-dorado-dijes.webp',
      boxImage: './assets/images/productos/pulsera-au09-cordon-dorado-dijes.webp',
      mainCaption: 'Pulsera Cordón Dorado con Dijes (AU09) · $5.00 USD',
      modelCaption: 'Cordón satinado suave con cierre ajustable',
      boxCaption: 'Empaque protector listo para obsequio'
    },
    includesBox: false
  },
  {
    id: 'AU10',
    name: 'Pulsera Macramé Negro Árbol de la Vida',
    category: 'Pulseras Artesanales',
    price: 5.00,
    promoBadge: 'AU10 · $5.00 USD',
    tagline: 'Hilo negro tejido en macramé con balines dorados y dije con microcirconias.',
    designStory: 'Hilo negro en macramé con balines dorados y dije del Árbol de la Vida con microcirconias. Una pieza sobria con significado sereno para usar o regalar.',
    description: 'Hilo negro en macramé con balines dorados y dije del Árbol de la Vida con microcirconias. Una pieza sobria con significado sereno para usar o regalar.',
    imagen: './assets/images/productos/pulsera-au10-macrame-negro-arbol.webp',
    disponible: true,
    whatsappMessage: '¡Hola Áurea by Siu! ✨ Deseo pedir la *Pulsera Macramé Negro Árbol de la Vida (AU10)* por *$5.00 USD*.',
    media: {
      mainImage: './assets/images/productos/pulsera-au10-macrame-negro-arbol.webp',
      modelImage: './assets/images/productos/pulsera-au10-macrame-negro-arbol.webp',
      boxImage: './assets/images/productos/pulsera-au10-macrame-negro-arbol.webp',
      mainCaption: 'Pulsera Macramé Negro Árbol de la Vida (AU10) · $5.00 USD',
      modelCaption: 'Nudo macramé ajustable con balines dorados',
      boxCaption: 'Empaque protector individual'
    },
    includesBox: false
  },
  {
    id: 'AU11',
    name: 'Pulseras Ajustables Diseños Variados',
    category: 'Pulseras Artesanales',
    price: 5.00,
    promoBadge: 'AU11 · $5.00 USD',
    tagline: 'Modelos tejidos con cierre graduable y detalles artesanales sutiles.',
    designStory: 'Colección de pulseras ajustables elaboradas con cuidado y acabados ligeros. Pensadas para adaptarse cómodamente a tu muñeca y sumar un toque personal.',
    description: 'Pulseras ajustables elaboradas con cuidado y acabados ligeros. Pensadas para adaptarse cómodamente a tu muñeca y sumar un toque personal.',
    imagen: './assets/images/productos/pulsera-au11-ajustables-variadas.webp',
    disponible: true,
    whatsappMessage: '¡Hola Áurea by Siu! ✨ Deseo pedir las *Pulseras Ajustables Diseños Variados (AU11)* por *$5.00 USD*.',
    media: {
      mainImage: './assets/images/productos/pulsera-au11-ajustables-variadas.webp',
      modelImage: './assets/images/productos/pulsera-au11-ajustables-variadas.webp',
      boxImage: './assets/images/productos/pulsera-au11-ajustables-variadas.webp',
      mainCaption: 'Pulseras Ajustables Diseños Variados (AU11) · $5.00 USD',
      modelCaption: 'Tejido cómodo con cierre corredizo práctico',
      boxCaption: 'Empaque protector listo para obsequio'
    },
    includesBox: false
  },
  {
    id: 'AU12',
    name: 'Pulsera Tejida Artesanal con Dije',
    category: 'Pulseras Artesanales',
    price: 5.00,
    promoBadge: 'AU12 · $5.00 USD',
    tagline: 'Hilo tejido a mano con nudo corredizo y detalle central en tono dorado.',
    designStory: 'Elaborada a mano en hilo resistente con nudo corredizo y dije central en tono dorado. Cómoda para el uso diario o como un gesto sencillo y cuidado.',
    description: 'Elaborada a mano en hilo resistente con nudo corredizo y dije central en tono dorado. Cómoda para el uso diario o como un gesto sencillo y cuidado.',
    imagen: './assets/images/productos/pulsera-au12-cordon-artesanal.webp',
    disponible: true,
    whatsappMessage: '¡Hola Áurea by Siu! ✨ Deseo pedir la *Pulsera Tejida Artesanal con Dije (AU12)* por *$5.00 USD*.',
    media: {
      mainImage: './assets/images/productos/pulsera-au12-cordon-artesanal.webp',
      modelImage: './assets/images/productos/pulsera-au12-cordon-artesanal.webp',
      boxImage: './assets/images/productos/pulsera-au12-cordon-artesanal.webp',
      mainCaption: 'Pulsera Tejida Artesanal con Dije (AU12) · $5.00 USD',
      modelCaption: 'Nudo corredizo ligero y práctico de ajustar',
      boxCaption: 'Empaque protector listo para obsequio'
    },
    includesBox: false
  }
];
