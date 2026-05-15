"use client";

import { useMemo } from "react";

import { useAppState } from "@/components/app-state-provider";
import { StatusPill } from "@/components/status-pill";
import { StatusTransitionButton } from "@/components/status-transition-button";
import {
  getNextWorkOrderStatuses,
  getWorkOrderStatusTone,
  normalizeWorkOrderStatus,
} from "@/lib/business-states";
import { workOrderRecords } from "@/lib/mock-data";

function summarizeOrder(lines: { name: string }[], fallback: string) {
  if (lines.length === 0) {
    return fallback;
  }

  const [first, ...rest] = lines;
  return rest.length > 0 ? `${first.name} +${rest.length} items` : first.name;
}

export function WorkOrderRegistryTable() {
  const { workOrders, transitionWorkOrderStatus } = useAppState();

  const rows = useMemo(() => {
    const shared = workOrders.map((order) => ({
      key: order.id,
      number: order.number,
      customer: order.customer,
      area: order.area,
      summary: summarizeOrder(order.lines, order.notes),
      deliveryDate: order.dueDate,
      status: order.status,
      tone: getWorkOrderStatusTone(order.status),
      source: "live" as const,
      workOrderId: order.id,
    }));

    const mock = workOrderRecords
      .filter((record) => !shared.some((row) => row.number === record.number))
      .map((record) => ({
        key: record.number,
        number: record.number,
        customer: record.customer,
        area: record.area,
        summary: record.summary,
        deliveryDate: record.deliveryDate,
        status: normalizeWorkOrderStatus(record.status),
        tone: record.tone,
        source: "mock" as const,
        workOrderId: null as string | null,
      }));

    return [...shared, ...mock];
  }, [workOrders]);

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Orden</th>
            <th>Cliente</th>
            <th>Area</th>
            <th>Resumen</th>
            <th>Entrega</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const nextStatuses = row.workOrderId ? getNextWorkOrderStatuses(row.status) : [];

            return (
              <tr key={row.key}>
                <td>
                  {row.number}
                  {row.source === "live" ? (
                    <small className="table-subtle"> · flujo vivo</small>
                  ) : null}
                </td>
                <td>{row.customer}</td>
                <td>{row.area}</td>
                <td>{row.summary}</td>
                <td>{row.deliveryDate}</td>
                <td>
                  <StatusPill label={row.status} tone={row.tone} />
                </td>
                <td>
                  <div className="table-actions">
                    {row.workOrderId
                      ? nextStatuses.map((status) => (
                          <StatusTransitionButton
                            key={status}
                            label={status}
                            onClick={() => transitionWorkOrderStatus(row.workOrderId!, status)}
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
