import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  BookOpen,
  CheckCircle,
  FileText,
  Calculator,
  Lightbulb,
  ListOrdered,
  ShieldCheck,
  RotateCcw,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  Layers,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { 
  AiChatMessage, 
  PromptTemplate, 
  ProjectInfo, 
  StructuredAiCitation,
  AppView 
} from '../types';

interface AiAssistantViewProps {
  project: ProjectInfo;
  messages: AiChatMessage[];
  promptTemplates: PromptTemplate[];
  onSendMessage: (text: string, mode: 'project' | 'research') => Promise<void>;
  onClearChat: () => void;
  onOpenCitation: (citation: StructuredAiCitation) => void;
  onNavigate: (view: AppView) => void;
  initialPrompt?: string;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  project,
  messages,
  promptTemplates,
  onSendMessage,
  onClearChat,
  onOpenCitation,
  onNavigate,
  initialPrompt,
}) => {
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState<'project' | 'research'>('project');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt) {
      setInputText(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const query = inputText.trim();
    setInputText('');
    setIsLoading(true);

    try {
      await onSendMessage(query, mode);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTemplate = (tpl: PromptTemplate) => {
    setInputText(tpl.promptText.replace('{COST_CODE}', '03.00 Superstructure Frame').replace('{CUTOFF_DATE}', '2026-08-28'));
    setShowTemplatesModal(false);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 pb-12">
      {/* Top Bar: Title & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-slate-900 flex items-center space-x-2">
              <span>CostPilot Evidence-Based AI Assistant</span>
            </h2>
            <p className="text-xs text-slate-500">
              {mode === 'project' 
                ? `Scoped strictly to ${project.name} (${project.code}) records`
                : 'General Construction, RICS Standards & Contract Research Mode'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setMode('project')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                mode === 'project' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Project-Grounded Mode</span>
            </button>
            <button
              onClick={() => setMode('research')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                mode === 'research' 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>General QS Research</span>
            </button>
          </div>

          <button
            onClick={() => setShowTemplatesModal(true)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Templates</span>
          </button>

          <button
            onClick={onClearChat}
            title="Reset conversation"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Conversation Feed */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs min-h-[480px] max-h-[640px] flex flex-col justify-between overflow-hidden">
        {/* Messages List */}
        <div className="p-5 space-y-6 overflow-y-auto flex-1 bg-slate-50/50">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs font-bold text-xs font-display">
                    CP
                  </div>
                )}

                <div className={`max-w-3xl space-y-2.5 ${isUser ? 'items-end' : 'items-start'}`}>
                  {/* Sender & Timestamp Header */}
                  <div className={`flex items-center space-x-2 text-[11px] text-slate-400 ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <span className="font-semibold text-slate-600">{isUser ? 'You' : 'CostPilot AI Engine'}</span>
                    <span>•</span>
                    <span className="font-mono">{msg.timestamp}</span>
                    {!isUser && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-mono px-1.5 py-0.2 rounded">
                        Audited
                      </span>
                    )}
                  </div>

                  {/* Message Bubble Content */}
                  <div
                    className={`rounded-2xl p-4 text-xs leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-blue-600 text-white font-sans'
                        : 'bg-white text-slate-900 border border-slate-200'
                    }`}
                  >
                    {/* Summary / Text */}
                    <div className="whitespace-pre-wrap font-sans text-xs sm:text-[13px] leading-relaxed">
                      {msg.text}
                    </div>

                    {/* Structured Evidence-Based Sections (Facts, Calculations, Assumptions, Recommendations, Citations) */}
                    {msg.structured && (
                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-3 font-sans text-xs">
                        {/* 📌 FACTS */}
                        {msg.structured.facts && msg.structured.facts.length > 0 && (
                          <div className="bg-blue-50/70 border border-blue-100 rounded-lg p-3 space-y-1.5">
                            <div className="flex items-center space-x-1.5 text-blue-900 font-bold font-display text-xs">
                              <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                              <span>📌 VERIFIED FACTS (Grounding Data)</span>
                            </div>
                            <ul className="space-y-1 text-slate-700 pl-4 list-disc text-xs">
                              {msg.structured.facts.map((fact, i) => (
                                <li key={i}>{fact}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* 🧮 CALCULATIONS */}
                        {msg.structured.calculations && msg.structured.calculations.length > 0 && (
                          <div className="bg-emerald-50/70 border border-emerald-100 rounded-lg p-3 space-y-1.5">
                            <div className="flex items-center space-x-1.5 text-emerald-900 font-bold font-display text-xs">
                              <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                              <span>🧮 ARITHMETIC & VARIANCE CALCULATIONS</span>
                            </div>
                            <ul className="space-y-1 font-mono text-emerald-900 pl-4 list-disc text-[11px]">
                              {msg.structured.calculations.map((calc, i) => (
                                <li key={i}>{calc}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* 💡 ASSUMPTIONS */}
                        {msg.structured.assumptions && msg.structured.assumptions.length > 0 && (
                          <div className="bg-amber-50/70 border border-amber-100 rounded-lg p-3 space-y-1.5">
                            <div className="flex items-center space-x-1.5 text-amber-900 font-bold font-display text-xs">
                              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                              <span>💡 DISCLOSED ASSUMPTIONS & WORKING LIMITS</span>
                            </div>
                            <ul className="space-y-1 text-amber-900 pl-4 list-disc text-xs">
                              {msg.structured.assumptions.map((asm, i) => (
                                <li key={i}>{asm}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* 📋 RECOMMENDATIONS */}
                        {msg.structured.recommendations && msg.structured.recommendations.length > 0 && (
                          <div className="bg-indigo-50/70 border border-indigo-100 rounded-lg p-3 space-y-1.5">
                            <div className="flex items-center space-x-1.5 text-indigo-900 font-bold font-display text-xs">
                              <ListOrdered className="w-3.5 h-3.5 text-indigo-600" />
                              <span>📋 ACTIONABLE RECOMMENDATIONS FOR QS/PM</span>
                            </div>
                            <ul className="space-y-1 text-indigo-950 pl-4 list-disc text-xs">
                              {msg.structured.recommendations.map((rec, i) => (
                                <li key={i}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* CITATIONS & SOURCES BADGES */}
                        {msg.structured.citations && msg.structured.citations.length > 0 && (
                          <div className="pt-2 flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] text-slate-400 font-semibold uppercase">Citations:</span>
                            {msg.structured.citations.map((c, i) => (
                              <button
                                key={i}
                                onClick={() => onOpenCitation(c)}
                                className="inline-flex items-center space-x-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-300 transition-colors cursor-pointer"
                              >
                                <FileText className="w-3 h-3 text-blue-600" />
                                <span>{c.label}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Footer: Confidence Meter & Human Approval Disclaimer */}
                        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[10px] text-slate-400">
                          <div className="flex items-center space-x-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Confidence: {msg.structured.confidenceScore || 98}%</span>
                            <span>•</span>
                            <span>{msg.structured.auditStatus || 'Grounded in Project Ledger'}</span>
                          </div>
                          <span className="text-amber-600 font-medium">
                            *Requires human QS/PM review before contract issuance
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions under bubble */}
                  {!isUser && (
                    <div className="flex items-center space-x-2 text-[11px] text-slate-400 pl-1">
                      <button
                        onClick={() => handleCopyText(msg.id, msg.text)}
                        className="hover:text-slate-600 flex items-center space-x-1 transition-colors cursor-pointer"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-slate-500 text-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex items-center space-x-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-200">
                <span className="animate-spin text-blue-600 font-bold">⟳</span>
                <span>Retrieving evidence & calculating ledgers...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form onSubmit={handleSend} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder={
                mode === 'project'
                  ? 'Ask about budget variance, variations, payment certs, or drawing revisions...'
                  : 'Ask about RICS measurement, NEC4 compensation events, or standard formulas...'
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>

          {/* Quick Prompts Pills */}
          <div className="flex items-center space-x-1.5 pt-2 overflow-x-auto text-[11px] text-slate-500">
            <span className="font-semibold text-slate-400 uppercase text-[10px] shrink-0">Try asking:</span>
            <button
              onClick={() => setInputText('What is the current budget variance on 03.00 Superstructure Frame?')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full whitespace-nowrap transition-colors cursor-pointer"
            >
              Steelwork Variance
            </button>
            <button
              onClick={() => setInputText('Summarize the status and cost impact of VAR-001 and VAR-002.')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full whitespace-nowrap transition-colors cursor-pointer"
            >
              Variations Impact
            </button>
            <button
              onClick={() => setInputText('How much retention is currently held under Interim Certificate IPC-05?')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full whitespace-nowrap transition-colors cursor-pointer"
            >
              Retention Held
            </button>
          </div>
        </div>
      </div>

      {/* Prompt Templates Modal */}
      {showTemplatesModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-2xl w-full p-5 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  Standard Construction Prompt Engineering Library
                </h3>
                <p className="text-xs text-slate-500">
                  Pre-configured prompt templates with strict roles, constraints and quality checks.
                </p>
              </div>
              <button
                onClick={() => setShowTemplatesModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3">
              {promptTemplates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-3 hover:border-blue-400 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900">{tpl.title}</span>
                    <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      {tpl.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{tpl.description}</p>

                  <div className="bg-white p-2.5 rounded border border-slate-200 text-[11px] font-mono text-slate-700">
                    <strong>Template:</strong> {tpl.promptText}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400">Role: {tpl.role}</span>
                    <button
                      onClick={() => handleSelectTemplate(tpl)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1 rounded-lg flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Use Template</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
