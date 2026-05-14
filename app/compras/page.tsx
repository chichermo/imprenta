import { AppShell } from "@/components/app-shell";
import { PurchasePlanner } from "@/components/purchase-planner";
import { SectionCard } from "@/components/section-card";
import { StatusPill } from "@/components/status-pill";
import { purchaseOrderRecords, stockAlerts } from "@/lib/mock-data";

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
          description="Seguimiento de aprobacion, confirmacion y fecha estimada de llegada."
        >
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Orden</th>
                  <th>Proveedor</th>
                  <th>ETA</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrderRecords.map((purchase) => (
                  <tr key={purchase.number}>
                    <td>{purchase.number}</td>
                    <td>{purchase.supplier}</td>
                    <td>{purchase.eta}</td>
                    <td>{purchase.total}</td>
                    <td>
                      <StatusPill label={purchase.status} tone={purchase.tone} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
