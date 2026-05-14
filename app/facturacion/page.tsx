import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { StatusPill } from "@/components/status-pill";
import { dteReadiness } from "@/lib/mock-data";

const dteDocuments = [
  "Factura Electronica (33)",
  "Factura Exenta Electronica (34), si aplica",
  "Nota de Credito Electronica (61)",
  "Guia de Despacho Electronica (52), si se usa",
];

const dteFlow = [
  "Configurar datos tributarios del emisor y certificado digital.",
  "Generar folio y XML del documento.",
  "Firmar electronicamente y enviar al proveedor DTE o al SII.",
  "Guardar track ID, estado tributario, XML y PDF.",
];

export default function BillingPage() {
  return (
    <AppShell
      title="Facturacion electronica"
      description="Control tributario para documentos electronicos y seguimiento DTE en Chile."
    >
      <div className="content-grid">
        <SectionCard
          title="Estado de preparacion"
          description="Checklist ejecutivo para saber que falta antes de emitir DTE reales."
        >
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Area</th>
                  <th>Estado</th>
                  <th>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {dteReadiness.map((item) => (
                  <tr key={item.area}>
                    <td>{item.area}</td>
                    <td>
                      <StatusPill label={item.status} tone={item.tone} />
                    </td>
                    <td>{item.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard
          title="Documentos a soportar"
          description="Set inicial pensado para una empresa B2B con entregas y notas de ajuste."
        >
          <ul className="bullet-list">
            {dteDocuments.map((document) => (
              <li key={document}>{document}</li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Flujo tecnico esperado"
          description="La validacion tributaria se procesa fuera de la interfaz y queda trazada por documento."
        >
          <ol className="number-list">
            {dteFlow.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </SectionCard>
      </div>
    </AppShell>
  );
}
