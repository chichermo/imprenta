"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

import {
  companyProfile,
  navigationSections,
  quickActions,
} from "@/lib/app-data";

type AppShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AppShell({ title, description, children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand-block" href="/">
          <div className="brand-mark">SP</div>
          <div className="brand-meta">
            <p className="eyebrow">ERP comercial</p>
            <h1>{companyProfile.name}</h1>
            <p className="brand-copy">{companyProfile.positioning}</p>
          </div>
          <div className="brand-tags">
            <span className="region-tag">{companyProfile.region}</span>
            <span className="region-tag region-tag--secondary">
              {companyProfile.specialty}
            </span>
          </div>
        </Link>

        <nav aria-label="Navegacion principal" className="nav-sections">
          {navigationSections.map((section) => (
            <div className="nav-section" key={section.title}>
              <p className="nav-section__title">{section.title}</p>
              <div className="nav-list">
                {section.items.map((item) => {
                  const isActive =
                    item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

                  return (
                    <Link
                      aria-current={isActive ? "page" : undefined}
                      className={`nav-link${isActive ? " nav-link--active" : ""}`}
                      href={item.href}
                      key={item.href}
                    >
                      <span className="nav-link__badge">{item.shortLabel}</span>
                      <div className="nav-link__copy">
                        <span>{item.label}</span>
                        <small>{item.description}</small>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <div className="main-layout">
        <header className="topbar">
          <div className="page-header">
            <div>
              <p className="eyebrow">Panel general</p>
              <h2>{title}</h2>
            </div>
            <p className="page-description">{description}</p>
          </div>

          <div className="topbar-actions" aria-label="Accesos rapidos">
            {quickActions.map((action) => (
              <Link className="quick-action" href={action.href} key={action.href}>
                {action.label}
              </Link>
            ))}
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
