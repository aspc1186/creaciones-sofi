import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SECRET_KEY!;
const bucket      = process.env.SUPABASE_STORAGE_BUCKET || "catalog";

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface CatalogItem {
  id:       string;
  name:     string;
  ref:      string;
  price:    number;
  category: string;
  url:      string;
  tag?:     string;
}

// ─── Listar imágenes del bucket ─────────────────────────────
export async function listCatalogItems(): Promise<CatalogItem[]> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list("", { limit: 1000, sortBy: { column: "name", order: "asc" } });

  if (error || !data) return [];

  return data
    .filter((f) => /\.(jpe?g|png|webp|gif|avif)$/i.test(f.name))
    .map((f, idx) => parseFileName(f.name, idx));
}

// ─── Parsear nombre de archivo ───────────────────────────────
// Ejemplo: "conjuntos-dama-022.jpg" → { name, ref, price, category }
const CAT_MAP: Record<string, { label: string; price: number }> = {
  "camiseta":        { label: "Camisetas Dama",      price: 25000  },
  "camisetas-dama":  { label: "Camisetas Dama",      price: 25000  },
  "body":            { label: "Bodies Dama",         price: 28000  },
  "bodies-dama":     { label: "Bodies Dama",         price: 28000  },
  "conjunto":        { label: "Conjuntos Dama",      price: 50000  },
  "conjuntos-dama":  { label: "Conjuntos Dama",      price: 50000  },
  "enterizo":        { label: "Enterizos Dama",      price: 45000  },
  "conjunto-nina":   { label: "Conjunto Niñas",      price: 38000  },
  "conjunto-nino":   { label: "Conjunto Niños",      price: 38000  },
  "familia":         { label: "Familia",             price: 120000 },
  "pareja":          { label: "Pareja",              price: 90000  },
  "conjunto-hombre": { label: "Conjunto Hombre",     price: 45000  },
};

function parseFileName(filename: string, idx: number): CatalogItem {
  const base  = filename.replace(/\.(jpe?g|png|webp|gif|avif)$/i, "");
  const lower = base.toLowerCase();

  // Detectar categoría y precio
  let category = "Camisetas Dama";
  let price    = 25000;
  for (const [key, val] of Object.entries(CAT_MAP)) {
    if (lower.startsWith(key) || lower.includes(key)) {
      category = val.label;
      price    = val.price;
      break;
    }
  }

  // Precio desde nombre ($50000)
  const priceMatch = base.match(/\$(\d[\d.,]*)/);
  if (priceMatch) price = parseInt(priceMatch[1].replace(/[.,]/g, ""));

  // Referencia
  const refMatch = base.match(/(\d{3,})(?!.*\d{3,})/);
  const ref      = "Ref. " + (refMatch ? refMatch[1] : String(idx + 1).padStart(3, "0"));

  // Nombre limpio
  const name = base
    .replace(/\$[\d.,]+/g, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase()) || "Prenda Femenina";

  // URL pública
  const { data } = supabase.storage.from(bucket).getPublicUrl(filename);

  return { id: String(idx), name, ref, price, category, url: data.publicUrl };
}
