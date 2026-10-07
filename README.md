# Áurea | Bisutería Fina y Personalizada en Ecuador 🇪🇨✨

Sitio web y catálogo digital para marca de bisutería de autor, pulseras de moda y accesorios personalizados en Ecuador, con integración directa de pedidos por **WhatsApp (+593 988 691 800)** y envíos nacionales asegurados a través de **Servientrega**.

---

## 🌟 Características Principales

- **Diseño Móvil Primero (Mobile-First)**: Optimizado para celulares, tablets y computadoras con paleta de lujo en tonos marfil, blanco cálido y dorado oro 18K (`#C59B2D` / `#D4AF37`).
- **Productos Reales Destacados**:
  - **Juego de 2 Pulseras Elegancia (Dúo Estrella)** a solo **$10 USD**: Pulsera Baguette de cristales negros + Pulsera de cuentas de ónix con dije de trébol Van Cleef de cuatro hojas.
  - **Colección Baguette Tenis en 8 Tonos ($8.50 USD)**: Verde Esmeralda, Negro Ónix, Multicolor Arcoíris, Rosa Cuarzo, Rojo Rubí, Azul Turquesa, Azul Zafiro y Diamante Blanco con cierre deslizable.
  - **Colección Pulseras de Moda ($6.00 c/u o 2 x $10)**: Mariposa, Virgen María, Cruz Minimalista, Peace, Cruz de Fe y Cruz Elegante.
  - **Colección Patriótica Ecuador & Cordón Artesanal ($7.00 USD)**: Placa esmaltada con la Bandera de Ecuador y Escudo Nacional, San Benito y Árbol de la Vida en nácar.
  - **Gargantillas y Dijes Grabados a Láser**: Personalizados con iniciales y nombres.
- **Simulador de Grabado en Vivo**: Permite al cliente escribir su inicial/nombre, elegir tipografía (Serif, Sans, Cursiva) y generar un mensaje listo para ordenar por WhatsApp.
- **Carrito de Cotización / Lista de Pedido**: Permite a los clientes seleccionar múltiples piezas y generar un mensaje ordenado de cotización para WhatsApp.
- **Confianza para el Mercado Ecuatoriano**: Métodos de pago populares (Banco Pichincha, Deuna, Banco Guayaquil, Produbanco, Tarjetas) y envíos con Servientrega.

---

## 🚀 Cómo Exportar y Publicar en GitHub

### Paso 1: Crear tu repositorio en GitHub
1. Ingresa a [github.com](https://github.com) e inicia sesión con tu cuenta.
2. Haz clic en el botón verde **"New"** (Nuevo repositorio).
3. Nombra tu repositorio, por ejemplo: `aurea-bisuteria-ecuador`.
4. Selecciónalo como **Público** y **NO marques** la opción de inicializar con README (ya tenemos todo listo aquí).
5. Haz clic en **"Create repository"**.

### Paso 2: Conectar y subir tus archivos
Abre tu terminal en la carpeta del proyecto y ejecuta los siguientes comandos:

```bash
# 1. Configurar tu usuario de Git (si es la primera vez)
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@gmail.com"

# 2. Agregar la URL de tu repositorio de GitHub recién creado
git remote add origin https://github.com/TU_USUARIO/aurea-bisuteria-ecuador.git

# 3. Renombrar la rama a main y subir el código
git branch -M main
git push -u origin main
```

*(O si utilizas el asistente de Google AI Studio, puedes hacer clic directamente en el botón superior **"Export to GitHub"**).*

---

## 🌐 Cómo Publicar Gratis en Internet (1-Clic)

Elige cualquiera de estas 3 opciones gratuitas para tener tu tienda online activa con tu propio enlace:

### Opción A: Vercel (Recomendada, rápida y automática)
1. Ve a [vercel.com](https://vercel.com) y conecta tu cuenta de GitHub.
2. Haz clic en **"Add New Project"** e importa tu repositorio `aurea-bisuteria-ecuador`.
3. Vercel detectará automáticamente que es un proyecto **Vite**. Haz clic en **"Deploy"**.
4. ¡En menos de 1 minuto tendrás tu enlace público gratis (ejemplo: `aurea-bisuteria.vercel.app`)!

### Opción B: Netlify
1. Ve a [netlify.com](https://netlify.com) y selecciona **"Add new site" > "Import an existing project"**.
2. Conéctalo con tu GitHub y presiona **"Deploy"**.

### Opción C: GitHub Pages (Ya viene configurado en `.github/workflows/deploy.yml`)
1. En tu repositorio de GitHub, ve a **Settings** > **Pages**.
2. En la sección **Build and deployment**, cambia la fuente a **GitHub Actions**.
3. Cada vez que hagas `git push`, tu web se publicará automáticamente en `https://tu-usuario.github.io/aurea-bisuteria-ecuador/`.

---

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo en http://localhost:3000
npm run dev

# Generar versión optimizada para producción en /dist
npm run build
```

---

## 📱 Cambiar Datos de Contacto o Precios

- **Número de WhatsApp**: Puedes cambiar el número en `src/App.tsx` en la constante `WHATSAPP_NUMBER = '593988691800'`.
- **Productos y Precios**: Edita fácilmente los textos, promociones y valores en `src/products.ts`.
- **Archivo independiente único**: En la raíz encuentras también `landing-page-completa.html`, el cual puedes abrir con doble clic en cualquier navegador sin instalar nada.
