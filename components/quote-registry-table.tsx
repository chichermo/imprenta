"use client";

import { useMemo } from "react";

import { formatStoredQuoteTotal, useAppState } from "@/components/app-state-provider";
import { StatusPill } from "@/components/status-pill";
import { StatusTransitionButton } from "@/components/status-transition-button";
import {
  getNextQuoteStatuses,
  getQuoteStatusTone,
  normalizeQuoteStatus,
} from "@/lib/business-states";
import { quoteRecords } from "@/lib/mock-data";

function summarizeLines(lines: { name: string }[]) {
  if (lines.length === 0) {
    return "Sin detalle de lineas";
  }

  const [first, ...rest] = lines;
  return rest.length > 0 ? `${first.name} +${rest.length} items` : first.name;
}

export function QuoteRegistryTable() {
  const { savedQuotes, transitionQuoteStatus } = useAppState();

  const rows = useMemo(() => {
    const shared = savedQuotes.map((quote) => ({
      key: quote.id,
      number: quote.number,
      customer: quote.customer,
      summary: summarizeLines(quote.lines),
      validUntil: quote.validUntilLabel,
      total: formatStoredQuoteTotal(quote.total),
      status: quote.status,
      tone: getQuoteStatusTone(quote.status),
      source: "live" as const,
      quoteId: quote.id,
    }));

    const mock = quoteRecords
      .filter((record) => !shared.some((row) => row.number === record.number))
      .map((record) => ({
        key: record.number,
        number: record.number,
        customer: record.customer,
        summary: record.summary,
        validUntil: record.validUntil,
        total: record.total,
        status: normalizeQuoteStatus(record.status),
        tone: record.tone,
        source: "mock" as const,
        quoteId: null as string | null,
      }));

    return [...shared, ...mock];
  }, [savedQuotes]);

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Numero</th>
            <th>Cliente</th>
            <th>Detalle</th>
            <th>Validez</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const nextStatuses = row.quoteId ? getNextQuoteStatuses(row.status) : [];

            return (
              <tr key={row.key}>
                <td>
                  {row.number}
                  {row.source === "live" ? (
                    <small className="table-subtle"> · flujo vivo</small>
                  ) : null}
                </td>
                <td>{row.customer}</td>
                <td>{row.summary}</td>
                <td>{row.validUntil}</td>
                <td>{row.total}</td>
                <td>
                  <StatusPill label={row.status} tone={row.tone} />
                </td>
                <td>
                  <div className="table-actions">
                    {row.quoteId
                      ? nextStatuses.map((status) => (
                          <StatusTransitionButton
                            key={status}
                            label={status}
                            onClick={() => transitionQuoteStatus(row.quoteId!, status)}
                          />
                        ))
                      : (
                        <span className="table-subtle">Referencia historica</span>
                      )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
