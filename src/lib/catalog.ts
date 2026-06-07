import fs from "fs";
import path from "path";
import { parseFilename, Product } from "@/config/store";

export async function getCatalogProducts(): Promise<Product[]> {
  try {
    const dir = path.join(process.cwd(), "public", "catalog");
    if (!fs.existsSync(dir)) return [];

    const files = fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp|gif|avif)$/i.test(f))
      .sort((a, b) => a.localeCompare(b));

    return files.map((filename, idx) => {
      const product = parseFilename(filename, idx);
      return { ...product, file: `/catalog/${filename}` };
    });
  } catch {
    return [];
  }
}
