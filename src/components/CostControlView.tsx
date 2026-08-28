import React, { useState } from 'react';
import {
  Calculator,
  FileCheck2,
  Receipt,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Sparkles,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { CostCodeItem, VariationRecord, PaymentApplication, ProjectInfo } from '../types';
import { useCurrency } from '../context/CurrencyContext';

interface CostControlViewProps {
  project: ProjectInfo;
  costCodes: CostCodeItem[];
  variations: VariationRecord[];
  payments: PaymentApplication[];
  onAddVariation: (variation: VariationRecord) => void;
  onUpdateVariationStatus: (id: string, status: VariationRecord['status']) => void;
  onAuditVariationWithAi: (variation: VariationRecord) => void;
  onAddPayment: (payment: PaymentApplication) => void;
}

export const CostControlView: React.FC<CostControlViewProps> = ({
  project,
  costCodes,
  variations,
  payments,
  onAddVariation,
  onUpdateVariationStatus,
  onAuditVariationWithAi,
  onAddPayment,
}) => {
  const { formatMoney, currencyConfig } = useCurrency();
  const [activeTab, setActiveTab] = useState<'cost-codes' | 'variations' | 'payments'>('cost-codes');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedVariation, setSelectedVariation] = useState<VariationRecord | null>(null);
  const [showAddVariationModal, setShowAddVariationModal] = useState(false);

  // New Variation form state
  const [newVarTitle, setNewVarTitle] = useState('');
  const [newVarDesc, setNewVarDesc] = useState('');
  const [newVarCode, setNewVarCode] = useState('03.00 Superstructure Frame');
  const [newVarOriginator, setNewVarOriginator] = useState('Apex Construct Ltd (Main Contractor)');
  const [newVarContractorQuote, setNewVarContractorQuote] = useState('');
  const [newVarQsCost, setNewVarQsCost] = useState('');
  const [newVarTimeImpact, setNewVarTimeImpact] = useState('0');
  const [newVarSourceDoc, setNewVarSourceDoc] = useState('Site Instruction SI-09');
  const [newVarJustification, setNewVarJustification] = useState('');

  const handleCreateVariation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVarTitle.trim()) return;

    const nextId = `VAR-00${variations.length + 1}`;
    const newRecord: VariationRecord = {
      id: nextId,
      varNumber: nextId,
      title: newVarTitle,
      description: newVarDesc,
      costCodeRef: newVarCode,
      originator: newVarOriginator,
      contractorQuote: parseFloat(newVarContractorQuote) || 0,
      qsAssessedCost: parseFloat(newVarQsCost) || parseFloat(newVarContractorQuote) || 0,
      status: 'Pending Review',
      timeImpactDays: parseInt(newVarTimeImpact, 10) || 0,
      submissionDate: new Date().toISOString().split('T')[0],
      sourceDocument: newVarSourceDoc,
      justification: newVarJustification,
    };

    onAddVariation(newRecord);
    setShowAddVariationModal(false);
    // Reset form
    setNewVarTitle('');
    setNewVarDesc('');
    setNewVarContractorQuote('');
    setNewVarQsCost('');
    setNewVarJustification('');
  };

  const filteredCostCodes = costCodes.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVariations = variations.filter(v => {
    const matchesSearch = v.varNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate totals
  const totalOriginal = costCodes.reduce((sum, c) => sum + c.originalBudget, 0);
  const totalCurrent = costCodes.reduce((sum, c) => sum + c.currentBudget, 0);
  const totalCommitted = costCodes.reduce((sum, c) => sum + c.committedCost, 0);
  const totalActual = costCodes.reduce((sum, c) => sum + c.actualCost, 0);
  const totalForecast = costCodes.reduce((sum, c) => sum + c.forecastCost, 0);
  const totalVariance = totalCurrent - totalForecast;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <Calculator className="w-6 h-6 text-blue-600" />
            <span>Cost Control & Commercial Ledgers</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit-grade quantity surveying registers with direct source traceability ({currencyConfig.code}).
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-slate-200/80 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('cost-codes')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'cost-codes' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cost Codes Breakdown ({costCodes.length})
          </button>
          <button
            onClick={() => setActiveTab('variations')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1 ${
              activeTab === 'variations' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Variations Register</span>
            <span className="bg-blue-100 text-blue-800 text-[10px] font-mono px-1.5 rounded-full">
              {variations.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'payments' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Payment Tracker ({payments.length})
          </button>
        </div>
      </div>

      {/* TAB 1: Cost Codes Ledger */}
      {activeTab === 'cost-codes' && (
        <div className="space-y-4">
          {/* Summary Row */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-slate-900 text-white p-4 rounded-xl border border-slate-800">
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400">Current Budget</div>
              <div className="font-mono font-bold text-sm sm:text-base text-slate-100">{formatMoney(totalCurrent)}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400">Committed</div>
              <div className="font-mono font-bold text-sm sm:text-base text-blue-300">{formatMoney(totalCommitted)}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400">Actual to Date</div>
              <div className="font-mono font-bold text-sm sm:text-base text-emerald-400">{formatMoney(totalActual)}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400">Forecast at Completion</div>
              <div className="font-mono font-bold text-sm sm:text-base text-amber-300">{formatMoney(totalForecast)}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400">Net Variance</div>
              <div className={`font-mono font-bold text-sm sm:text-base ${totalVariance < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {formatMoney(totalVariance)}
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by cost code, trade package, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
              />
            </div>
          </div>

          {/* Ledger Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px]">
                  <tr>
                    <th className="p-3 font-semibold">Code</th>
                    <th className="p-3 font-semibold">Package & Description</th>
                    <th className="p-3 font-semibold text-right">Orig. Budget</th>
                    <th className="p-3 font-semibold text-right">Approved Var.</th>
                    <th className="p-3 font-semibold text-right">Current Budget</th>
                    <th className="p-3 font-semibold text-right">Committed</th>
                    <th className="p-3 font-semibold text-right">Actual Spend</th>
                    <th className="p-3 font-semibold text-right">Forecast (FAC)</th>
                    <th className="p-3 font-semibold text-right">Variance</th>
                    <th className="p-3 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {filteredCostCodes.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-800">{item.code}</td>
                      <td className="p-3 max-w-[260px]">
                        <div className="font-semibold text-slate-900">{item.category}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{item.description}</div>
                        <div className="text-[10px] text-blue-600 font-mono mt-0.5">{item.sourceRef}</div>
                      </td>
                      <td className="p-3 font-mono text-right text-slate-600">{formatMoney(item.originalBudget)}</td>
                      <td className="p-3 font-mono text-right text-slate-600">
                        {item.approvedVariations !== 0 ? formatMoney(item.approvedVariations) : '—'}
                      </td>
                      <td className="p-3 font-mono text-right font-medium text-slate-800">{formatMoney(item.currentBudget)}</td>
                      <td className="p-3 font-mono text-right text-blue-800">{formatMoney(item.committedCost)}</td>
                      <td className="p-3 font-mono text-right text-emerald-800">{formatMoney(item.actualCost)}</td>
                      <td className="p-3 font-mono text-right font-semibold text-slate-900">{formatMoney(item.forecastCost)}</td>
                      <td className={`p-3 font-mono text-right font-bold ${item.variance < 0 ? 'text-rose-600' : item.variance > 0 ? 'text-emerald-600' : 'text-slate-600'}`}>
                        {formatMoney(item.variance)}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
                          item.status === 'On Track' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          item.status === 'Under Budget' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          item.status === 'Overrun Alert' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-rose-50 text-rose-700 border border-rose-200'
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
        </div>
      )}

      {/* TAB 2: Variations Register */}
      {activeTab === 'variations' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-2">
              <div className="relative w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter variations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none font-sans"
                />
              </div>

              <select
                aria-label="Filter Variations by Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg text-xs py-1.5 px-3 font-sans focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Draft">Draft</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <button
              onClick={() => setShowAddVariationModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Record New Variation</span>
            </button>
          </div>

          {/* Variations Cards / Table */}
          <div className="space-y-3">
            {filteredVariations.map((v) => {
              const varianceAmount = v.contractorQuote - v.qsAssessedCost;
              return (
                <div 
                  key={v.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                          {v.varNumber}
                        </span>
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                          v.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                          v.status === 'Pending Review' ? 'bg-amber-100 text-amber-800 font-semibold' :
                          v.status === 'Draft' ? 'bg-blue-100 text-blue-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {v.status}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">{v.costCodeRef}</span>
                      </div>
                      <h4 className="font-display font-semibold text-sm text-slate-900">
                        {v.title}
                      </h4>
                      <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                        {v.description}
                      </p>
                    </div>

                    {/* Financials & Actions */}
                    <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100 shrink-0">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-500 uppercase font-mono">Contractor Claim</div>
                        <div className="font-mono text-xs text-slate-700 line-through">
                          {formatMoney(v.contractorQuote)}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] text-slate-500 uppercase font-mono">QS Agreed / Assessed</div>
                        <div className="font-mono font-bold text-sm text-slate-900">
                          {formatMoney(v.qsAssessedCost)}
                        </div>
                      </div>

                      {varianceAmount > 0 && (
                        <div className="text-right">
                          <div className="text-[10px] text-emerald-600 uppercase font-mono">QS Savings</div>
                          <div className="font-mono font-bold text-xs text-emerald-700">
                            -{formatMoney(varianceAmount)}
                          </div>
                        </div>
                      )}

                      <div className="text-right">
                        <div className="text-[10px] text-slate-500 uppercase font-mono">Time Impact</div>
                        <div className="font-mono font-semibold text-xs text-slate-800">
                          {v.timeImpactDays > 0 ? `+${v.timeImpactDays} Days (EoT)` : '0 Days'}
                        </div>
                      </div>

                      {/* Quick AI Audit Action */}
                      <div className="flex items-center space-x-1 pl-2 border-l border-slate-200">
                        <button
                          onClick={() => onAuditVariationWithAi(v)}
                          title="Audit this variation claim with CostPilot AI"
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs px-2.5 py-1.5 rounded-lg flex items-center space-x-1 font-medium transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Audit Claim</span>
                        </button>

                        {v.status === 'Pending Review' && (
                          <button
                            onClick={() => onUpdateVariationStatus(v.id, 'Approved')}
                            title="Formally approve variation as Lead QS"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Document and Justification Footer */}
                  <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center space-x-3">
                      <span><strong>Originator:</strong> {v.originator}</span>
                      <span>•</span>
                      <span><strong>Source Doc:</strong> {v.sourceDocument}</span>
                    </div>
                    <div>
                      <span><strong>Submitted:</strong> {v.submissionDate}</span>
                      {v.approvedBy && <span className="ml-2 text-emerald-700 font-medium">• Approved by {v.approvedBy}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Payment Tracker */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div>
              <div className="text-xs text-slate-500 uppercase font-semibold">Total Certified Gross</div>
              <div className="font-mono font-bold text-xl text-slate-900">
                {formatMoney(payments.reduce((s, p) => s + p.qsCertified, 0))}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase font-semibold">Total Retention Held (5%)</div>
              <div className="font-mono font-bold text-xl text-blue-900">
                {formatMoney(payments.reduce((s, p) => s + p.retentionDeducted, 0))}
              </div>
              <div className="text-[10px] text-slate-400">Held under NEC4 Clause 51</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase font-semibold">Net Paid / Due to Date</div>
              <div className="font-mono font-bold text-xl text-emerald-700">
                {formatMoney(payments.reduce((s, p) => s + p.netPayable, 0))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px]">
                  <tr>
                    <th className="p-3 font-semibold">Cert #</th>
                    <th className="p-3 font-semibold">Period Ending</th>
                    <th className="p-3 font-semibold text-right">Contractor Claimed</th>
                    <th className="p-3 font-semibold text-right">Gross Certified</th>
                    <th className="p-3 font-semibold text-right">Retention (5%)</th>
                    <th className="p-3 font-semibold text-right">Net Payable</th>
                    <th className="p-3 font-semibold">Due Date</th>
                    <th className="p-3 font-semibold text-center">Status</th>
                    <th className="p-3 font-semibold">Payment Ref</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-mono font-bold text-blue-900">{p.certNumber}</td>
                      <td className="p-3 font-mono text-slate-700">{p.periodEnding}</td>
                      <td className="p-3 font-mono text-right text-slate-600">{formatMoney(p.contractorClaimed)}</td>
                      <td className="p-3 font-mono text-right font-medium text-slate-900">{formatMoney(p.qsCertified)}</td>
                      <td className="p-3 font-mono text-right text-amber-700">-{formatMoney(p.retentionDeducted)}</td>
                      <td className="p-3 font-mono text-right font-bold text-emerald-800">{formatMoney(p.netPayable)}</td>
                      <td className="p-3 font-mono text-slate-700">{p.dueDate}</td>
                      <td className="p-3 text-center">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          p.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                          p.status === 'Certified' ? 'bg-blue-100 text-blue-800 font-bold animate-pulse' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-500">{p.paymentRef || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Variation Modal */}
      {showAddVariationModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-base text-slate-900">
                Record New Variation (Compensation Event)
              </h3>
              <button
                onClick={() => setShowAddVariationModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateVariation} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Variation Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Additional drainage soakaway on North boundary"
                  value={newVarTitle}
                  onChange={(e) => setNewVarTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Trade Package</label>
                <select
                  value={newVarCode}
                  onChange={(e) => setNewVarCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                >
                  {costCodes.map(c => (
                    <option key={c.id} value={`${c.code} ${c.category}`}>
                      {c.code} {c.category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contractor Claim ({currencyConfig.symbol.trim()})</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="50000.00"
                    value={newVarContractorQuote}
                    onChange={(e) => setNewVarContractorQuote(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">QS Assessed ({currencyConfig.symbol.trim()})</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="45000.00"
                    value={newVarQsCost}
                    onChange={(e) => setNewVarQsCost(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time Impact (Days EoT)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newVarTimeImpact}
                    onChange={(e) => setNewVarTimeImpact(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Source Reference</label>
                  <input
                    type="text"
                    placeholder="Site Instruction SI-10"
                    value={newVarSourceDoc}
                    onChange={(e) => setNewVarSourceDoc(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Scope & Justification</label>
                <textarea
                  rows={3}
                  placeholder="Explain why this change is necessary and contractual clause entitlement..."
                  value={newVarJustification}
                  onChange={(e) => setNewVarJustification(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddVariationModal(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
                >
                  Save Variation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
