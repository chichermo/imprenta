"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { customerRecords } from "@/lib/mock-data";
import { formatClp } from "@/lib/formatters";

export type QuoteLineSource = "catalogo" | "custom";

export type SharedQuoteLine = {
  id: string;
  source: QuoteLineSource;
  code: string;
  name: string;
  type: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  notes: string;
  stock: string;
};

export type QuoteDraft = {
  customer: string;
  validityDays: string;
  deliveryWindow: string;
  note: string;
  includeVat: boolean;
  lines: SharedQuoteLine[];
};

export type SavedQuote = {
  id: string;
  number: string;
  customer: string;
  rut: string;
  commune: string;
  paymentTerms: string;
  validUntilLabel: string;
  deliveryWindow: string;
  note: string;
  includeVat: boolean;
  subtotal: number;
  tax: number;
  total: number;
  lines: SharedQuoteLine[];
  status: string;
  createdAt: string;
};

export type StoredWorkOrder = {
  id: string;
  number: string;
  quoteNumber: string;
  customer: string;
  area: string;
  responsible: string;
  proof: string;
  dueDate: string;
  requiresInstallation: boolean;
  notes: string;
  stages: string[];
  status: string;
  totalLabel: string;
  createdAt: string;
};

export type StoredPurchaseLine = {
  id: string;
  item: string;
  quantity: number;
  unitCost: number;
  purpose: string;
};

export type StoredPurchase = {
  id: string;
  number: string;
  supplier: string;
  eta: string;
  status: string;
  lines: StoredPurchaseLine[];
  subtotal: number;
  vat: number;
  total: number;
  createdAt: string;
  sourceReference: string;
};

export type InventoryOperation = "Reserva" | "Entrada" | "Salida" | "Ajuste";

export type StoredInventoryMovement = {
  id: string;
  item: string;
  operation: InventoryOperation;
  quantity: number;
  reference: string;
  createdAt: string;
};

type AppStateContextValue = {
  quoteDraft: QuoteDraft;
  savedQuotes: SavedQuote[];
  workOrders: StoredWorkOrder[];
  purchases: StoredPurchase[];
  inventoryMovements: StoredInventoryMovement[];
  quoteDraftTotals: {
    subtotal: number;
    tax: number;
    total: number;
    hasProductionWork: boolean;
    requiresPurchaseReview: boolean;
  };
  liveStats: {
    quotes: number;
    workOrders: number;
    purchases: number;
    inventoryMovements: number;
    quoteValue: number;
    purchaseValue: number;
  };
  updateQuoteDraft: (patch: Partial<Omit<QuoteDraft, "lines">>) => void;
  addQuoteLine: (line: SharedQuoteLine) => void;
  removeQuoteLine: (lineId: string) => void;
  saveQuoteDraft: () => SavedQuote | null;
  createWorkOrder: (input: {
    quoteNumber: string;
    customer: string;
    area: string;
    responsible: string;
    proof: string;
    dueDate: string;
    requiresInstallation: boolean;
    notes: string;
    stages: string[];
    totalLabel: string;
  }) => StoredWorkOrder;
  createPurchase: (input: {
    supplier: string;
    eta: string;
    sourceReference: string;
    lines: StoredPurchaseLine[];
  }) => StoredPurchase | null;
  addInventoryMovement: (input: Omit<StoredInventoryMovement, "id" | "createdAt">) => StoredInventoryMovement;
  removeInventoryMovement: (id: string) => void;
};

type PersistedState = {
  quoteDraft: QuoteDraft;
  savedQuotes: SavedQuote[];
  workOrders: StoredWorkOrder[];
  purchases: StoredPurchase[];
  inventoryMovements: StoredInventoryMovement[];
};

const STORAGE_KEY = "imprenta-shared-state-v1";

const initialQuoteDraft: QuoteDraft = {
  customer: customerRecords[0].businessName,
  validityDays: "7",
  deliveryWindow: "5 dias habiles",
  note: "Cotizacion referencial sujeta a confirmacion de stock y aprobacion tecnica.",
  includeVat: true,
  lines: [],
};

