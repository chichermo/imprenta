export type PeriodPreset = "30d" | "90d" | "6m" | "12m" | "all";

export type PerformanceSnapshot = {
  periodStart: string;
  label: string;
  revenue: number;
  costs: number;
  quotesCreated: number;
  quotesApproved: number;
  workOrders: number;
  deliveries: number;
  purchases: number;
  collected: number;
  outstanding: number;
  clinicalSales: number;
  printSales: number;
  signageSales: number;
  paperSales: number;
};

export type CustomerPerformancePoint = {
  periodStart: string;
  customer: string;
  revenue: number;
  quotes: number;
  outstanding: number;
};

export type ReportSummaryMetric = {
  label: string;
  value: string;
  helper: string;
};

export type CategoryBreakdown = {
  category: string;
  revenue: number;
  share: number;
};

export type OperationsBreakdown = {
  label: string;
  quotesCreated: number;
  quotesApproved: number;
  workOrders: number;
  deliveries: number;
};

export type CustomerRanking = {
  customer: string;
  revenue: number;
  quotes: number;
  outstanding: number;
};

export const periodOptions: { value: PeriodPreset; label: string }[] = [
  { value: "30d", label: "Ultimos 30 dias" },
  { value: "90d", label: "Ultimos 90 dias" },
  { value: "6m", label: "Ultimos 6 meses" },
  { value: "12m", label: "Ultimos 12 meses" },
  { value: "all", label: "Todo el historial" },
];

export const performanceSnapshots: PerformanceSnapshot[] = [
  {
    periodStart: "2025-06-01",
    label: "Jun 2025",
    revenue: 7200000,
    costs: 4810000,
    quotesCreated: 16,
    quotesApproved: 9,
    workOrders: 8,
    deliveries: 7,
    purchases: 5,
    collected: 6030000,
    outstanding: 1710000,
    clinicalSales: 2560000,
    printSales: 2010000,
    signageSales: 1480000,
    paperSales: 1150000,
  },
  {
    periodStart: "2025-07-01",
    label: "Jul 2025",
    revenue: 7680000,
    costs: 5060000,
    quotesCreated: 17,
    quotesApproved: 10,
    workOrders: 9,
    deliveries: 8,
    purchases: 6,
    collected: 6340000,
    outstanding: 1860000,
    clinicalSales: 2780000,
    printSales: 2050000,
    signageSales: 1610000,
    paperSales: 1240000,
  },
  {
    periodStart: "2025-08-01",
    label: "Ago 2025",
    revenue: 8040000,
    costs: 5310000,
    quotesCreated: 18,
    quotesApproved: 11,
    workOrders: 10,
    deliveries: 8,
    purchases: 6,
    collected: 6680000,
    outstanding: 1980000,
    clinicalSales: 2910000,
    printSales: 2160000,
    signageSales: 1710000,
    paperSales: 1260000,
  },
  {
    periodStart: "2025-09-01",
    label: "Sep 2025",
    revenue: 8520000,
    costs: 5630000,
    quotesCreated: 19,
    quotesApproved: 12,
    workOrders: 10,
    deliveries: 9,
    purchases: 6,
    collected: 6940000,
    outstanding: 2040000,
    clinicalSales: 3050000,
    printSales: 2210000,
    signageSales: 1840000,
    paperSales: 1420000,
  },
  {
    periodStart: "2025-10-01",
    label: "Oct 2025",
    revenue: 9010000,
    costs: 5850000,
    quotesCreated: 21,
    quotesApproved: 13,
    workOrders: 11,
    deliveries: 10,
    purchases: 7,
    collected: 7420000,
    outstanding: 2190000,
    clinicalSales: 3210000,
    printSales: 2380000,
    signageSales: 1980000,
    paperSales: 1440000,
  },
  {
    periodStart: "2025-11-01",
    label: "Nov 2025",
    revenue: 9480000,
    costs: 6120000,
    quotesCreated: 22,
    quotesApproved: 14,
    workOrders: 12,
    deliveries: 10,
    purchases: 7,
    collected: 7830000,
    outstanding: 2270000,
    clinicalSales: 3320000,
    printSales: 2560000,
    signageSales: 2110000,
    paperSales: 1490000,
  },
  {
    periodStart: "2025-12-01",
    label: "Dic 2025",
    revenue: 9860000,
    costs: 6390000,
    quotesCreated: 24,
    quotesApproved: 15,
    workOrders: 13,
    deliveries: 11,
    purchases: 8,
    collected: 8140000,
    outstanding: 2360000,
    clinicalSales: 3440000,
    printSales: 2660000,
    signageSales: 2230000,
    paperSales: 1530000,
  },
  {
    periodStart: "2026-01-01",
    label: "Ene 2026",
    revenue: 10320000,
    costs: 6670000,
    quotesCreated: 25,
    quotesApproved: 16,
    workOrders: 14,
    deliveries: 12,
    purchases: 8,
    collected: 8420000,
    outstanding: 2480000,
    clinicalSales: 3610000,
    printSales: 2780000,
    signageSales: 2320000,
    paperSales: 1610000,
  },
  {
    periodStart: "2026-02-01",
    label: "Feb 2026",
    revenue: 10840000,
    costs: 7010000,
    quotesCreated: 26,
    quotesApproved: 16,
    workOrders: 14,
    deliveries: 12,
    purchases: 8,
    collected: 8780000,
    outstanding: 2550000,
    clinicalSales: 3780000,
    printSales: 2910000,
    signageSales: 2410000,
    paperSales: 1740000,
  },
  {
    periodStart: "2026-03-01",
    label: "Mar 2026",
    revenue: 11260000,
    costs: 7240000,
    quotesCreated: 27,
    quotesApproved: 17,
    workOrders: 15,
    deliveries: 13,
    purchases: 9,
    collected: 9140000,
    outstanding: 2610000,
    clinicalSales: 3940000,
    printSales: 3020000,
    signageSales: 2510000,
    paperSales: 1790000,
  },
  {
    periodStart: "2026-04-01",
    label: "Abr 2026",
    revenue: 11880000,
    costs: 7590000,
    quotesCreated: 29,
    quotesApproved: 18,
    workOrders: 16,
    deliveries: 14,
    purchases: 9,
    collected: 9520000,
    outstanding: 2720000,
    clinicalSales: 4210000,
    printSales: 3150000,
    signageSales: 2640000,
    paperSales: 1850000,
  },
  {
    periodStart: "2026-05-01",
    label: "May 2026",
    revenue: 12400000,
    costs: 7920000,
    quotesCreated: 30,
    quotesApproved: 19,
    workOrders: 17,
    deliveries: 15,
    purchases: 10,
    collected: 9810000,
    outstanding: 2840000,
    clinicalSales: 4380000,
    printSales: 3280000,
    signageSales: 2790000,
    paperSales: 1940000,
  },
];

