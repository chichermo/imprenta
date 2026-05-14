import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { categoryPerformance, reportSummaries } from "@/lib/mock-data";

export default function ReportsPage() {
  return (
    <AppShell
      title="Reportes y gestion"
      description="Tablero ejecutivo para ventas, categorias, clientes clave y seguimiento general del negocio."
    >
      <div className="content-grid">
        <section className="mini-stat-grid">
          {reportSummaries.map((summary) => (
            <article className="mini-stat-card" key={summary.label}>
              <span>{summary.label}</span>
              <strong>{summary.value}</strong>
              <small>{summary.helper}</small>
            </article>
          ))}
        </section>

        <SectionCard
          title="Rendimiento por linea"
          description="Base para el futuro dashboard gerencial con datos reales."
        >
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Categoria</th>
                  <th>Ventas</th>
                  <th>Participacion</th>
                  <th>Tendencia</th>
                </tr>
              </thead>
              <tbody>
                {categoryPerformance.map((row) => (
                  <tr key={row.category}>
                    <td>{row.category}</td>
                    <td>{row.sales}</td>
                    <td>{row.share}</td>
                    <td>{row.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
