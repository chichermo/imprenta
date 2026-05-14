"use client";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { formatClp } from "@/lib/formatters";
import {
  CategoryBreakdown,
  CustomerRanking,
  OperationsBreakdown,
  PerformanceSnapshot,
  ReportSummaryMetric,
} from "@/lib/reporting-data";

type ChartTargets = {
  trend: HTMLElement | null;
  operations: HTMLElement | null;
  categories: HTMLElement | null;
  customers: HTMLElement | null;
};

type ExportPayload = {
  fileLabel: string;
  periodLabel: string;
  summaryMetrics: ReportSummaryMetric[];
  records: PerformanceSnapshot[];
  categoryBreakdown: CategoryBreakdown[];
  operationsBreakdown: OperationsBreakdown[];
  customerRanking: CustomerRanking[];
  chartTargets: ChartTargets;
};

async function captureChartImages(targets: ChartTargets) {
  const images: { key: keyof ChartTargets; base64: string }[] = [];

  for (const [key, element] of Object.entries(targets) as [keyof ChartTargets, HTMLElement | null][]) {
    if (!element) {
      continue;
    }

    const base64 = await toPng(element, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#fffaf0",
    });

    images.push({ key, base64 });
  }

  return images;
}

export async function exportReportToPdf(payload: ExportPayload) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const chartImages = await captureChartImages(payload.chartTargets);
  const pageWidth = doc.internal.pageSize.getWidth();
  const usableWidth = pageWidth - 80;

  doc.setFontSize(22);
  doc.text("Reporte ejecutivo", 40, 48);
  doc.setFontSize(11);
  doc.text(`Periodo: ${payload.periodLabel}`, 40, 68);
  doc.text(`Exportado: ${new Date().toLocaleString("es-CL")}`, 40, 84);

  autoTable(doc, {
    startY: 104,
    head: [["Indicador", "Valor", "Contexto"]],
    body: payload.summaryMetrics.map((metric) => [metric.label, metric.value, metric.helper]),
    styles: {
      fontSize: 9,
      cellPadding: 6,
    },
    headStyles: {
      fillColor: [17, 32, 51],
    },
  });

  let currentY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 160;

  for (const image of chartImages.slice(0, 2)) {
    if (currentY + 230 > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      currentY = 48;
    }

    doc.setFontSize(13);
    doc.text(image.key.toUpperCase(), 40, currentY + 16);
    doc.addImage(image.base64, "PNG", 40, currentY + 26, usableWidth, 180);
    currentY += 228;
  }

  doc.addPage();
  autoTable(doc, {
    startY: 40,
    head: [["Mes", "Ventas", "Costos", "Cotizaciones", "Aprobadas", "OT", "Cobranza"]],
    body: payload.records.map((record) => [
      record.label,
      formatClp(record.revenue),
      formatClp(record.costs),
      record.quotesCreated.toString(),
      record.quotesApproved.toString(),
      record.workOrders.toString(),
      formatClp(record.collected),
    ]),
    styles: {
      fontSize: 8,
      cellPadding: 5,
    },
    headStyles: {
      fillColor: [14, 66, 93],
    },
  });

  doc.addPage();
  autoTable(doc, {
    startY: 40,
    head: [["Categoria", "Ventas", "Participacion"]],
    body: payload.categoryBreakdown.map((category) => [
      category.category,
      formatClp(category.revenue),
      `${category.share}%`,
    ]),
    styles: {
      fontSize: 9,
      cellPadding: 5,
    },
    headStyles: {
      fillColor: [41, 116, 115],
    },
  });

  autoTable(doc, {
    startY: ((doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 120) + 22,
    head: [["Cliente", "Ventas", "Cotizaciones", "Saldo pendiente"]],
    body: payload.customerRanking.map((customer) => [
      customer.customer,
      formatClp(customer.revenue),
      customer.quotes.toString(),
      formatClp(customer.outstanding),
    ]),
    styles: {
      fontSize: 9,
      cellPadding: 5,
    },
    headStyles: {
      fillColor: [145, 102, 20],
    },
  });

  doc.save(`${payload.fileLabel}.pdf`);
}

export async function exportReportToExcel(payload: ExportPayload) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Cursor";
  workbook.created = new Date();

  const summarySheet = workbook.addWorksheet("Resumen");
  summarySheet.columns = [
    { header: "Indicador", key: "label", width: 28 },
    { header: "Valor", key: "value", width: 18 },
    { header: "Contexto", key: "helper", width: 56 },
  ];

  summarySheet.addRow(["Periodo", payload.periodLabel, "Filtro actualmente aplicado"]);
  payload.summaryMetrics.forEach((metric) => summarySheet.addRow(metric));

  const detailSheet = workbook.addWorksheet("Detalle mensual");
  detailSheet.columns = [
    { header: "Mes", key: "label", width: 16 },
    { header: "Ventas", key: "revenue", width: 16 },
    { header: "Costos", key: "costs", width: 16 },
    { header: "Cotizaciones", key: "quotesCreated", width: 16 },
    { header: "Aprobadas", key: "quotesApproved", width: 14 },
    { header: "OT", key: "workOrders", width: 12 },
    { header: "Entregas", key: "deliveries", width: 12 },
    { header: "Compras", key: "purchases", width: 12 },
    { header: "Cobranza", key: "collected", width: 16 },
    { header: "Saldo", key: "outstanding", width: 16 },
  ];
  payload.records.forEach((record) => detailSheet.addRow(record));

  const categoriesSheet = workbook.addWorksheet("Categorias");
  categoriesSheet.columns = [
    { header: "Categoria", key: "category", width: 28 },
    { header: "Ventas", key: "revenue", width: 16 },
    { header: "Participacion", key: "share", width: 16 },
  ];
  payload.categoryBreakdown.forEach((row) => categoriesSheet.addRow(row));

  const customersSheet = workbook.addWorksheet("Clientes");
  customersSheet.columns = [
    { header: "Cliente", key: "customer", width: 28 },
    { header: "Ventas", key: "revenue", width: 16 },
    { header: "Cotizaciones", key: "quotes", width: 16 },
    { header: "Saldo pendiente", key: "outstanding", width: 18 },
  ];
  payload.customerRanking.forEach((row) => customersSheet.addRow(row));

  const chartsSheet = workbook.addWorksheet("Graficos");
  const chartImages = await captureChartImages(payload.chartTargets);

  let currentRow = 2;
  for (const chart of chartImages) {
    chartsSheet.getCell(`A${currentRow}`).value = chart.key.toUpperCase();
    chartsSheet.getCell(`A${currentRow}`).font = { bold: true, size: 14 };
    const imageId = workbook.addImage({
      base64: chart.base64,
      extension: "png",
    });

    chartsSheet.addImage(imageId, {
      tl: { col: 0, row: currentRow },
      ext: { width: 640, height: 240 },
    });
    currentRow += 15;
  }

  [summarySheet, detailSheet, categoriesSheet, customersSheet].forEach((sheet) => {
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "112033" },
    };
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `${payload.fileLabel}.xlsx`,
  );
}
