import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  ArrowUpRight,
  Layers,
  FileCheck,
  Building,
  Calendar
} from 'lucide-react';
import { 
  ProjectInfo, 
  CostCodeItem, 
  VariationRecord, 
  PaymentApplication, 
  ProjectTask, 
  Milestone, 
  MeetingRecord, 
  RiskItem, 
  AppView 
} from '../types';
import { useCurrency } from '../context/CurrencyContext';

interface DashboardViewProps {
  project: ProjectInfo;
  costCodes: CostCodeItem[];
  variations: VariationRecord[];
  payments: PaymentApplication[];
  tasks: ProjectTask[];
  milestones: Milestone[];
  latestMeeting: MeetingRecord;
  risks: RiskItem[];
  onNavigate: (view: AppView) => void;
  onOpenAiWithPrompt: (promptText: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  project,
  costCodes,
  variations,
  payments,
  tasks,
  milestones,
  latestMeeting,
  risks,
  onNavigate,
  onOpenAiWithPrompt,
}) => {
  const { formatMoney, formatCompact, currencyConfig } = useCurrency();

  // Financial calculations
  const pendingVariations = variations.filter(v => v.status === 'Pending Review');
  const pendingPayment = payments.find(p => p.status === 'Certified');
  const conflictTasks = tasks.filter(t => t.hasConflict);
  const unapprovedActions = latestMeeting.actionItems.filter(a => !a.isApprovedAsTask);
  const highRisks = risks.filter(r => r.score >= 10);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner: Project Title, Status & Executive Traceability */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-mono font-semibold px-2 py-0.5 rounded">
                {project.code}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Contract: {project.contractType}
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-900 mt-1">
              {project.name}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
              <span><strong>Client:</strong> {project.client}</span>
              <span>•</span>
              <span><strong>Lead QS:</strong> {project.qsLead}</span>
              <span>•</span>
              <span><strong>Main Contractor:</strong> {project.contractor}</span>
              <span>•</span>
              <span><strong>Current Phase:</strong> {project.currentPhase}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-3 rounded-lg">
            <div className="text-right">
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                Overall Progress
              </div>
              <div className="font-display font-bold text-2xl text-blue-600">
                {project.progressPercent}%
              </div>
            </div>
            <div className="w-28 bg-slate-200 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${project.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Critical Alert Bar */}
      {(pendingVariations.length > 0 || pendingPayment || conflictTasks.length > 0 || unapprovedActions.length > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-amber-900">
                  Attention Required ({pendingVariations.length + (pendingPayment ? 1 : 0) + conflictTasks.length + unapprovedActions.length} Pending Actions)
                </h3>
                <div className="mt-1 space-y-1 text-xs text-amber-800">
                  {pendingPayment && (
                    <div>
                      • <strong>Payment Due:</strong> {pendingPayment.certNumber} ({formatMoney(pendingPayment.netPayable)} net) certified for release by <strong>{pendingPayment.dueDate}</strong>.
                    </div>
                  )}
                  {pendingVariations.map(v => (
                    <div key={v.id}>
                      • <strong>Variation Review:</strong> {v.varNumber} ({v.title}) pending formal QS / Client instruction ({formatMoney(v.qsAssessedCost)}).
                    </div>
                  ))}
                  {conflictTasks.map(t => (
                    <div key={t.id}>
                      • <strong>Dependency Conflict:</strong> {t.title} ({t.conflictReason}).
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => onNavigate('cost-control')}
              className="text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors shrink-0 cursor-pointer"
            >
              Review Ledgers &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Primary Financial Ledger Cards (Traceable) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Approved Budget */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Approved Budget</span>
            <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
              Contract Baseline
            </span>
          </div>
          <div className="font-mono font-bold text-xl text-slate-900">
            {formatMoney(project.approvedBudget)}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
            <span>Includes {formatCompact(project.contingencyBudget)} Contingency</span>
            <span className="text-blue-600 font-medium">NEC4 Option A</span>
          </div>
        </div>

        {/* Committed Cost */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Committed Cost</span>
            <span className="text-[10px] font-mono bg-blue-50 px-1.5 py-0.5 rounded text-blue-700">
              {((project.committedCost / project.approvedBudget) * 100).toFixed(1)}% of Budget
            </span>
          </div>
          <div className="font-mono font-bold text-xl text-blue-900">
            {formatMoney(project.committedCost)}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
            <span>Subcontracts & Orders</span>
            <span className="text-slate-600 font-mono">6 Packages Let</span>
          </div>
        </div>

        {/* Actual Certified Spend */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Actual Certified</span>
            <span className="text-[10px] font-mono bg-emerald-50 px-1.5 py-0.5 rounded text-emerald-700">
              Valuation #05
            </span>
          </div>
          <div className="font-mono font-bold text-xl text-emerald-700">
            {formatMoney(project.actualCost)}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
            <span>Net Paid + IPC-05 Due</span>
            <span className="text-slate-600 font-mono">5% Retention Held</span>
          </div>
        </div>

        {/* Forecast at Completion (FAC) & Net Variance */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Forecast at Completion</span>
            <span className="text-[10px] font-mono bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded font-semibold">
              -{formatCompact(project.forecastAtCompletion - project.approvedBudget)} Variance
            </span>
          </div>
          <div className="font-mono font-bold text-xl text-slate-900">
            {formatMoney(project.forecastAtCompletion)}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
            <span className="text-amber-700 font-medium">Absorbed in Contingency</span>
            <span className="text-emerald-700 font-semibold">{formatCompact(project.contingencyBudget - project.contingencyCommitted)} Cont. Left</span>
          </div>
        </div>
      </div>

      {/* Grid: Cost Package Status & S-Curve Cashflow Projection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost Code Breakdown Summary */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Cost Package Breakdown & Variance
              </h3>
              <p className="text-xs text-slate-500">
                Live ledger synchronization with certified variations and subcontractor claims ({currencyConfig.code})
              </p>
            </div>
            <button
              onClick={() => onNavigate('cost-control')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1 cursor-pointer"
            >
              <span>Full Ledger</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-mono text-[11px]">
                  <th className="pb-2 font-medium">Code</th>
                  <th className="pb-2 font-medium">Trade Package</th>
                  <th className="pb-2 font-medium text-right">Current Budget</th>
                  <th className="pb-2 font-medium text-right">Actual Cost</th>
                  <th className="pb-2 font-medium text-right">Forecast (FAC)</th>
                  <th className="pb-2 font-medium text-right">Variance</th>
                  <th className="pb-2 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {costCodes.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 font-mono font-semibold text-slate-700">{item.code}</td>
                    <td className="py-2.5 font-medium text-slate-800">
                      <div>{item.category}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.sourceRef}</div>
                    </td>
                    <td className="py-2.5 font-mono text-right text-slate-700">{formatMoney(item.currentBudget)}</td>
                    <td className="py-2.5 font-mono text-right text-slate-700">{formatMoney(item.actualCost)}</td>
                    <td className="py-2.5 font-mono text-right font-medium text-slate-900">{formatMoney(item.forecastCost)}</td>
                    <td className={`py-2.5 font-mono text-right font-semibold ${item.variance < 0 ? 'text-rose-600' : item.variance > 0 ? 'text-emerald-600' : 'text-slate-600'}`}>
                      {formatMoney(item.variance)}
                    </td>
                    <td className="py-2.5 text-center">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        item.status === 'On Track' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        item.status === 'Under Budget' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Milestone Tracker & Quick AI Prompts */}
        <div className="space-y-6">
          {/* Milestones */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-base text-slate-900">
                Key Contract Milestones
              </h3>
              <button 
                onClick={() => onNavigate('schedule-tasks')}
                className="text-xs text-blue-600 hover:underline font-medium cursor-pointer"
              >
                Schedule &rarr;
              </button>
            </div>

            <div className="space-y-3.5">
              {milestones.map((m) => (
                <div key={m.id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800 line-clamp-1">{m.name}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      m.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                      m.status === 'On Track' ? 'bg-blue-100 text-blue-800' :
                      'bg-rose-100 text-rose-800 font-semibold'
                    }`}>
                      {m.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Target: {m.baselineDate}</span>
                    <span>Forecast: {m.forecastDate}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${m.status === 'Completed' ? 'bg-emerald-600' : m.status === 'At Risk' ? 'bg-rose-500' : 'bg-blue-600'}`}
                      style={{ width: `${m.completionPercent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Assistance Card */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-xl p-5 shadow-md border border-slate-800">
            <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Evidence-Based AI Actions</span>
            </div>
            <h4 className="font-display font-semibold text-sm text-slate-100">
              What would you like to analyze?
            </h4>
            <div className="mt-3 space-y-2">
              <button
                onClick={() => onOpenAiWithPrompt('Analyze the current budget variance for 03.00 Superstructure Frame and evaluate the impact of VAR-002 on our contingency fund.')}
                className="w-full text-left text-xs bg-slate-800/80 hover:bg-slate-700 border border-slate-700 p-2 rounded-lg text-slate-200 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>🔍 Audit Superstructure Cost Variance</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              </button>
              <button
                onClick={() => onNavigate('smart-email')}
                className="w-full text-left text-xs bg-slate-800/80 hover:bg-slate-700 border border-slate-700 p-2 rounded-lg text-slate-200 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>✉️ Draft IPC-05 Payment Reminder Email</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              </button>
              <button
                onClick={() => onNavigate('meetings')}
                className="w-full text-left text-xs bg-slate-800/80 hover:bg-slate-700 border border-slate-700 p-2 rounded-lg text-slate-200 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>📝 Extract Decisions from Meeting #08</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
