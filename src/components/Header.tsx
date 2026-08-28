import React from 'react';
import { 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  UserCheck, 
  Printer, 
  AlertCircle,
  Coins,
} from 'lucide-react';
import { ProjectInfo, UserRole, CurrencyCode } from '../types';
import { useCurrency } from '../context/CurrencyContext';

interface HeaderProps {
  project: ProjectInfo;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  pendingApprovalsCount: number;
  onOpenQuickAssistant: () => void;
  onExportSummary: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  project,
  userRole,
  onRoleChange,
  pendingApprovalsCount,
  onOpenQuickAssistant,
}) => {
  const { currency, setCurrency, supportedCurrencies } = useCurrency();

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Project Identity */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold font-display text-xl tracking-tight">
                CP
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="font-display font-bold text-lg text-slate-100 tracking-tight">CostPilot AI</h1>
                  <span className="bg-blue-900/60 text-blue-300 border border-blue-700/50 text-[11px] font-mono px-2 py-0.5 rounded-full font-medium">
                    v2.4
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-sans hidden sm:block">
                  Project clarity. Cost control. Confident delivery.
                </p>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-700 mx-1 hidden md:block" />

            {/* Active Project Tag */}
            <div className="hidden lg:flex items-center space-x-2 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg text-xs">
              <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <div className="flex flex-col">
                <span className="font-semibold text-slate-200 truncate max-w-[200px]">
                  {project.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {project.code} • {project.contractType.split(' ')[0]} Option A
                </span>
              </div>
            </div>
          </div>

          {/* Right Controls: Currency Selector, Role Selector, Approvals & Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Responsible AI Verification Pill */}
            <div className="hidden xl:flex items-center space-x-1.5 bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px]">Human-in-the-loop</span>
            </div>

            {/* Pending Human Approvals Badge */}
            {pendingApprovalsCount > 0 && (
              <div 
                title={`${pendingApprovalsCount} items require human review before action`}
                className="flex items-center space-x-1 bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs px-2.5 py-1 rounded-full font-medium animate-pulse"
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-mono font-semibold">{pendingApprovalsCount}</span>
              </div>
            )}

            {/* Currency Selector (ZAR Standard + Global Options) */}
            <div className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg px-2.5 py-1 text-xs transition-colors">
              <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <select
                aria-label="Select Project Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer border-none py-0.5"
                title="Change display currency (Standard: ZAR Rands)"
              >
                {supportedCurrencies.map((c) => (
                  <option key={c.code} value={c.code} className="bg-slate-800 text-white">
                    {c.flag} {c.code} ({c.symbol.trim()}) {c.code === 'ZAR' ? '★ Standard' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Switcher */}
            <div className="hidden sm:flex items-center space-x-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
              <select
                aria-label="Select User Role"
                value={userRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer border-none py-0.5"
              >
                <option value="Quantity Surveyor" className="bg-slate-800 text-white">Lead QS</option>
                <option value="Project Manager" className="bg-slate-800 text-white">Project Manager</option>
                <option value="Cost Controller" className="bg-slate-800 text-white">Cost Controller</option>
                <option value="Commercial Director" className="bg-slate-800 text-white">Commercial Director</option>
                <option value="Client Representative" className="bg-slate-800 text-white">Client Rep</option>
              </select>
            </div>

            {/* Quick AI Query Button */}
            <button
              onClick={onOpenQuickAssistant}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span className="hidden md:inline">Ask AI Copilot</span>
              <span className="md:hidden">AI</span>
            </button>

            {/* Print / Export Action */}
            <button
              onClick={() => window.print()}
              title="Print / Save as PDF Report"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer hidden lg:block"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
