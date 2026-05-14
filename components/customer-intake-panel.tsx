"use client";

import { useMemo, useState } from "react";

import { StatusPill } from "@/components/status-pill";

const segmentOptions = [
  "Clinica privada",
  "Centro medico",
  "Hospital",
  "Laboratorio",
  "Empresa",
];

export function CustomerIntakePanel() {
  const [businessName, setBusinessName] = useState("Clinica Nueva Esperanza");
  const [rut, setRut] = useState("76.555.321-1");
  const [segment, setSegment] = useState(segmentOptions[0]);
  const [commune, setCommune] = useState("Quilpue");
  const [paymentTerms, setPaymentTerms] = useState("30 dias");
  const [contactName, setContactName] = useState("Marcela Fuentes");
  const [contactEmail, setContactEmail] = useState("compras@clinicaesperanza.cl");
  const [notes, setNotes] = useState(
    "Cliente con compras recurrentes de sabanillas y papeleria clinica.",
  );

  const completion = useMemo(() => {
    const values = [businessName, rut, segment, commune, paymentTerms, contactName, contactEmail];
    const completed = values.filter((value) => value.trim().length > 0).length;
    return Math.round((completed / values.length) * 100);
  }, [businessName, rut, segment, commune, paymentTerms, contactName, contactEmail]);

  return (
    <div className="quote-workbench">
      <section className="builder-pane builder-pane--primary">
        <div className="builder-block">
          <div className="builder-block__header">
            <div>
              <p className="eyebrow">Captura preliminar</p>
              <h3>Ficha de nuevo cliente</h3>
            </div>
            <StatusPill
              label={completion >= 85 ? "Lista para guardar" : "Aun incompleta"}
              tone={completion >= 85 ? "success" : "warning"}
            />
          </div>

          <div className="form-grid">
            <label className="field-group field-group--span-2">
              <span className="field-label">Razon social</span>
              <input
                className="field-control"
                onChange={(event) => setBusinessName(event.target.value)}
                value={businessName}
              />
            </label>

            <label className="field-group">
              <span className="field-label">RUT</span>
              <input
                className="field-control"
                onChange={(event) => setRut(event.target.value)}
                value={rut}
              />
            </label>

            <label className="field-group">
              <span className="field-label">Segmento</span>
              <select
                className="field-control"
                onChange={(event) => setSegment(event.target.value)}
                value={segment}
              >
                {segmentOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-group">
              <span className="field-label">Comuna</span>
              <input
                className="field-control"
                onChange={(event) => setCommune(event.target.value)}
                value={commune}
              />
            </label>

            <label className="field-group">
              <span className="field-label">Condicion de pago</span>
              <input
                className="field-control"
                onChange={(event) => setPaymentTerms(event.target.value)}
                value={paymentTerms}
              />
            </label>

            <label className="field-group">
              <span className="field-label">Contacto</span>
              <input
                className="field-control"
                onChange={(event) => setContactName(event.target.value)}
                value={contactName}
              />
            </label>

            <label className="field-group">
              <span className="field-label">Correo</span>
              <input
                className="field-control"
                onChange={(event) => setContactEmail(event.target.value)}
                value={contactEmail}
              />
            </label>

            <label className="field-group field-group--span-2">
              <span className="field-label">Notas comerciales</span>
              <textarea
                className="field-control field-control--textarea"
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                value={notes}
              />
            </label>
          </div>
        </div>
      </section>

      <aside className="builder-pane builder-pane--summary">
        <div className="quote-summary-card">
          <div className="quote-summary-card__header">
            <p className="eyebrow">Preview de ficha</p>
            <h3>{businessName}</h3>
          </div>

          <div className="summary-list">
            <div className="summary-list__row">
              <span>RUT</span>
              <strong>{rut}</strong>
            </div>
            <div className="summary-list__row">
              <span>Segmento</span>
              <strong>{segment}</strong>
            </div>
            <div className="summary-list__row">
              <span>Comuna</span>
              <strong>{commune}</strong>
            </div>
            <div className="summary-list__row">
              <span>Pago</span>
              <strong>{paymentTerms}</strong>
            </div>
            <div className="summary-list__row">
              <span>Contacto</span>
              <strong>{contactName}</strong>
            </div>
            <div className="summary-list__row">
              <span>Correo</span>
              <strong>{contactEmail}</strong>
            </div>
          </div>

          <div className="quote-total-card">
            <div className="summary-list__row summary-list__row--grand">
              <span>Completitud</span>
              <strong>{completion}%</strong>
            </div>
          </div>

          <p>{notes}</p>
        </div>
      </aside>
    </div>
  );
}
