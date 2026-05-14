export type StatusTone =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

export type CustomerRecord = {
  businessName: string;
  segment: string;
  rut: string;
  commune: string;
  paymentTerms: string;
  lastQuote: string;
  balance: string;
};

export type SupplierRecord = {
  name: string;
  category: string;
  leadTime: string;
  contact: string;
  status: string;
  tone: StatusTone;
};

export type CatalogRecord = {
  code: string;
  name: string;
  type: string;
  category: string;
  unit: string;
  price: string;
  stock: string;
  status: string;
  tone: StatusTone;
};

export type QuoteRecord = {
  number: string;
  customer: string;
  summary: string;
  validUntil: string;
  total: string;
  status: string;
  tone: StatusTone;
};

export type WorkOrderRecord = {
  number: string;
  customer: string;
  area: string;
  deliveryDate: string;
  status: string;
  tone: StatusTone;
  summary: string;
};

export type PurchaseOrderRecord = {
  number: string;
  supplier: string;
  eta: string;
  total: string;
  status: string;
  tone: StatusTone;
};

export type StockAlert = {
  item: string;
  currentStock: string;
  reorderPoint: string;
  suggestion: string;
  tone: StatusTone;
};

export type InventoryMovement = {
  date: string;
  item: string;
  type: string;
  quantity: string;
  reference: string;
};

export type DteReadiness = {
  area: string;
  status: string;
  tone: StatusTone;
  notes: string;
};

export type DashboardAlert = {
  title: string;
  description: string;
  tone: StatusTone;
};

export type ReceivableRecord = {
  customer: string;
  document: string;
  dueDate: string;
  amount: string;
  owner: string;
  status: string;
  tone: StatusTone;
};

export type DeliveryRecord = {
  number: string;
  customer: string;
  destination: string;
  scheduled: string;
  status: string;
  tone: StatusTone;
  summary: string;
};

export type ReportSummary = {
  label: string;
  value: string;
  helper: string;
};

export type CategoryPerformance = {
  category: string;
  sales: string;
  share: string;
  trend: string;
};

export const customerRecords: CustomerRecord[] = [
  {
    businessName: "Clinica Los Aromos",
    segment: "Clinica privada",
    rut: "76.321.550-4",
    commune: "Villa Alemana",
    paymentTerms: "30 dias",
    lastQuote: "Aprobada",
    balance: "CLP 980.000",
  },
  {
    businessName: "Centro Medico Pacifico",
    segment: "Centro de salud",
    rut: "77.118.204-2",
    commune: "Vina del Mar",
    paymentTerms: "15 dias",
    lastQuote: "Enviada",
    balance: "CLP 420.000",
  },
  {
    businessName: "Hospital San Gabriel",
    segment: "Institucion publica",
    rut: "61.982.000-7",
    commune: "Valparaiso",
    paymentTerms: "60 dias",
    lastQuote: "Borrador",
    balance: "CLP 2.400.000",
  },
  {
    businessName: "Laboratorio Medipack",
    segment: "Proveedor salud",
    rut: "79.553.410-9",
    commune: "Quilpue",
    paymentTerms: "30 dias",
    lastQuote: "Aprobada",
    balance: "CLP 0",
  },
];

export const supplierRecords: SupplierRecord[] = [
  {
    name: "Papeles Bio Bio",
    category: "Papeleria e impresion",
    leadTime: "3 dias habiles",
    contact: "ventas@papelesbiobio.cl",
    status: "Activo",
    tone: "success",
  },
  {
    name: "Nova Industrial Chile",
    category: "Aseo clinico",
    leadTime: "5 dias habiles",
    contact: "ejecutivo@novaindustrial.cl",
    status: "Reposicion programada",
    tone: "info",
  },
  {
    name: "PVC y Senaletica SPA",
    category: "Letreros y troviseles",
    leadTime: "7 dias habiles",
    contact: "contacto@pvcsenaletica.cl",
    status: "Cotizacion abierta",
    tone: "warning",
  },
];

export const catalogRecords: CatalogRecord[] = [
  {
    code: "INS-001",
    name: "Sabanilla 60x90 absorbente",
    type: "Producto",
    category: "Insumos clinicos",
    unit: "paquete",
    price: "CLP 24.900",
    stock: "18",
    status: "Disponible",
    tone: "success",
  },
  {
    code: "ASE-004",
    name: "Toalla nova jumbo industrial",
    type: "Producto",
    category: "Aseo y consumo",
    unit: "rollo",
    price: "CLP 8.600",
    stock: "6",
    status: "Stock bajo",
    tone: "warning",
  },
  {
    code: "IMP-011",
    name: "Formulario autocopiativo A5",
    type: "Trabajo",
    category: "Imprenta",
    unit: "talonario",
    price: "CLP 5.400",
    stock: "A pedido",
    status: "Produccion",
    tone: "info",
  },
  {
    code: "SIG-008",
    name: "Letrero PVC 3 mm",
    type: "Servicio",
    category: "Senaletica",
    unit: "m2",
    price: "CLP 18.000",
    stock: "A pedido",
    status: "Activo",
    tone: "success",
  },
];

