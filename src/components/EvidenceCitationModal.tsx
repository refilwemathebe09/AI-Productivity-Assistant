import React from 'react';
import {
  FileText,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { StructuredAiCitation, DocumentItem } from '../types';

interface EvidenceCitationModalProps {
  citation: StructuredAiCitation | null;
  document?: DocumentItem | null;
  onClose: () => void;
}

export const EvidenceCitationModal: React.FC<EvidenceCitationModalProps> = ({
  citation,
  document,
  onClose,
}) => {
  if (!citation && !document) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full p-5 space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">
                {document ? document.title : citation?.label || 'Source Evidence Record'}
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {document ? `${document.refCode} (${document.version})` : citation?.documentRef || 'Project Audit Record'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 cursor-pointer text-lg font-bold"
          >
            &times;
          </button>
        </div>

        {/* Content details */}
        <div className="space-y-3 text-xs">
          {citation && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-slate-500">Document / Ledger Source:</span>
                <span className="font-bold text-slate-800">{citation.label}</span>
              </div>
              {citation.documentRef && (
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-500">Document Ref:</span>
                  <span className="font-bold text-blue-700">{citation.documentRef}</span>
                </div>
              )}
              {citation.fieldOrCode && (
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-500">Clause / Cost Code:</span>
                  <span className="font-bold text-emerald-700">{citation.fieldOrCode}</span>
                </div>
              )}
              {citation.quote && (
                <div className="pt-2 border-t border-slate-200 font-mono text-[11px] text-slate-700 bg-white p-2 rounded">
                  <strong>Excerpt:</strong> "{citation.quote}"
                </div>
              )}
            </div>
          )}

          {document && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg text-[11px]">
                <div>
                  <span className="text-slate-400 block font-mono">Category</span>
                  <span className="font-semibold text-slate-800">{document.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono">Status</span>
                  <span className="font-semibold text-slate-800">{document.status}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono">Author</span>
                  <span className="font-semibold text-slate-800">{document.author}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono">Upload Date</span>
                  <span className="font-semibold text-slate-800">{document.uploadDate}</span>
                </div>
              </div>

              {document.status === 'Superseded' && (
                <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg text-rose-900 flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Superseded Revision Warning</div>
                    <div className="text-[11px]">
                      This drawing is no longer current and has been superseded by <strong>{document.supersededBy}</strong>. Do not use for fabrication or site setting out.
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Executive Summary:</h4>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg">
                  {document.summary}
                </p>
              </div>

              {document.linkedCostCodes && document.linkedCostCodes.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">Linked Cost Codes:</h4>
                  <div className="flex flex-wrap gap-1">
                    {document.linkedCostCodes.map((c, i) => (
                      <span key={i} className="font-mono text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified in Riverbend Phase 1 Repository</span>
            </div>
            <button
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
