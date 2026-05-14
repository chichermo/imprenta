"use client";

import { useMemo, useState } from "react";

import {
  buildPurchaseLinesFromSuggestions,
  buildPurchaseSuggestionsFromQuoteLines,
  formatStoredQuoteTotal,
  StoredWorkOrder,
  useAppState,
} from "@/components/app-state-provider";
import { StatusPill } from "@/components/status-pill";
import { quoteRecords } from "@/lib/mock-data";

const areas = ["Imprenta", "Senaletica", "Gran formato", "Despacho"];

const responsibles = ["Preprensa", "Produccion", "Taller PVC", "Despacho"];

const proofOptions = ["PDF digital", "Foto de muestra", "Sin prueba previa"];

function createStageTemplates(area: string) {
  switch (area) {
    case "Senaletica":
      return [
        { name: "Diseno y aprobacion", tone: "warning" as const },
        { name: "Corte y materialidad", tone: "info" as const },
        { name: "Montaje final", tone: "neutral" as const },
      ];
    case "Gran formato":
      return [
        { name: "Preparacion de arte", tone: "warning" as const },
        { name: "Impresion y laminado", tone: "info" as const },
        { name: "Terminacion y empaque", tone: "neutral" as const },
      ];
    case "Despacho":
      return [
        { name: "Picking y empaque", tone: "info" as const },
        { name: "Ruta y documento", tone: "warning" as const },
        { name: "Entrega final", tone: "neutral" as const },
      ];
    default:
      return [
        { name: "Preprensa", tone: "warning" as const },
        { name: "Impresion", tone: "info" as const },
        { name: "Terminaciones", tone: "neutral" as const },
      ];
  }
}

function buildDefaultEta(daysAhead: number) {
  const etaDate = new Date();
  etaDate.setDate(etaDate.getDate() + daysAhead);
  return etaDate.toISOString().slice(0, 10);
}

