import fs from "fs";
import path from "path";
import { parseFilename, Product } from "@/config/store";

// Lee la carpeta public/catalog en tiempo de build
// Cada vez que agregues fotos y hagas deploy, la lista se actualiza
export function getCatalogProducts(): Product[] {
  const dir = path.join(process.cwd(), "public", "catalog");

  // Si la carpeta no existe, devolver array vacío
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp|gif|avif)$/i.test(f))
    .sort((a, b) => a.localeCompare(b));

  return files.map((filename, idx) => parseFilename(filename, idx));
}
