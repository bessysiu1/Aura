export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  priceUnit?: string;
  promoBadge?: string;
  tagline: string;
  designStory: string;
  description: string;
  variantPrompt?: string;
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

// CONFIGURACIÓN DE PORTADA HERO
export const HERO_CONFIG = {
  id: 'hero_portada',
  productId: 'AU03',
  title: 'Brazalete Óvalos Alma Marina',
  tagline: 'Eslabones ovalados con relieves marinos y esmalte en vino, rojo y negro.',
  price: 10.00,
  promoBadge: 'CÓDIGO AU03 · $10.00 USD c/u',
  defaultImage: './assets/images/productos/brazalete-au03-marina-esmalte-ovalos.webp',
  defaultModelImage: './assets/images/productos/pulsera-au05-tennis-baguette-colores.webp',
  defaultBoxImage: './assets/images/productos/earcuff-au06-set-plata-hojas.webp',
  mainCaption: 'Brazalete Óvalos Alma Marina (AU03) · $10.00 USD c/u',
  modelCaption: 'Pulsera Tennis Baguette Ajustable (AU05) · $6.00 USD c/u',
  boxCaption: 'Ear Cuff Plateado Ajustable (AU06) · $8.00 USD c/u'
};

// CONFIGURACIÓN SECCIÓN DESTACADOS
export const DESTACADOS_CONFIG = {
  duo: {
    slotPrefix: 'destacado_duo',
    name: 'Brazalete Óvalos Alma Marina',
    price: 10.00,
    defaultMain: './assets/images/productos/brazalete-au03-marina-esmalte-ovalos.webp',
    defaultModel: './assets/images/productos/brazalete-au03-marina-esmalte-ovalos.webp',
    defaultBox: './assets/images/productos/brazalete-au03-marina-esmalte-ovalos.webp',
    mainCaption: 'Eslabones ovalados articulados con relieves marinos y esmalte satinado.',
    modelCaption: 'Acabado dorado con detalles en vino, rojo y negro (precio por pieza).',
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
    modelCaption: 'Broche deslizable suave que se adapta a cualquier muñeca (precio por pieza).',
    boxCaption: 'Empaque protector listo para regalar o llevar contigo.'
  }
};

// BANNER PROMOCIONAL
export const BANNER_CONFIG = {
  slotKey: 'banner_promo_main',
  productId: 'AU04',
  defaultImage: './assets/images/productos/brazalete-au04-marina-nacar-relieve.webp',
  defaultFilename: 'brazalete-au04-marina-nacar-relieve.webp',
  caption: 'Brazalete Marina Nácar en Relieve (AU04) · $10.00 USD c/u'
};

