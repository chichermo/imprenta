"use client";

import { useMemo, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useAppState } from "@/components/app-state-provider";
import { exportReportToExcel, exportReportToPdf } from "@/lib/report-exports";
import { formatClp } from "@/lib/formatters";
import {
  buildCategoryBreakdown,
  buildCustomerRanking,
  buildOperationsBreakdown,
  buildSummaryMetrics,
  filterCustomerPointsByPeriod,
  filterSnapshotsByPeriod,
  periodOptions,
  PeriodPreset,
} from "@/lib/reporting-data";

const chartPalette = ["#29b7b0", "#5ac7ea", "#d1911f", "#cf5a5f"];

export function ReportingDashboard() {
  const { inventoryMovements, liveStats, purchases, savedQuotes, workOrders } = useAppState();
  const [period, setPeriod] = useState<PeriodPreset>("6m");
  const [isExporting, setIsExporting] = useState<"pdf" | "excel" | null>(null);

  const trendRef = useRef<HTMLDivElement>(null);
  const operationsRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const customersRef = useRef<HTMLDivElement>(null);

  const filteredSnapshots = useMemo(() => filterSnapshotsByPeriod(period), [period]);
  const filteredCustomers = useMemo(() => filterCustomerPointsByPeriod(period), [period]);
  const summaryMetrics = useMemo(() => buildSummaryMetrics(filteredSnapshots), [filteredSnapshots]);
  const categoryBreakdown = useMemo(
    () => buildCategoryBreakdown(filteredSnapshots),
    [filteredSnapshots],
  );
  const operationsBreakdown = useMemo(
    () => buildOperationsBreakdown(filteredSnapshots),
    [filteredSnapshots],
  );
  const customerRanking = useMemo(
    () => buildCustomerRanking(filteredCustomers),
    [filteredCustomers],
  );

  const periodLabel = periodOptions.find((option) => option.value === period)?.label ?? period;
  const fileLabel = `reporte-distribuidora-san-pablo-${period}`;

  const chartPayload = {
    fileLabel,
    periodLabel,
    summaryMetrics,
    records: filteredSnapshots,
    categoryBreakdown,
    operationsBreakdown,
    customerRanking,
    chartTargets: {
      trend: trendRef.current,
      operations: operationsRef.current,
      categories: categoriesRef.current,
      customers: customersRef.current,
    },
  };

  async function handleExportPdf() {
    try {
      setIsExporting("pdf");
      await exportReportToPdf(chartPayload);
    } finally {
      setIsExporting(null);
    }
  }

  async function handleExportExcel() {
    try {
      setIsExporting("excel");
      await exportReportToExcel(chartPayload);
    } finally {
      setIsExporting(null);
    }
  }

  return (
    <div className="content-grid">
      <section className="report-toolbar">
        <div className="report-toolbar__copy">
          <p className="eyebrow">Analitica y exportacion</p>
          <h3>Centro de reportes</h3>
          <p>
            Filtra por periodo, revisa tendencias comerciales y exporta resumenes con datos y
            graficos incluidos.
          </p>
        </div>

        <div className="report-toolbar__controls">
          <label className="field-group">
            <span className="field-label">Periodo</span>
            <select
              className="field-control"
              onChange={(event) => setPeriod(event.target.value as PeriodPreset)}
              value={period}
            >
              {periodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="report-toolbar__actions">
            <button
              className="ghost-button"
              disabled={isExporting !== null}
              onClick={handleExportExcel}
              type="button"
            >
              {isExporting === "excel" ? "Exportando Excel..." : "Exportar Excel"}
            </button>
            <button
              className="action-button"
              disabled={isExporting !== null}
              onClick={handleExportPdf}
              type="button"
            >
              {isExporting === "pdf" ? "Exportando PDF..." : "Exportar PDF"}
            </button>
          </div>
        </div>
      </section>

      <section className="mini-stat-grid">
        {summaryMetrics.map((summary) => (
          <article className="mini-stat-card" key={summary.label}>
            <span>{summary.label}</span>
            <strong>{summary.value}</strong>
            <small>{summary.helper}</small>
          </article>
        ))}
      </section>

      <section className="mini-stat-grid">
        <article className="mini-stat-card">
          <span>Cotizaciones sincronizadas</span>
          <strong>{liveStats.quotes}</strong>
          <small>Guardadas desde la mesa comercial compartida.</small>
        </article>
        <article className="mini-stat-card">
          <span>OT creadas</span>
          <strong>{liveStats.workOrders}</strong>
          <small>Ordenes nuevas derivadas desde cotizaciones sincronizadas.</small>
        </article>
        <article className="mini-stat-card">
          <span>Compras activas</span>
          <strong>{liveStats.purchases}</strong>
          <small>Ordenes de compra nuevas planificadas desde el flujo.</small>
        </article>
        <article className="mini-stat-card">
          <span>Movimientos stock</span>
          <strong>{liveStats.inventoryMovements}</strong>
          <small>Reservas, entradas o salidas registradas en navegador.</small>
        </article>
        <article className="mini-stat-card">
          <span>Valor cotizado vivo</span>
          <strong>{formatClp(liveStats.quoteValue)}</strong>
          <small>Acumulado de cotizaciones sincronizadas en esta capa compartida.</small>
        </article>
        <article className="mini-stat-card">
          <span>Valor compras vivo</span>
          <strong>{formatClp(liveStats.purchaseValue)}</strong>
          <small>Acumulado de compras nuevas registradas en el flujo operativo.</small>
        </article>
      </section>

      <section className="chart-grid">
        <article className="chart-panel chart-panel--wide" ref={trendRef}>
          <div className="chart-panel__header">
            <div>
              <p className="eyebrow">Tendencia financiera</p>
              <h3>Ventas vs costos</h3>
            </div>
            <span className="chart-caption">{periodLabel}</span>
          </div>
          <div className="chart-surface">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={filteredSnapshots}>
                <defs>
                  <linearGradient id="salesFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#29b7b0" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#29b7b0" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="costFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#cf5a5f" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#cf5a5f" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(17, 32, 51, 0.1)" strokeDasharray="4 6" />
                <XAxis dataKey="label" stroke="#536277" />
                <YAxis stroke="#536277" tickFormatter={(value) => `${Math.round(value / 1000000)}M`} />
                <Tooltip
                  formatter={(value) => formatClp(Number(value ?? 0))}
                  labelStyle={{ color: "#112033" }}
                />
                <Legend />
                <Area
                  dataKey="revenue"
                  fill="url(#salesFill)"
                  name="Ventas"
                  stroke="#29b7b0"
                  strokeWidth={2}
                  type="monotone"
                />
                <Area
                  dataKey="costs"
                  fill="url(#costFill)"
                  name="Costos"
                  stroke="#cf5a5f"
                  strokeWidth={2}
                  type="monotone"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="chart-panel" ref={operationsRef}>
          <div className="chart-panel__header">
            <div>
              <p className="eyebrow">Operacion</p>
              <h3>Embudo operativo</h3>
            </div>
            <span className="chart-caption">Cotizacion a entrega</span>
          </div>
          <div className="chart-surface">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={operationsBreakdown}>
                <CartesianGrid stroke="rgba(17, 32, 51, 0.1)" strokeDasharray="4 6" />
                <XAxis dataKey="label" stroke="#536277" />
                <YAxis stroke="#536277" />
                <Tooltip labelStyle={{ color: "#112033" }} />
                <Legend />
                <Bar dataKey="quotesCreated" fill="#5ac7ea" name="Cotizadas" radius={[6, 6, 0, 0]} />
                <Bar dataKey="quotesApproved" fill="#29b7b0" name="Aprobadas" radius={[6, 6, 0, 0]} />
                <Bar dataKey="workOrders" fill="#d1911f" name="OT" radius={[6, 6, 0, 0]} />
                <Bar dataKey="deliveries" fill="#59834d" name="Entregas" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="chart-panel" ref={categoriesRef}>
          <div className="chart-panel__header">
            <div>
              <p className="eyebrow">Mix comercial</p>
              <h3>Venta por categoria</h3>
            </div>
            <span className="chart-caption">Participacion</span>
          </div>
          <div className="chart-surface">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  cx="50%"
                  cy="50%"
                  data={categoryBreakdown}
                  dataKey="revenue"
                  innerRadius={58}
                  nameKey="category"
                  outerRadius={106}
                  paddingAngle={3}
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell fill={chartPalette[index % chartPalette.length]} key={entry.category} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatClp(Number(value ?? 0))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="chart-panel chart-panel--wide" ref={customersRef}>
          <div className="chart-panel__header">
            <div>
              <p className="eyebrow">Clientes clave</p>
              <h3>Top clientes por facturacion</h3>
            </div>
            <span className="chart-caption">Ranking filtrado</span>
          </div>
          <div className="chart-surface">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={customerRanking}>
                <CartesianGrid stroke="rgba(17, 32, 51, 0.1)" strokeDasharray="4 6" />
                <XAxis dataKey="customer" stroke="#536277" />
                <YAxis stroke="#536277" tickFormatter={(value) => `${Math.round(value / 1000000)}M`} />
                <Tooltip
                  formatter={(value) => formatClp(Number(value ?? 0))}
                  labelStyle={{ color: "#112033" }}
                />
                <Legend />
                <Line
                  dataKey="revenue"
                  dot={{ fill: "#29b7b0", r: 4 }}
                  name="Ventas"
                  stroke="#29b7b0"
                  strokeWidth={3}
                  type="monotone"
                />
                <Line
                  dataKey="outstanding"
                  dot={{ fill: "#cf5a5f", r: 4 }}
                  name="Saldo pendiente"
                  stroke="#cf5a5f"
                  strokeWidth={2}
                  type="monotone"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <div className="split-grid">
        <article className="chart-panel">
          <div className="chart-panel__header">
            <div>
              <p className="eyebrow">Detalle temporal</p>
              <h3>Desglose mensual</h3>
            </div>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mes</th>
                  <th>Ventas</th>
                  <th>Costos</th>
                  <th>Aprobadas</th>
                  <th>OT</th>
                  <th>Cobranza</th>
                </tr>
              </thead>
              <tbody>
                {filteredSnapshots.map((record) => (
                  <tr key={record.periodStart}>
                    <td>{record.label}</td>
                    <td>{formatClp(record.revenue)}</td>
                    <td>{formatClp(record.costs)}</td>
                    <td>{record.quotesApproved}</td>
                    <td>{record.workOrders}</td>
                    <td>{formatClp(record.collected)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="chart-panel">
          <div className="chart-panel__header">
            <div>
              <p className="eyebrow">Ranking comercial</p>
              <h3>Clientes con mayor impacto</h3>
            </div>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Ventas</th>
                  <th>Cotizaciones</th>
                  <th>Saldo</th>
                </tr>
              </thead>
              <tbody>
                {customerRanking.map((customer) => (
                  <tr key={customer.customer}>
                    <td>{customer.customer}</td>
                    <td>{formatClp(customer.revenue)}</td>
                    <td>{customer.quotes}</td>
                    <td>{formatClp(customer.outstanding)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>

      <div className="split-grid">
        <article className="chart-panel">
          <div className="chart-panel__header">
            <div>
              <p className="eyebrow">Actividad viva</p>
              <h3>Flujo compartido actual</h3>
            </div>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Modulo</th>
                  <th>Ultimo registro</th>
                  <th>Detalle</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cotizaciones</td>
                  <td>{savedQuotes[0]?.number ?? "Sin registros"}</td>
                  <td>{savedQuotes[0] ? `${savedQuotes[0].customer} · ${formatClp(savedQuotes[0].total)}` : "Guarda una cotizacion desde Comercial."}</td>
                </tr>
                <tr>
                  <td>Produccion</td>
                  <td>{workOrders[0]?.number ?? "Sin registros"}</td>
                  <td>{workOrders[0] ? `${workOrders[0].customer} · ${workOrders[0].area}` : "Genera una OT desde Produccion."}</td>
                </tr>
                <tr>
                  <td>Compras</td>
                  <td>{purchases[0]?.number ?? "Sin registros"}</td>
                  <td>{purchases[0] ? `${purchases[0].supplier} · ${formatClp(purchases[0].total)}` : "Guarda una OC desde Compras."}</td>
                </tr>
                <tr>
                  <td>Inventario</td>
                  <td>{inventoryMovements[0]?.reference ?? "Sin registros"}</td>
                  <td>{inventoryMovements[0] ? `${inventoryMovements[0].operation} · ${inventoryMovements[0].item}` : "Aplica un movimiento en Inventario."}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <article className="chart-panel">
          <div className="chart-panel__header">
            <div>
              <p className="eyebrow">Notas del modelo</p>
              <h3>Como se conectan hoy los modulos</h3>
            </div>
          </div>

          <div className="timeline-list">
            <article>
              <strong>1. Cotizacion sincronizada</strong>
              <p>Se guarda en la capa compartida y queda disponible inmediatamente en Produccion y Reportes.</p>
            </article>
            <article>
              <strong>2. OT o compra compartida</strong>
              <p>Las nuevas OT y OC se agregan al estado comun y alimentan el tablero vivo.</p>
            </article>
            <article>
              <strong>3. Inventario compartido</strong>
              <p>Los movimientos registrados afectan el stock simulado y el resumen operativo del dashboard.</p>
            </article>
          </div>
        </article>
      </div>
    </div>
  );
}
