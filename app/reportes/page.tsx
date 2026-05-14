import { AppShell } from "@/components/app-shell";
import { ReportingDashboard } from "@/components/reporting-dashboard";

export default function ReportsPage() {
  return (
    <AppShell
      title="Reportes y graficos"
      description="Aqui ves los graficos del negocio: ventas, costos, categorias, clientes clave y actividad general."
    >
      <ReportingDashboard />
    </AppShell>
  );
}
