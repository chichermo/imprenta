"use client";

import { useMemo, useState } from "react";

import {
  buildPurchaseLinesFromSuggestions,
  buildPurchaseSuggestionsFromQuoteLines,
  StoredPurchaseLine,
  useAppState,
} from "@/components/app-state-provider";
import { StatusPill } from "@/components/status-pill";
import { formatClp, parseClp, parseNumericText } from "@/lib/formatters";
import { catalogRecords, supplierRecords, stockAlerts } from "@/lib/mock-data";

const lineId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function PurchasePlanner() {
  const { createPurchase, purchases, savedQuotes, workOrders } = useAppState();
  const [supplier, setSupplier] = useState(supplierRecords[0].name);
  const [item, setItem] = useState(catalogRecords[1].name);
  const [quantity, setQuantity] = useState("12");
  const [unitCost, setUnitCost] = useState("6200");
  const [purpose, setPurpose] = useState("Reposicion por stock critico");
  const [eta, setEta] = useState("2026-05-20");
  const [sourceReference, setSourceReference] = useState("Manual");
  const [lines, setLines] = useState<StoredPurchaseLine[]>([
    {
      id: "plan-1",
      item: catalogRecords[1].name,
      quantity: 12,
      unitCost: 6200,
      purpose: "Reposicion por stock critico",
    },
  ]);
  const [lastCreatedPurchase, setLastCreatedPurchase] = useState<string | null>(null);

  const selectedSupplier = supplierRecords.find((record) => record.name === supplier) ?? supplierRecords[0];
  const sourceQuote = savedQuotes.find((quote) => quote.number === sourceReference);
  const sourceWorkOrder = workOrders.find((order) => order.number === sourceReference);
  const linkedQuoteFromWorkOrder = savedQuotes.find(
    (quote) => quote.number === sourceWorkOrder?.quoteNumber,
  );
  const sourceOptions = useMemo(
    () => [
      "Manual",
      ...savedQuotes.map((quote) => quote.number),
      ...workOrders.map((order) => order.number),
    ],
    [savedQuotes, workOrders],
  );
  const sourceSuggestions = useMemo(() => {
    if (sourceWorkOrder?.purchaseSuggestions?.length) {
      return sourceWorkOrder.purchaseSuggestions;
    }

    if (sourceQuote) {
      return buildPurchaseSuggestionsFromQuoteLines(sourceQuote.lines);
    }

    if (linkedQuoteFromWorkOrder) {
      return buildPurchaseSuggestionsFromQuoteLines(linkedQuoteFromWorkOrder.lines);
    }

    return [];
  }, [linkedQuoteFromWorkOrder, sourceQuote, sourceWorkOrder]);
  const sourceItems = useMemo(() => {
    if (sourceWorkOrder?.lines?.length) {
      return sourceWorkOrder.lines;
    }

    if (sourceQuote) {
      return sourceQuote.lines;
    }

    if (linkedQuoteFromWorkOrder) {
      return linkedQuoteFromWorkOrder.lines;
    }

    return [];
  }, [linkedQuoteFromWorkOrder, sourceQuote, sourceWorkOrder]);

  const suggestedItem =
    stockAlerts.find((alert) => alert.item === item)?.item ??
    catalogRecords.find((record) => record.name === item)?.name ??
    item;

  const totals = useMemo(() => {
    const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.unitCost, 0);
    const vat = Math.round(subtotal * 0.19);
    return {
      subtotal,
      vat,
      total: subtotal + vat,
    };
  }, [lines]);

  function autofillCost(selectedItemName: string) {
    const catalogItem = catalogRecords.find((record) => record.name === selectedItemName);
    if (!catalogItem) {
      return;
    }

    const suggestedCost = Math.round(parseClp(catalogItem.price) * 0.72);
    setUnitCost(String(suggestedCost));
  }

  function addLine() {
    const parsedQuantity = Math.max(1, parseNumericText(quantity));
    const parsedUnitCost = Math.max(0, parseNumericText(unitCost));

    setLines((current) => [
      ...current,
      {
        id: lineId(),
        item: suggestedItem,
        quantity: parsedQuantity,
        unitCost: parsedUnitCost,
        purpose: purpose.trim() || "Reposicion general",
      },
    ]);
  }

  function loadSuggestedLines() {
    if (sourceSuggestions.length === 0) {
      return;
    }

    setLines(buildPurchaseLinesFromSuggestions(sourceSuggestions));
  }

  function handleSourceReferenceChange(nextReference: string) {
    setSourceReference(nextReference);

    if (nextReference === "Manual") {
      return;
    }

    const nextQuote = savedQuotes.find((quote) => quote.number === nextReference);
    const nextWorkOrder = workOrders.find((order) => order.number === nextReference);
    const nextLinkedQuote = savedQuotes.find(
      (quote) => quote.number === nextWorkOrder?.quoteNumber,
    );
    const nextSuggestions = nextWorkOrder?.purchaseSuggestions?.length
      ? nextWorkOrder.purchaseSuggestions
      : nextQuote
        ? buildPurchaseSuggestionsFromQuoteLines(nextQuote.lines)
        : nextLinkedQuote
          ? buildPurchaseSuggestionsFromQuoteLines(nextLinkedQuote.lines)
          : [];

    if (nextSuggestions.length === 0) {
      return;
    }

    const [primarySuggestion] = nextSuggestions;

    setSupplier(primarySuggestion.suggestedSupplier);
    setItem(primarySuggestion.item);
    setQuantity(String(primarySuggestion.shortageQuantity));
    setUnitCost(String(primarySuggestion.unitCost));
    setPurpose(primarySuggestion.reason);
  }

  function handleCreatePurchase() {
    const purchase = createPurchase({
      supplier,
      eta,
      sourceReference,
      lines,
    });

    if (purchase) {
      setLastCreatedPurchase(purchase.number);
    }
  }

  function removeLine(id: string) {
    setLines((current) => current.filter((line) => line.id !== id));
  }

  return (
    <div className="quote-workbench">
      <section className="builder-pane builder-pane--primary">
        <div className="builder-block">
          <div className="builder-block__header">
            <div>
              <p className="eyebrow">Abastecimiento</p>
              <h3>Planificador de compra</h3>
            </div>
            <StatusPill label="Borrador OC" tone="warning" />
          </div>

          <div className="form-grid">
            <label className="field-group field-group--span-2">
              <span className="field-label">Proveedor</span>
              <select
                className="field-control"
                onChange={(event) => setSupplier(event.target.value)}
                value={supplier}
              >
                {supplierRecords.map((record) => (
                  <option key={record.name} value={record.name}>
                    {record.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-group field-group--span-2">
              <span className="field-label">Origen del requerimiento</span>
              <select
                className="field-control"
                onChange={(event) => handleSourceReferenceChange(event.target.value)}
                value={sourceReference}
              >
                {sourceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-group field-group--span-2">
              <span className="field-label">Item a comprar</span>
              <select
                className="field-control"
                onChange={(event) => {
                  setItem(event.target.value);
                  autofillCost(event.target.value);
                }}
                value={item}
              >
                {[...new Set([...stockAlerts.map((alert) => alert.item), ...catalogRecords.map((record) => record.name)])].map(
                  (option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ),
                )}
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

            <label className="field-group">
              <span className="field-label">Costo unitario</span>
              <input
                className="field-control"
                min="0"
                onChange={(event) => setUnitCost(event.target.value)}
                type="number"
                value={unitCost}
              />
            </label>

            <label className="field-group">
              <span className="field-label">ETA</span>
              <input
                className="field-control"
                onChange={(event) => setEta(event.target.value)}
                type="date"
                value={eta}
              />
            </label>

            <label className="field-group">
              <span className="field-label">Motivo</span>
              <input
                className="field-control"
                onChange={(event) => setPurpose(event.target.value)}
                value={purpose}
              />
            </label>
          </div>

          <div className="builder-actions">
            <button className="action-button" onClick={addLine} type="button">
              Agregar linea a OC
            </button>
            <button
              className="ghost-button"
              disabled={sourceSuggestions.length === 0}
              onClick={loadSuggestedLines}
              type="button"
            >
              Reemplazar por sugeridas
            </button>
            <button className="ghost-button" onClick={handleCreatePurchase} type="button">
              Guardar OC compartida
            </button>
          </div>
        </div>

        <div className="builder-block">
          <div className="builder-block__header">
            <strong>Sugerencias automaticas del origen</strong>
            <p>Compras puede recuperar faltantes detectados en cotizaciones u ordenes de trabajo.</p>
          </div>

          <div className="quote-line-list">
            {sourceReference === "Manual" ? (
              <article className="quote-line-card">
                <strong>Origen manual</strong>
                <p>Selecciona una cotizacion u OT para cargar faltantes calculados automaticamente.</p>
              </article>
            ) : sourceSuggestions.length === 0 ? (
              <article className="quote-line-card">
                <strong>Sin compras sugeridas para este origen</strong>
                <p>El documento seleccionado no presenta faltantes con stock controlado.</p>
              </article>
            ) : (
              sourceSuggestions.map((suggestion) => (
                <article className="quote-line-card" key={suggestion.id}>
                  <div className="quote-line-card__top">
                    <div>
                      <div className="quote-line-card__eyebrow">
                        {sourceReference} · {suggestion.sourceCode}
                      </div>
                      <strong>{suggestion.item}</strong>
                    </div>
                    <strong>{suggestion.shortageQuantity} por comprar</strong>
                  </div>
                  <div className="quote-line-card__meta">
                    <span>Stock: {suggestion.availableStock}</span>
                    <span>Pedido: {suggestion.requiredQuantity}</span>
                    <span>{suggestion.suggestedSupplier}</span>
                  </div>
                  <p>{suggestion.reason}</p>
                </article>
              ))
            )}
          </div>
        </div>

        <div className="builder-block">
          <div className="builder-block__header">
            <strong>Detalle recuperado del origen</strong>
            <p>Referencia rapida de lineas comerciales o productivas antes de emitir la OC.</p>
          </div>

          <div className="quote-line-list">
            {sourceItems.length === 0 ? (
              <article className="quote-line-card">
                <strong>No hay lineas compartidas en este origen</strong>
                <p>Las cotizaciones guardadas en el armador comercial apareceran aqui con su detalle.</p>
              </article>
            ) : (
              sourceItems.map((line) => (
                <article className="quote-line-card" key={line.id}>
                  <div className="quote-line-card__top">
                    <div>
                      <div className="quote-line-card__eyebrow">
                        {line.code} · {line.type}
                      </div>
                      <strong>{line.name}</strong>
                    </div>
                    <strong>{line.quantity} {line.unit}</strong>
                  </div>
                  <div className="quote-line-card__meta">
                    <span>Stock: {line.stock}</span>
                    <span>{formatClp(line.unitPrice)} unitario</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        <div className="builder-block">
          <div className="builder-block__header">
            <strong>Lineas planificadas</strong>
            <p>Armado preliminar de la orden de compra segun faltantes y demanda comercial.</p>
          </div>

          <div className="quote-line-list">
            {lines.map((line) => (
              <article className="quote-line-card" key={line.id}>
                <div className="quote-line-card__top">
                  <div>
                    <div className="quote-line-card__eyebrow">OC · Abastecimiento</div>
                    <strong>{line.item}</strong>
                  </div>
                  <button
                    className="quote-line-card__remove"
                    onClick={() => removeLine(line.id)}
                    type="button"
                  >
                    Quitar
                  </button>
                </div>
                <div className="quote-line-card__meta">
                  <span>{line.quantity} unidades</span>
                  <span>{formatClp(line.unitCost)} costo</span>
                  <span>{line.purpose}</span>
                </div>
                <div className="quote-line-card__footer">
                  <div className="quote-line-card__signals">
                    <StatusPill label="Pendiente aprobacion" tone="warning" />
                  </div>
                  <strong>{formatClp(line.quantity * line.unitCost)}</strong>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <aside className="builder-pane builder-pane--summary">
        <div className="quote-summary-card">
          <div className="quote-summary-card__header">
            <p className="eyebrow">Resumen de compra</p>
            <h3>{lastCreatedPurchase ?? supplier}</h3>
          </div>

          <div className="summary-list">
            <div className="summary-list__row">
              <span>Lead time</span>
              <strong>{selectedSupplier.leadTime}</strong>
            </div>
            <div className="summary-list__row">
              <span>ETA comprometida</span>
              <strong>{eta}</strong>
            </div>
            <div className="summary-list__row">
              <span>Origen</span>
              <strong>{sourceReference}</strong>
            </div>
            <div className="summary-list__row">
              <span>Faltantes detectados</span>
              <strong>{sourceSuggestions.length}</strong>
            </div>
            <div className="summary-list__row">
              <span>Subtotal</span>
              <strong>{formatClp(totals.subtotal)}</strong>
            </div>
            <div className="summary-list__row">
              <span>IVA estimado</span>
              <strong>{formatClp(totals.vat)}</strong>
            </div>
            <div className="summary-list__row summary-list__row--grand">
              <span>Total OC</span>
              <strong>{formatClp(totals.total)}</strong>
            </div>
          </div>

          <div className="summary-signals">
            <StatusPill label={selectedSupplier.status} tone={selectedSupplier.tone} />
            <StatusPill label={`${lines.length} lineas`} tone="info" />
            <StatusPill
              label={sourceSuggestions.length > 0 ? "Origen con faltantes" : "Sin alertas de compra"}
              tone={sourceSuggestions.length > 0 ? "warning" : "success"}
            />
          </div>
        </div>

        <div className="quote-summary-card quote-summary-card--secondary">
          <div className="quote-summary-card__header">
            <p className="eyebrow">OC sincronizadas</p>
            <h3>{purchases.length}</h3>
          </div>

          <div className="timeline-list">
            {purchases.length === 0 ? (
              <article>
                <strong>No hay OC guardadas aun</strong>
                <p>Las compras guardadas aqui quedaran disponibles para el resto del flujo.</p>
              </article>
            ) : (
              purchases.slice(0, 3).map((purchase) => (
                <article key={purchase.id}>
                  <strong>
                    {purchase.number} · {purchase.supplier}
                  </strong>
                  <p>
                    {formatClp(purchase.total)} · ETA {purchase.eta}
                  </p>
                </article>
              ))
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
