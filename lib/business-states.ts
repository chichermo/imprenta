import { StatusTone } from "@/lib/mock-data";

export const QUOTE_STATUSES = [
  "Borrador",
  "Enviada",
  "Aprobada",
  "Rechazada",
  "Vencida",
  "Convertida",
] as const;

export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

export const WORK_ORDER_STATUSES = [
  "Pendiente",
  "Diseno",
  "Esperando aprobacion",
  "En produccion",
  "Lista para entrega",
  "Entregada",
] as const;

export type WorkOrderStatus = (typeof WORK_ORDER_STATUSES)[number];

export const PURCHASE_STATUSES = [
  "Borrador",
  "Pendiente aprobacion",
  "Confirmada",
  "En transito",
  "Recibida",
  "Cancelada",
] as const;

export type PurchaseStatus = (typeof PURCHASE_STATUSES)[number];

const QUOTE_TRANSITIONS: Record<QuoteStatus, QuoteStatus[]> = {
  Borrador: ["Enviada", "Aprobada", "Rechazada"],
  Enviada: ["Aprobada", "Rechazada", "Vencida"],
  Aprobada: ["Convertida", "Rechazada"],
  Rechazada: [],
  Vencida: [],
  Convertida: [],
};

const WORK_ORDER_TRANSITIONS: Record<WorkOrderStatus, WorkOrderStatus[]> = {
  Pendiente: ["Diseno"],
  Diseno: ["Esperando aprobacion"],
  "Esperando aprobacion": ["En produccion"],
  "En produccion": ["Lista para entrega"],
  "Lista para entrega": ["Entregada"],
  Entregada: [],
};

const PURCHASE_TRANSITIONS: Record<PurchaseStatus, PurchaseStatus[]> = {
  Borrador: ["Pendiente aprobacion", "Cancelada"],
  "Pendiente aprobacion": ["Confirmada", "Cancelada"],
  Confirmada: ["En transito", "Recibida"],
  "En transito": ["Recibida"],
  Recibida: [],
  Cancelada: [],
};

const LEGACY_QUOTE_STATUS: Record<string, QuoteStatus> = {
  Sincronizada: "Borrador",
};

const LEGACY_WORK_ORDER_STATUS: Record<string, WorkOrderStatus> = {
  Planificada: "Pendiente",
};

export function normalizeQuoteStatus(raw: string | undefined): QuoteStatus {
  if (!raw) {
    return "Borrador";
  }

  if (QUOTE_STATUSES.includes(raw as QuoteStatus)) {
    return raw as QuoteStatus;
  }

  return LEGACY_QUOTE_STATUS[raw] ?? "Borrador";
}

export function normalizeWorkOrderStatus(raw: string | undefined): WorkOrderStatus {
  if (!raw) {
    return "Pendiente";
  }

  if (WORK_ORDER_STATUSES.includes(raw as WorkOrderStatus)) {
    return raw as WorkOrderStatus;
  }

  return LEGACY_WORK_ORDER_STATUS[raw] ?? "Pendiente";
}

export function normalizePurchaseStatus(raw: string | undefined): PurchaseStatus {
  if (!raw) {
    return "Borrador";
  }

  if (PURCHASE_STATUSES.includes(raw as PurchaseStatus)) {
    return raw as PurchaseStatus;
  }

  return "Borrador";
}

export function getNextQuoteStatuses(status: QuoteStatus) {
  return QUOTE_TRANSITIONS[status];
}

export function getNextWorkOrderStatuses(status: WorkOrderStatus) {
  return WORK_ORDER_TRANSITIONS[status];
}

export function getNextPurchaseStatuses(status: PurchaseStatus) {
  return PURCHASE_TRANSITIONS[status];
}

export function canTransitionQuote(from: QuoteStatus, to: QuoteStatus) {
  return QUOTE_TRANSITIONS[from].includes(to);
}

export function canTransitionWorkOrder(from: WorkOrderStatus, to: WorkOrderStatus) {
  return WORK_ORDER_TRANSITIONS[from].includes(to);
}

export function canTransitionPurchase(from: PurchaseStatus, to: PurchaseStatus) {
  return PURCHASE_TRANSITIONS[from].includes(to);
}

export function getQuoteStatusTone(status: QuoteStatus): StatusTone {
  switch (status) {
    case "Aprobada":
    case "Convertida":
      return "success";
    case "Enviada":
      return "info";
    case "Rechazada":
    case "Vencida":
      return "danger";
    default:
      return "neutral";
  }
}

export function getWorkOrderStatusTone(status: WorkOrderStatus): StatusTone {
  switch (status) {
    case "Entregada":
    case "Lista para entrega":
      return "success";
    case "En produccion":
      return "info";
    case "Esperando aprobacion":
      return "warning";
    default:
      return "neutral";
  }
}

export function getPurchaseStatusTone(status: PurchaseStatus): StatusTone {
  switch (status) {
    case "Recibida":
    case "Confirmada":
      return "success";
    case "En transito":
      return "info";
    case "Pendiente aprobacion":
      return "warning";
    case "Cancelada":
      return "danger";
    default:
      return "neutral";
  }
}

export function getPrimaryQuoteAction(status: QuoteStatus): QuoteStatus | null {
  const [next] = getNextQuoteStatuses(status);
  return next ?? null;
}

export function getPrimaryWorkOrderAction(status: WorkOrderStatus): WorkOrderStatus | null {
  const [next] = getNextWorkOrderStatuses(status);
  return next ?? null;
}

export function getPrimaryPurchaseAction(status: PurchaseStatus): PurchaseStatus | null {
  const [next] = getNextPurchaseStatuses(status);
  return next ?? null;
}
