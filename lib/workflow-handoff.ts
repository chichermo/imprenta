import type { InventoryOperation, SharedQuoteLine, StoredPurchaseLine } from "@/components/app-state-provider";

export type HandoffMovementInput = {
  item: string;
  operation: InventoryOperation;
  quantity: number;
  reference: string;
};

function isStockManagedLine(line: SharedQuoteLine) {
  return line.type === "Producto" || line.source === "catalogo";
}

export function buildReservationMovements(
  lines: SharedQuoteLine[],
  reference: string,
): HandoffMovementInput[] {
  return lines
    .filter(isStockManagedLine)
    .map((line) => ({
      item: line.name,
      operation: "Reserva" as const,
      quantity: line.quantity,
      reference,
    }));
}

export function buildConsumptionMovements(
  lines: SharedQuoteLine[],
  reference: string,
): HandoffMovementInput[] {
  return lines
    .filter(isStockManagedLine)
    .map((line) => ({
      item: line.name,
      operation: "Salida" as const,
      quantity: line.quantity,
      reference,
    }));
}

export function buildReceiptMovements(
  lines: StoredPurchaseLine[],
  reference: string,
): HandoffMovementInput[] {
  return lines.map((line) => ({
    item: line.item,
    operation: "Entrada" as const,
    quantity: line.quantity,
    reference,
  }));
}

export function movementSignature(movement: HandoffMovementInput) {
  return `${movement.reference}|${movement.operation}|${movement.item}|${movement.quantity}`;
}
