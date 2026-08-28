import React, { useState } from 'react';
import {
  Mail,
  Send,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  FileCheck,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProjectInfo } from '../types';

interface SmartEmailViewProps {
  project: ProjectInfo;
  onGenerateEmail: (params: {
    templateType: string;
    tone: string;
    audience: string;
    keyPoints: string;
  }) => Promise<any>;
}

export const SmartEmailView: React.FC<SmartEmailViewProps> = ({
  project,
  onGenerateEmail,
}) => {
  const [templateType, setTemplateType] = useState('Payment Certificate Release Reminder');
  const [tone, setTone] = useState('Contractually Firm (NEC4 Clause 51)');
  const [audience, setAudience] = useState('Client Representative (Finance Desk)');
  const [customKeyPoints, setCustomKeyPoints] = useState(
    'Remind client finance desk that Interim Payment Certificate IPC-05 for R1,349,000.00 net payable is due on 2026-08-29. Remind them of late payment interest statutory terms under NEC4.'
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Generated email state
  const [emailSubject, setEmailSubject] = useState(
    `[ACTION REQUIRED] ${project.code} — Interim Payment Certificate IPC-05 Release Notice (Due: 2026-08-29)`
  );
  const [emailRecipient, setEmailRecipient] = useState(
    'finance-approvals@riverbend-properties.co.za (Attn: Sarah Chen, Commercial Director)'
  );
  const [emailBody, setEmailBody] = useState(
    `Dear Sarah,

RE: ${project.name} (${project.code}) — Interim Payment Certificate IPC-05

Please be advised that Interim Payment Certificate IPC-05 was certified on 11 August 2026 for the gross valuation of R1,420,000.00. 

In accordance with NEC4 Clause 51.1 and the agreed project payment schedule, the 5% contractual retention (R71,000.00) has been deducted, leaving a Net Payable Amount of R1,349,000.00 (plus applicable VAT) due for electronic funds transfer to Apex Construct Ltd no later than 29 August 2026.

Payment Summary:
• Gross Certified Valuation: R1,420,000.00
• 5% Retention Deduction: R71,000.00
• Net Amount Payable: R1,349,000.00
• Final Due Date for Payment: 29 August 2026

Please confirm once the EFT payment run has been scheduled so we may update the project commercial ledger.

Yours sincerely,

Refilwe Mathebe
Lead Quantity Surveyor & Employer Agent
CostPilot Project Management Desk`
  );

  const [contractClauses, setContractClauses] = useState<string[]>([
    'NEC4 ECC Clause 51.1 (Payment Timelines)',
    'NEC4 ECC Clause 51.2 (Late Payment Interest)',
  ]);
  const [keyDates, setKeyDates] = useState<string[]>(['2026-08-11 (Certified)', '2026-08-29 (Due Date)']);
  const [financialValues, setFinancialValues] = useState<string[]>(['R1,420,000.00 (Gross)', 'R1,349,000.00 (Net)']);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsApproved(false);
    setIsSent(false);

    try {
      const result = await onGenerateEmail({
        templateType,
        tone,
        audience,
        keyPoints: customKeyPoints,
      });

      if (result) {
        if (result.subject) setEmailSubject(result.subject);
        if (result.recipientName) setEmailRecipient(result.recipientName);
        if (result.body) setEmailBody(result.body);
        if (result.contractClausesCited) setContractClauses(result.contractClausesCited);
        if (result.keyDatesMentioned) setKeyDates(result.keyDatesMentioned);
        if (result.financialValuesMentioned) setFinancialValues(result.financialValuesMentioned);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = () => {
    setIsApproved(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${emailSubject}\n\nTo: ${emailRecipient}\n\n${emailBody}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSimulateSend = () => {
    setIsSent(true);
  };

  const handleTemplateChange = (type: string) => {
    setTemplateType(type);
    if (type.includes('Payment')) {
      setCustomKeyPoints(
        'Remind client finance desk that Interim Payment Certificate IPC-05 for R1,349,000.00 net payable is due on 2026-08-29. Remind them of late payment interest statutory terms under NEC4.'
      );
      setTone('Contractually Firm (NEC4 Clause 51)');
      setAudience('Client Representative (Finance Desk)');
    } else if (type.includes('Variation')) {
      setCustomKeyPoints(
        'Draft formal variation confirmation letter to Apex Construct for VAR-002 (Roof PV solar steel reinforcement). Confirm agreed QS valuation of R90,000.00 with 0 days EoT, subject to drawing S-204 Rev B.'
      );
      setTone('Formal & Collaborative');
      setAudience('Main Contractor (Apex Construct PM)');
    } else if (type.includes('Testing')) {
      setCustomKeyPoints(
        'Request structural engineer Marcus Vance to issue urgent pull-out test sign-off for South Elevation cladding brackets on Grid 4-8 so Euroclad crew can proceed.'
      );
      setTone('Urgent Commercial Warning');
      setAudience('Design Consultant (Marcus Vance)');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* View Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 flex items-center space-x-2">
              <Mail className="w-6 h-6 text-blue-600" />
              <span>Smart Construction Correspondence Drafter</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Generates context-aware, legally rigorous construction notices and payment correspondence.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-1.5 rounded-lg font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Draft Guarantee: Never auto-sent without human sign-off</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: Email Parameters & Prompts */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="font-display font-bold text-sm text-slate-900 flex items-center space-x-1.5">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Correspondence Parameters</span>
          </h3>

          <form onSubmit={handleGenerate} className="space-y-3.5 text-xs">
            {/* Correspondence Type */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Template Type</label>
              <select
                value={templateType}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-sans bg-slate-50 focus:bg-white"
              >
                <option value="Payment Certificate Release Reminder">Payment Certificate Release Reminder (IPC-05)</option>
                <option value="Variation Confirmation / Compensation Event Notice">Variation Confirmation (VAR-002 Roof PV)</option>
                <option value="Extension of Time (EoT) Assessment Query">Extension of Time Assessment (VAR-001)</option>
                <option value="Site Testing & Anchor Sign-off Request">Site Testing & Anchor Sign-off Request (Grid 4-8)</option>
                <option value="General Commercial Instruction">General Commercial Instruction</option>
              </select>
            </div>

            {/* Tone Selector */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Communication Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-sans bg-slate-50 focus:bg-white"
              >
                <option value="Formal & Collaborative">Formal & Collaborative (Partnering Ethos)</option>
                <option value="Contractually Firm (NEC4 Clause 51)">Contractually Firm (NEC4 Clause Enforcement)</option>
                <option value="Diplomatic Client-Facing">Diplomatic Client-Facing (Board Level)</option>
                <option value="Urgent Commercial Warning">Urgent Commercial Warning (Critical Path Risk)</option>
              </select>
            </div>

            {/* Audience Selector */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Audience / Recipient</label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-sans bg-slate-50 focus:bg-white"
              >
                <option value="Client Representative (Finance Desk)">Client Representative (Sarah Chen / Finance)</option>
                <option value="Main Contractor (Apex Construct PM)">Main Contractor (Liam Burke, Apex PM)</option>
                <option value="Subcontractor (Euroclad / Severfield)">Subcontractor Lead</option>
                <option value="Design Consultant (Marcus Vance)">Design Consultant (Buro Structural Engineer)</option>
              </select>
            </div>

            {/* Custom Notes */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Key Context & Special Instructions</label>
              <textarea
                rows={4}
                value={customKeyPoints}
                onChange={(e) => setCustomKeyPoints(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>{isLoading ? 'Drafting Contextual Email...' : 'Generate Contextual Email'}</span>
            </button>
          </form>
        </div>

        {/* Right Preview: Generated Email Document */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Header: Human-in-the-loop Status Banner */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {isApproved ? '✓ APPROVED BY QS' : '⚠️ UNREVIEWED DRAFT'}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Tone: {tone}</span>
              </div>

              {isSent && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Dispatched via Outlook Sync</span>
                </span>
              )}
            </div>

            {/* Email Metadata Fields */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-500 w-16 shrink-0">To:</span>
                <input
                  type="text"
                  value={emailRecipient}
                  onChange={(e) => setEmailRecipient(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded px-2 py-1 font-sans text-xs"
                />
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-500 w-16 shrink-0">Subject:</span>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded px-2 py-1 font-mono font-medium text-xs text-slate-900"
                />
              </div>
            </div>

            {/* Editable Email Body */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">
                Draft Email Message Body
              </label>
              <textarea
                rows={12}
                value={emailBody}
                onChange={(e) => {
                  setEmailBody(e.target.value);
                  setIsApproved(false);
                }}
                className="w-full p-3 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed font-sans focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Referenced Clauses & Key Facts Badges */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-2 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-semibold uppercase text-slate-400">Clauses Cited:</span>
                {contractClauses.map((c, i) => (
                  <span key={i} className="bg-blue-50 text-blue-800 text-[10px] font-mono px-2 py-0.5 rounded border border-blue-200 font-medium">
                    {c}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-semibold uppercase text-slate-400">Key Values:</span>
                {financialValues.map((v, i) => (
                  <span key={i} className="bg-emerald-50 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-200 font-medium">
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons: Human Approval & Send/Copy */}
          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              {!isApproved ? (
                <button
                  onClick={handleApprove}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve as Authorized QS</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsApproved(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-3 py-2 rounded-lg cursor-pointer"
                >
                  Edit Approval
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied' : 'Copy Message'}</span>
              </button>

              <button
                onClick={handleSimulateSend}
                disabled={!isApproved}
                title={!isApproved ? 'Requires human approval before sending' : 'Send via connected email service'}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to Recipient</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