export const quoteRecords: QuoteRecord[] = [
  {
    number: "COT-2026-041",
    customer: "Clinica Los Aromos",
    summary: "Sabanillas + formularios de admision",
    validUntil: "20 may 2026",
    total: "CLP 1.240.000",
    status: "Aprobada",
    tone: "success",
  },
  {
    number: "COT-2026-043",
    customer: "Centro Medico Pacifico",
    summary: "Toallas novas jumbo y senaletica interior",
    validUntil: "18 may 2026",
    total: "CLP 860.000",
    status: "Enviada",
    tone: "info",
  },
  {
    number: "COT-2026-045",
    customer: "Hospital San Gabriel",
    summary: "Resmas, sabanillas y letreros de area limpia",
    validUntil: "22 may 2026",
    total: "CLP 2.980.000",
    status: "Revision interna",
    tone: "warning",
  },
  {
    number: "COT-2026-046",
    customer: "Laboratorio Medipack",
    summary: "Etiquetas y troviseles para exhibicion",
    validUntil: "25 may 2026",
    total: "CLP 540.000",
    status: "Borrador",
    tone: "neutral",
  },
];

export const workOrderRecords: WorkOrderRecord[] = [
  {
    number: "OT-2026-012",
    customer: "Clinica Los Aromos",
    area: "Imprenta",
    deliveryDate: "17 may 2026",
    status: "En produccion",
    tone: "info",
    summary: "100 talonarios autocopiativos para admision.",
  },
  {
    number: "OT-2026-013",
    customer: "Centro Medico Pacifico",
    area: "Senaletica",
    deliveryDate: "19 may 2026",
    status: "Esperando aprobacion",
    tone: "warning",
    summary: "Letreros PVC para salas de procedimiento.",
  },
  {
    number: "OT-2026-014",
    customer: "Farmacia Santa Elena",
    area: "Gran formato",
    deliveryDate: "16 may 2026",
    status: "Lista para entrega",
    tone: "success",
    summary: "Troviseles promocionales y adhesivos de vitrina.",
  },
];

export const purchaseOrderRecords: PurchaseOrderRecord[] = [
  {
    number: "OC-2026-019",
    supplier: "Nova Industrial Chile",
    eta: "16 may 2026",
    total: "CLP 480.000",
    status: "En transito",
    tone: "info",
  },
  {
    number: "OC-2026-020",
    supplier: "Papeles Bio Bio",
    eta: "15 may 2026",
    total: "CLP 690.000",
    status: "Confirmada",
    tone: "success",
  },
  {
    number: "OC-2026-021",
    supplier: "PVC y Senaletica SPA",
    eta: "21 may 2026",
    total: "CLP 350.000",
    status: "Pendiente aprobacion",
    tone: "warning",
  },
];

export const stockAlerts: StockAlert[] = [
  {
    item: "Toalla nova jumbo industrial",
    currentStock: "6 rollos",
    reorderPoint: "10 rollos",
    suggestion: "Emitir OC en 24 horas",
    tone: "warning",
  },
  {
    item: "Resma carta 75 gr",
    currentStock: "8 resmas",
    reorderPoint: "12 resmas",
    suggestion: "Consolidar con proxima compra de papeleria",
    tone: "warning",
  },
  {
    item: "PVC espumado 3 mm",
    currentStock: "2 planchas",
    reorderPoint: "5 planchas",
    suggestion: "Reservar para OT-2026-013",
    tone: "danger",
  },
];

export const inventoryMovements: InventoryMovement[] = [
  {
    date: "14 may",
    item: "Sabanilla 60x90 absorbente",
    type: "Salida por venta",
    quantity: "-12 paquetes",
    reference: "COT-2026-041",
  },
  {
    date: "14 may",
    item: "Resma carta 75 gr",
    type: "Reserva",
    quantity: "-4 resmas",
    reference: "OT-2026-012",
  },
  {
    date: "13 may",
    item: "Toalla nova jumbo industrial",
    type: "Entrada por compra",
    quantity: "+10 rollos",
    reference: "OC-2026-018",
  },
];

