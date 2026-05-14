import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { StatusPill } from "@/components/status-pill";
import { workOrderRecords, workStages } from "@/lib/mock-data";

export default function WorkOrdersPage() {
  return (
    <AppShell
      title="Ordenes de trabajo"
      description="Seguimiento productivo para imprenta, gran formato, senaletica y encargos a medida."
    >
      <div className="content-grid">
        <SectionCard
          title="Cola de produccion"
          description="Idealmente esta vista se alimentara desde cotizaciones aprobadas."
        >
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Orden</th>
                  <th>Cliente</th>
                  <th>Area</th>
                  <th>Resumen</th>
                  <th>Entrega</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {workOrderRecords.map((order) => (
                  <tr key={order.number}>
                    <td>{order.number}</td>
                    <td>{order.customer}</td>
                    <td>{order.area}</td>
                    <td>{order.summary}</td>
                    <td>{order.deliveryDate}</td>
                    <td>
                      <StatusPill label={order.status} tone={order.tone} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard
          title="Estados sugeridos"
          description="Flujo simple y suficiente para la primera etapa."
        >
          <div className="tag-list">
            {workStages.map((stage) => (
              <span className="soft-tag" key={stage}>
                {stage}
              </span>
            ))}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
