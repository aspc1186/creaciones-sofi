# 🌸 Creaciones Sofi — Tienda Online

## 📁 ESTRUCTURA DE LA CARPETA

```
creaciones-sofi/
├── public/
│   ├── catalog/          ← 📸 PON AQUÍ TUS FOTOS
│   └── logo.webp         ← Tu logo (ya incluido)
├── src/
│   ├── app/
│   │   ├── page.tsx      ← Página principal
│   │   ├── layout.tsx    ← Layout base
│   │   └── globals.css   ← Estilos globales
│   ├── config/
│   │   └── store.ts      ← ⚙️ CONFIGURACIÓN (precios, datos)
│   └── lib/
│       └── catalog.ts    ← Lee fotos de public/catalog
├── package.json
└── README.md
```

---

## 📸 CÓMO AGREGAR FOTOS

1. Abre la carpeta **`public/catalog/`**
2. Copia tus fotos de productos ahí
3. Nombra las fotos así para que se organicen solas:

| Nombre del archivo              | Categoría         | Precio    |
|---------------------------------|-------------------|-----------|
| `camisetas-dama-001.jpg`        | Camisetas Dama    | $25.000   |
| `camisetas-dama-002.jpg`        | Camisetas Dama    | $25.000   |
| `conjuntos-dama-001.jpg`        | Conjuntos Dama    | $50.000   |
| `conjuntos-dama-$65000-001.jpg` | Conjuntos Dama    | $65.000   |
| `conjunto-ninas-001.jpg`        | Conjunto Niñas    | $38.000   |
| `pareja-001.jpg`                | Pareja            | $90.000   |
| `familia-001.jpg`               | Familia           | $120.000  |

> 💡 Si el precio es diferente al estándar, ponlo en el nombre: `conjunto-$75000-022.jpg`

---

## 🚀 PUBLICAR EN VERCEL (primera vez)

### Paso 1 — Subir a GitHub
1. Ve a [github.com](https://github.com) → botón verde **New** → nombre: `creaciones-sofi`
2. Descarga [GitHub Desktop](https://desktop.github.com/) si no lo tienes
3. Arrastra la carpeta `creaciones-sofi` a GitHub Desktop → Commit → Push

### Paso 2 — Conectar Vercel
1. Ve a [vercel.com](https://vercel.com) → **Add New Project**
2. Selecciona el repositorio `creaciones-sofi`
3. Click **Deploy** — ¡listo! 🎉

---

## 🔄 ACTUALIZAR FOTOS (después)

Cada vez que quieras agregar fotos nuevas:

1. Copia las fotos nuevas a **`public/catalog/`**
2. En GitHub Desktop: escribe un mensaje (ej: "Fotos nuevas") → **Commit** → **Push**
3. Vercel detecta el cambio y actualiza la página automáticamente ⚡

---

## ⚙️ CAMBIAR PRECIOS O DATOS

Abre el archivo **`src/config/store.ts`** en cualquier editor de texto (Notepad, VS Code, etc.) y edita los precios de cada categoría.

---

## 📞 Datos de contacto configurados
- **WhatsApp:** 3223815323
- **Facebook:** @creacionesofi.848405  
- **Instagram:** @crea.cionesofio9
- **Ubicación:** Medellín, Antioquia

## 💳 Métodos de pago
- Nequi · 3223815323
- Llave Bancolombia · 3223815323
- Contraentrega
