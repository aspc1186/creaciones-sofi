import { parseFilename, Product } from "@/config/store";

const CLOUD  = process.env.CLOUDINARY_CLOUD_NAME || "djs5hqpyz";
const KEY    = process.env.CLOUDINARY_API_KEY    || "813582114723111";
const SECRET = process.env.CLOUDINARY_API_SECRET || "";
const FOLDER = "Catálogo";

export function cloudinaryUrl(publicId: string): string {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/q_auto,f_auto,w_400/${publicId}`;
}

export async function getCatalogProducts(): Promise<Product[]> {
  try {
    const auth = Buffer.from(`${KEY}:${SECRET}`).toString("base64");
    const url  = `https://api.cloudinary.com/v1_1/${CLOUD}/resources/image?prefix=${encodeURIComponent(FOLDER + "/")}&max_results=500&type=upload`;

    const res = await fetch(url, {
      headers: { Authorization: `Basic ${auth}` },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    const resources: { public_id: string }[] = data.resources || [];

    return resources
      .map((r, idx) => {
        const filename = r.public_id.split("/").pop() || "";
        const product  = parseFilename(filename, idx);
        return { ...product, file: cloudinaryUrl(r.public_id) };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

  } catch (e) {
    console.error("getCatalogProducts error:", e);
    return [];
  }
}
