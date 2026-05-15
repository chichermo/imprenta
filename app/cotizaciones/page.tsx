import { AppShell } from "@/components/app-shell";
import { QuoteRegistryTable } from "@/components/quote-registry-table";
import { QuoteWorkbench } from "@/components/quote-workbench";
import { SectionCard } from "@/components/section-card";
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

        <QuoteWorkbench />

        <SectionCard
          title="Bandeja comercial"
          description="Cotizaciones del flujo vivo y referencias historicas en un solo listado."
        >
          <QuoteRegistryTable />
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

        <div className="split-grid">
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
            description="Campos minimos para emitir una oferta clara y lista para seguimiento."
          >
            <ul className="bullet-list">
              {quoteTemplateChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
