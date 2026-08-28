import React, { useState } from 'react';
import {
  FileText,
  Search,
  AlertTriangle,
  Eye,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { DocumentItem, ProjectInfo } from '../types';

interface DocumentsViewProps {
  project: ProjectInfo;
  documents: DocumentItem[];
  onOpenDocumentModal: (doc: DocumentItem) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  project,
  documents,
  onOpenDocumentModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const categories = ['ALL', 'Contract', 'Drawings', 'BOQ & Pricing', 'Correspondence', 'Specification'];

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.refCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const supersededCount = documents.filter(d => d.status === 'Superseded').length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 flex items-center space-x-2">
              <FileText className="w-6 h-6 text-blue-600" />
              <span>Project Repository & Drawing Register</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Single source of truth with strict revision control and automated superseded drawing alerts.
            </p>
          </div>

          {supersededCount > 0 && (
            <div className="flex items-center space-x-2 bg-amber-50 border border-amber-200 text-amber-900 text-xs px-3 py-1.5 rounded-lg font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{supersededCount} Superseded Revision Flagged</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search documents by reference code, title, author, or specification..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 font-sans"
          />
        </div>

        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-xs overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer whitespace-nowrap ${
                categoryFilter === cat ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px]">
              <tr>
                <th className="p-3 font-semibold">Ref Code & Rev</th>
                <th className="p-3 font-semibold">Document Title</th>
                <th className="p-3 font-semibold">Category</th>
                <th className="p-3 font-semibold">Author / Originator</th>
                <th className="p-3 font-semibold">Linked Codes</th>
                <th className="p-3 font-semibold">Upload Date</th>
                <th className="p-3 font-semibold text-center">Status</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredDocs.map((doc) => (
                <tr 
                  key={doc.id} 
                  className={`hover:bg-slate-50/80 transition-colors ${
                    doc.status === 'Superseded' ? 'bg-rose-50/20' : ''
                  }`}
                >
                  <td className="p-3 font-mono font-bold text-slate-800">
                    <div className="flex items-center space-x-1.5">
                      <span>{doc.refCode}</span>
                      <span className="bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded text-[10px]">
                        {doc.version}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 max-w-[280px]">
                    <div className="font-semibold text-slate-900 line-clamp-1">{doc.title}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{doc.summary}</div>
                    {doc.supersededBy && (
                      <div className="text-[10px] font-mono text-rose-600 font-bold mt-0.5 flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Superseded by {doc.supersededBy} — DO NOT USE ON SITE</span>
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <span className="bg-slate-100 text-slate-700 font-mono text-[10px] px-2 py-0.5 rounded">
                      {doc.category}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700">{doc.author}</td>
                  <td className="p-3 font-mono text-[11px] text-blue-700 font-medium">
                    {doc.linkedCostCodes.join(', ') || '—'}
                  </td>
                  <td className="p-3 font-mono text-slate-600">{doc.uploadDate}</td>
                  <td className="p-3 text-center">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
                      doc.status === 'Active Valid' ? 'bg-emerald-100 text-emerald-800' :
                      doc.status === 'Superseded' ? 'bg-rose-100 text-rose-800 font-bold animate-pulse' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onOpenDocumentModal(doc)}
                      className="bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-2.5 py-1 rounded text-xs font-semibold inline-flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
