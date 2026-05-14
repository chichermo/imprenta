import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { StatusPill } from "@/components/status-pill";
import {
  appwriteCollections,
  commercialFlow,
  dashboardMetrics,
  implementationRoadmap,
} from "@/lib/app-data";
import {
  dashboardAlerts,
  purchaseOrderRecords,
  quoteRecords,
  workOrderRecords,
} from "@/lib/mock-data";

export default function HomePage() {
  return (
    <AppShell
      title="Base operativa para la app web"
      description="Dashboard inicial con foco en ventas B2B, trabajos personalizados, inventario y preparacion para DTE en Chile."
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
            title="Flujo comercial sugerido"
            description="Pensado para combinar insumos medicos, imprenta y trabajos especiales."
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
            description="Muestra de como se veria la bandeja comercial priorizada."
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
            title="Fases de implementacion"
            description="Orden recomendado para construir sin sobrecargar la primera version."
          >
            <div className="stack-list">
              {implementationRoadmap.map((phase) => (
                <article className="phase-card" key={phase.phase}>
                  <div className="phase-header">
                    <span className="phase-tag">{phase.phase}</span>
                    <strong>{phase.title}</strong>
                  </div>
                  <ul>
                    {phase.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
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
            title="Colecciones Appwrite prioritarias"
            description="Modelo semilla para clientes, cotizaciones, stock y futura capa tributaria."
          >
            <div className="collection-grid">
              {appwriteCollections.map((collection) => (
                <article className="collection-card" key={collection.name}>
                  <div className="collection-card__header">
                    <h4>{collection.name}</h4>
                    <p>{collection.purpose}</p>
                  </div>
                  <ul>
                    {collection.fields.map((field) => (
                      <li key={field}>{field}</li>
                    ))}
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
