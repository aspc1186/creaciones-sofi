import fs from "fs";
import path from "path";
import { parseFilename, Product } from "@/config/store";

export async function getCatalogProducts(): Promise<Product[]> {
  try {
    const dir = path.join(process.cwd(), "public", "catálogo");
    if (!fs.existsSync(dir)) return [];

    const files = fs.readdirSync(dir)
      .filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f))
      .sort();

    return files.map((filename, idx) => {
      const product = parseFilename(filename, idx);
      return { ...product, file: `/catálogo/${filename}` };
    });
  } catch {
    return [];
  }
}