// CATÁLOGO COMPLETO DE 10 PRODUCTOS
export const PRODUCTS_CATALOG: Product[] = [
  {
    id: 'AU03',
    name: 'Brazalete Óvalos Alma Marina',
    category: 'Brazaletes',
    price: 10.00,
    priceUnit: 'c/u',
    promoBadge: 'AU03 · $10.00 USD c/u',
    tagline: 'Eslabones ovalados con relieves marinos y esmalte en vino, rojo o negro.',
    designStory: 'Brazalete individual de eslabones ovalados en tono dorado con relieves marinos y esmalte satinado. Disponible en tono vino, rojo o negro (valor por unidad).',
    description: 'Brazalete individual de eslabones ovalados en tono dorado con sutiles relieves marinos y esmalte. Disponible en vino, rojo o negro (precio por pieza).',
    variantPrompt: 'Color deseado (Vino, Rojo o Negro)',
    imagen: './assets/images/productos/brazalete-au03-marina-esmalte-ovalos.webp',
    disponible: true,
    whatsappMessage: '¡Hola Áurea by Siu! Deseo pedir el *Brazalete Óvalos Alma Marina (AU03)* por *$10.00 USD c/u*.',
    media: {
      mainImage: './assets/images/productos/brazalete-au03-marina-esmalte-ovalos.webp',
      modelImage: './assets/images/productos/brazalete-au03-marina-esmalte-ovalos.webp',
      boxImage: './assets/images/productos/brazalete-au03-marina-esmalte-ovalos.webp',
      mainCaption: 'Brazalete Óvalos Alma Marina (AU03) · $10.00 USD c/u',
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
    priceUnit: 'c/u',
    promoBadge: 'AU04 · $10.00 USD c/u',
    tagline: 'Acabado nacarado con motivos marinos en relieve y brillo sutil.',
    designStory: 'Superficie nacarada con delicados relieves inspirados en el mar y destellos luminosos. Un detalle distinguido que aporta frescura y calidez a tu muñeca.',
    description: 'Superficie nacarada con delicados relieves inspirados en el mar y destellos luminosos. Un detalle distinguido que aporta frescura y calidez.',
    variantPrompt: 'Color deseado',
    imagen: './assets/images/productos/brazalete-au04-marina-nacar-relieve.webp',
    disponible: true,
    whatsappMessage: '¡Hola Áurea by Siu! Deseo pedir el *Brazalete Marina Nácar en Relieve (AU04)* por *$10.00 USD c/u*.',
    media: {
      mainImage: './assets/images/productos/brazalete-au04-marina-nacar-relieve.webp',
      modelImage: './assets/images/productos/brazalete-au04-marina-nacar-relieve.webp',
      boxImage: './assets/images/productos/brazalete-au04-marina-nacar-relieve.webp',
      mainCaption: 'Brazalete Marina Nácar en Relieve (AU04) · $10.00 USD c/u',
      modelCaption: 'Textura nacarada con relieves marinos definidos',
      boxCaption: 'Presentado en estuche protector listo para regalo'
    },
    includesBox: true
  },
  {
    id: 'AU06',
    name: 'Ear Cuff Plateado Ajustable',
    category: 'Ear Cuffs',
    price: 8.00,
    priceUnit: 'c/u',
    promoBadge: 'AU06 · $8.00 USD c/u',
    tagline: 'Diseño individual ajustable sin perforación en acabado plateado.',
    designStory: 'Ear cuff individual en tono plateado, cómodo y sin necesidad de perforación. Elige tu diseño favorito entre hojas, circones o banda lisa (valor por unidad).',
    description: 'Ear cuff individual en tono plateado, cómodo y adaptable sin perforación. Disponible en diseño de hojas, circones o banda lisa (precio por pieza).',
    variantPrompt: 'Diseño deseado (Hojas, Circones o Banda lisa)',
    imagen: './assets/images/productos/earcuff-au06-set-plata-hojas.webp',
    disponible: true,
    whatsappMessage: '¡Hola Áurea by Siu! Deseo pedir el *Ear Cuff Plateado Ajustable (AU06)* por *$8.00 USD c/u*.',
    media: {
      mainImage: './assets/images/productos/earcuff-au06-set-plata-hojas.webp',
      modelImage: './assets/images/productos/earcuff-au06-set-plata-hojas.webp',
      boxImage: './assets/images/productos/earcuff-au06-set-plata-hojas.webp',
      mainCaption: 'Ear Cuff Plateado Ajustable (AU06) · $8.00 USD c/u',
      modelCaption: 'Diseño adaptable con hojas, circones o bandas lisas',
      boxCaption: 'Presentación cuidada lista para entregar'
    },
    includesBox: false
  },
  {
    id: 'AU05',
    name: 'Pulsera Tennis Baguette Ajustable',
    category: 'Pulseras',
    price: 6.00,
    priceUnit: 'c/u',
    promoBadge: 'AU05 · $6.00 USD c/u',
    tagline: 'Cristales corte baguette en distintos tonos con cadena corrediza dorada.',
    designStory: 'Pulsera individual con cristales rectangulares corte baguette sobre cadena fina y broche deslizable a tu medida. Elige el tono de cristal de tu preferencia (valor por unidad).',
    description: 'Pulsera individual con cristales corte baguette sobre cadena fina y broche deslizable a tu medida. Disponible en varios tonos (precio por pieza).',
    variantPrompt: 'Color de cristal deseado',
    imagen: './assets/images/productos/pulsera-au05-tennis-baguette-colores.webp',
    disponible: true,
    whatsappMessage: '¡Hola Áurea by Siu! Deseo pedir la *Pulsera Tennis Baguette Ajustable (AU05)* por *$6.00 USD c/u*.',
    media: {
      mainImage: './assets/images/productos/pulsera-au05-tennis-baguette-colores.webp',
      modelImage: './assets/images/productos/pulsera-au05-tennis-baguette-colores.webp',
      boxImage: './assets/images/productos/pulsera-au05-tennis-baguette-colores.webp',
      mainCaption: 'Pulsera Tennis Baguette Ajustable (AU05) · $6.00 USD c/u',
      modelCaption: 'Cristales corte baguette luminosos en cadena dorada',
      boxCaption: 'Empaque protector individual para conservar su brillo'
    },
    includesBox: false
  },
  {
    id: 'AU07',
    name: 'Set de Pulsera y Aretes Turquesa',
    category: 'Sets',
    price: 12.00,
    priceUnit: 'set',
    promoBadge: 'AU07 · $12.00 USD el set',
    tagline: 'Set coordinado de pulsera y aretes en tonos turquesa con destellos dorados.',
    designStory: 'Juego completo de pulsera y aretes a juego con cuentas en tono turquesa y detalles dorados luminosos. Una combinación fresca y armoniosa lista para lucir en conjunto o regalar.',
    description: 'Set completo de pulsera y aretes en tonos turquesa con acentos dorados luminosos. Ideal para lucir en conjunto o sorprender con un detalle especial.',
    imagen: './assets/images/productos/set-au07-turquesa-modelo.webp',
    disponible: true,
    whatsappMessage: '¡Hola Áurea by Siu! Deseo pedir el *Set de Pulsera y Aretes Turquesa (AU07)* por *$12.00 USD el set*.',
    media: {
      mainImage: './assets/images/productos/set-au07-turquesa-modelo.webp',
      modelImage: './assets/images/productos/set-au07-turquesa-modelo.webp',
      boxImage: './assets/images/productos/set-au07-turquesa-modelo.webp',
      mainCaption: 'Set de Pulsera y Aretes Turquesa (AU07) · $12.00 USD el set',
      modelCaption: 'Juego coordinado de pulsera y aretes en tonos turquesa',
      boxCaption: 'Empaque protector listo para obsequio'
  },
    includesBox: false
  },
  {
    id: 'AU08',
    name: 'Set de Pulseras Mariposas Negro',
    category: 'Sets',
    price: 12.00,
    priceUnit: 'set',
    promoBadge: 'AU08 · $12.00 USD el set',
    tagline: 'Dúo en tono negro con delicados dijes de mariposa y acabado sutil.',
    designStory: 'Set en contraste negro y detalles de mariposa que simbolizan ligereza y renovación. Ideal para acompañar tu estilo diario o sorprender con un detalle especial.',
    description: 'Set completo en contraste negro con delicados dijes de mariposa que simbolizan ligereza. Ideal para acompañar tu estilo diario.',
    imagen: './assets/images/productos/set-au08-mariposas-negro-modelo.webp',
    disponible: true,
    whatsappMessage: '¡Hola Áurea by Siu! Deseo pedir el *Set de Pulseras Mariposas Negro (AU08)* por *$12.00 USD*.',
    media: {
      mainImage: './assets/images/productos/set-au08-mariposas-negro-modelo.webp',
      modelImage: './assets/images/productos/set-au08-mariposas-negro-modelo.webp',
      boxImage: './assets/images/productos/set-au08-mariposas-negro-modelo.webp',
      mainCaption: 'Set de Pulseras Mariposas Negro (AU08) · $12.00 USD',
      modelCaption: 'Detalles de mariposa sobre diseño ajustable',
      boxCaption: 'Empaque protector individual'
    },
    includesBox: false
  },
  {
    id: 'AU11',
    name: 'Pulsera Ajustable con Detalles Dorados',
    category: 'Pulseras Artesanales',
    price: 6.00,
    priceUnit: 'c/u',
    promoBadge: 'AU11 · $6.00 USD c/u',
    tagline: 'Cordón fino regulable con detalles dorados y cierre deslizante práctico.',
    designStory: 'Pulsera individual de cordón fino resistente con acabado limpio, cierre deslizante adaptable a cualquier muñeca y delicados acentos en tono dorado (valor por unidad).',
    description: 'Pulsera individual de cordón fino resistente con cierre deslizante adaptable y delicados acentos en tono dorado. Elige tu modelo o color favorito (precio por pieza).',
    variantPrompt: 'Modelo / Color deseado',
    imagen: './assets/images/productos/pulsera-au11-ajustables-variadas.webp',
    disponible: true,
    whatsappMessage: '¡Hola Áurea by Siu! Deseo pedir la *Pulsera Ajustable con Detalles Dorados (AU11)* por *$6.00 USD c/u*.',
    media: {
      mainImage: './assets/images/productos/pulsera-au11-ajustables-variadas.webp',
      modelImage: './assets/images/productos/pulsera-au11-ajustables-variadas.webp',
      boxImage: './assets/images/productos/pulsera-au11-ajustables-variadas.webp',
      mainCaption: 'Pulsera Ajustable con Detalles Dorados (AU11) · $6.00 USD c/u',
      modelCaption: 'Cordón fino cómodo con cierre corredizo práctico',
      boxCaption: 'Empaque protector listo para obsequio'
    },
    includesBox: false
  },
  {
    id: 'AU09',
    name: 'Pulsera Cordón Dorado con Dije',
    category: 'Pulseras Artesanales',
    price: 5.00,
    priceUnit: 'c/u',
    promoBadge: 'AU09 · $5.00 USD c/u',
    tagline: 'Cordón satinado dorado con extensión graduable y dije a elección.',
    designStory: 'Pulsera individual en cordón satinado dorado suave, ligero y cómodo, con cadena de extensión ajustable y dije central a elección entre clave de sol, gatito o virgen (valor por unidad).',
    description: 'Pulsera individual de cordón satinado dorado suave con extensión ajustable y dije a elección: clave de sol, gatito o virgen (precio por pieza).',
    variantPrompt: 'Dije deseado (Clave de Sol, Gatito o Virgencita)',
    optionsName: 'Elige tu Dije',
    options: [
      { name: 'Clave de Sol', detail: 'Símbolo de música y armonía' },
      { name: 'Gatito', detail: 'Detalle tierno de compañía' },
      { name: 'Virgencita', detail: 'Símbolo de fe y cuidado' }
    ],
    imagen: './assets/images/productos/pulsera-au09-cordon-dorado-dijes.webp',
    disponible: true,
    whatsappMessage: '¡Hola Áurea by Siu! Deseo pedir la *Pulsera Cordón Dorado con Dije (AU09)* por *$5.00 USD c/u*.',
    media: {
      mainImage: './assets/images/productos/pulsera-au09-cordon-dorado-dijes.webp',
      modelImage: './assets/images/productos/pulsera-au09-cordon-dorado-dijes.webp',
      boxImage: './assets/images/productos/pulsera-au09-cordon-dorado-dijes.webp',
      mainCaption: 'Pulsera Cordón Dorado con Dije (AU09) · $5.00 USD c/u',
      modelCaption: 'Cordón satinado suave con cierre ajustable',
      boxCaption: 'Empaque protector listo para obsequio'
    },
    includesBox: false
  },
  {
    id: 'AU10',
    name: 'Pulsera Macramé Negro con Dije',
    category: 'Pulseras Artesanales',
    price: 5.00,
    priceUnit: 'c/u',
    promoBadge: 'AU10 · $5.00 USD c/u',
    tagline: 'Hilo negro tejido en macramé con balines dorados y dije central.',
    designStory: 'Pulsera individual en hilo negro macramé con balines dorados y dije central con microcirconias. Una pieza sobria con significado sereno para usar o regalar (valor por unidad).',
    description: 'Pulsera individual de hilo negro en macramé con balines dorados y dije central con microcirconias. Indica el dije de tu preferencia (precio por pieza).',
    variantPrompt: 'Dije deseado',
    imagen: './assets/images/productos/pulsera-au10-macrame-negro-arbol.webp',
    disponible: true,
    whatsappMessage: '¡Hola Áurea by Siu! Deseo pedir la *Pulsera Macramé Negro con Dije (AU10)* por *$5.00 USD c/u*.',
    media: {
      mainImage: './assets/images/productos/pulsera-au10-macrame-negro-arbol.webp',
      modelImage: './assets/images/productos/pulsera-au10-macrame-negro-arbol.webp',
      boxImage: './assets/images/productos/pulsera-au10-macrame-negro-arbol.webp',
      mainCaption: 'Pulsera Macramé Negro con Dije (AU10) · $5.00 USD c/u',
      modelCaption: 'Nudo macramé ajustable con balines dorados',
      boxCaption: 'Empaque protector individual'
    },
    includesBox: false
  },
  {
    id: 'AU12',
    name: 'Pulsera Cordón Regulable con Dije',
    category: 'Pulseras Artesanales',
    price: 5.00,
    priceUnit: 'c/u',
    promoBadge: 'AU12 · $5.00 USD c/u',
    tagline: 'Cordón liso de alta resistencia con nudo corredizo y detalle central dorado.',
    designStory: 'Pulsera individual elaborada con cordón liso de tacto suave y alta resistencia, nudo corredizo práctico para ajustar a tu medida y dije central en tono dorado (valor por unidad).',
    description: 'Pulsera individual de cordón liso resistente con nudo corredizo práctico y dije central en tono dorado. Cómoda para acompañar tu rutina (precio por pieza).',
    variantPrompt: 'Dije deseado',
    imagen: './assets/images/productos/pulsera-au12-cordon-artesanal.webp',
    disponible: true,
    whatsappMessage: '¡Hola Áurea by Siu! Deseo pedir la *Pulsera Cordón Regulable con Dije (AU12)* por *$5.00 USD c/u*.',
    media: {
      mainImage: './assets/images/productos/pulsera-au12-cordon-artesanal.webp',
      modelImage: './assets/images/productos/pulsera-au12-cordon-artesanal.webp',
      boxImage: './assets/images/productos/pulsera-au12-cordon-artesanal.webp',
      mainCaption: 'Pulsera Cordón Regulable con Dije (AU12) · $5.00 USD c/u',
      modelCaption: 'Nudo corredizo ligero y práctico de ajustar',
      boxCaption: 'Empaque protector listo para obsequio'
    },
    includesBox: false
  }
];
