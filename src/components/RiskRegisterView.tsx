import React, { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { RiskItem, ProjectInfo } from '../types';
import { useCurrency } from '../context/CurrencyContext';

interface RiskRegisterViewProps {
  project: ProjectInfo;
  risks: RiskItem[];
  onAddRisk: (risk: RiskItem) => void;
  onConvertMitigationToTask: (risk: RiskItem) => void;
}

export const RiskRegisterView: React.FC<RiskRegisterViewProps> = ({
  project,
  risks,
  onAddRisk,
  onConvertMitigationToTask,
}) => {
  const { formatMoney, getSymbol } = useCurrency();
  const [selectedCell, setSelectedCell] = useState<{ l: number; i: number } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Risk Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<RiskItem['category']>('Commercial');
  const [newRootCause, setNewRootCause] = useState('');
  const [newLikelihood, setNewLikelihood] = useState<number>(3);
  const [newImpact, setNewImpact] = useState<number>(3);
  const [newFinancial, setNewFinancial] = useState('50000');
  const [newSchedule, setNewSchedule] = useState('5');
  const [newMitigation, setNewMitigation] = useState('');
  const [newOwner, setNewOwner] = useState('Refilwe Mathebe (Lead QS)');

  const handleCreateRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const l = newLikelihood;
    const i = newImpact;
    const nextCode = `RSK-0${risks.length + 1}`;

    const newRisk: RiskItem = {
      id: nextCode,
      riskCode: nextCode,
      category: newCategory,
      title: newTitle,
      rootCause: newRootCause || 'Identified during site progress risk assessment',
      likelihood: l,
      impact: i,
      score: l * i,
      likelyCostEffect: parseFloat(newFinancial) || 0,
      likelyScheduleEffectDays: parseInt(newSchedule, 10) || 0,
      mitigationStrategy: newMitigation,
      owner: newOwner,
      status: 'Open',
      sourceReference: 'Site Progress Risk Register Log',
    };

    onAddRisk(newRisk);
    setShowAddModal(false);
    setNewTitle('');
    setNewRootCause('');
    setNewMitigation('');
  };

  const getHeatmapColor = (score: number) => {
    if (score >= 15) return 'bg-rose-500 text-white font-bold';
    if (score >= 10) return 'bg-amber-400 text-amber-950 font-bold';
    if (score >= 6) return 'bg-amber-200 text-amber-900';
    return 'bg-emerald-100 text-emerald-900';
  };

  const filteredRisks = selectedCell
    ? risks.filter(r => r.likelihood === selectedCell.l && r.impact === selectedCell.i)
    : risks;

  const totalFinancialExposure = risks
    .filter(r => r.status === 'Open')
    .reduce((sum, r) => sum + r.likelyCostEffect, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 flex items-center space-x-2">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              <span>Project Risk & Early Warning Register</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              5x5 Likelihood × Impact quantification with financial exposure modeling.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg text-right">
              <div className="text-[10px] uppercase font-mono text-amber-800 font-semibold">Active Exposure</div>
              <div className="font-mono font-bold text-sm text-amber-900">
                {formatMoney(totalFinancialExposure)}
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Record Early Warning</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: 5x5 Heatmap Matrix & Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 5x5 Matrix */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-slate-900">
              5x5 Risk Heatmap Matrix
            </h3>
            {selectedCell && (
              <button
                onClick={() => setSelectedCell(null)}
                className="text-[11px] text-blue-600 hover:underline cursor-pointer"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="space-y-1">
            <div className="text-[10px] font-mono text-slate-400 text-center uppercase tracking-wider mb-1">
              Impact (1 to 5) &rarr;
            </div>

            <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
              {[5, 4, 3, 2, 1].map((l) => (
                <React.Fragment key={l}>
                  {[1, 2, 3, 4, 5].map((i) => {
                    const score = l * i;
                    const count = risks.filter(r => r.likelihood === l && r.impact === i).length;
                    const isSelected = selectedCell?.l === l && selectedCell?.i === i;

                    return (
                      <button
                        key={`${l}-${i}`}
                        onClick={() => setSelectedCell(isSelected ? null : { l, i })}
                        className={`h-10 rounded-md flex flex-col items-center justify-center transition-all cursor-pointer border ${
                          isSelected ? 'ring-2 ring-blue-600 scale-105 z-10' : 'border-slate-200'
                        } ${getHeatmapColor(score)}`}
                        title={`Likelihood ${l} × Impact ${i} (Score ${score})`}
                      >
                        <span className="font-mono text-[10px] opacity-75">{score}</span>
                        {count > 0 && (
                          <span className="font-mono font-bold text-xs bg-slate-900/40 text-white px-1.5 rounded-full">
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
            <div className="text-[10px] font-mono text-slate-400 text-left uppercase tracking-wider mt-1">
              &uarr; Likelihood (1 to 5)
            </div>
          </div>
        </div>

        {/* Risk Breakdown and Mitigation Summary */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="font-display font-bold text-sm text-slate-900">
            Risk Categories & Contingency Buffer
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="text-slate-500 font-semibold uppercase text-[10px]">Contingency Fund</div>
              <div className="font-mono font-bold text-base text-slate-900 mt-1">{formatMoney(750000)}</div>
              <div className="text-[10px] text-slate-500 mt-1">Initial Approved Pool</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="text-slate-500 font-semibold uppercase text-[10px]">Allocated to Overruns</div>
              <div className="font-mono font-bold text-base text-rose-600 mt-1">-{formatMoney(235000)}</div>
              <div className="text-[10px] text-slate-500 mt-1">Steelwork & PV Frame</div>
            </div>

            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              <div className="text-emerald-800 font-semibold uppercase text-[10px]">Remaining Buffer</div>
              <div className="font-mono font-bold text-base text-emerald-700 mt-1">{formatMoney(515000)}</div>
              <div className="text-[10px] text-emerald-700 mt-1">Safe coverage for RSK-01..05</div>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 space-y-1">
            <div className="font-bold flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>AI Risk Advisory</span>
            </div>
            <p className="leading-relaxed">
              Highest operational risk is currently <strong>RSK-01 (Steelwork supply lead time)</strong> and <strong>RSK-02 (High wind cladding downtime)</strong>. Early warning notice issued to structural coordinator.
            </p>
          </div>
        </div>
      </div>

      {/* Risks Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px]">
              <tr>
                <th className="p-3 font-semibold">Code & Category</th>
                <th className="p-3 font-semibold">Risk Description & Root Cause</th>
                <th className="p-3 font-semibold text-center">Score (L×I)</th>
                <th className="p-3 font-semibold text-right">Financial Exposure</th>
                <th className="p-3 font-semibold text-right">Delay Risk</th>
                <th className="p-3 font-semibold">Mitigation Strategy</th>
                <th className="p-3 font-semibold">Owner</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredRisks.map((risk) => (
                <tr key={risk.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-mono font-bold text-slate-800">
                    <div>{risk.riskCode}</div>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-normal">
                      {risk.category}
                    </span>
                  </td>
                  <td className="p-3 max-w-[260px]">
                    <div className="font-semibold text-slate-900">{risk.title}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-2">{risk.rootCause}</div>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${getHeatmapColor(risk.score)}`}>
                      {risk.likelihood} × {risk.impact} = {risk.score}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-right font-bold text-slate-900">
                    {formatMoney(risk.likelyCostEffect)}
                  </td>
                  <td className="p-3 font-mono text-right text-slate-700">
                    {risk.likelyScheduleEffectDays > 0 ? `+${risk.likelyScheduleEffectDays} Days` : '0 Days'}
                  </td>
                  <td className="p-3 text-[11px] text-slate-700 max-w-[220px]">
                    {risk.mitigationStrategy}
                  </td>
                  <td className="p-3 text-slate-600 text-[11px]">{risk.owner}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onConvertMitigationToTask(risk)}
                      title="Convert this mitigation action into a live Kanban task"
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold px-2 py-1 rounded inline-flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Task</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Risk Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-base text-slate-900">
                Log New Risk / Early Warning Notice
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateRisk} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Risk Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead time delay on Substation Transformer delivery"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Commercial">Commercial</option>
                    <option value="Procurement">Procurement</option>
                    <option value="Ground Conditions">Ground Conditions</option>
                    <option value="Weather & Delay">Weather & Delay</option>
                    <option value="Design Changes">Design Changes</option>
                    <option value="Health & Safety">Health & Safety</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Risk Owner</label>
                  <input
                    type="text"
                    required
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Root Cause</label>
                <input
                  type="text"
                  placeholder="e.g. Supply chain bottlenecks or ground water table"
                  value={newRootCause}
                  onChange={(e) => setNewRootCause(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Likelihood (1 to 5)</label>
                  <select
                    value={newLikelihood}
                    onChange={(e) => setNewLikelihood(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                  >
                    <option value="1">1 - Rare</option>
                    <option value="2">2 - Unlikely</option>
                    <option value="3">3 - Possible</option>
                    <option value="4">4 - Likely</option>
                    <option value="5">5 - Almost Certain</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Impact (1 to 5)</label>
                  <select
                    value={newImpact}
                    onChange={(e) => setNewImpact(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                  >
                    <option value="1">1 - Negligible</option>
                    <option value="2">2 - Minor</option>
                    <option value="3">3 - Moderate</option>
                    <option value="4">4 - Major</option>
                    <option value="5">5 - Severe</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Financial Exposure ({getSymbol()})</label>
                  <input
                    type="number"
                    step="1000"
                    value={newFinancial}
                    onChange={(e) => setNewFinancial(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Delay Exposure (Days)</label>
                  <input
                    type="number"
                    value={newSchedule}
                    onChange={(e) => setNewSchedule(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mitigation Action Plan</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Steps required to mitigate, transfer or eliminate this risk..."
                  value={newMitigation}
                  onChange={(e) => setNewMitigation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
                >
                  Save Risk Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
