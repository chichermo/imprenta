export type NavItem = {
  href: string;
  label: string;
  description: string;
  shortLabel: string;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export type Metric = {
  label: string;
  value: string;
  helper: string;
};

export type WorkStage = {
  name: string;
  summary: string;
};

export type CollectionBlueprint = {
  name: string;
  purpose: string;
  fields: string[];
};

export const companyProfile = {
  name: "Distribuidora San Pablo S.A.",
  region: "Quinta Region, Chile",
  positioning:
    "Imprenta comercial y distribuidora de insumos para clinicas, centros de salud y empresas.",
  specialty: "Salud, imprenta y senaletica",
};

export const navigationSections: NavSection[] = [
  {
    title: "Comercial",
    items: [
      {
        href: "/",
        label: "Inicio",
        shortLabel: "Home",
        description: "Vista general del negocio y accesos rapidos.",
      },
      {
        href: "/clientes",
        label: "Clientes",
        shortLabel: "CRM",
        description: "Ficha comercial, RUT, contactos, condiciones y cobranzas.",
      },
      {
        href: "/cotizaciones",
        label: "Cotizaciones",
        shortLabel: "Quotes",
        description: "Ventas consultivas para impresos, senaletica e insumos.",
      },
      {
        href: "/catalogo",
        label: "Catalogo",
        shortLabel: "Items",
        description: "Productos, servicios y trabajos con precio y unidad.",
      },
    ],
  },
  {
    title: "Operaciones",
    items: [
      {
        href: "/ordenes-trabajo",
        label: "Produccion",
        shortLabel: "OT",
        description: "Ordenes de trabajo, responsables y plazos de entrega.",
      },
      {
        href: "/compras",
        label: "Compras",
        shortLabel: "OC",
        description: "Ordenes de compra y seguimiento de reposiciones.",
      },
      {
        href: "/inventario",
        label: "Inventario",
        shortLabel: "Stock",
        description: "Stock, compras, reservas y alertas de quiebre.",
      },
      {
        href: "/entregas",
        label: "Entregas",
        shortLabel: "Ruta",
        description: "Despachos, remitos y estado de entrega por cliente.",
      },
    ],
  },
  {
    title: "Administracion",
    items: [
      {
        href: "/proveedores",
        label: "Proveedores",
        shortLabel: "Prov",
        description: "Abastecimiento, tiempos de entrega y compras.",
      },
      {
        href: "/cobranzas",
        label: "Cobranzas",
        shortLabel: "CxC",
        description: "Saldos pendientes, vencimientos y seguimiento de pago.",
      },
      {
        href: "/facturacion",
        label: "Facturacion",
        shortLabel: "DTE",
        description: "Documentos tributarios y control DTE para Chile.",
      },
      {
        href: "/reportes",
        label: "Reportes",
        shortLabel: "BI",
        description: "Ventas, margenes, clientes clave y tableros de gestion.",
      },
    ],
  },
];

export const navigation: NavItem[] = navigationSections.flatMap((section) => section.items);

export const quickActions = [
  { href: "/cotizaciones", label: "Nueva venta" },
  { href: "/ordenes-trabajo", label: "Produccion" },
  { href: "/compras", label: "Reposicion" },
  { href: "/facturacion", label: "Facturacion" },
];

export const dashboardMetrics: Metric[] = [
  {
    label: "Cotizaciones activas",
    value: "24",
    helper: "12 clinicas, 7 empresas y 5 trabajos especiales.",
  },
  {
    label: "Ordenes en produccion",
    value: "8",
    helper: "4 impresiones, 2 letreros, 2 reposiciones de insumos.",
  },
  {
    label: "Stock critico",
    value: "6 SKU",
    helper: "Sabanillas, toallas novas gigantes y dos tipos de papel.",
  },
  {
    label: "Cuentas por cobrar",
    value: "CLP 4.8M",
    helper: "Con foco en clientes institucionales a 30 y 60 dias.",
  },
];

export const commercialFlow: WorkStage[] = [
  {
    name: "Venta consultiva",
    summary:
      "El equipo registra necesidades del cliente y arma una cotizacion con productos, servicios o trabajos a medida.",
  },
  {
    name: "Aprobacion y produccion",
    summary:
      "Las cotizaciones aprobadas generan ordenes de trabajo, reserva de stock y compras si falta abastecimiento.",
  },
  {
    name: "Entrega y facturacion",
    summary:
      "El sistema deja lista la entrega y la futura emision DTE para Chile con trazabilidad documental.",
  },
];

export const appwriteCollections: CollectionBlueprint[] = [
  {
    name: "customers",
    purpose: "Ficha maestra de clientes empresa y centros de salud.",
    fields: [
      "business_name",
      "rut",
      "giro",
      "billing_address",
      "payment_terms",
      "price_list_id",
    ],
  },
  {
    name: "products",
    purpose: "Catalogo unificado de insumos fisicos y articulos estandar.",
    fields: [
      "sku",
      "name",
      "category",
      "unit",
      "stock",
      "reorder_level",
      "net_price",
    ],
  },
  {
    name: "services",
    purpose: "Servicios de imprenta, letreros y trabajos personalizados.",
    fields: [
      "name",
      "service_type",
      "base_price",
      "lead_time_days",
      "technical_notes",
    ],
  },
  {
    name: "quotes",
    purpose: "Cabecera comercial con estado, vigencia y montos.",
    fields: [
      "customer_id",
      "quote_number",
      "status",
      "valid_until",
      "subtotal",
      "tax_amount",
      "total_amount",
    ],
  },
  {
    name: "quote_items",
    purpose: "Detalle flexible de productos, servicios y trabajos a medida.",
    fields: [
      "quote_id",
      "item_type",
      "description",
      "quantity",
      "unit_price",
      "discount_percent",
    ],
  },
  {
    name: "work_orders",
    purpose: "Seguimiento productivo desde diseno hasta entrega.",
    fields: [
      "quote_id",
      "production_status",
      "assigned_to",
      "due_date",
      "technical_specs",
    ],
  },
  {
    name: "inventory_movements",
    purpose: "Bitacora de entradas, salidas, reservas y ajustes.",
    fields: [
      "product_id",
      "movement_type",
      "quantity",
      "reference_type",
      "reference_id",
      "performed_by",
    ],
  },
  {
    name: "dte_submissions",
    purpose: "Control tributario para futura integracion con SII o proveedor DTE.",
    fields: [
      "document_type",
      "invoice_id",
      "folio",
      "track_id",
      "sii_status",
      "xml_file_id",
    ],
  },
];