function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function computeQuoteTotals(draft: QuoteDraft) {
  const subtotal = draft.lines.reduce((sum, line) => {
    const gross = line.quantity * line.unitPrice;
    const discount = gross * (line.discountPercent / 100);
    return sum + (gross - discount);
  }, 0);

  const tax = draft.includeVat ? Math.round(subtotal * 0.19) : 0;
  const total = subtotal + tax;
  const hasProductionWork = draft.lines.some(
    (line) => line.type === "Servicio" || line.type === "Trabajo",
  );
  const requiresPurchaseReview = draft.lines.some((line) => {
    const stock = Number(line.stock.replace(/[^\d]/g, ""));
    return Number.isFinite(stock) && stock > 0 && line.quantity > stock;
  });

  return {
    subtotal,
    tax,
    total,
    hasProductionWork,
    requiresPurchaseReview,
  };
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [quoteDraft, setQuoteDraft] = useState<QuoteDraft>(initialQuoteDraft);
  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>([]);
  const [workOrders, setWorkOrders] = useState<StoredWorkOrder[]>([]);
  const [purchases, setPurchases] = useState<StoredPurchase[]>([]);
  const [inventoryMovements, setInventoryMovements] = useState<StoredInventoryMovement[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const rawState = window.localStorage.getItem(STORAGE_KEY);
      if (!rawState) {
        setHydrated(true);
        return;
      }

      const parsedState = JSON.parse(rawState) as PersistedState;
      setQuoteDraft(parsedState.quoteDraft ?? initialQuoteDraft);
      setSavedQuotes(parsedState.savedQuotes ?? []);
      setWorkOrders(parsedState.workOrders ?? []);
      setPurchases(parsedState.purchases ?? []);
      setInventoryMovements(parsedState.inventoryMovements ?? []);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const persistedState: PersistedState = {
      quoteDraft,
      savedQuotes,
      workOrders,
      purchases,
      inventoryMovements,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedState));
  }, [hydrated, inventoryMovements, purchases, quoteDraft, savedQuotes, workOrders]);

  const quoteDraftTotals = useMemo(() => computeQuoteTotals(quoteDraft), [quoteDraft]);

  const liveStats = useMemo(
    () => ({
      quotes: savedQuotes.length,
      workOrders: workOrders.length,
      purchases: purchases.length,
      inventoryMovements: inventoryMovements.length,
      quoteValue: savedQuotes.reduce((sum, quote) => sum + quote.total, 0),
      purchaseValue: purchases.reduce((sum, purchase) => sum + purchase.total, 0),
    }),
    [inventoryMovements.length, purchases, savedQuotes, workOrders.length],
  );

  function updateQuoteDraft(patch: Partial<Omit<QuoteDraft, "lines">>) {
    setQuoteDraft((current) => ({ ...current, ...patch }));
  }

  function addQuoteLine(line: SharedQuoteLine) {
    setQuoteDraft((current) => ({
      ...current,
      lines: [...current.lines, line],
    }));
  }

  function removeQuoteLine(lineId: string) {
    setQuoteDraft((current) => ({
      ...current,
      lines: current.lines.filter((line) => line.id !== lineId),
    }));
  }

  function saveQuoteDraft() {
    if (quoteDraft.lines.length === 0) {
      return null;
    }

    const customer =
      customerRecords.find((record) => record.businessName === quoteDraft.customer) ??
      customerRecords[0];
    const totals = computeQuoteTotals(quoteDraft);
    const quoteNumber = `COT-LOCAL-${String(savedQuotes.length + 1).padStart(3, "0")}`;

    const validUntilDate = new Date();
    validUntilDate.setDate(validUntilDate.getDate() + Number(quoteDraft.validityDays || "0"));

    const savedQuote: SavedQuote = {
      id: generateId("quote"),
      number: quoteNumber,
      customer: customer.businessName,
      rut: customer.rut,
      commune: customer.commune,
      paymentTerms: customer.paymentTerms,
      validUntilLabel: validUntilDate.toLocaleDateString("es-CL"),
      deliveryWindow: quoteDraft.deliveryWindow,
      note: quoteDraft.note,
      includeVat: quoteDraft.includeVat,
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
      lines: quoteDraft.lines,
      status: "Sincronizada",
      createdAt: new Date().toISOString(),
    };

    setSavedQuotes((current) => [savedQuote, ...current]);
    return savedQuote;
  }

  function createWorkOrder(input: {
    quoteNumber: string;
    customer: string;
    area: string;
    responsible: string;
    proof: string;
    dueDate: string;
    requiresInstallation: boolean;
    notes: string;
    stages: string[];
    totalLabel: string;
  }) {
    const workOrder: StoredWorkOrder = {
      id: generateId("wo"),
      number: `OT-LOCAL-${String(workOrders.length + 1).padStart(3, "0")}`,
      quoteNumber: input.quoteNumber,
      customer: input.customer,
      area: input.area,
      responsible: input.responsible,
      proof: input.proof,
      dueDate: input.dueDate,
      requiresInstallation: input.requiresInstallation,
      notes: input.notes,
      stages: input.stages,
      status: "Planificada",
      totalLabel: input.totalLabel,
      createdAt: new Date().toISOString(),
    };

    setWorkOrders((current) => [workOrder, ...current]);
    return workOrder;
  }

  function createPurchase(input: {
    supplier: string;
    eta: string;
    sourceReference: string;
    lines: StoredPurchaseLine[];
  }) {
    if (input.lines.length === 0) {
      return null;
    }

    const subtotal = input.lines.reduce(
      (sum, line) => sum + line.quantity * line.unitCost,
      0,
    );
    const vat = Math.round(subtotal * 0.19);
    const purchase: StoredPurchase = {
      id: generateId("purchase"),
      number: `OC-LOCAL-${String(purchases.length + 1).padStart(3, "0")}`,
      supplier: input.supplier,
      eta: input.eta,
      status: "Borrador",
      lines: input.lines,
      subtotal,
      vat,
      total: subtotal + vat,
      createdAt: new Date().toISOString(),
      sourceReference: input.sourceReference,
    };

    setPurchases((current) => [purchase, ...current]);
    return purchase;
  }

  function addInventoryMovement(input: Omit<StoredInventoryMovement, "id" | "createdAt">) {
    const movement: StoredInventoryMovement = {
      ...input,
      id: generateId("movement"),
      createdAt: new Date().toISOString(),
    };

    setInventoryMovements((current) => [movement, ...current]);
    return movement;
  }

  function removeInventoryMovement(id: string) {
    setInventoryMovements((current) => current.filter((movement) => movement.id !== id));
  }

  const value: AppStateContextValue = {
    quoteDraft,
    savedQuotes,
    workOrders,
    purchases,
    inventoryMovements,
    quoteDraftTotals,
    liveStats,
    updateQuoteDraft,
    addQuoteLine,
    removeQuoteLine,
    saveQuoteDraft,
    createWorkOrder,
    createPurchase,
    addInventoryMovement,
    removeInventoryMovement,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error("useAppState must be used inside AppStateProvider");
  }

  return context;
}

export function formatStoredQuoteTotal(total: number) {
  return formatClp(total);
}
