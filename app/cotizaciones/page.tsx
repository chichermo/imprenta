import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { StatusPill } from "@/components/status-pill";
import { quoteRecords, quoteTemplateChecklist } from "@/lib/mock-data";

const quoteCapabilities = [
  "Mezclar productos estandar, servicios y trabajos a medida en un mismo documento.",
  "Guardar especificaciones tecnicas: material, medida, color, terminaciones y observaciones.",
  "Aplicar descuentos por item o globales segun tipo de cliente.",
  "Convertir cotizacion aprobada en orden de trabajo y futura factura.",
];

const quoteStates = [
  "Borrador",
  "Enviada",
  "Aprobada",
  "Rechazada",
  "Vencida",
];

export default function QuotesPage() {
  return (
    <AppShell
      title="Modulo de cotizaciones"
      description="Corazon comercial del sistema para venta consultiva, impresiones especiales y reposicion de insumos."
    >
      <div className="content-grid">
        <section className="mini-stat-grid">
          <article className="mini-stat-card">
            <span>Cotizaciones abiertas</span>
            <strong>{quoteRecords.length}</strong>
            <small>La bandeja debe ordenar por vigencia y probabilidad de cierre.</small>
          </article>
          <article className="mini-stat-card">
            <span>Aprobadas esta semana</span>
            <strong>1</strong>
            <small>Ideal para disparar orden de trabajo y reserva de stock.</small>
          </article>
          <article className="mini-stat-card">
            <span>Mix comercial</span>
            <strong>Producto + servicio</strong>
            <small>Un mismo documento puede mezclar insumos, impresion y senaletica.</small>
          </article>
        </section>

        <SectionCard
          title="Bandeja comercial"
          description="Vista sugerida para seguimiento diario del equipo de ventas."
        >
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Numero</th>
                  <th>Cliente</th>
                  <th>Detalle</th>
                  <th>Validez</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {quoteRecords.map((quote) => (
                  <tr key={quote.number}>
                    <td>{quote.number}</td>
                    <td>{quote.customer}</td>
                    <td>{quote.summary}</td>
                    <td>{quote.validUntil}</td>
                    <td>{quote.total}</td>
                    <td>
                      <StatusPill label={quote.status} tone={quote.tone} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard
          title="Capacidades requeridas"
          description="Flujo pensado para ventas B2B y trabajos personalizados."
        >
          <ul className="bullet-list">
            {quoteCapabilities.map((capability) => (
              <li key={capability}>{capability}</li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Estados sugeridos"
          description="Ayudan a ordenar seguimiento comercial y conversion a produccion."
        >
          <div className="tag-list">
            {quoteStates.map((state) => (
              <span className="soft-tag" key={state}>
                {state}
              </span>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Checklist minimo por cotizacion"
          description="Campos que conviene exigir incluso antes de conectar Appwrite."
        >
          <ul className="bullet-list">
            {quoteTemplateChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </AppShell>
  );
}
