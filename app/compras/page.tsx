import { AppShell } from "@/components/app-shell";
import { PurchasePlanner } from "@/components/purchase-planner";
import { PurchaseRegistryTable } from "@/components/purchase-registry-table";
import { SectionCard } from "@/components/section-card";
import { stockAlerts } from "@/lib/mock-data";

export default function PurchasesPage() {
  return (
    <AppShell
      title="Ordenes de compra"
      description="Modulo para reponer inventario y abastecer trabajos especiales segun demanda comercial."
    >
      <div className="content-grid">
        <PurchasePlanner />

        <SectionCard
          title="Compras abiertas"
          description="OC del flujo vivo con recepcion automatica a inventario al marcar Recibida."
        >
          <PurchaseRegistryTable />
        </SectionCard>

        <SectionCard
          title="Detonantes de compra"
          description="Alertas que deben poder generar OC desde inventario o desde una orden de trabajo."
        >
          <ul className="bullet-list">
            {stockAlerts.map((alert) => (
              <li key={alert.item}>
                <strong>{alert.item}:</strong> {alert.suggestion}
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </AppShell>
  );
}
