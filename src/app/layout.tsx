import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creaciones Sofi | Moda Femenina Premium",
  description: "Moda femenina con estilo y elegancia. Encuentra las últimas tendencias en Medellín, Colombia.",
  keywords: "ropa femenina, moda, boutique, Medellín, Creaciones Sofi, camisetas, conjuntos, vestidos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
