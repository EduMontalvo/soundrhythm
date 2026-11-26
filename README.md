# 🎵 SoundRhythm

Reproductor web de emisoras de radio en vivo de Perú con estética de tornamesa clásica y controles estilo DJ. Construido con **React 19**, **TypeScript**, **Tailwind CSS v4** y **Zustand**.

---

## ✨ Características principales

- **Tocadiscos interactivo (`TurntablePlayer`)**: Disco de vinilo animado con la carátula de la emisora activa y brazo mecánico que reacciona al estado de reproducción.
- **Fader de volumen estilo DJ (`VolumeFader`)**: Control vertical táctil (compatible con ratón, teclado, rueda del mouse y pantallas móviles) sincronizado en tiempo real con el reproductor inferior.
- **Reproductor persistente (`MusicPlayer`)**: Barra inferior fija que mantiene la reproducción continua mientras navegas entre vistas, con controles de play/pausa, anterior/siguiente, botón de **radio aleatoria**, favoritos, control de volumen, visualizador de ecualizador y estados de conexión.
- **Carrusel de favoritas (`Slider`)**: Muestra tus emisoras guardadas en el navegador (`localStorage`) y utiliza las más votadas como respaldo inicial.
- **Descubrimiento y búsqueda (`ListRadios` + `SearchBar`)**:
  - Búsqueda en tiempo real con debounce.
  - Filtros dinámicos por etiquetas musicales (`#tags`) y ordenamiento por votos o alfabético (`A – Z`).
  - Carga progresiva de tarjetas para mantener la interfaz fluida.
- **Filtrado inteligente de emisoras**: Descarta flujos rotos o incompatibles (como streams HLS `.m3u8` o contenido mixto `http://` en HTTPS) y elimina automáticamente de la lista las emisoras que fallen o excedan el tiempo de conexión.
- **Vistas dedicadas**: Páginas `Home`, `About` y `Contact` integradas con React Router.

---

## 🛠️ Stack tecnológico

| Categoría | Tecnologías |
| :--- | :--- |
| **Core** | React 19, TypeScript, Vite (`rolldown-vite`) |
| **Estilos** | Tailwind CSS v4 (`@tailwindcss/vite`), Plus Jakarta Sans |
| **Estado y Rutas** | Zustand, React Router DOM |
| **UI y Carrusel** | Embla Carousel (`embla-carousel-react`), React Icons |
| **Datos y Validación** | Axios, Zod, [Radio Browser API](https://www.radio-browser.info/) |

---

## 📁 Estructura del proyecto

```text
src/
├── components/
│   ├── ListRadios.tsx        # Grilla responsiva con paginación progresiva y filtros
│   ├── MusicPlayer.tsx       # Barra de reproducción fija inferior y manejo de audio
│   ├── NavBar.tsx            # Navegación principal responsiva
│   ├── SearchBar.tsx         # Barra de búsqueda con debounce
│   ├── Slider.tsx            # Carrusel Embla conectado a favoritas
│   ├── TurntablePlayer.tsx   # Tocadiscos SVG animado con vinilo y brazo
│   └── VolumeFader.tsx       # Control vertical de volumen estilo DJ
├── Layout/
│   └── Layout.tsx            # Estructura fija (cabecera + contenido + reproductor)
├── schema/
│   └── RadiosSchema.ts       # Esquema Zod para validar respuestas de la API
├── stores/
│   └── useRadioStore.ts      # Estado global (emisoras, reproducción, volumen, favoritas)
├── utils/
│   ├── fetchapi.ts           # Consulta a Radio Browser API (estaciones de Perú)
│   ├── FilterRadio.ts        # Filtrado de streams reproducibles y caché local de caídas
│   └── formatname.ts         # Formateo de nombres largos de emisoras
├── views/
│   ├── Home.tsx              # Vista principal (tocadiscos, carrusel y listado)
│   ├── About.tsx             # Información del proyecto y stack
│   └── Contact.tsx           # Canales directos y formulario mailto
└── router.tsx                # Definición de rutas con React Router
```

---

## 🚀 Instalación y uso local

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/EduMontalvo/soundrhythm.git
   cd soundrhythm
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

### Scripts disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Levanta el entorno de desarrollo con Vite |
| `npm run build` | Compila TypeScript (`tsc -b`) y genera el build de producción |
| `npm run lint` | Ejecuta ESLint sobre el proyecto |
| `npm run preview` | Previsualiza localmente el build de producción |

---

## 🌐 Fuente de datos

El listado de emisoras se obtiene dinámicamente desde la API pública y de código abierto [Radio Browser](https://www.radio-browser.info/).

---

## 👤 Autor

Desarrollado por **EduMontalvo** — [GitHub](https://github.com/EduMontalvo/soundrhythm)
