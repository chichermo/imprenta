import { AppShell } from "@/components/app-shell";
import { InventoryControlPanel } from "@/components/inventory-control-panel";
import { SectionCard } from "@/components/section-card";
import { StatusPill } from "@/components/status-pill";
import { inventoryMovements, stockAlerts } from "@/lib/mock-data";

const inventoryControls = [
  "Entradas desde ordenes de compra",
  "Salidas por venta o consumo de produccion",
  "Reservas ligadas a cotizaciones aprobadas",
  "Alertas de stock minimo por SKU",
  "Ajustes con trazabilidad de usuario y motivo",
];

const suggestedUnits = [
  "unidad",
  "caja",
  "paquete",
  "resma",
  "rollo",
  "metro",
];

export default function InventoryPage() {
  return (
    <AppShell
      title="Modulo de inventario"
      description="Orientado a insumos clinicos, papeleria, materiales de impresion y control basico de bodega."
    >
      <div className="content-grid">
        <InventoryControlPanel />

        <SectionCard
          title="Alertas de stock"
          description="Punto de partida para compras y reservas segun demanda comercial."
        >
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Stock actual</th>
                  <th>Punto reposicion</th>
                  <th>Accion sugerida</th>
                  <th>Prioridad</th>
                </tr>
              </thead>
              <tbody>
                {stockAlerts.map((alert) => (
                  <tr key={alert.item}>
                    <td>{alert.item}</td>
                    <td>{alert.currentStock}</td>
                    <td>{alert.reorderPoint}</td>
                    <td>{alert.suggestion}</td>
                    <td>
                      <StatusPill
                        label={alert.tone === "danger" ? "Urgente" : "Atencion"}
                        tone={alert.tone}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard
          title="Controles clave"
          description="Buenas practicas para controlar bodega, reservas, consumos y ajustes."
        >
          <ul className="bullet-list">
            {inventoryControls.map((control) => (
              <li key={control}>{control}</li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Unidades de medida iniciales"
          description="Un set corto pero suficiente para el rubro."
        >
          <div className="tag-list">
            {suggestedUnits.map((unit) => (
              <span className="soft-tag" key={unit}>
                {unit}
              </span>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Movimientos recientes"
          description="Bitacora minima para trazabilidad de compras, ventas y produccion."
        >
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Item</th>
                  <th>Tipo</th>
                  <th>Cantidad</th>
                  <th>Referencia</th>
                </tr>
              </thead>
              <tbody>
                {inventoryMovements.map((movement) => (
                  <tr key={`${movement.date}-${movement.item}-${movement.reference}`}>
                    <td>{movement.date}</td>
                    <td>{movement.item}</td>
                    <td>{movement.type}</td>
                    <td>{movement.quantity}</td>
                    <td>{movement.reference}</td>
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