export const customerPerformancePoints: CustomerPerformancePoint[] = [
  { periodStart: "2026-02-01", customer: "Hospital San Gabriel", revenue: 2430000, quotes: 4, outstanding: 870000 },
  { periodStart: "2026-03-01", customer: "Hospital San Gabriel", revenue: 2680000, quotes: 4, outstanding: 940000 },
  { periodStart: "2026-04-01", customer: "Hospital San Gabriel", revenue: 2910000, quotes: 5, outstanding: 1020000 },
  { periodStart: "2026-05-01", customer: "Hospital San Gabriel", revenue: 3120000, quotes: 5, outstanding: 1120000 },
  { periodStart: "2026-02-01", customer: "Clinica Los Aromos", revenue: 1560000, quotes: 3, outstanding: 410000 },
  { periodStart: "2026-03-01", customer: "Clinica Los Aromos", revenue: 1710000, quotes: 3, outstanding: 430000 },
  { periodStart: "2026-04-01", customer: "Clinica Los Aromos", revenue: 1840000, quotes: 4, outstanding: 460000 },
  { periodStart: "2026-05-01", customer: "Clinica Los Aromos", revenue: 1960000, quotes: 4, outstanding: 490000 },
  { periodStart: "2026-02-01", customer: "Centro Medico Pacifico", revenue: 1280000, quotes: 2, outstanding: 320000 },
  { periodStart: "2026-03-01", customer: "Centro Medico Pacifico", revenue: 1320000, quotes: 3, outstanding: 350000 },
  { periodStart: "2026-04-01", customer: "Centro Medico Pacifico", revenue: 1490000, quotes: 3, outstanding: 390000 },
  { periodStart: "2026-05-01", customer: "Centro Medico Pacifico", revenue: 1620000, quotes: 3, outstanding: 420000 },
  { periodStart: "2026-02-01", customer: "Laboratorio Medipack", revenue: 910000, quotes: 2, outstanding: 180000 },
  { periodStart: "2026-03-01", customer: "Laboratorio Medipack", revenue: 980000, quotes: 2, outstanding: 195000 },
  { periodStart: "2026-04-01", customer: "Laboratorio Medipack", revenue: 1060000, quotes: 2, outstanding: 205000 },
  { periodStart: "2026-05-01", customer: "Laboratorio Medipack", revenue: 1170000, quotes: 3, outstanding: 225000 },
];

function getLatestDate(records: PerformanceSnapshot[]) {
  return new Date(records[records.length - 1].periodStart);
}

