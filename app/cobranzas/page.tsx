import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { StatusPill } from "@/components/status-pill";
import { receivableRecords } from "@/lib/mock-data";

const collectionWorkflow = [
  "Seguimiento de vencimientos por cliente y documento.",
  "Registro de compromisos de pago y responsable interno.",
  "Cruce futuro con factura electronica emitida y abonos.",
];

export default function CollectionsPage() {
  return (
    <AppShell
      title="Cobranzas y cuentas por cobrar"
      description="Vista administrativa para controlar saldos pendientes, vencimientos y seguimiento comercial posterior a la venta."
    >
      <div className="content-grid">
        <section className="mini-stat-grid">
          <article className="mini-stat-card">
            <span>Saldo monitoreado</span>
            <strong>CLP 3.26M</strong>
            <small>Base inicial de cobranza con foco en clientes institucionales.</small>
          </article>
          <article className="mini-stat-card">
            <span>Documentos vencidos</span>
            <strong>1</strong>
            <small>Ideal para disparar alertas y registrar compromisos.</small>
          </article>
          <article className="mini-stat-card">
            <span>Responsables</span>
            <strong>Ventas + Admin</strong>
            <small>La cobranza debe poder dividirse por area o ejecutivo.</small>
          </article>
        </section>

        <SectionCard
          title="Documentos por cobrar"
          description="Semilla del tablero de gestion administrativa."
        >
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Documento</th>
                  <th>Vencimiento</th>
                  <th>Monto</th>
                  <th>Responsable</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {receivableRecords.map((record) => (
                  <tr key={record.document}>
                    <td>{record.customer}</td>
                    <td>{record.document}</td>
                    <td>{record.dueDate}</td>
                    <td>{record.amount}</td>
                    <td>{record.owner}</td>
                    <td>
                      <StatusPill label={record.status} tone={record.tone} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard
          title="Flujo minimo de cobranza"
          description="Funciones que conviene dejar consideradas aunque todavia no exista login."
        >
          <ul className="bullet-list">
            {collectionWorkflow.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </AppShell>
  );
}
