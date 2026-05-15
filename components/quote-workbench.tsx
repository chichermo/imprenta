"use client";

import { useState } from "react";

import {
  formatStoredQuoteTotal,
  SavedQuote,
  SharedQuoteLine,
  useAppState,
} from "@/components/app-state-provider";
import { StatusPill } from "@/components/status-pill";
import { StatusTransitionButton } from "@/components/status-transition-button";
import {
  getNextQuoteStatuses,
  getQuoteStatusTone,
} from "@/lib/business-states";
import { formatClp, parseClp, parseNumericText, parseStockText } from "@/lib/formatters";
import { catalogRecords, customerRecords } from "@/lib/mock-data";

const baseLineId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function buildDefaultDueDate(daysAhead: number) {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + daysAhead);
  return dueDate.toISOString().slice(0, 10);
}

function inferWorkOrderArea(lines: SharedQuoteLine[]) {
  const normalizedHaystack = lines
    .map((line) => `${line.name} ${line.type} ${line.notes}`)
    .join(" ")
    .toLowerCase();

  if (
    normalizedHaystack.includes("letrero") ||
    normalizedHaystack.includes("pvc") ||
    normalizedHaystack.includes("senaletica") ||
    normalizedHaystack.includes("trovisel")
  ) {
    return "Senaletica";
  }

  if (
    normalizedHaystack.includes("banner") ||
    normalizedHaystack.includes("adhesivo") ||
    normalizedHaystack.includes("lona") ||
    normalizedHaystack.includes("vinilo")
  ) {
    return "Gran formato";
  }

  return "Imprenta";
}

function inferResponsible(area: string) {
  switch (area) {
    case "Senaletica":
      return "Taller PVC";
    case "Gran formato":
      return "Produccion";
    default:
      return "Preprensa";
  }
}

function inferStages(area: string) {
  switch (area) {
    case "Senaletica":
      return ["Diseno y aprobacion", "Corte y materialidad", "Montaje final"];
    case "Gran formato":
      return ["Preparacion de arte", "Impresion y laminado", "Terminacion y empaque"];
    default:
      return ["Preprensa", "Impresion", "Terminaciones"];
  }
}

