import type { Metadata } from "next";
import { AppStateProvider } from "@/components/app-state-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Distribuidora San Pablo S.A.",
  description:
    "Sistema comercial para cotizaciones, ventas, inventario y futura facturacion electronica en Chile.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <AppStateProvider>{children}</AppStateProvider>
      </body>
    </html>
  );
}
