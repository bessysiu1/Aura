export interface Product {
  id: string;
  name: string;
  category: 'duos' | 'baguette' | 'moda' | 'cordon' | 'sets';
  price: number;
  originalPrice?: number;
  promoBadge?: string;
  tagline: string;
  designStory: string; // Explicación enganchadora del diseño para conectar con el público
  description: string;
  features: string[];
  optionsName?: string;
  options?: { name: string; colorCode?: string; detail?: string }[];
  whatsappMessage: string;
  media: {
    mainImage: string;       // Imagen original del producto / catálogo
    modelImage: string;      // Foto de la modelo luciendo la pieza
    boxImage: string;        // Foto de la respectiva caja de joyería
    mainCaption: string;
    modelCaption: string;
    boxCaption: string;
  };
  includesBox?: boolean;
}

// 🌟 GALERÍA 1: FOTO PRINCIPAL DE PORTADA / HERO DEL INICIO (100% Desvinculada)
export const HERO_CONFIG = {
  id: 'hero_portada',
  title: 'Juego de 2 Pulseras "Elegancia en Cada Detalle"',
  tagline: 'Estilo, fuerza y buena energía ♡',
  price: 15.00,
  originalPrice: 24.00,
  promoBadge: '🔥 PRODUCTO ESTRELLA $15 EL JUEGO',
  defaultImage: '/images/hero-principal.jpg',
  defaultModelImage: '/images/hero-modelo.jpg',
  defaultBoxImage: '/images/hero-caja.jpg',
  mainCaption: 'Fotografía de portada principal de la tienda Áurea Joyería ($15 USD)',
  modelCaption: 'Modelo luciendo el juego de pulseras en muñeca',
  boxCaption: 'Caja rígida azul marino de joyería con almohadilla'
};

// ⭐ GALERÍA 2: SECCIÓN MODELOS DESTACADAS (100% Desvinculadas del Catálogo y de la Portada)
export const DESTACADOS_CONFIG = {
  duo: {
    slotPrefix: 'destacado_duo',
    name: 'Juego de 2 Pulseras "Elegancia en Cada Detalle" (Sección Destacada)',
    defaultMain: '/images/destacado-duo-principal.jpg',
    defaultModel: '/images/destacado-duo-modelo.jpg',
    defaultBox: '/images/destacado-duo-caja.jpg',
    mainCaption: 'Fotografía destacada del Dúo Elegancia en fondo neutro ($15 USD)',
    modelCaption: 'Modelo luciendo las dos pulseras en muñeca con blazer de noche',
    boxCaption: 'Caja rígida azul marino de joyería con terciopelo interior'
  },
  stack: {
    slotPrefix: 'destacado_stack',
    name: 'Dúos Stacking en Muñeca (Sección Destacada)',
    defaultMain: '/images/destacado-stack-principal.jpg',
    defaultModel: '/images/destacado-stack-modelo.jpg',
    defaultBox: '/images/destacado-stack-caja.jpg',
    mainCaption: 'Combinación en tendencia: pulsera baguette con cordón amuleto ($15 USD)',
    modelCaption: 'Tres combinaciones reales de stacking lucidas en muñeca',
    boxCaption: 'Caja acolchada de presentación lista para obsequio'
  }
};

// 🏷️ GALERÍA 3: BANNER PROMOCIONAL DÚO $15 USD (100% Desvinculada)
export const BANNER_CONFIG = {
  slotKey: 'banner_promo_main',
  defaultImage: '/images/banner-promo-duo.jpg',
  defaultFilename: 'banner-promo-duo.jpg',
  caption: 'Fotografía promocional con la modelo en muñeca y su caja respectiva de joyería ($15 USD)'
};