export function QuoteWorkbench() {
  const {
    addQuoteLine,
    createWorkOrder,
    quoteDraft,
    quoteDraftTotals,
    removeQuoteLine,
    saveQuoteDraft,
    savedQuotes,
    transitionQuoteStatus,
    updateQuoteDraft,
    workOrders,
  } = useAppState();

  const [lineSource, setLineSource] = useState<SharedQuoteLine["source"]>("catalogo");
  const [selectedItemCode, setSelectedItemCode] = useState(catalogRecords[0].code);
  const [quantity, setQuantity] = useState("1");
  const [discountPercent, setDiscountPercent] = useState("0");
  const [technicalNotes, setTechnicalNotes] = useState("");
  const [customName, setCustomName] = useState("Letrero clinico acrilico");
  const [customType, setCustomType] = useState("Servicio");
  const [customUnit, setCustomUnit] = useState("m2");
  const [customPrice, setCustomPrice] = useState("28000");
  const [customStock, setCustomStock] = useState("A pedido");
  const [lastSavedQuoteNumber, setLastSavedQuoteNumber] = useState<string | null>(null);
  const [lastCreatedWorkOrder, setLastCreatedWorkOrder] = useState<string | null>(null);

  const selectedCustomerRecord =
    customerRecords.find((customer) => customer.businessName === quoteDraft.customer) ??
    customerRecords[0];

  const selectedCatalogItem =
    catalogRecords.find((item) => item.code === selectedItemCode) ?? catalogRecords[0];

  function resetEntryForm() {
    setQuantity("1");
    setDiscountPercent("0");
    setTechnicalNotes("");
    setCustomName("Letrero clinico acrilico");
    setCustomType("Servicio");
    setCustomUnit("m2");
    setCustomPrice("28000");
    setCustomStock("A pedido");
  }

  function addLine() {
    const parsedQuantity = Math.max(1, parseNumericText(quantity));
    const parsedDiscount = Math.max(0, parseNumericText(discountPercent));

    if (lineSource === "catalogo") {
      addQuoteLine({
          id: baseLineId(),
          source: "catalogo",
          code: selectedCatalogItem.code,
          name: selectedCatalogItem.name,
          type: selectedCatalogItem.type,
          unit: selectedCatalogItem.unit,
          quantity: parsedQuantity,
          unitPrice: parseClp(selectedCatalogItem.price),
          discountPercent: parsedDiscount,
          notes: technicalNotes,
          stock: selectedCatalogItem.stock,
        });
      resetEntryForm();
      return;
    }

    addQuoteLine({
        id: baseLineId(),
        source: "custom",
        code: "CUSTOM",
        name: customName.trim() || "Item personalizado",
        type: customType.trim() || "Servicio",
        unit: customUnit.trim() || "unidad",
        quantity: parsedQuantity,
        unitPrice: Math.max(0, parseNumericText(customPrice)),
        discountPercent: parsedDiscount,
        notes: technicalNotes,
        stock: customStock.trim() || "A pedido",
      });
    resetEntryForm();
  }

  function handleSaveQuote() {
    const savedQuote = saveQuoteDraft();
    if (savedQuote) {
      setLastSavedQuoteNumber(savedQuote.number);
    }
  }

  function hasProductionWork(lines: SharedQuoteLine[]) {
    return lines.some((line) => line.type === "Servicio" || line.type === "Trabajo");
  }

  function handleCreateWorkOrderFromQuote(quote: SavedQuote) {
    if (!hasProductionWork(quote.lines)) {
      return;
    }

    if (quote.status !== "Aprobada") {
      return;
    }

    const existingWorkOrder = workOrders.find((order) => order.quoteNumber === quote.number);

    if (existingWorkOrder) {
      setLastCreatedWorkOrder(existingWorkOrder.number);
      return;
    }

    const area = inferWorkOrderArea(quote.lines);
    const workOrder = createWorkOrder({
      quoteNumber: quote.number,
      customer: quote.customer,
      area,
      responsible: inferResponsible(area),
      proof: "PDF digital",
      dueDate: buildDefaultDueDate(3),
      requiresInstallation: area === "Senaletica",
      notes: quote.note || "Generada desde cotizacion aprobada para continuar el flujo productivo.",
      stages: inferStages(area),
      totalLabel: formatStoredQuoteTotal(quote.total),
    });

    if (workOrder) {
      setLastCreatedWorkOrder(workOrder.number);
    }
  }

  return (
    <div className="quote-workbench">
      <section className="builder-pane builder-pane--primary">
        <div className="builder-header">
          <div>
            <p className="eyebrow">Mesa comercial</p>
            <h3>Armador de cotizaciones</h3>
          </div>
          <div className="builder-status-row">
            <StatusPill label="Borrador activo" tone="neutral" />
            <StatusPill
              label={quoteDraft.includeVat ? "IVA 19% activo" : "Sin IVA"}
              tone={quoteDraft.includeVat ? "info" : "warning"}
            />
            {lastSavedQuoteNumber ? (
              <StatusPill label={`Ultima sync ${lastSavedQuoteNumber}`} tone="success" />
            ) : null}
            {lastCreatedWorkOrder ? (
              <StatusPill label={`OT directa ${lastCreatedWorkOrder}`} tone="warning" />
            ) : null}
          </div>
        </div>

        <div className="quote-workspace-grid">
          <div className="builder-block">
            <div className="builder-block__header">
              <strong>Cabecera comercial</strong>
              <p>Cliente, vigencia, entrega y notas generales.</p>
            </div>

            <div className="form-grid">
              <label className="field-group field-group--span-2">
                <span className="field-label">Cliente</span>
                <select
                  className="field-control"
                  onChange={(event) => updateQuoteDraft({ customer: event.target.value })}
                  value={quoteDraft.customer}
                >
                  {customerRecords.map((customer) => (
                    <option key={customer.businessName} value={customer.businessName}>
                      {customer.businessName}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field-group">
                <span className="field-label">Validez en dias</span>
                <input
                  className="field-control"
                  min="1"
                  onChange={(event) => updateQuoteDraft({ validityDays: event.target.value })}
                  type="number"
                  value={quoteDraft.validityDays}
                />
              </label>

              <label className="field-group">
                <span className="field-label">Ventana de entrega</span>
                <input
                  className="field-control"
                  onChange={(event) => updateQuoteDraft({ deliveryWindow: event.target.value })}
                  value={quoteDraft.deliveryWindow}
                />
              </label>

              <label className="field-group field-group--span-2">
                <span className="field-label">Observaciones comerciales</span>
                <textarea
                  className="field-control field-control--textarea"
                  onChange={(event) => updateQuoteDraft({ note: event.target.value })}
                  rows={3}
                  value={quoteDraft.note}
                />
              </label>
            </div>
          </div>

          <div className="builder-block">
            <div className="builder-block__header">
              <strong>Detalle de items</strong>
              <p>Mezcla catalogo y trabajos personalizados dentro de la misma cotizacion.</p>
            </div>

            <div className="mode-switch" role="tablist" aria-label="Origen del item">
              <button
                className={`mode-chip${lineSource === "catalogo" ? " mode-chip--active" : ""}`}
                onClick={() => setLineSource("catalogo")}
                type="button"
              >
                Desde catalogo
              </button>
              <button
                className={`mode-chip${lineSource === "custom" ? " mode-chip--active" : ""}`}
                onClick={() => setLineSource("custom")}
                type="button"
              >
                Trabajo personalizado
              </button>
            </div>

            <div className="form-grid">
              {lineSource === "catalogo" ? (
                <label className="field-group field-group--span-2">
                  <span className="field-label">Item catalogo</span>
                  <select
                    className="field-control"
                    onChange={(event) => setSelectedItemCode(event.target.value)}
                    value={selectedItemCode}
                  >
                    {catalogRecords.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.code} · {item.name}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <>
                  <label className="field-group field-group--span-2">
                    <span className="field-label">Nombre del trabajo</span>
                    <input
                      className="field-control"
                      onChange={(event) => setCustomName(event.target.value)}
                      value={customName}
                    />
                  </label>
                  <label className="field-group">
                    <span className="field-label">Tipo</span>
                    <input
                      className="field-control"
                      onChange={(event) => setCustomType(event.target.value)}
                      value={customType}
                    />
                  </label>
                  <label className="field-group">
                    <span className="field-label">Unidad</span>
                    <input
                      className="field-control"
                      onChange={(event) => setCustomUnit(event.target.value)}
                      value={customUnit}
                    />
                  </label>
                  <label className="field-group">
                    <span className="field-label">Precio unitario neto</span>
                    <input
                      className="field-control"
                      onChange={(event) => setCustomPrice(event.target.value)}
                      type="number"
                      value={customPrice}
                    />
                  </label>
                  <label className="field-group">
                    <span className="field-label">Stock / condicion</span>
                    <input
                      className="field-control"
                      onChange={(event) => setCustomStock(event.target.value)}
                      value={customStock}
                    />
                  </label>
                </>
              )}

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
                <span className="field-label">Descuento %</span>
                <input
                  className="field-control"
                  min="0"
                  onChange={(event) => setDiscountPercent(event.target.value)}
                  type="number"
                  value={discountPercent}
                />
              </label>

              <label className="field-group field-group--span-2">
                <span className="field-label">Notas tecnicas del item</span>
                <textarea
                  className="field-control field-control--textarea"
                  onChange={(event) => setTechnicalNotes(event.target.value)}
                  rows={3}
                  value={technicalNotes}
                />
              </label>
            </div>

            <div className="builder-actions">
              <button className="action-button" onClick={addLine} type="button">
                Agregar item
              </button>
              <button
                className="ghost-button"
                onClick={() => updateQuoteDraft({ includeVat: !quoteDraft.includeVat })}
                type="button"
              >
                {quoteDraft.includeVat ? "Quitar IVA" : "Agregar IVA"}
              </button>
              <button className="ghost-button" onClick={handleSaveQuote} type="button">
                Guardar cotizacion
              </button>
            </div>
          </div>
        </div>

        <div className="builder-block">
          <div className="builder-block__header">
            <strong>Detalle armado</strong>
            <p>Los items agregados quedan listos para PDF, orden de trabajo o revision administrativa.</p>
          </div>

          <div className="quote-line-list">
            {quoteDraft.lines.map((line) => {
              const grossLine = line.quantity * line.unitPrice;
              const discountAmount = grossLine * (line.discountPercent / 100);
              const netLine = grossLine - discountAmount;
              const needsPurchaseReview =
                parseStockText(line.stock) > 0 && line.quantity > parseStockText(line.stock);

              return (
                <article className="quote-line-card" key={line.id}>
                  <div className="quote-line-card__top">
                    <div>
                      <div className="quote-line-card__eyebrow">
                        {line.code} · {line.type}
                      </div>
                      <strong>{line.name}</strong>
                    </div>
                    <button
                      className="quote-line-card__remove"
                      onClick={() => removeQuoteLine(line.id)}
                      type="button"
                    >
                      Quitar
                    </button>
                  </div>

                  <div className="quote-line-card__meta">
                    <span>
                      {line.quantity} {line.unit}
                    </span>
                    <span>{formatClp(line.unitPrice)} unitario</span>
                    <span>{line.discountPercent}% desc.</span>
                    <span>Stock: {line.stock}</span>
                  </div>

                  {line.notes ? <p>{line.notes}</p> : null}

                  <div className="quote-line-card__footer">
                    <div className="quote-line-card__signals">
                      <StatusPill
                        label={line.source === "catalogo" ? "Catalogo" : "Personalizado"}
                        tone={line.source === "catalogo" ? "info" : "warning"}
                      />
                      {needsPurchaseReview ? (
                        <StatusPill label="Revisar compra" tone="danger" />
                      ) : null}
                    </div>
                    <strong>{formatClp(netLine)}</strong>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <aside className="builder-pane builder-pane--summary">
        <div className="quote-summary-card">
          <div className="quote-summary-card__header">
            <p className="eyebrow">Resumen ejecutivo</p>
            <h3>{selectedCustomerRecord.businessName}</h3>
          </div>

          <div className="summary-list">
            <div className="summary-list__row">
              <span>RUT</span>
              <strong>{selectedCustomerRecord.rut}</strong>
            </div>
            <div className="summary-list__row">
              <span>Condicion de pago</span>
              <strong>{selectedCustomerRecord.paymentTerms}</strong>
            </div>
            <div className="summary-list__row">
              <span>Comuna</span>
              <strong>{selectedCustomerRecord.commune}</strong>
            </div>
            <div className="summary-list__row">
              <span>Validez</span>
              <strong>{quoteDraft.validityDays} dias</strong>
            </div>
            <div className="summary-list__row">
              <span>Entrega estimada</span>
              <strong>{quoteDraft.deliveryWindow}</strong>
            </div>
          </div>

          <div className="quote-total-card">
            <div className="summary-list__row">
              <span>Neto</span>
              <strong>{formatClp(quoteDraftTotals.subtotal)}</strong>
            </div>
            <div className="summary-list__row">
              <span>IVA</span>
              <strong>{formatClp(quoteDraftTotals.tax)}</strong>
            </div>
            <div className="summary-list__row summary-list__row--grand">
              <span>Total</span>
              <strong>{formatClp(quoteDraftTotals.total)}</strong>
            </div>
          </div>

          <div className="summary-signals">
            <StatusPill
              label={quoteDraftTotals.hasProductionWork ? "Genera OT" : "Venta directa"}
              tone={quoteDraftTotals.hasProductionWork ? "warning" : "success"}
            />
            <StatusPill
              label={
                quoteDraftTotals.requiresPurchaseReview
                  ? "Revisar stock y OC"
                  : "Stock controlado"
              }
              tone={quoteDraftTotals.requiresPurchaseReview ? "danger" : "success"}
            />
          </div>
        </div>

        <div className="quote-summary-card quote-summary-card--secondary">
          <div className="quote-summary-card__header">
            <p className="eyebrow">Checklist operativo</p>
            <h3>Proximo paso</h3>
          </div>

          <div className="timeline-list">
            <article>
              <strong>1. Enviar cotizacion</strong>
              <p>Con nota comercial y vigencia clara para la aprobacion del cliente.</p>
            </article>
            <article>
              <strong>2. Validar produccion</strong>
              <p>Si hay trabajos personalizados, generar orden de trabajo automaticamente.</p>
            </article>
            <article>
              <strong>3. Revisar abastecimiento</strong>
              <p>Si una linea supera stock disponible, disparar orden de compra o reserva.</p>
            </article>
          </div>
        </div>

        <div className="quote-summary-card quote-summary-card--secondary">
          <div className="quote-summary-card__header">
            <p className="eyebrow">Cotizaciones sincronizadas</p>
            <h3>{savedQuotes.length}</h3>
          </div>

          <div className="timeline-list">
            {savedQuotes.length === 0 ? (
              <article>
                <strong>Aun no hay cotizaciones guardadas</strong>
                <p>Guarda el borrador actual para que quede disponible en Produccion y Compras.</p>
              </article>
            ) : (
              savedQuotes.slice(0, 3).map((quote) => (
                <article key={quote.id}>
                  <strong>
                    {quote.number} · {quote.customer}
                  </strong>
                  <p>
                    {formatClp(quote.total)} · vence {quote.validUntilLabel}
                  </p>
                  <div className="quote-line-card__signals">
                    <StatusPill label={quote.status} tone={getQuoteStatusTone(quote.status)} />
                    {quote.workOrderNumber ? (
                      <StatusPill label={`OT ${quote.workOrderNumber}`} tone="success" />
                    ) : null}
                  </div>
                  <div className="builder-actions">
                    {getNextQuoteStatuses(quote.status).map((status) => (
                      <StatusTransitionButton
                        key={status}
                        label={status}
                        onClick={() => transitionQuoteStatus(quote.id, status)}
                      />
                    ))}
                    <button
                      className="ghost-button"
                      disabled={!hasProductionWork(quote.lines) || quote.status !== "Aprobada"}
                      onClick={() => handleCreateWorkOrderFromQuote(quote)}
                      type="button"
                    >
                      {quote.status !== "Aprobada"
                        ? "Aprobar antes de OT"
                        : hasProductionWork(quote.lines)
                          ? "Crear OT directa"
                          : "Venta directa"}
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
