import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { StatusPill } from "@/components/status-pill";
import { deliveryRecords } from "@/lib/mock-data";

const deliveryNotes = [
  "Relacionar la entrega con cotizacion, OT y futura factura.",
  "Permitir marcar despacho parcial o completo.",
  "Preparar soporte para guia de despacho electronica si se implementa.",
];

export default function DeliveriesPage() {
  return (
    <AppShell
      title="Entregas y despachos"
      description="Modulo operativo para organizar salidas, entregas comprometidas y trazabilidad documental."
    >
      <div className="content-grid">
        <SectionCard
          title="Despachos programados"
          description="Vista semilla para coordinar ruta y cumplimiento de entrega."
        >
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Entrega</th>
                  <th>Cliente</th>
                  <th>Destino</th>
                  <th>Programada</th>
                  <th>Detalle</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {deliveryRecords.map((delivery) => (
                  <tr key={delivery.number}>
                    <td>{delivery.number}</td>
                    <td>{delivery.customer}</td>
                    <td>{delivery.destination}</td>
                    <td>{delivery.scheduled}</td>
                    <td>{delivery.summary}</td>
                    <td>
                      <StatusPill label={delivery.status} tone={delivery.tone} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard
          title="Notas operativas"
          description="Puntos importantes para una fase posterior con flujos reales."
        >
          <ul className="bullet-list">
            {deliveryNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </AppShell>
  );
}
