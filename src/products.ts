export interface Product {
  id: string;
  name: string;
  category: 'duos' | 'baguette' | 'moda' | 'cordon' | 'personalizados';
  price: number;
  originalPrice?: number;
  promoBadge?: string;
  tagline: string;
  description: string;
  features: string[];
  image: string;
  secondaryImage?: string;
  optionsName?: string;
  options?: { name: string; colorCode?: string; detail?: string }[];
  whatsappMessage: string;
}

export const PRODUCTS_CATALOG: Product[] = [
  {
    id: 'juego-duo-10',
    name: 'Juego de 2 Pulseras Elegancia (Dúo Estrella)',
    category: 'duos',
    price: 10.00,
    originalPrice: 16.00,
    promoBadge: '🔥 SOLO $10 EL JUEGO',
    tagline: 'Estilo, fuerza y buena energía ♡',
    description: 'Incluye 1 pulsera de cristales baguette negros azabache con montura dorada brillante y cierre deslizable + 1 pulsera de cuentas de ónix negro mate y facetado con el icónico dije de trébol de cuatro hojas estilo Van Cleef con borde perlado dorado.',
    features: [
      'Juego completo de 2 pulseras combinables',
      'Cristales baguette negros azabache de alta refracción',
      'Dije de trébol de cuatro hojas con borde perlado dorado',
      'Cierre corredizo ajustable para cualquier tamaño de muñeca',
      'Opción con caja de regalo azul marino de lujo'
    ],
    image: '/images/promo-duo-10.jpg',
    secondaryImage: '/images/caja-regalo-lujo.jpg',
    optionsName: 'Presentación',
    options: [
      { name: 'Empaque Estándar con bolsita de organza', detail: '$10.00 USD' },
      { name: 'Con Caja Rígida de Regalo Azul Marino', detail: '+$2.50 ($12.50 total)' }
    ],
    whatsappMessage: 'Hola Áurea Joyería! Deseo pedir el *Juego de 2 Pulseras Elegancia (Dúo Estrella)* por solo $10 USD.'
  },
  {
    id: 'pulseras-baguette-tenis',
    name: 'Pulseras Baguette Tenis en 8 Colores',
    category: 'baguette',
    price: 8.50,
    originalPrice: 12.00,
    promoBadge: '✨ 8 Tonos en Stock',
    tagline: 'Gemas facetadas de brillo deslumbrante',
    description: 'Pulsera estilo tenis con hilera continua de cristales rectangulares corte baguette sobre montura dorada. Cuenta con cadena veneciana ajustable con broche bolo deslizable y terminales de gotas de cristal.',
    features: [
      '8 tonalidades vibrantes a elección',
      'Cierre bolo deslizable ultra cómodo',
      'Acabado dorado hipoalergénico resistente',
      'Perfecta para lucir sola o en stacking'
    ],
    image: '/images/baguettes-8-colores.jpg',
    secondaryImage: '/images/duos-muneca-stack.jpg',
    optionsName: 'Elige tu color favorito',
    options: [
      { name: 'Verde Esmeralda', colorCode: '#059669', detail: 'Verde esmeralda sofisticado' },
      { name: 'Negro Ónix', colorCode: '#18181b', detail: 'Elegancia clásica y versátil' },
      { name: 'Multicolor Arcoíris', colorCode: '#f59e0b', detail: 'Degradé de gemas multicolor' },
      { name: 'Rosa Cuarzo Pastel', colorCode: '#f472b6', detail: 'Dulce, femenina y romántica' },
      { name: 'Rojo Rubí', colorCode: '#dc2626', detail: 'Rojo intenso y apasionado' },
      { name: 'Azul Turquesa', colorCode: '#06b6d4', detail: 'Fresco y luminoso' },
      { name: 'Azul Zafiro Profundo', colorCode: '#1d4ed8', detail: 'Azul noche refinado' },
      { name: 'Cristal Diamante Blanco', colorCode: '#e2e8f0', detail: 'Transparente con destellos prisma' }
    ],
    whatsappMessage: 'Hola Áurea Joyería! Me interesa la *Pulsera Baguette Cristales Tenis* ($8.50 USD). Deseo el color: '
  },
  {
    id: 'coleccion-pulseras-moda-6',
    name: 'Pulseras de Moda con Dijes y Símbolos',
    category: 'moda',
    price: 6.00,
    originalPrice: 9.00,
    promoBadge: '💛 $6.00 c/u | Promo 2 x $10',
    tagline: 'Elegancia, fe y estilo en tu día a día',
    description: 'Colección de pulseras finas con cuentas esféricas doradas pulidas y dijes centrales con significado. Diseños con cristales microengastados y símbolos devocionales y de protección.',
    features: [
      'Precio especial: $6.00 cada una o 2 x $10.00',
      'Cierre corredizo ajustable con esferas colgantes',
      'Material de alta calidad y brillo duradero',
      'Ideal para regalar a personas especiales'
    ],
    image: '/images/pulseras-moda-6.jpg',
    optionsName: 'Selecciona tu Modelo',
    options: [
      { name: 'Modelo 1: Mariposa', detail: 'Dije de mariposa colorido con cristales' },
      { name: 'Modelo 2: Virgen María', detail: 'Medalla de la Virgen María de protección y fe' },
      { name: 'Modelo 3: Cruz Minimalista', detail: 'Cruz con brillantes atemporal y elegante' },
      { name: 'Modelo 4: Peace', detail: 'Letras PEACE con microcristales' },
      { name: 'Modelo 5: Cruz de Fe', detail: 'Cruz con detalles calados devocionales' },
      { name: 'Modelo 6: Cruz Elegante', detail: 'Cruz pequeña y delicada' }
    ],
    whatsappMessage: 'Hola Áurea! Deseo ordenar la *Pulsera de Moda de $6.00 USD*. Mi modelo elegido es: '
  },
  {
    id: 'coleccion-patriotica-cordon',
    name: 'Pulseras de Cordón & Edición Orgullo Ecuador',
    category: 'cordon',
    price: 7.00,
    originalPrice: 10.00,
    promoBadge: '🇪🇨 Edición Especial Ecuador',
    tagline: 'Identidad patria, protección y devoción',
    description: 'Pulseras de cordón trenzado de alta resistencia con terminales dorados y piezas centrales esmaltadas a fuego: Placa con la Bandera del Ecuador y Escudo Nacional, Corazón Tricolor con cristales, San Benito o Árbol de la Vida en nácar.',
    features: [
      'Cordón impermeable ultra resistente de tacto suave',
      'Herrajes y terminales en baño de oro de 18k',
      'Esmalte horneado de alta definición que no se descascara',
      'Ajustable para cualquier muñeca'
    ],
    image: '/images/coleccion-ecuador.jpg',
    secondaryImage: '/images/duos-muneca-stack.jpg',
    optionsName: 'Elige tu dije central',
    options: [
      { name: 'Placa Bandera de Ecuador con Escudo Nacional', detail: 'Esmalte tricolor y escudo patrio en oro' },
      { name: 'Corazón Bandera de Ecuador con Cristales', detail: 'Silueta de corazón tricolor con borde brillante' },
      { name: 'Medalla de San Benito Protectora', detail: 'Inscripción sagrada en dorado relieve' },
      { name: 'Árbol de la Vida en Nácar y Cristales', detail: 'Base de nácar blanco con árbol dorado y gemas' },
      { name: 'Corazón con Latido Electrocardiograma', detail: 'Símbolo del latido y vida' },
      { name: 'Corazón Selección Ecuador Fútbol con Balón', detail: 'Para fanáticos de la Tri' },
      { name: 'Silueta Niña / Bebé en Nácar', detail: 'Para mamás orgullosas' }
    ],
    whatsappMessage: 'Hola Áurea Joyería! Me encantó la *Pulsera de Cordón Edición Ecuador ($7.00 USD)* con el dije: '
  },
  {
    id: 'combo-stack-duo-mix',
    name: 'Dúo Stacking en Mano (Baguette + Cordón)',
    category: 'duos',
    price: 13.50,
    originalPrice: 17.50,
    promoBadge: 'Look de Tendencia',
    tagline: 'El contraste perfecto entre cristal y cordón',
    description: 'Luce el estilo visto en nuestras fotografías: combina 1 Pulsera Baguette en tu color favorito con 1 Pulsera de Cordón (Árbol de la Vida, San Benito o Bandera de Ecuador).',
    features: [
      'Look moderno listo para combinar',
      'Ahorra llevando el combo completo',
      'El regalo más pedido de nuestra tienda'
    ],
    image: '/images/duos-muneca-stack.jpg',
    optionsName: 'Combinación recomendada',
    options: [
      { name: 'Stack Rosa (Baguette Rosa + Árbol de la Vida)', detail: 'Romántica y dulce' },
      { name: 'Stack Black Gold (Baguette Negro + San Benito)', detail: 'Elegancia sobria y protección' },
      { name: 'Stack Tricolor (Baguette Multicolor + Bandera Ecuador)', detail: 'Vibrante y patriótico' }
    ],
    whatsappMessage: 'Hola Áurea! Deseo pedir el *Dúo Stacking Mix & Match ($13.50 USD)* en la combinación: '
  },
  {
    id: 'caja-regalo-lujo-presentacion',
    name: 'Presentación en Caja de Regalo de Lujo',
    category: 'duos',
    price: 12.50,
    originalPrice: 18.00,
    promoBadge: '🎁 Lista para Regalo',
    tagline: 'La experiencia de desempaque perfecta',
    description: 'El Juego de 2 Pulseras Elegancia acondicionado en estuche rígido azul marino profundo con almohadilla de terciopelo blanco, bolsa de regalo y tarjeta de dedicatoria.',
    features: [
      'Estuche rígido azul noche de alta resistencia',
      'Inserto acolchado para exhibición de pulseras',
      'Pañito de limpieza para joyería dorada',
      'Tarjeta personalizada para dedicatoria'
    ],
    image: '/images/caja-regalo-lujo.jpg',
    whatsappMessage: 'Hola Áurea! Deseo pedir el *Juego de Pulseras en Caja de Regalo de Lujo ($12.50 USD)*.'
  }
];
