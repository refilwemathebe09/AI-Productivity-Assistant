import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ReportItem, ProjectInfo, CostCodeItem, VariationRecord } from '../types';
import { useCurrency } from '../context/CurrencyContext';

interface ReportsViewProps {
  project: ProjectInfo;
  costCodes: CostCodeItem[];
  variations: VariationRecord[];
  reports: ReportItem[];
  onGenerateReport: (reportType: string, period: string) => Promise<any>;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  project,
  costCodes,
  variations,
  reports,
  onGenerateReport,
}) => {
  const { formatMoney } = useCurrency();
  const [selectedReportId, setSelectedReportId] = useState<string>(reports[0]?.id || 'REP-01');
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reportList, setReportList] = useState<ReportItem[]>(reports);

  const currentReport = reportList.find(r => r.id === selectedReportId) || reportList[0];

  const handleCopyMarkdown = () => {
    if (!currentReport) return;
    navigator.clipboard.writeText(currentReport.contentMarkdown);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleGenerateNew = async () => {
    setIsLoading(true);
    try {
      const result = await onGenerateReport('Monthly Cost Report', 'Month 07 (August 2026)');
      if (result && result.markdown) {
        const nextNum = `MCR-2026-0${reportList.length + 1}`;
        const newRpt: ReportItem = {
          id: `REP-0${reportList.length + 1}`,
          reportNumber: nextNum,
          title: `Monthly Cost Report #${reportList.length + 1} (Period Ending 31 August 2026)`,
          type: 'Monthly Cost Report',
          period: 'Month 07 (August 2026)',
          dataCutOffDate: new Date().toISOString().split('T')[0],
          author: 'Refilwe Mathebe (Lead QS)',
          status: 'Reviewed',
          executiveSummary: result.summary || 'Monthly cost audit and valuation overview.',
          keyMetrics: {
            budget: project.approvedBudget,
            committed: project.committedCost,
            actual: project.actualCost,
            forecast: project.forecastAtCompletion,
            variance: project.approvedBudget - project.forecastAtCompletion,
            contingencyLeft: project.contingencyBudget - project.contingencyCommitted,
          },
          generatedByAI: true,
          contentMarkdown: result.markdown,
        };
        setReportList([newRpt, ...reportList]);
        setSelectedReportId(newRpt.id);
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 flex items-center space-x-2">
              <FileSpreadsheet className="w-6 h-6 text-blue-600" />
              <span>Project Reports & Commercial Audits</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Professional RICS-standard cost reports and executive progress statements.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleGenerateNew}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>{isLoading ? 'Generating Full Report...' : 'Generate New Monthly Cost Report'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Report List Selector */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
          <h3 className="font-display font-bold text-xs text-slate-500 uppercase tracking-wider">
            Available Reports ({reportList.length})
          </h3>

          <div className="space-y-2">
            {reportList.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedReportId(r.id)}
                className={`w-full text-left p-3 rounded-lg border text-xs transition-all cursor-pointer ${
                  selectedReportId === r.id
                    ? 'bg-blue-50 border-blue-300 text-blue-950 font-semibold shadow-2xs'
                    : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>{r.reportNumber}</span>
                  <span className={`px-1.5 py-0.2 rounded font-semibold ${
                    r.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {r.status}
                  </span>
                </div>
                <div className="line-clamp-2">{r.title}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">{r.period}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Selected Report View */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          {currentReport && (
            <>
              {/* Report Title & Metadata Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {currentReport.reportNumber}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{currentReport.period}</span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-slate-900 mt-1">
                    {currentReport.title}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Prepared by: <strong>{currentReport.author}</strong> • Cut-off: {currentReport.dataCutOffDate}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyMarkdown}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1.5 font-medium transition-colors cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied' : 'Copy Markdown'}</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="bg-slate-800 hover:bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1.5 font-medium transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print PDF</span>
                  </button>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                <h4 className="font-display font-bold text-xs text-slate-800 uppercase tracking-wider">
                  Report Executive Metrics
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Approved Budget</span>
                    <span className="font-bold text-slate-900">{formatMoney(currentReport.keyMetrics.budget)}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Committed Cost</span>
                    <span className="font-bold text-slate-900">{formatMoney(currentReport.keyMetrics.committed)}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Forecast at Completion</span>
                    <span className="font-bold text-slate-900">{formatMoney(currentReport.keyMetrics.forecast)}</span>
                  </div>
                </div>
              </div>

              {/* Main Markdown Body Content */}
              <div className="prose prose-slate max-w-none text-xs leading-relaxed font-sans bg-slate-50/40 p-5 rounded-xl border border-slate-100">
                <pre className="font-mono text-xs whitespace-pre-wrap text-slate-800 bg-transparent p-0 border-none">
                  {currentReport.contentMarkdown}
                </pre>
              </div>

              {/* Report Footer & Certification */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>CostPilot Audit Certificate: Compliant with RICS Black Book & NEC4 ECC</span>
                </div>
                <div className="font-mono text-[11px]">
                  Riverbend Phase 1 Cost Management
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
