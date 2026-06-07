// ╔══════════════════════════════════════════════════════════╗
// ║  CONFIGURACIÓN DE CREACIONES SOFI                       ║
// ║  Edita este archivo para cambiar datos de la tienda     ║
// ╚══════════════════════════════════════════════════════════╝

export const STORE = {
  name:        "Creaciones Sofi",
  tagline:     "Moda femenina con estilo y elegancia",
  mayorista:   "Distribuidor mayorista de ropa femenina",
  description: "Encuentra las últimas tendencias en moda femenina y luce espectacular en cada ocasión.",
  location:    "Medellín, Antioquia, Colombia",
  whatsapp:    "573223815323",
  waMessage:   "Hola Creaciones Sofi, quiero conocer más sobre sus prendas 💗",
  instagram:   "https://www.instagram.com/crea.cionesofio9",
  facebook:    "https://www.facebook.com/creacionesofi.848405",
};

// ── Métodos de pago activos ────────────────────────────────
export const PAYMENTS = [
  { icon: "💳", label: "Nequi · 3223815323" },
  { icon: "🏦", label: "Bancolombia · 25356116201" },
  { icon: "🔑", label: "Llave Bancolombia · 3223815323" },
  { icon: "📦", label: "Contraentrega" },
];

// ── Categorías y precios por defecto ──────────────────────
export const CATEGORIES: Category[] = [
  { id: "camisetas-dama",   label: "Camisetas Dama",     price: 25000,  kw: ["camiseta","camisetas-dama","camisetas_dama"] },
  { id: "blusas-dama",      label: "Blusas Dama",        price: 30000,  kw: ["blusa","blusas","blusa-dama","blusas-dama"] },
  { id: "bodies-dama",      label: "Bodies Dama",        price: 30000,  kw: ["body","bodies","bodysuit","body-dama"] },
  { id: "conjuntos-dama",   label: "Conjuntos Dama",     price: 50000,  kw: ["conjunto","conjuntos-dama","conjuntos_dama"] },
  { id: "enterizos-dama",   label: "Enterizos Dama",     price: 60000,  kw: ["enterizo","jumpsuit","enterizos-dama"] },
  { id: "conjunto-ninas",   label: "Conjunto Niñas",     price: 45900,  kw: ["nina","niña","conjunto-nina","conjunto_nina"] },
  { id: "conjunto-ninos",   label: "Conjunto Niños",     price: 44900,  kw: ["nino","niño","conjunto-nino","conjunto_nino"] },
  { id: "familia",          label: "Familia",            price: 58900,  kw: ["familia","family","camiseta-familia"] },
  { id: "pareja",           label: "Pareja",             price: 25000,  kw: ["pareja","couple","camiseta-pareja"] },
  { id: "conjunto-hombre",  label: "Conjunto Hombre",    price: 50000,  kw: ["hombre","caballero","conjunto-hombre"] },
];

// ── Tallas disponibles ────────────────────────────────────
export const SIZES = ["S", "M", "L", "XL"];

// ── Testimonios ───────────────────────────────────────────
export const TESTIMONIALS = [
  { name: "Laura Martínez",   city: "Medellín, Antioquia",    stars: 5, avatar: "👩",     text: "Los vestidos son hermosísimos y de muy buena calidad. La atención de Sofi es increíble, súper puntual con las entregas. ¡Ya hice mi segundo pedido!" },
  { name: "Valentina Gómez",  city: "Itagüí, Antioquia",      stars: 5, avatar: "👩‍🦱", text: "Compré un conjunto para una cena especial y recibí muchos cumplidos. La tela es de primera y el diseño espectacular. ¡100% recomendada!" },
  { name: "Daniela Ríos",     city: "Envigado, Antioquia",    stars: 5, avatar: "👩‍🦰", text: "Excelente servicio por WhatsApp. Me ayudó a elegir la talla perfecta y el envío llegó rapidísimo. ¡Las prendas son tal cual en las fotos!" },
  { name: "Sofía Herrera",    city: "Bello, Antioquia",       stars: 5, avatar: "🧕",     text: "Siempre encuentro lo que busco aquí. Los precios son muy buenos y la calidad supera las expectativas. ¡Mi tienda favorita de moda femenina!" },
  { name: "Catalina Zapata",  city: "Sabaneta, Antioquia",    stars: 5, avatar: "👩‍🦳", text: "Me encanta la variedad de estilos. Siempre hay cosas nuevas y modernas. La atención es personalizada, ¡como si fuera tu amiga de toda la vida!" },
  { name: "Isabella Morales", city: "La Estrella, Antioquia", stars: 5, avatar: "👩",     text: "Pedí una blusa y llegó perfecta, el color idéntico a la foto. El empaque muy cuidadoso y con un detallito de amor incluido. ¡Gracias!" },
];

// ── Types ─────────────────────────────────────────────────
export interface Category {
  id: string; label: string; price: number; kw: string[];
}

export interface Product {
  id: string; name: string; ref: string; price: number;
  category: string; catId: string; file: string;
}

// ── Parsear nombre de archivo ─────────────────────────────
export function parseFilename(filename: string, idx: number): Product {
  const base  = filename.replace(/\.(jpe?g|png|webp|gif|avif)$/i, "");
  const lower = base.toLowerCase();

  let cat: Category = CATEGORIES[0];
  for (const c of CATEGORIES) {
    if (c.kw.some((k) => lower.includes(k))) { cat = c; break; }
  }

  const pm = base.match(/\$(\d[\d.,]*)/);
  const price = pm ? parseInt(pm[1].replace(/[.,]/g, "")) : cat.price;

  const rm  = base.match(/(\d{3,})(?!.*\d{3,})/);
  const ref = "Ref. " + (rm ? rm[1] : String(idx + 1).padStart(3, "0"));

  const name = base
    .replace(/\$[\d.,]+/g, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase()) || "Prenda Femenina";

  return { id: String(idx), name, ref, price, category: cat.label, catId: cat.id, file: `/catalog/${filename}` };
}

// ── Formatear precio ──────────────────────────────────────
export function fmt(price: number): string {
  return "$ " + price.toLocaleString("es-CO");
}
