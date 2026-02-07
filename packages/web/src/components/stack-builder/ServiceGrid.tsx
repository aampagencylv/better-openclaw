"use client";

import type { ServiceDefinition, CategoryInfo, ResolvedService } from "@better-openclaw/core";
import { ServiceCard } from "./ServiceCard";

interface ServiceGridProps {
  services: ServiceDefinition[];
  categories: CategoryInfo[];
  selectedIds: Set<string>;
  resolvedServices: ResolvedService[];
  onToggle: (id: string) => void;
}

export function ServiceGrid({
  services,
  categories,
  selectedIds,
  resolvedServices,
  onToggle,
}: ServiceGridProps) {
  // Build a lookup for addedBy from resolved services
  const addedByMap = new Map<string, string>();
  for (const rs of resolvedServices) {
    addedByMap.set(rs.definition.id, rs.addedBy);
  }

  // Group services by category
  const grouped = new Map<string, ServiceDefinition[]>();
  for (const svc of services) {
    const existing = grouped.get(svc.category) ?? [];
    existing.push(svc);
    grouped.set(svc.category, existing);
  }

  return (
    <div className="space-y-8">
      {categories.map((cat) => {
        const categoryServices = grouped.get(cat.id);
        if (!categoryServices || categoryServices.length === 0) return null;

        return (
          <div key={cat.id}>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <span>{cat.icon}</span>
              {cat.name}
              <span className="text-xs font-normal">
                ({categoryServices.length})
              </span>
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {categoryServices.map((svc) => (
                <ServiceCard
                  key={svc.id}
                  id={svc.id}
                  name={svc.name}
                  description={svc.description}
                  icon={svc.icon}
                  maturity={svc.maturity}
                  minMemoryMB={svc.minMemoryMB}
                  selected={selectedIds.has(svc.id)}
                  addedBy={addedByMap.get(svc.id)}
                  onToggle={onToggle}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