// 🛍️ GALERÍA 4: CATÁLOGO COMPLETO DE PRODUCTOS (Cada uno con sus 3 ranuras independientes)
export const PRODUCTS_CATALOG: Product[] = [
  {
    id: 'juego-duo-10',
    name: 'Juego de 2 Pulseras "Elegancia en Cada Detalle"',
    category: 'duos',
    price: 15.00,
    originalPrice: 24.00,
    promoBadge: '🔥 PRODUCTO ESTRELLA $15 EL JUEGO',
    tagline: 'Estilo, fuerza y buena energía ♡',
    designStory: 'El trébol de cuatro hojas es el amuleto universal de la fortuna y la protección. Creamos este dúo para la mujer que busca un look refinado sin complicaciones: equilibra el fulgor nítido de los cristales baguette rectangulares con la serenidad de las cuentas de ónix negro y su dije con borde perlado en tono dorado brillante. Es un juego armónico que estiliza la muñeca, combina con cualquier atuendo (desde oficina hasta salidas de noche) y proyecta seguridad en ti misma.',
    description: 'Nuestra oferta más pedida en Ecuador: incluye 2 pulseras completas para usar juntas en sofisticado stacking o por separado. Una pulsera de cristales baguette negros azabache con montura en tono dorado y cierre corredizo ajustable, acompañada de la pulsera de cuentas de ónix negro con dije de trébol de cuatro hojas en fino acabado dorado.',
    features: [
      '2 pulseras completas diseñadas para lucir en conjunto o individuales',
      'Cristales baguette negros con montura y terminales en tono dorado resplandeciente',
      'Dije de trébol de cuatro hojas con borde perlado de estilo alta gama',
      'Cuentas esféricas de ónix en contraste pulido que aportan textura y presencia',
      'Broche corredizo tipo bolo que se ajusta cómodamente a cualquier muñeca',
      'Estructura hipoalergénica con acabado protector de alta durabilidad'
    ],
    optionsName: 'Presentación del Pedido',
    options: [
      { name: 'Empaque Estándar en bolsita de organza', detail: '$15.00 USD' },
      { name: 'Con Caja Rígida de Joyería de Lujo Azul Marino', detail: '+$3.00 ($18.00 USD total)' }
    ],
    whatsappMessage: 'Hola Áurea Joyería! Deseo pedir el *Juego de 2 Pulseras Elegancia por $15 USD* que vi en su página web.',
    media: {
      mainImage: '/images/catalogo-juego-duo-10-principal.jpg',
      modelImage: '/images/catalogo-juego-duo-10-modelo.jpg',
      boxImage: '/images/catalogo-juego-duo-10-caja.jpg',
      mainCaption: 'Fotografía de producto: Dúo de 2 pulseras en tono dorado con dije de trébol y cristales ($15 USD)',
      modelCaption: 'Modelo luciendo el juego de pulseras en muñeca con blazer negro de noche',
      boxCaption: 'Caja rígida de joyería azul marino de terciopelo con almohadilla de protección'
    },
    includesBox: true
  },
  {
    id: 'stack-muneca-combos',
    name: 'Dúos Stacking en Muñeca (Baguette + Cordón Amuletos)',
    category: 'duos',
    price: 15.00,
    originalPrice: 22.00,
    promoBadge: '✨ COMBINACIÓN EN TENDENCIA $15',
    tagline: 'El contraste perfecto entre el brillo del cristal y la nobleza del cordón',
    designStory: 'El "stacking" o capas de pulseras es la tendencia de moda más fuerte del momento. Esta propuesta fusiona dos estilos: la geometría de los cristales baguette que captan cada haz de luz, junto a la calidez del cordón artesanal con dijes de alta carga simbólica (el Árbol de la Vida que representa raíces y crecimiento, o la medalla de San Benito para protección espiritual). Un detalle distintivo que atrae todas las miradas a tus manos.',
    description: 'Juego de 2 piezas diseñado tal como lo lucen nuestras modelos en fotografía: 1 pulsera baguette en tu tono favorito coordinada con 1 pulsera de cordón fino trenzado con dije central sagrado o conmemorativo en tono dorado pulido.',
    features: [
      'Stack Rosa: Baguette Rosa Pastel + Cordón Rosa con Árbol de la Vida en nácar blanco',
      'Stack Negro: Baguette Negra Ónix + Cordón Negro con Medalla de San Benito Protectora',
      'Stack Tricolor: Baguette Multicolor + Cordón Blanco con Placa Bandera de Ecuador',
      'Herrajes y terminales en tono dorado pulido resistentes al uso diario',
      'Cordón impermeable suave que no causa alergias ni destiñe'
    ],
    optionsName: 'Selecciona tu Combinación de Muñeca',
    options: [
      { name: 'Stack Rosa (Baguette Rosa + Árbol de la Vida Nácar)', detail: 'Romántica, delicada y luminosa' },
      { name: 'Stack Negro (Baguette Negra + San Benito Protector)', detail: 'Elegancia sobria y amuleto de fuerza' },
      { name: 'Stack Tricolor (Baguette Multicolor + Bandera Ecuador)', detail: 'Identidad y orgullo patrio ecuatoriano' }
    ],
    whatsappMessage: 'Hola Áurea Joyería! Deseo pedir el *Dúo Stacking en Muñeca ($15.00 USD)*.',
    media: {
      mainImage: '/images/catalogo-stack-muneca-combos-principal.jpg',
      modelImage: '/images/catalogo-stack-muneca-combos-modelo.jpg',
      boxImage: '/images/catalogo-stack-muneca-combos-caja.jpg',
      mainCaption: 'Fotografía en muñeca: Modelo combinando pulsera baguette con dije del Árbol de la Vida ($15 USD)',
      modelCaption: 'Tres opciones reales de stacking lucidas en piel con pulseras ajustadas',
      boxCaption: 'Presentación en caja de joyería acolchada lista para obsequio'
    },
    includesBox: true
  },
  {
    id: 'pulseras-baguette-tenis',
    name: 'Pulsera Baguette Cristales Facetados Tenis (8 Tonos)',
    category: 'baguette',
    price: 8.50,
    originalPrice: 14.00,
    promoBadge: '💎 8 COLORES EN STOCK',
    tagline: 'Brillo geométrico moderno con broche corredizo adaptable',
    designStory: 'Inspirada en el corte rectangular baguette de la joyería contemporánea. Cada piedra ha sido facetada con precisión milimétrica para ofrecer un destello limpio y multidimensional que no pasa desapercibido. Su montura en tono dorado resalta el color vibrante de las gemas, mientras que su cadenita deslizable asegura que se adapte con total naturalidad a la anatomía de tu muñeca.',
    description: 'Pulsera tenis con hilera continua de cristales rectangulares corte baguette engastados sobre una delicada montura en tono dorado pulido. Cuenta con terminales de gota dorada y esfera deslizable con silicona interna que garantiza una sujeción firme y confortable.',
    features: [
      '8 tonalidades de gemas facetadas para que elijas la que refleje tu personalidad',
      'Cierre bolo deslizable tipo macramé metálico: se adapta de 14 a 22 cm de muñeca',
      'Montura en tonalidad dorada brillante con sellado protector antideslustre',
      'Acabado hipoalergénico que no irrita la piel ni causa manchas oscuras',
      'Perfecta para llevar sola o combinada con tu reloj de pulsera'
    ],
    optionsName: 'Elige tu tono de cristal favorito',
    options: [
      { name: 'Verde Esmeralda', colorCode: '#059669', detail: 'Tono joya noble, profundo y elegante' },
      { name: 'Negro Ónix', colorCode: '#18181b', detail: 'Elegancia clásica, sobria y versátil' },
      { name: 'Multicolor Arcoíris', colorCode: '#f59e0b', detail: 'Secuencia de gemas en degradé vibrante' },
      { name: 'Rosa Cuarzo Pastel', colorCode: '#f472b6', detail: 'Delicada, romántica y dulce' },
      { name: 'Rojo Rubí', colorCode: '#dc2626', detail: 'Intenso, apasionado y seductor' },
      { name: 'Azul Turquesa', colorCode: '#06b6d4', detail: 'Fresco, veraniego y juvenil' },
      { name: 'Azul Zafiro Profundo', colorCode: '#1d4ed8', detail: 'Azul noche con brillo majestuoso' },
      { name: 'Cristal Blanco Diamante', colorCode: '#e2e8f0', detail: 'Transparente con destellos cristalinos prisma' }
    ],
    whatsappMessage: 'Hola Áurea Joyería! Me interesa la *Pulsera Baguette Cristales Facetados* ($8.50 USD). Deseo el color: ',
    media: {
      mainImage: '/images/catalogo-pulseras-baguette-tenis-principal.jpg',
      modelImage: '/images/catalogo-pulseras-baguette-tenis-modelo.jpg',
      boxImage: '/images/catalogo-pulseras-baguette-tenis-caja.jpg',
      mainCaption: 'Exhibidor de terciopelo con los 8 colores reales de cristales baguette en tono dorado',
      modelCaption: 'Exhibidor en rollo de terciopelo con la gama completa de tonalidades',
      boxCaption: 'Estuche de joyería individual para proteger y regalar tu pulsera'
    },
    includesBox: false
  },
  {
    id: 'coleccion-pulseras-moda-6',
    name: 'Dúo de Pulseras "Rojo Rubí & Cuentas Doradas de Autor"',
    category: 'duos',
    price: 15.00,
    originalPrice: 24.00,
    promoBadge: '✨ DÚO RUBÍ GLAMOUR $15',
    tagline: 'Brillo baguette rojo rubí y cuentas artesanales lucidas con distinción',
    designStory: 'Inspirado en el magnetismo y calidez del color rubí. Este dúo exclusivo combina el fulgor nítido de los cristales baguette facetados en tono carmesí engastados en carril dorado, con una segunda pulsera de cuentas cilíndricas blancas y esferas doradas antialérgicas. En la fotografía real, nuestra modelo muestra cómo este juego viste la muñeca con una prestancia inigualable, ideal para combinar con prendas en tonos neutros o vestidos elegantes.',
    description: 'Juego de 2 pulseras completas para usar juntas o independientes: 1 pulsera de cristales baguette facetados color rojo rubí con montura dorada y cierre ajustable, más 1 pulsera de cuentas artesanales con esferas en tono dorado pulido.',
    features: [
      '2 pulseras completas de diseño exclusivo en tono dorado brillante',
      'Cristales facetados corte baguette rectangular color rojo rubí de alta luminosidad',
      'Pulsera complementaria con cuentas cilíndricas marfil y esferas doradas',
      'Broche deslizable tipo bolo adaptable a cualquier medida de muñeca',
      'Acabado hipoalergénico resistente al agua y al uso diario',
      'Fotografía real tomada con modelo luciendo el juego de pulseras en muñeca'
    ],
    optionsName: 'Presentación del Pedido',
    options: [
      { name: 'Dúo Rojo Rubí & Cuentas (Empaque Estándar)', detail: '$15.00 USD' },
      { name: 'Con Caja Rígida de Joyería de Lujo Azul Marino', detail: '+$3.00 ($18.00 USD total)' }
    ],
    whatsappMessage: 'Hola Áurea Joyería! Deseo encargar el *Dúo de Pulseras Rojo Rubí & Cuentas de Autor por $15 USD*.',
    media: {
      mainImage: '/images/catalogo-coleccion-pulseras-moda-6-principal.jpg',
      modelImage: '/images/catalogo-coleccion-pulseras-moda-6-principal.jpg',
      boxImage: '/images/catalogo-coleccion-pulseras-moda-6-caja.jpg',
      mainCaption: 'Fotografía oficial de la modelo luciendo el Dúo Rojo Rubí ($15 USD)',
      modelCaption: 'Modelo luciendo el juego de pulseras en muñeca sobre prenda marfil',
      boxCaption: 'Caja de joyería disponible para presentar tu dúo listo para obsequio'
    },
    includesBox: false
  },
  {
    id: 'coleccion-patriotica-cordon',
    name: 'Dúo de Pulseras "Corazón Dorado & Cristales Baguette Azul Petróleo"',
    category: 'duos',
    price: 15.00,
    originalPrice: 24.00,
    promoBadge: '💖 DÚO CORAZÓN & ZAFIRO $15',
    tagline: 'El encanto del corazón dorado liso junto al resplandor baguette zafiro',
    designStory: 'El corazón liso abombado en tono dorado pulido es el homenaje definitivo al amor propio y los afectos genuinos. Este juego combina una pulsera continua de cristales baguette rectangulares en tono azul petróleo / zafiro majestuoso, con una segunda pulsera de cristales transparentes bicónicos facetados con cuentas y dije central de corazón con acabado espejo. Su broche bolo regulable garantiza un ajuste sedoso y seguro.',
    description: 'Juego de 2 pulseras en tonalidad dorada y azul zafiro: incluye pulsera tenis de cristales baguette y pulsera de cristales transparentes con dije central de corazón abombado en fino acabado dorado.',
    features: [
      '2 pulseras completas diseñadas para lucir en combinación o individuales',
      'Dije central de corazón dorado pulido con acabado espejo impecable',
      'Hilera de cristales rectangulares corte baguette en tono azul zafiro / petróleo',
      'Pulsera con cuentas de cristal bicónico transparente de destello prismático',
      'Cierre corredizo ajustable bolo con esferas colgantes',
      'Material hipoalergénico de alta durabilidad sin deslustre'
    ],
    optionsName: 'Presentación del Pedido',
    options: [
      { name: 'Dúo Corazón Dorado & Azul Petróleo (Empaque Estándar)', detail: '$15.00 USD' },
      { name: 'Con Caja Rígida de Joyería de Lujo Azul Marino', detail: '+$3.00 ($18.00 USD total)' }
    ],
    whatsappMessage: 'Hola Áurea Joyería! Deseo encargar el *Dúo de Pulseras Corazón Dorado & Baguette Azul Petróleo por $15 USD*.',
    media: {
      mainImage: '/images/catalogo-coleccion-patriotica-cordon-principal.jpg',
      modelImage: '/images/catalogo-coleccion-patriotica-cordon-modelo.jpg',
      boxImage: '/images/catalogo-coleccion-patriotica-cordon-caja.jpg',
      mainCaption: 'Fotografía de producto: Dúo de pulseras baguette azul zafiro con pulsera y dije de corazón dorado ($15 USD)',
      modelCaption: 'Detalle del juego de pulseras y su dije de corazón pulido',
      boxCaption: 'Presentación en caja rígida de joyería con almohadilla interior'
    },
    includesBox: false
  },
  {
    id: 'set-regalo-lujo-caja',
    name: 'Juego de Joyería de Lujo: Collar con Pulsera y Aritos (Con Caja de Regalo)',
    category: 'sets',
    price: 20.00,
    originalPrice: 32.00,
    promoBadge: '👑 SET TRÍO $20 CON CAJA DE LUJO',
    tagline: 'Collar con dije, pulsera y aritos a juego presentados en caja rígida de lujo',
    designStory: 'La trilogía de elegancia más completa y solicitada. Creada para mujeres que aprecian la armonía perfecta entre sus accesorios: un delicado collar con dije central, su respectiva pulsera a juego y aritos / aretes en acabado dorado de alta gama que enmarcan el rostro con luminosidad. Incluye nuestra icónica caja rígida azul marino AURA LUXE acolchada con terciopelo blanco y almohadilla de fijación, lista para entregar como un regalo inolvidable.',
    description: 'Conjunto completo de 3 piezas de joyería fina presentado en su respectiva caja de lujo: incluye collar con dije en tono dorado, pulsera a juego y un par de aritos elegantes, listos para regalar o estrenar en ocasiones especiales.',
    features: [
      'Set completo de 3 piezas: 1 Collar con dije + 1 Pulsera a juego + 1 Par de Aritos',
      'Incluye Caja Rígida de Joyería de Lujo Azul Marino AURA LUXE con interior de terciopelo',
      'Diseño integral coordinado para lucir en armonía total',
      'Acabado en tono dorado pulido brillante hipoalergénico de larga duración',
      'Broches seguros y ajustables cómodos para todo tipo de cuello y muñeca',
      'La mejor relación valor-precio: 3 piezas de alta gama por solo $20 USD'
    ],
    optionsName: 'Elige la variante de tu Set Trío',
    options: [
      { name: 'Set Trío Trébol de la Fortuna Ónix (Collar + Pulsera + Aritos + Caja)', detail: '$20.00 USD' },
      { name: 'Set Trío Corazón Dorado & Cristales (Collar + Pulsera + Aritos + Caja)', detail: '$20.00 USD' },
      { name: 'Set Trío Baguette Esmeralda Nobleza (Collar + Pulsera + Aritos + Caja)', detail: '$20.00 USD' }
    ],
    whatsappMessage: 'Hola Áurea Joyería! Me interesa el *Juego de Joyería de Lujo: Collar con Pulsera y Aritos por $20 USD (con Caja de Regalo)*.',
    media: {
      mainImage: '/images/catalogo-set-regalo-lujo-caja-principal.jpg',
      modelImage: '/images/catalogo-set-regalo-lujo-caja-modelo.jpg',
      boxImage: '/images/catalogo-set-regalo-lujo-caja-caja.jpg',
      mainCaption: 'Caja rígida azul marino AURA LUXE con el conjunto de joyería sobre almohadilla de terciopelo ($20 USD)',
      modelCaption: 'Modelo luciendo el conjunto de joyería en cuello, muñeca y aritos a juego',
      boxCaption: 'Estuche de presentación rígido con acabado aterciopelado listo para obsequio'
    },
    includesBox: true
  }
];
