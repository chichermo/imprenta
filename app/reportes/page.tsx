import { AppShell } from "@/components/app-shell";
import { ReportingDashboard } from "@/components/reporting-dashboard";

export default function ReportsPage() {
  return (
    <AppShell
      title="Reportes y gestion"
      description="Tablero ejecutivo para ventas, categorias, clientes clave y seguimiento general del negocio."
    >
      <ReportingDashboard />
    </AppShell>
  );
}
