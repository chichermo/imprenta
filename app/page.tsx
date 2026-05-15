import { AppShell } from "@/components/app-shell";
import { IntegrationStatusPanel } from "@/components/integration-status-panel";
import { SectionCard } from "@/components/section-card";
import { StatusPill } from "@/components/status-pill";
import {
  commercialFlow,
  dashboardMetrics,
} from "@/lib/app-data";
import {
  categoryPerformance,
  dashboardAlerts,
  purchaseOrderRecords,
  quoteRecords,
  receivableRecords,
  workOrderRecords,
} from "@/lib/mock-data";

export default function HomePage() {
  return (
    <AppShell
      title="Panel operativo"
      description="Resumen comercial, productivo y administrativo para la gestion diaria de Distribuidora San Pablo S.A."
    >
      <div className="page-grid">
        <section className="metric-grid">
          {dashboardMetrics.map((metric) => (
            <article className="metric-card" key={metric.label}>
              <p>{metric.label}</p>
              <strong>{metric.value}</strong>
              <span>{metric.helper}</span>
            </article>
          ))}
        </section>

        <IntegrationStatusPanel />

        <div className="content-grid">
          <SectionCard
            title="Alertas operativas"
            description="Resumen rapido de seguimiento comercial, stock y cobranza."
          >
            <div className="alert-grid">
              {dashboardAlerts.map((alert) => (
                <article className={`alert-card alert-card--${alert.tone}`} key={alert.title}>
                  <strong>{alert.title}</strong>
                  <p>{alert.description}</p>
                </article>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Circuito comercial"
            description="Asi se mueve el trabajo entre ventas, produccion, entrega y administracion."
          >
            <div className="stack-list">
              {commercialFlow.map((stage) => (
                <article className="list-row" key={stage.name}>
                  <div className="list-badge">{stage.name}</div>
                  <p>{stage.summary}</p>
                </article>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Cotizaciones activas"
            description="Bandeja comercial priorizada para seguimiento diario."
          >
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Numero</th>
                    <th>Cliente</th>
                    <th>Resumen</th>
                    <th>Vence</th>
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
            title="Cobranzas prioritarias"
            description="Documentos con seguimiento mas sensible por vencimiento o monto."
          >
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Documento</th>
                    <th>Vencimiento</th>
                    <th>Monto</th>
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
            title="Produccion y compras"
            description="Dos tableros clave para cumplir plazos y reponer insumos a tiempo."
          >
            <div className="split-grid">
              <div className="stack-list">
                {workOrderRecords.map((order) => (
                  <article className="list-row" key={order.number}>
                    <div className="row-between">
                      <div className="list-badge">{order.number}</div>
                      <StatusPill label={order.status} tone={order.tone} />
                    </div>
                    <strong>{order.customer}</strong>
                    <p>{order.summary}</p>
                    <small className="muted-note">
                      {order.area} · entrega {order.deliveryDate}
                    </small>
                  </article>
                ))}
              </div>

              <div className="stack-list">
                {purchaseOrderRecords.map((purchase) => (
                  <article className="list-row" key={purchase.number}>
                    <div className="row-between">
                      <div className="list-badge">{purchase.number}</div>
                      <StatusPill label={purchase.status} tone={purchase.tone} />
                    </div>
                    <strong>{purchase.supplier}</strong>
                    <p>Total estimado {purchase.total}</p>
                    <small className="muted-note">ETA {purchase.eta}</small>
                  </article>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Rendimiento por linea"
            description="Participacion comercial estimada de cada linea del negocio."
          >
            <div className="collection-grid">
              {categoryPerformance.map((category) => (
                <article className="collection-card" key={category.category}>
                  <div className="collection-card__header">
                    <h4>{category.category}</h4>
                    <p>{category.trend}</p>
                  </div>
                  <ul>
                    <li>Ventas: {category.sales}</li>
                    <li>Participacion: {category.share}</li>
                  </ul>
                </article>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
