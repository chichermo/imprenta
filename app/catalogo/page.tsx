import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { StatusPill } from "@/components/status-pill";
import { catalogRecords } from "@/lib/mock-data";

const pricingRules = [
  "Permitir precio neto por item y lista especial por cliente.",
  "Separar productos de stock versus trabajos a pedido.",
  "Guardar unidad de medida y categoria comercial.",
  "Preparar costos estimados para medir margen despues.",
];

export default function CatalogPage() {
  return (
    <AppShell
      title="Catalogo mixto"
      description="Modulo para centralizar insumos clinicos, papeleria, impresion y senaletica dentro de una sola base comercial."
    >
      <div className="content-grid">
        <SectionCard
          title="Items disponibles"
          description="Vista inicial pensada para armar cotizaciones rapido."
        >
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Item</th>
                  <th>Tipo</th>
                  <th>Categoria</th>
                  <th>Unidad</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {catalogRecords.map((item) => (
                  <tr key={item.code}>
                    <td>{item.code}</td>
                    <td>{item.name}</td>
                    <td>{item.type}</td>
                    <td>{item.category}</td>
                    <td>{item.unit}</td>
                    <td>{item.price}</td>
                    <td>{item.stock}</td>
                    <td>
                      <StatusPill label={item.status} tone={item.tone} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard
          title="Reglas del catalogo"
          description="Definiciones utiles antes de conectar formularios y persistencia."
        >
          <ul className="bullet-list">
            {pricingRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </AppShell>
  );
}
