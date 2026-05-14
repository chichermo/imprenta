import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Distribuidora San Pablo S.A.",
  description:
    "Sistema comercial para cotizaciones, ventas, inventario y futura facturacion electronica en Chile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
