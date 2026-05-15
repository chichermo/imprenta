"use client";

import { StatusPill } from "@/components/status-pill";
import { isAppwriteConfigured } from "@/lib/appwrite-client";
import { useAppState } from "@/components/app-state-provider";

export function IntegrationStatusPanel() {
  const { liveStats } = useAppState();
  const appwriteReady = isAppwriteConfigured();

  return (
    <section className="integration-status-panel">
      <article className="integration-status-card">
        <p className="eyebrow">Flujo operativo</p>
        <strong>Estado compartido activo</strong>
        <p>
          {liveStats.quotes} cotizaciones · {liveStats.workOrders} OT · {liveStats.purchases} OC ·{" "}
          {liveStats.inventoryMovements} movimientos
        </p>
        <div className="quote-line-card__signals">
          <StatusPill label={`${liveStats.approvedQuotes} aprobadas`} tone="success" />
          <StatusPill label={`${liveStats.openPurchases} compras abiertas`} tone="warning" />
        </div>
      </article>

      <article className="integration-status-card">
        <p className="eyebrow">Appwrite</p>
        <strong>{appwriteReady ? "Variables detectadas" : "Pendiente de configurar"}</strong>
        <p>
          {appwriteReady
            ? "El cliente esta listo para conectar colecciones cuando migres desde localStorage."
            : "Copia .env.example a .env.local y completa endpoint, proyecto y base de datos."}
        </p>
        <StatusPill
          label={appwriteReady ? "Listo para sync" : "Solo navegador"}
          tone={appwriteReady ? "info" : "neutral"}
        />
      </article>

      <article className="integration-status-card">
        <p className="eyebrow">PWA</p>
        <strong>Instalable desde el navegador</strong>
        <p>Manifest activo. En Chrome o Edge usa Instalar aplicacion para acceso rapido en tablet o bodega.</p>
        <StatusPill label="Manifest activo" tone="success" />
      </article>
    </section>
  );
}