function getPresetStartDate(preset: PeriodPreset, latestDate: Date) {
  const startDate = new Date(latestDate);

  if (preset === "30d") {
    startDate.setDate(startDate.getDate() - 30);
    return startDate;
  }

  if (preset === "90d") {
    startDate.setDate(startDate.getDate() - 90);
    return startDate;
  }

  if (preset === "6m") {
    startDate.setMonth(startDate.getMonth() - 5);
    return startDate;
  }

  if (preset === "12m") {
    startDate.setMonth(startDate.getMonth() - 11);
    return startDate;
  }

  return new Date(recordsStartDate());
}

function recordsStartDate() {
  return performanceSnapshots[0].periodStart;
}

export function filterSnapshotsByPeriod(preset: PeriodPreset) {
  if (preset === "all") {
    return performanceSnapshots;
  }

  const latestDate = getLatestDate(performanceSnapshots);
  const startDate = getPresetStartDate(preset, latestDate);

  return performanceSnapshots.filter((record) => new Date(record.periodStart) >= startDate);
}

export function filterCustomerPointsByPeriod(preset: PeriodPreset) {
  if (preset === "all") {
    return customerPerformancePoints;
  }

  const latestDate = getLatestDate(performanceSnapshots);
  const startDate = getPresetStartDate(preset, latestDate);

  return customerPerformancePoints.filter((record) => new Date(record.periodStart) >= startDate);
}

export function buildSummaryMetrics(records: PerformanceSnapshot[]): ReportSummaryMetric[] {
  const revenue = records.reduce((sum, record) => sum + record.revenue, 0);
  const costs = records.reduce((sum, record) => sum + record.costs, 0);
  const quotesCreated = records.reduce((sum, record) => sum + record.quotesCreated, 0);
  const quotesApproved = records.reduce((sum, record) => sum + record.quotesApproved, 0);
  const workOrders = records.reduce((sum, record) => sum + record.workOrders, 0);
  const collected = records.reduce((sum, record) => sum + record.collected, 0);
  const outstanding = records[records.length - 1]?.outstanding ?? 0;
  const margin = revenue > 0 ? Math.round(((revenue - costs) / revenue) * 100) : 0;
  const approvalRate = quotesCreated > 0 ? Math.round((quotesApproved / quotesCreated) * 100) : 0;

  return [
    {
      label: "Ventas acumuladas",
      value: `${Math.round(revenue / 100000) / 10}M`,
      helper: "Suma filtrada de ventas proyectadas y cerradas en el periodo.",
    },
    {
      label: "Margen bruto",
      value: `${margin}%`,
      helper: "Estimado segun costo versus ingreso en la mezcla actual del negocio.",
    },
    {
      label: "Aprobacion comercial",
      value: `${approvalRate}%`,
      helper: "Relacion entre cotizaciones emitidas y cotizaciones aprobadas.",
    },
    {
      label: "OT generadas",
      value: workOrders.toString(),
      helper: "Carga productiva potencial que nace desde ventas consultivas.",
    },
    {
      label: "Cobranza registrada",
      value: `${Math.round(collected / 100000) / 10}M`,
      helper: "Ingresos efectivamente recaudados durante el periodo filtrado.",
    },
    {
      label: "Saldo pendiente",
      value: `${Math.round(outstanding / 100000) / 10}M`,
      helper: "Cartera estimada al cierre del ultimo tramo del periodo elegido.",
    },
  ];
}

export function buildCategoryBreakdown(records: PerformanceSnapshot[]): CategoryBreakdown[] {
  const totals = {
    "Insumos clinicos": 0,
    Imprenta: 0,
    Senaletica: 0,
    "Papeleria y consumo": 0,
  };

  for (const record of records) {
    totals["Insumos clinicos"] += record.clinicalSales;
    totals.Imprenta += record.printSales;
    totals.Senaletica += record.signageSales;
    totals["Papeleria y consumo"] += record.paperSales;
  }

  const totalRevenue = Object.values(totals).reduce((sum, value) => sum + value, 0);

  return Object.entries(totals).map(([category, revenue]) => ({
    category,
    revenue,
    share: totalRevenue > 0 ? Math.round((revenue / totalRevenue) * 1000) / 10 : 0,
  }));
}

export function buildOperationsBreakdown(records: PerformanceSnapshot[]): OperationsBreakdown[] {
  return records.map((record) => ({
    label: record.label,
    quotesCreated: record.quotesCreated,
    quotesApproved: record.quotesApproved,
    workOrders: record.workOrders,
    deliveries: record.deliveries,
  }));
}

export function buildCustomerRanking(points: CustomerPerformancePoint[]): CustomerRanking[] {
  const grouped = new Map<string, CustomerRanking>();

  for (const point of points) {
    const current = grouped.get(point.customer) ?? {
      customer: point.customer,
      revenue: 0,
      quotes: 0,
      outstanding: 0,
    };

    current.revenue += point.revenue;
    current.quotes += point.quotes;
    current.outstanding = point.outstanding;
    grouped.set(point.customer, current);
  }

  return [...grouped.values()].sort((a, b) => b.revenue - a.revenue);
}
