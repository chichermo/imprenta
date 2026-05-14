import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { customerRecords } from "@/lib/mock-data";

const customerSegments = [
  "Clinicas y centros medicos",
  "Laboratorios y proveedores de salud",
  "Empresas que compran senaletica o impresos",
];

const customerFields = [
  "RUT y razon social",
  "Giro y direccion tributaria",
  "Contactos comerciales y de cobranza",
  "Condicion de pago",
  "Lista de precios especial",
  "Historial de cotizaciones y facturas",
];

export default function CustomersPage() {
  return (
    <AppShell
      title="Modulo de clientes"
      description="Este modulo concentrara ficha comercial, datos tributarios, acuerdos de pago y seguimiento historico."
    >
      <div className="content-grid">
        <section className="mini-stat-grid">
          <article className="mini-stat-card">
            <span>Clientes activos</span>
            <strong>{customerRecords.length}</strong>
            <small>Base inicial para ventas institucionales y trabajos especiales.</small>
          </article>
          <article className="mini-stat-card">
            <span>Con saldo pendiente</span>
            <strong>3</strong>
            <small>Necesarios para el tablero de cobranza y seguimiento administrativo.</small>
          </article>
          <article className="mini-stat-card">
            <span>Condiciones de pago</span>
            <strong>15-60 dias</strong>
            <small>Se debe guardar por cliente para cotizar y facturar correctamente.</small>
          </article>
        </section>

        <SectionCard
          title="Base de clientes"
          description="Muestra de la vista operativa para ventas, cobranza y futuros DTE."
        >
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Segmento</th>
                  <th>RUT</th>
                  <th>Comuna</th>
                  <th>Pago</th>
                  <th>Ultima cotizacion</th>
                  <th>Saldo</th>
                </tr>
              </thead>
              <tbody>
                {customerRecords.map((customer) => (
                  <tr key={customer.businessName}>
                    <td>{customer.businessName}</td>
                    <td>{customer.segment}</td>
                    <td>{customer.rut}</td>
                    <td>{customer.commune}</td>
                    <td>{customer.paymentTerms}</td>
                    <td>{customer.lastQuote}</td>
                    <td>{customer.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard
          title="Segmentos comerciales"
          description="La app debe contemplar clientes institucionales y ventas por trabajo."
        >
          <ul className="bullet-list">
            {customerSegments.map((segment) => (
              <li key={segment}>{segment}</li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Datos minimos por cliente"
          description="Base necesaria para cotizar, facturar y controlar cobranzas."
        >
          <ul className="bullet-list">
            {customerFields.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </AppShell>
  );
}
