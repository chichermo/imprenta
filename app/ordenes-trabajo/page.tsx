import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { WorkOrderRegistryTable } from "@/components/work-order-registry-table";
import { WorkOrderStudio } from "@/components/work-order-studio";
import { workStages } from "@/lib/mock-data";

export default function WorkOrdersPage() {
  return (
    <AppShell
      title="Ordenes de trabajo"
      description="Seguimiento productivo para imprenta, gran formato, senaletica y encargos a medida."
    >
      <div className="content-grid">
        <WorkOrderStudio />

        <SectionCard
          title="Cola de produccion"
          description="Ordenes del flujo compartido con avance de estado y handoff a compras e inventario."
        >
          <WorkOrderRegistryTable />
        </SectionCard>

        <SectionCard
          title="Estados sugeridos"
          description="Flujo simple y suficiente para la primera etapa."
        >
          <div className="tag-list">
            {workStages.map((stage) => (
              <span className="soft-tag" key={stage}>
                {stage}
              </span>
            ))}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
