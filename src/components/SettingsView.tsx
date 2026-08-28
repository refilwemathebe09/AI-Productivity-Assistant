import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  ShieldCheck,
  UserCheck,
  Calculator,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Lock,
  Coins
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserRole, ProjectInfo, CurrencyCode } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { CURRENCIES } from '../utils/currency';

interface SettingsViewProps {
  project: ProjectInfo;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  project,
  userRole,
  onRoleChange,
  onResetData,
}) => {
  const { currency, setCurrency, convertRateEnabled, setConvertRateEnabled } = useCurrency();
  const [requireEmailApproval, setRequireEmailApproval] = useState(true);
  const [requireTaskApproval, setRequireTaskApproval] = useState(true);
  const [strictEvidenceMode, setStrictEvidenceMode] = useState(true);

  const handleReset = () => {
    if (window.confirm('Reset all project ledgers, variations, and tasks back to the original Riverbend Logistics Park demo state?')) {
      onResetData();
      confetti({ particleCount: 30, spread: 50 });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h2 className="font-display text-2xl font-bold text-slate-900 flex items-center space-x-2">
          <SettingsIcon className="w-6 h-6 text-blue-600" />
          <span>System Settings & Responsible AI Governance</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Role permissions, currency localization (ZAR default), calculation precision, and ethical AI safeguards.
        </p>
      </div>

      {/* Currency & Financial Localization */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h3 className="font-display font-bold text-sm text-slate-900 flex items-center space-x-2">
          <Coins className="w-4 h-4 text-emerald-600" />
          <span>Currency & Regional Localization</span>
        </h3>
        <p className="text-xs text-slate-500">
          Set the standard reporting currency for all financial ledgers, variations, and certified valuations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {CURRENCIES.map((curr) => {
            const isSelected = currency === curr.code;
            return (
              <button
                key={curr.code}
                onClick={() => setCurrency(curr.code)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-1 ring-emerald-400 font-semibold shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-slate-900">
                    {curr.symbol} {curr.code}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">{curr.name}</div>
                <div className="text-[10px] font-mono text-slate-400 mt-1">
                  1 ZAR = {(curr.rateFromZAR).toFixed(4)} {curr.code}
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <div>
            <div className="font-semibold text-slate-800">Dynamic Exchange Rate Conversion</div>
            <p className="text-[11px] text-slate-500">
              Converts baseline ZAR contract amounts to selected currency according to standard FX matrix.
            </p>
          </div>
          <input
            type="checkbox"
            checked={convertRateEnabled}
            onChange={(e) => setConvertRateEnabled(e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Role & Access Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h3 className="font-display font-bold text-sm text-slate-900 flex items-center space-x-2">
          <UserCheck className="w-4 h-4 text-blue-600" />
          <span>Active Role & Permission Level</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {[
            { role: 'Quantity Surveyor' as UserRole, desc: 'Full authority to approve variations, verify valuations, and certify monthly cost reports.' },
            { role: 'Project Manager' as UserRole, desc: 'Schedule coordination, milestone tracking, and site instruction governance.' },
            { role: 'Cost Controller' as UserRole, desc: 'Ledger audits, package commitments, and arithmetic variance verification.' },
            { role: 'Client Representative' as UserRole, desc: 'Executive dashboard visibility, payment authorization, and board report sign-off.' },
          ].map((r) => (
            <button
              key={r.role}
              onClick={() => onRoleChange(r.role)}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                userRole === r.role
                  ? 'bg-blue-50 border-blue-400 text-blue-950 ring-1 ring-blue-400 font-semibold'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span>{r.role}</span>
                {userRole === r.role && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
              </div>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed font-normal">{r.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Ethical AI Guardrails & Human-in-the-Loop */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h3 className="font-display font-bold text-sm text-slate-900 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Responsible AI & Human-in-the-Loop Safeguards</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div>
              <div className="font-semibold text-slate-900">Require Human Approval for Correspondence</div>
              <p className="text-[11px] text-slate-500">Emails and contract notices remain drafts until formally signed off.</p>
            </div>
            <input
              type="checkbox"
              checked={requireEmailApproval}
              onChange={(e) => setRequireEmailApproval(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div>
              <div className="font-semibold text-slate-900">Require Human Approval for Action Tasks</div>
              <p className="text-[11px] text-slate-500">Extracted meeting minutes require confirmation before adding to Kanban.</p>
            </div>
            <input
              type="checkbox"
              checked={requireTaskApproval}
              onChange={(e) => setRequireTaskApproval(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div>
              <div className="font-semibold text-slate-900">Strict Source Evidence Grounding Mode</div>
              <p className="text-[11px] text-slate-500">Forces AI assistant to cite exact document IDs, ledger rows, and formulas.</p>
            </div>
            <input
              type="checkbox"
              checked={strictEvidenceMode}
              onChange={(e) => setStrictEvidenceMode(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Professional Legal Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 shadow-xs space-y-2 text-xs text-amber-900">
        <div className="flex items-center space-x-2 font-bold font-display">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Professional Governance & Legal Disclaimer</span>
        </div>
        <p className="leading-relaxed text-amber-800">
          CostPilot AI is an augmented decision-support software prototype purpose-built for construction cost intelligence. All financial calculations, schedule assessments, and generated drafts are provided to assist authorized Quantity Surveyors and Project Managers. They do not constitute autonomous statutory determinations or formal contractual notices until verified and certified by a qualified professional.
        </p>
      </div>

      {/* Reset State Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-sm text-slate-900">Reset Demo Project Data</h3>
          <p className="text-xs text-slate-500">Restore Riverbend Logistics Park initial approved budget and demo records.</p>
        </div>
        <button
          onClick={handleReset}
          className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Data</span>
        </button>
      </div>
    </div>
  );
};
