import React from 'react';
import {
  LayoutDashboard,
  Calculator,
  Kanban,
  Bot,
  Mail,
  Users,
  CalendarCheck2,
  FileText,
  FileSpreadsheet,
  AlertTriangle,
  Layers,
  Settings,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  variationsPendingCount: number;
  unapprovedActionsCount: number;
  conflictTasksCount: number;
  risksHighCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  variationsPendingCount,
  unapprovedActionsCount,
  conflictTasksCount,
  risksHighCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as AppView,
      label: 'Dashboard',
      icon: LayoutDashboard,
      section: 'Core Overview',
    },
    {
      id: 'cost-control' as AppView,
      label: 'Cost Control',
      icon: Calculator,
      badge: variationsPendingCount > 0 ? `${variationsPendingCount} pending` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      section: 'Commercial & Delivery',
    },
    {
      id: 'schedule-tasks' as AppView,
      label: 'Schedule & Tasks',
      icon: Kanban,
      badge: conflictTasksCount > 0 ? `${conflictTasksCount} conflict` : undefined,
      badgeColor: 'bg-red-100 text-red-800 border-red-200',
      section: 'Commercial & Delivery',
    },
    {
      id: 'ai-assistant' as AppView,
      label: 'AI Copilot Assistant',
      icon: Bot,
      highlight: true,
      section: 'AI Productivity Suite',
    },
    {
      id: 'smart-email' as AppView,
      label: 'Smart Email Drafter',
      icon: Mail,
      section: 'AI Productivity Suite',
    },
    {
      id: 'meetings' as AppView,
      label: 'Meeting Summarizer',
      icon: Users,
      badge: unapprovedActionsCount > 0 ? `${unapprovedActionsCount} drafts` : undefined,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      section: 'AI Productivity Suite',
    },
    {
      id: 'task-planner' as AppView,
      label: 'AI Task Planner',
      icon: CalendarCheck2,
      section: 'AI Productivity Suite',
    },
    {
      id: 'documents' as AppView,
      label: 'Documents & BOQs',
      icon: FileText,
      section: 'Project Repository',
    },
    {
      id: 'reports' as AppView,
      label: 'Reports & Audits',
      icon: FileSpreadsheet,
      section: 'Project Repository',
    },
    {
      id: 'risks' as AppView,
      label: 'Risk Register',
      icon: AlertTriangle,
      badge: risksHighCount > 0 ? `${risksHighCount} high` : undefined,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      section: 'Governance',
    },
    {
      id: 'integrations' as AppView,
      label: 'Integrations',
      icon: Layers,
      section: 'Governance',
    },
    {
      id: 'settings' as AppView,
      label: 'Settings & Ethics',
      icon: Settings,
      section: 'Governance',
    },
  ];

  // Group items by section
  const sections = Array.from(new Set(navItems.map(item => item.section)));

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between shrink-0 no-print">
      <div className="p-3 space-y-6 overflow-y-auto">
        {sections.map(section => (
          <div key={section} className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">
              {section}
            </div>
            {navItems
              .filter(item => item.section === section)
              .map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectView(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer text-left ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm font-semibold'
                        : item.highlight
                        ? 'text-blue-300 hover:bg-slate-800/90 hover:text-white bg-blue-950/30 border border-blue-800/40'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-blue-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0 ml-1">
                      {item.badge && (
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
                    </div>
                  </button>
                );
              })}
          </div>
        ))}
      </div>

      {/* Footer Ethics & Responsible AI Card */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 space-y-1.5">
          <div className="flex items-center space-x-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="text-[11px] font-semibold">Decision-Support Only</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            AI outputs remain drafts. Certified cost advice & statutory notices require QS/PM authorization.
          </p>
          <div className="text-[9px] font-mono text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
            <span>Refilwe Mathebe</span>
            <span>2026 Edition</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
