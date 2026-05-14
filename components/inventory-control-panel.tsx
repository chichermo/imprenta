"use client";

import { useMemo, useState } from "react";

import {
  InventoryOperation,
  useAppState,
} from "@/components/app-state-provider";
import { StatusPill } from "@/components/status-pill";
import { parseNumericText, parseStockText } from "@/lib/formatters";
import { catalogRecords } from "@/lib/mock-data";

export function InventoryControlPanel() {
  const {
    addInventoryMovement,
    inventoryMovements,
    purchases,
    removeInventoryMovement,
    savedQuotes,
    workOrders,
  } = useAppState();
  const [item, setItem] = useState(catalogRecords[0].name);
  const [operation, setOperation] = useState<InventoryOperation>("Reserva");
  const [quantity, setQuantity] = useState("4");
  const [reference, setReference] = useState("COT-2026-041");
  const [lastCreatedMovement, setLastCreatedMovement] = useState<string | null>(null);

  const selectedItem = catalogRecords.find((record) => record.name === item) ?? catalogRecords[0];
  const referenceOptions = useMemo(
    () => [
      "Manual",
      ...savedQuotes.map((quote) => quote.number),
      ...workOrders.map((order) => order.number),
      ...purchases.map((purchase) => purchase.number),
    ],
    [purchases, savedQuotes, workOrders],
  );

  const stockState = useMemo(() => {
    const baseStock = parseStockText(selectedItem.stock);
    const simulated = inventoryMovements.reduce((accumulator, movement) => {
      if (movement.item !== selectedItem.name) {
        return accumulator;
      }

      if (movement.operation === "Entrada") {
        return accumulator + movement.quantity;
      }

      if (movement.operation === "Ajuste") {
        return accumulator + movement.quantity;
      }

      return accumulator - movement.quantity;
    }, baseStock);

    return {
      baseStock,
      simulated,
      reorderPoint: 10,
    };
  }, [inventoryMovements, selectedItem]);

  function addMovement() {
    const parsedQuantity = Math.max(1, parseNumericText(quantity));
    const movement = addInventoryMovement({
      item,
      operation,
      quantity: parsedQuantity,
      reference: reference.trim() || "Sin referencia",
    });

    setLastCreatedMovement(movement.reference);
  }

  return (
    <div className="quote-workbench">
      <section className="builder-pane builder-pane--primary">
        <div className="builder-block">
          <div className="builder-block__header">
            <div>
              <p className="eyebrow">Control de bodega</p>
              <h3>Simulador de movimientos</h3>
            </div>
            <StatusPill
              label={stockState.simulated <= stockState.reorderPoint ? "Bajo umbral" : "Stock estable"}
              tone={stockState.simulated <= stockState.reorderPoint ? "warning" : "success"}
            />
          </div>

          <div className="form-grid">
            <label className="field-group field-group--span-2">
              <span className="field-label">Item</span>
              <select
                className="field-control"
                onChange={(event) => setItem(event.target.value)}
                value={item}
              >
                {catalogRecords.map((record) => (
                  <option key={record.code} value={record.name}>
                    {record.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-group">
              <span className="field-label">Operacion</span>
              <select
                className="field-control"
                onChange={(event) => setOperation(event.target.value as InventoryOperation)}
                value={operation}
              >
                {["Reserva", "Entrada", "Salida", "Ajuste"].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-group">
              <span className="field-label">Cantidad</span>
              <input
                className="field-control"
                min="1"
                onChange={(event) => setQuantity(event.target.value)}
                type="number"
                value={quantity}
              />
            </label>

            <label className="field-group field-group--span-2">
              <span className="field-label">Referencia</span>
              <select
                className="field-control"
                onChange={(event) => setReference(event.target.value)}
                value={reference}
              >
                {referenceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="builder-actions">
            <button className="action-button" onClick={addMovement} type="button">
              Aplicar movimiento
            </button>
          </div>
        </div>

        <div className="builder-block">
          <div className="builder-block__header">
            <strong>Movimientos simulados</strong>
              <p>Ahora quedan compartidos con el resto del flujo y persisten en navegador.</p>
          </div>

          <div className="quote-line-list">
            {inventoryMovements.length === 0 ? (
              <article className="quote-line-card">
                <strong>Aun no hay movimientos compartidos</strong>
                <p>Aplica un movimiento para sincronizarlo con stock y reportes.</p>
              </article>
            ) : (
              inventoryMovements.map((movement) => (
              <article className="quote-line-card" key={movement.id}>
                <div className="quote-line-card__top">
                  <div>
                    <div className="quote-line-card__eyebrow">{movement.operation}</div>
                    <strong>{movement.item}</strong>
                  </div>
                  <button
                    className="quote-line-card__remove"
                    onClick={() => removeInventoryMovement(movement.id)}
                    type="button"
                  >
                    Quitar
                  </button>
                </div>
                <div className="quote-line-card__meta">
                  <span>{movement.quantity} unidades</span>
                  <span>{movement.reference}</span>
                  <span>{new Date(movement.createdAt).toLocaleDateString("es-CL")}</span>
                </div>
              </article>
            ))
            )}
          </div>
        </div>
      </section>

      <aside className="builder-pane builder-pane--summary">
        <div className="quote-summary-card">
          <div className="quote-summary-card__header">
            <p className="eyebrow">Estado simulado</p>
            <h3>{lastCreatedMovement ?? selectedItem.name}</h3>
          </div>

          <div className="summary-list">
            <div className="summary-list__row">
              <span>Stock base</span>
              <strong>{stockState.baseStock}</strong>
            </div>
            <div className="summary-list__row">
              <span>Stock proyectado</span>
              <strong>{stockState.simulated}</strong>
            </div>
            <div className="summary-list__row">
              <span>Punto de reposicion</span>
              <strong>{stockState.reorderPoint}</strong>
            </div>
          </div>

          <div className="summary-signals">
            <StatusPill label={selectedItem.category} tone="info" />
            <StatusPill
              label={
                stockState.simulated <= stockState.reorderPoint ? "Activar compra" : "Sin urgencia"
              }
              tone={stockState.simulated <= stockState.reorderPoint ? "warning" : "success"}
            />
          </div>
        </div>
      </aside>
    </div>
  );
}
