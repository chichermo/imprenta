import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Distribuidora San Pablo S.A.",
    short_name: "San Pablo",
    description:
      "ERP comercial para cotizaciones, produccion, compras e inventario en la quinta region.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f1a2b",
    theme_color: "#29b7b0",
    lang: "es-CL",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