export const dteReadiness: DteReadiness[] = [
  {
    area: "Datos empresa emisora",
    status: "Listo para configurar",
    tone: "success",
    notes: "Falta registrar razon social, giro y sucursal en settings.",
  },
  {
    area: "Certificado digital",
    status: "Pendiente",
    tone: "warning",
    notes: "Debe definirse proveedor y responsable de custodia.",
  },
  {
    area: "Folios / CAF",
    status: "Pendiente",
    tone: "warning",
    notes: "Se agregara cuando definamos integracion DTE final.",
  },
  {
    area: "Integracion SII o proveedor DTE",
    status: "En definicion",
    tone: "info",
    notes: "Conviene comparar costo mensual versus complejidad tecnica.",
  },
];

export const dashboardAlerts: DashboardAlert[] = [
  {
    title: "Seguimiento comercial",
    description:
      "Hay 3 cotizaciones que vencen esta semana y conviene convertir antes del lunes.",
    tone: "info",
  },
  {
    title: "Reposicion urgente",
    description:
      "El PVC espumado y las toallas novas ya estan bajo umbral para nuevos pedidos grandes.",
    tone: "warning",
  },
  {
    title: "Cobranza",
    description:
      "Dos clientes institucionales concentran la mayor parte de las cuentas por cobrar.",
    tone: "danger",
  },
];

export const quoteTemplateChecklist = [
  "Datos tributarios del cliente",
  "Detalle comercial y tecnico por item",
  "Condiciones de pago",
  "Plazo de entrega",
  "Validez de la oferta",
];

export const workStages = [
  "Pendiente",
  "Diseno",
  "Esperando aprobacion",
  "En produccion",
  "Lista para entrega",
  "Entregada",
];

export const receivableRecords: ReceivableRecord[] = [
  {
    customer: "Hospital San Gabriel",
    document: "FAC-2026-118",
    dueDate: "28 may 2026",
    amount: "CLP 1.860.000",
    owner: "Administracion",
    status: "Por vencer",
    tone: "warning",
  },
  {
    customer: "Clinica Los Aromos",
    document: "FAC-2026-115",
    dueDate: "20 may 2026",
    amount: "CLP 980.000",
    owner: "Ventas",
    status: "Compromiso de pago",
    tone: "info",
  },
  {
    customer: "Centro Medico Pacifico",
    document: "FAC-2026-103",
    dueDate: "08 may 2026",
    amount: "CLP 420.000",
    owner: "Administracion",
    status: "Vencida",
    tone: "danger",
  },
];

export const deliveryRecords: DeliveryRecord[] = [
  {
    number: "ENT-2026-031",
    customer: "Clinica Los Aromos",
    destination: "Villa Alemana",
    scheduled: "16 may 2026 AM",
    status: "Preparando despacho",
    tone: "info",
    summary: "Sabanillas y formularios de admision.",
  },
  {
    number: "ENT-2026-032",
    customer: "Farmacia Santa Elena",
    destination: "Quilpue",
    scheduled: "16 may 2026 PM",
    status: "Lista para salir",
    tone: "success",
    summary: "Troviseles, adhesivos y material promocional.",
  },
  {
    number: "ENT-2026-033",
    customer: "Centro Medico Pacifico",
    destination: "Vina del Mar",
    scheduled: "19 may 2026",
    status: "Pendiente de OT",
    tone: "warning",
    summary: "Senaletica interior y reposicion de consumo.",
  },
];

export const reportSummaries: ReportSummary[] = [
  {
    label: "Venta mensual proyectada",
    value: "CLP 12.4M",
    helper: "Cruza cotizaciones aprobadas, trabajos en curso y reposiciones.",
  },
  {
    label: "Margen estimado",
    value: "31%",
    helper: "Aun sin costo real integrado, pero con base para analitica.",
  },
  {
    label: "Cliente principal",
    value: "Hospital San Gabriel",
    helper: "Mayor ticket y tambien mayor saldo pendiente.",
  },
];

export const categoryPerformance: CategoryPerformance[] = [
  {
    category: "Insumos clinicos",
    sales: "CLP 4.9M",
    share: "39%",
    trend: "Demanda recurrente",
  },
  {
    category: "Imprenta",
    sales: "CLP 3.1M",
    share: "25%",
    trend: "Estable",
  },
  {
    category: "Senaletica",
    sales: "CLP 2.6M",
    share: "21%",
    trend: "En crecimiento",
  },
  {
    category: "Papeleria y consumo",
    sales: "CLP 1.8M",
    share: "15%",
    trend: "Mixto",
  },
];
