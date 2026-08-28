import React, { useState } from 'react';
import {
  CalendarCheck2,
  Sparkles,
  Clock,
  CheckCircle2,
  Layers,
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import { ProjectTask, ProjectInfo } from '../types';

interface TaskPlannerViewProps {
  project: ProjectInfo;
  tasks: ProjectTask[];
  onGeneratePlan: (tasks: ProjectTask[], focusArea: string) => Promise<any>;
}

export const TaskPlannerView: React.FC<TaskPlannerViewProps> = ({
  project,
  tasks,
  onGeneratePlan,
}) => {
  const [focusArea, setFocusArea] = useState('Commercial Risk Mitigation & Critical Path Clearances');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'matrix' | 'daily' | 'weekly'>('matrix');

  const [dailySchedule, setDailySchedule] = useState([
    { time: '08:30 - 09:30', task: 'Review IPC-05 payment certification files and verify 5% retention deductions', priority: 'critical', costCode: '00.00 General' },
    { time: '09:30 - 11:00', task: 'Structural anchor bolt pull-out torque certificate verification on Grid 4-8', priority: 'critical', costCode: '03.00 Superstructure' },
    { time: '11:15 - 12:30', task: 'Audit VAR-002 Roof PV reinforcement compensation event against drawing S-204 Rev B', priority: 'high', costCode: '03.00 Superstructure' },
    { time: '13:30 - 15:00', task: 'Finalize Monthly Cost Report and contingency drawdown statement for Client board', priority: 'high', costCode: '00.00 General' },
    { time: '15:15 - 16:30', task: 'Coordinate MEP drainage clash detection RFI-088 with Buro engineer', priority: 'medium', costCode: '04.00 MEP' },
    { time: '16:30 - 17:00', task: 'Log site progress diary and update Kanban ledger', priority: 'low', costCode: '00.00 General' },
  ]);

  const [optimizationTips, setOptimizationTips] = useState<string[]>([
    'Batch all structural steel and bolt inspections into a single morning session before the cladding crew arrives at 13:00.',
    'Prioritize IPC-05 sign-off before 12:00 to meet the client finance desk EFT cutoff for Friday payout.',
    'Delegate standard concrete pour cube test logs to Junior QS to protect 3 hours for VAR-002 solar steel rate analysis.',
  ]);

  const handleRunOptimization = async () => {
    setIsLoading(true);
    try {
      const result = await onGeneratePlan(tasks, focusArea);
      if (result) {
        if (result.dailySchedule) setDailySchedule(result.dailySchedule);
        if (result.optimizationTips) setOptimizationTips(result.optimizationTips);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const criticalTasks = tasks.filter(t => t.priority === 'critical');
  const highTasks = tasks.filter(t => t.priority === 'high');
  const mediumTasks = tasks.filter(t => t.priority === 'medium');
  const lowTasks = tasks.filter(t => t.priority === 'low');

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 flex items-center space-x-2">
              <CalendarCheck2 className="w-6 h-6 text-blue-600" />
              <span>AI Task Planner & Schedule Optimizer</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Converts unassigned actions and site tasks into an optimized, time-blocked execution plan.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('matrix')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'matrix' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Eisenhower Matrix
              </button>
              <button
                onClick={() => setActiveTab('daily')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'daily' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Time-Blocked Day Plan
              </button>
            </div>

            <button
              onClick={handleRunOptimization}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>{isLoading ? 'Optimizing Schedule...' : 'Re-Optimize with AI'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Recommendations Bar */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl p-5 shadow-md border border-slate-800 space-y-3">
        <div className="flex items-center space-x-2 text-blue-300 font-display font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>AI Schedule Optimization Strategy</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {optimizationTips.map((tip, idx) => (
            <div key={idx} className="bg-slate-800/80 border border-slate-700 rounded-lg p-3 text-xs leading-relaxed text-slate-200">
              <strong className="text-blue-300 font-mono">Strategy {idx + 1}:</strong> {tip}
            </div>
          ))}
        </div>
      </div>

      {/* TAB 1: Eisenhower Matrix */}
      {activeTab === 'matrix' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quadrant 1: Critical & Urgent (Do First) */}
          <div className="bg-white rounded-xl border border-red-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-red-100 pb-2">
              <div className="flex items-center space-x-2 text-red-900 font-display font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Q1: Critical & Urgent (Do First)</span>
              </div>
              <span className="bg-red-100 text-red-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                {criticalTasks.length}
              </span>
            </div>

            <div className="space-y-2">
              {criticalTasks.map((t) => (
                <div key={t.id} className="p-2.5 bg-red-50/50 border border-red-100 rounded-lg text-xs space-y-1">
                  <div className="flex justify-between font-semibold text-red-950">
                    <span>{t.title}</span>
                    <span className="font-mono text-[10px] text-red-700">{t.dueDate}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-1">{t.description}</p>
                </div>
              ))}
              {criticalTasks.length === 0 && (
                <div className="text-slate-400 text-xs py-4 text-center">No critical bottlenecks</div>
              )}
            </div>
          </div>

          {/* Quadrant 2: High Importance (Schedule Deep Work) */}
          <div className="bg-white rounded-xl border border-blue-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-blue-100 pb-2">
              <div className="flex items-center space-x-2 text-blue-900 font-display font-bold text-sm">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Q2: High Value / Commercial (Schedule)</span>
              </div>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                {highTasks.length}
              </span>
            </div>

            <div className="space-y-2">
              {highTasks.map((t) => (
                <div key={t.id} className="p-2.5 bg-blue-50/40 border border-blue-100 rounded-lg text-xs space-y-1">
                  <div className="flex justify-between font-semibold text-blue-950">
                    <span>{t.title}</span>
                    <span className="font-mono text-[10px] text-blue-700">{t.dueDate}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-1">{t.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quadrant 3: Medium / Delegable */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center space-x-2 text-slate-800 font-display font-bold text-sm">
                <Layers className="w-4 h-4 text-amber-600" />
                <span>Q3: Coordination & Delegable</span>
              </div>
              <span className="bg-slate-100 text-slate-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                {mediumTasks.length}
              </span>
            </div>

            <div className="space-y-2">
              {mediumTasks.map((t) => (
                <div key={t.id} className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs space-y-1">
                  <div className="flex justify-between font-semibold text-slate-900">
                    <span>{t.title}</span>
                    <span className="font-mono text-[10px] text-slate-500">{t.dueDate}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-1">{t.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quadrant 4: Low Priority / Routine Admin */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center space-x-2 text-slate-700 font-display font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Q4: Routine Maintenance & Logs</span>
              </div>
              <span className="bg-slate-100 text-slate-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                {lowTasks.length}
              </span>
            </div>

            <div className="space-y-2">
              {lowTasks.map((t) => (
                <div key={t.id} className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs space-y-1">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>{t.title}</span>
                    <span className="font-mono text-[10px] text-slate-500">{t.dueDate}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-1">{t.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Time-Blocked Daily Plan */}
      {activeTab === 'daily' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Optimized Daily Time Blocks (Today: 2026-08-28)
              </h3>
              <p className="text-xs text-slate-500">
                Structured to prevent critical path delays on South Elevation and ensure timely certification.
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded">
              7.5 Billable Hours Allocated
            </span>
          </div>

          <div className="space-y-3">
            {dailySchedule.map((block, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-4 p-3 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
              >
                <div className="w-28 shrink-0 font-mono text-xs font-bold text-slate-700 bg-white border border-slate-200 p-1.5 rounded text-center">
                  {block.time}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-xs text-slate-900">{block.task}</span>
                    <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-semibold ${
                      block.priority === 'critical' ? 'bg-red-100 text-red-800' :
                      block.priority === 'high' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {block.priority}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">{block.costCode}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
