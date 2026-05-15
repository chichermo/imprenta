"use client";

import { useMemo } from "react";

import { formatStoredQuoteTotal, useAppState } from "@/components/app-state-provider";
import { StatusPill } from "@/components/status-pill";
import { StatusTransitionButton } from "@/components/status-transition-button";
import {
  getNextPurchaseStatuses,
  getPurchaseStatusTone,
  normalizePurchaseStatus,
} from "@/lib/business-states";
import { purchaseOrderRecords } from "@/lib/mock-data";

export function PurchaseRegistryTable() {
  const { purchases, transitionPurchaseStatus } = useAppState();

  const rows = useMemo(() => {
    const shared = purchases.map((purchase) => ({
      key: purchase.id,
      number: purchase.number,
      supplier: purchase.supplier,
      eta: purchase.eta,
      total: formatStoredQuoteTotal(purchase.total),
      status: purchase.status,
      tone: getPurchaseStatusTone(purchase.status),
      source: "live" as const,
      purchaseId: purchase.id,
    }));

    const mock = purchaseOrderRecords
      .filter((record) => !shared.some((row) => row.number === record.number))
      .map((record) => ({
        key: record.number,
        number: record.number,
        supplier: record.supplier,
        eta: record.eta,
        total: record.total,
        status: normalizePurchaseStatus(record.status),
        tone: record.tone,
        source: "mock" as const,
        purchaseId: null as string | null,
      }));

    return [...shared, ...mock];
  }, [purchases]);

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Orden</th>
            <th>Proveedor</th>
            <th>ETA</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const nextStatuses = row.purchaseId ? getNextPurchaseStatuses(row.status) : [];

            return (
              <tr key={row.key}>
                <td>
                  {row.number}
                  {row.source === "live" ? (
                    <small className="table-subtle"> · flujo vivo</small>
                  ) : null}
                </td>
                <td>{row.supplier}</td>
                <td>{row.eta}</td>
                <td>{row.total}</td>
                <td>
                  <StatusPill label={row.status} tone={row.tone} />
                </td>
                <td>
                  <div className="table-actions">
                    {row.purchaseId
                      ? nextStatuses.map((status) => (
                          <StatusTransitionButton
                            key={status}
                            label={status}
                            onClick={() => transitionPurchaseStatus(row.purchaseId!, status)}
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
