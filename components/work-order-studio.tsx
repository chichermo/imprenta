"use client";

import { useMemo, useState } from "react";

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

export function WorkOrderStudio() {
  const [selectedQuote, setSelectedQuote] = useState(quoteRecords[0].number);
  const [area, setArea] = useState("Imprenta");
  const [responsible, setResponsible] = useState("Preprensa");
  const [proof, setProof] = useState("PDF digital");
  const [dueDate, setDueDate] = useState("2026-05-19");
  const [requiresInstallation, setRequiresInstallation] = useState(false);
  const [notes, setNotes] = useState(
    "Validar aprobacion del cliente antes de liberar a produccion.",
  );

  const quote = quoteRecords.find((record) => record.number === selectedQuote) ?? quoteRecords[0];
  const stageTemplates = useMemo(() => createStageTemplates(area), [area]);
  const generatedNumber = `OT-${selectedQuote.replace("COT-", "")}`;

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
                {quoteRecords.map((record) => (
                  <option key={record.number} value={record.number}>
                    {record.number} · {record.customer}
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
      </section>

      <aside className="builder-pane builder-pane--summary">
        <div className="quote-summary-card">
          <div className="quote-summary-card__header">
            <p className="eyebrow">Orden generada</p>
            <h3>{generatedNumber}</h3>
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
              <strong>{quote.total}</strong>
            </div>
          </div>

          <div className="summary-signals">
            <StatusPill label={proof} tone="info" />
            <StatusPill
              label={requiresInstallation ? "Coordinar instalacion" : "Solo produccion interna"}
              tone={requiresInstallation ? "warning" : "success"}
            />
          </div>

          <p>{notes}</p>
        </div>
      </aside>
    </div>
  );
}
