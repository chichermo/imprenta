import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { StatusPill } from "@/components/status-pill";
import { supplierRecords } from "@/lib/mock-data";

const procurementNotes = [
  "Diferenciar proveedores de insumos, papeleria y materiales de senaletica.",
  "Guardar plazos habituales para mejorar promesas de entrega al cliente.",
  "Relacionar ordenes de compra con ingresos de stock y costos.",
];

export default function SuppliersPage() {
  return (
    <AppShell
      title="Modulo de proveedores"
      description="Base para abastecimiento, reposicion de inventario y compras ligadas a trabajos especiales."
    >
      <div className="content-grid">
        <SectionCard
          title="Proveedores principales"
          description="Vista resumida para compras y control de abastecimiento."
        >
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Proveedor</th>
                  <th>Categoria</th>
                  <th>Lead time</th>
                  <th>Contacto</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {supplierRecords.map((supplier) => (
                  <tr key={supplier.name}>
                    <td>{supplier.name}</td>
                    <td>{supplier.category}</td>
                    <td>{supplier.leadTime}</td>
                    <td>{supplier.contact}</td>
                    <td>
                      <StatusPill label={supplier.status} tone={supplier.tone} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard
          title="Notas de abastecimiento"
          description="Criterios para mantener abastecimiento estable y compras mejor coordinadas."
        >
          <ul className="bullet-list">
            {procurementNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </AppShell>
  );
}