export function WorkOrderStudio() {
  const { createPurchase, createWorkOrder, purchases, savedQuotes, workOrders } = useAppState();
  const sharedQuoteSeed = savedQuotes[0]?.number ?? quoteRecords[0].number;
  const [selectedQuote, setSelectedQuote] = useState(sharedQuoteSeed);
  const [area, setArea] = useState("Imprenta");
  const [responsible, setResponsible] = useState("Preprensa");
  const [proof, setProof] = useState("PDF digital");
  const [dueDate, setDueDate] = useState("2026-05-19");
  const [requiresInstallation, setRequiresInstallation] = useState(false);
  const [notes, setNotes] = useState(
    "Validar aprobacion del cliente antes de liberar a produccion.",
  );
  const [lastCreated, setLastCreated] = useState<string | null>(null);
  const [lastCreatedPurchase, setLastCreatedPurchase] = useState<string | null>(null);

  const quoteOptions = useMemo(() => {
    const shared = savedQuotes.map((quote) => ({
      number: quote.number,
      customer: quote.customer,
      totalLabel: formatStoredQuoteTotal(quote.total),
      source: "Compartida",
    }));

    const fallback = quoteRecords
      .filter((record) => !shared.some((sharedQuote) => sharedQuote.number === record.number))
      .map((record) => ({
        number: record.number,
        customer: record.customer,
        totalLabel: record.total,
        source: "Mock",
      }));

    return [...shared, ...fallback];
  }, [savedQuotes]);

  const quote =
    quoteOptions.find((record) => record.number === selectedQuote) ?? quoteOptions[0];
  const selectedSharedQuote = useMemo(
    () => savedQuotes.find((record) => record.number === selectedQuote),
    [savedQuotes, selectedQuote],
  );
  const inheritedLines = useMemo(
    () => selectedSharedQuote?.lines ?? [],
    [selectedSharedQuote],
  );
  const purchaseSuggestions = useMemo(
    () => buildPurchaseSuggestionsFromQuoteLines(inheritedLines),
    [inheritedLines],
  );
  const stageTemplates = useMemo(() => createStageTemplates(area), [area]);
  const generatedNumber = `OT-${selectedQuote.replace("COT-", "")}`;

  function handleCreateWorkOrder() {
    const workOrder = createWorkOrder({
      quoteNumber: quote.number,
      customer: quote.customer,
      area,
      responsible,
      proof,
      dueDate,
      requiresInstallation,
      notes,
      stages: stageTemplates.map((stage) => stage.name),
      totalLabel: quote.totalLabel,
    });

    setLastCreated(workOrder.number);
  }

  function handleCreatePurchaseFromOrder(order: Pick<StoredWorkOrder, "number" | "purchaseSuggestions">) {
    if (order.purchaseSuggestions.length === 0) {
      return;
    }

    const existingPurchase = purchases.find((purchase) => purchase.sourceReference === order.number);

    if (existingPurchase) {
      setLastCreatedPurchase(existingPurchase.number);
      return;
    }

    const [primarySuggestion] = order.purchaseSuggestions;
    const purchase = createPurchase({
      supplier: primarySuggestion.suggestedSupplier,
      eta: buildDefaultEta(4),
      sourceReference: order.number,
      lines: buildPurchaseLinesFromSuggestions(order.purchaseSuggestions),
    });

    if (purchase) {
      setLastCreatedPurchase(purchase.number);
    }
  }

  return (
    <div className="quote-workbench">
      <section className="builder-pane builder-pane--primary">
        <div className="builder-block">
          <div className="builder-block__header">
            <div>
              <p className="eyebrow">Handoff a taller</p>
              <h3>Generador de orden de trabajo</h3>
            </div>
            <StatusPill label="Listo para produccion" tone="info" />
          </div>

          <div className="form-grid">
            <label className="field-group field-group--span-2">
              <span className="field-label">Cotizacion origen</span>
              <select
                className="field-control"
                onChange={(event) => setSelectedQuote(event.target.value)}
                value={selectedQuote}
              >
                {quoteOptions.map((record) => (
                  <option key={record.number} value={record.number}>
                    {record.number} · {record.customer} · {record.source}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-group">
              <span className="field-label">Area responsable</span>
              <select
                className="field-control"
                onChange={(event) => setArea(event.target.value)}
                value={area}
              >
                {areas.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-group">
              <span className="field-label">Responsable</span>
              <select
                className="field-control"
                onChange={(event) => setResponsible(event.target.value)}
                value={responsible}
              >
                {responsibles.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-group">
              <span className="field-label">Prueba requerida</span>
              <select
                className="field-control"
                onChange={(event) => setProof(event.target.value)}
                value={proof}
              >
                {proofOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-group">
              <span className="field-label">Fecha compromiso</span>
              <input
                className="field-control"
                onChange={(event) => setDueDate(event.target.value)}
                type="date"
                value={dueDate}
              />
            </label>

            <label className="field-group field-group--span-2">
              <span className="field-label">Notas de produccion</span>
              <textarea
                className="field-control field-control--textarea"
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                value={notes}
              />
            </label>
          </div>

          <div className="toggle-row">
            <button
              aria-pressed={requiresInstallation}
              className={`toggle-chip${requiresInstallation ? " toggle-chip--active" : ""}`}
              onClick={() => setRequiresInstallation((current) => !current)}
              type="button"
            >
              {requiresInstallation ? "Incluye instalacion en terreno" : "Sin instalacion"}
            </button>
            <button className="action-button" onClick={handleCreateWorkOrder} type="button">
              Crear OT en flujo compartido
            </button>
          </div>
        </div>

        <div className="builder-block">
          <div className="builder-block__header">
            <strong>Etapas sugeridas</strong>
            <p>La orden ya queda desglosada por hitos de trabajo para control interno.</p>
          </div>

          <div className="workflow-stage-list">
            {stageTemplates.map((stage, index) => (
              <article className="workflow-stage-card" key={stage.name}>
                <div className="workflow-stage-card__top">
                  <span className="workflow-stage-card__index">0{index + 1}</span>
                  <StatusPill label={stage.name} tone={stage.tone} />
                </div>
                <p>
                  {index === 0
                    ? "Primer hito para validar arte, especificaciones y liberacion."
                    : index === stageTemplates.length - 1
                      ? "Ultima revision antes de entrega o despacho al cliente."
                      : "Etapa intermedia de produccion y control de calidad."}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="builder-block">
          <div className="builder-block__header">
            <strong>Lineas heredadas desde la cotizacion</strong>
            <p>La OT conserva cantidades, notas y tipo de trabajo cuando nace desde una cotizacion guardada.</p>
          </div>

          <div className="quote-line-list">
            {inheritedLines.length === 0 ? (
              <article className="quote-line-card">
                <strong>Esta cotizacion no trae detalle compartido aun</strong>
                <p>Usa una cotizacion creada desde el armador comercial para transferir sus lineas a produccion.</p>
              </article>
            ) : (
              inheritedLines.map((line) => (
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
                    <span>Stock declarado: {line.stock}</span>
                    <span>{formatStoredQuoteTotal(line.unitPrice)} unitario</span>
                  </div>
                  {line.notes ? <p>{line.notes}</p> : null}
                </article>
              ))
            )}
          </div>
        </div>

        <div className="builder-block">
          <div className="builder-block__header">
            <strong>Sugerencias de abastecimiento</strong>
            <p>Si una linea supera el stock disponible, la OT deja lista la recomendacion para Compras.</p>
          </div>

          <div className="quote-line-list">
            {purchaseSuggestions.length === 0 ? (
              <article className="quote-line-card">
                <strong>Sin faltantes detectados</strong>
                <p>Las lineas heredadas no requieren reposicion inmediata para ejecutar la orden.</p>
              </article>
            ) : (
              purchaseSuggestions.map((suggestion) => (
                <article className="quote-line-card" key={suggestion.id}>
                  <div className="quote-line-card__top">
                    <div>
                      <div className="quote-line-card__eyebrow">
                        Compra sugerida · {suggestion.sourceCode}
                      </div>
                      <strong>{suggestion.item}</strong>
                    </div>
                    <strong>{suggestion.shortageQuantity} faltantes</strong>
                  </div>
                  <div className="quote-line-card__meta">
                    <span>Solicitado: {suggestion.requiredQuantity}</span>
                    <span>Disponible: {suggestion.availableStock}</span>
                    <span>Proveedor: {suggestion.suggestedSupplier}</span>
                  </div>
                  <p>{suggestion.reason}</p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <aside className="builder-pane builder-pane--summary">
        <div className="quote-summary-card">
          <div className="quote-summary-card__header">
            <p className="eyebrow">Orden generada</p>
            <h3>{lastCreated ?? generatedNumber}</h3>
          </div>

          <div className="summary-list">
            <div className="summary-list__row">
              <span>Cliente</span>
              <strong>{quote.customer}</strong>
            </div>
            <div className="summary-list__row">
              <span>Cotizacion</span>
              <strong>{quote.number}</strong>
            </div>
            <div className="summary-list__row">
              <span>Area</span>
              <strong>{area}</strong>
            </div>
            <div className="summary-list__row">
              <span>Encargado</span>
              <strong>{responsible}</strong>
            </div>
            <div className="summary-list__row">
              <span>Entrega</span>
              <strong>{dueDate}</strong>
            </div>
            <div className="summary-list__row">
              <span>Valor referencial</span>
              <strong>{quote.totalLabel}</strong>
            </div>
            <div className="summary-list__row">
              <span>Lineas heredadas</span>
              <strong>{inheritedLines.length}</strong>
            </div>
            <div className="summary-list__row">
              <span>Compras sugeridas</span>
              <strong>{purchaseSuggestions.length}</strong>
            </div>
          </div>

          <div className="summary-signals">
            <StatusPill label={proof} tone="info" />
            <StatusPill
              label={requiresInstallation ? "Coordinar instalacion" : "Solo produccion interna"}
              tone={requiresInstallation ? "warning" : "success"}
            />
            <StatusPill
              label={
                purchaseSuggestions.length > 0 ? "Derivar faltantes a Compras" : "Sin faltantes criticos"
              }
              tone={purchaseSuggestions.length > 0 ? "warning" : "success"}
            />
            {lastCreatedPurchase ? (
              <StatusPill label={`OC directa ${lastCreatedPurchase}`} tone="success" />
            ) : null}
          </div>

          <p>{notes}</p>
        </div>

        <div className="quote-summary-card quote-summary-card--secondary">
          <div className="quote-summary-card__header">
            <p className="eyebrow">OT sincronizadas</p>
            <h3>{workOrders.length}</h3>
          </div>

          <div className="timeline-list">
            {workOrders.length === 0 ? (
              <article>
                <strong>No hay ordenes creadas aun</strong>
                <p>Cuando generes una OT aqui, quedara visible para el resto del flujo.</p>
              </article>
            ) : (
              workOrders.slice(0, 3).map((order) => (
                <article key={order.id}>
                  <strong>
                    {order.number} · {order.customer}
                  </strong>
                  <p>
                    {order.area} · entrega {order.dueDate}
                  </p>
                  <div className="builder-actions">
                    <button
                      className="ghost-button"
                      disabled={order.purchaseSuggestions.length === 0}
                      onClick={() => handleCreatePurchaseFromOrder(order)}
                      type="button"
                    >
                      {order.purchaseSuggestions.length > 0
                        ? "Crear OC sugerida"
                        : "Sin compra requerida"}
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
