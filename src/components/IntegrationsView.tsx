import React, { useState } from 'react';
import {
  Layers,
  FolderSync,
  Mail,
  MessageSquare,
  Calendar,
  FileSpreadsheet,
  Cpu,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { ProjectInfo } from '../types';

interface IntegrationsViewProps {
  project: ProjectInfo;
}

export const IntegrationsView: React.FC<IntegrationsViewProps> = ({ project }) => {
  const [integrations, setIntegrations] = useState([
    {
      id: 'gemini',
      name: 'Google Gemini 2.5 Flash Engine',
      category: 'AI Model & Reasoning',
      icon: Cpu,
      status: 'Connected & Active',
      description: 'Server-side reasoning engine providing evidence-grounded cost calculation and correspondence drafting.',
      lastSync: 'Real-time (Active)',
      connected: true,
    },
    {
      id: 'drive',
      name: 'Google Drive / Document Vault',
      category: 'Cloud Storage',
      icon: FolderSync,
      status: 'Synchronized',
      description: 'Monitors incoming revisions of drawings, Site Instructions, and Bill of Quantities PDFs.',
      lastSync: 'Today at 08:45 AM (5 documents indexed)',
      connected: true,
    },
    {
      id: 'outlook',
      name: 'Microsoft Outlook 365',
      category: 'Email & Communications',
      icon: Mail,
      status: 'Drafts Mode Only',
      description: 'Exports human-approved email notices directly to Outlook Drafts folder with contract clause tags.',
      lastSync: 'Synced 2 hours ago',
      connected: true,
    },
    {
      id: 'teams',
      name: 'Microsoft Teams & Slack',
      category: 'Site Coordination',
      icon: MessageSquare,
      status: 'Channel Connected',
      description: 'Dispatches daily briefing summaries and critical path conflict alerts to #site-commercials.',
      lastSync: 'Today at 07:00 AM',
      connected: true,
    },
    {
      id: 'calendar',
      name: 'Google Calendar / Exchange',
      category: 'Schedule & Time Blocking',
      icon: Calendar,
      status: 'Connected',
      description: 'Pushes AI-optimized daily time blocks and milestone handover deadlines to team calendars.',
      lastSync: 'Yesterday',
      connected: true,
    },
    {
      id: 'excel',
      name: 'Excel / CSV Ledger Exporter',
      category: 'Commercial Data Export',
      icon: FileSpreadsheet,
      status: 'Ready',
      description: 'Bi-directional sync of cost code ledgers (01.00 - 07.00) and variations register.',
      lastSync: 'Continuous Local Sync',
      connected: true,
    },
  ]);

  const [isSyncing, setIsSyncing] = useState(false);

  const handleToggle = (id: string) => {
    setIntegrations(prev => prev.map(item => 
      item.id === id ? { ...item, connected: !item.connected } : item
    ));
  };

  const handleSyncAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 flex items-center space-x-2">
              <Layers className="w-6 h-6 text-blue-600" />
              <span>Enterprise Tool Integrations & Data Connectors</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Secure connections to document repositories, communication suites, and AI engines.
            </p>
          </div>

          <button
            onClick={handleSyncAll}
            disabled={isSyncing}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing Connectors...' : 'Sync All Integrations'}</span>
          </button>
        </div>
      </div>

      {/* Grid of Connectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`bg-white rounded-xl border p-5 shadow-xs transition-all space-y-3 flex flex-col justify-between ${
                item.connected ? 'border-slate-200 hover:border-blue-300' : 'border-slate-200 opacity-60'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <button
                    onClick={() => handleToggle(item.id)}
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                      item.connected ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                        item.connected ? 'right-0.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">{item.category}</span>
                  <h3 className="font-display font-bold text-sm text-slate-900 mt-0.5">{item.name}</h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center space-x-1.5 font-medium">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${item.connected ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.connected ? item.status : 'Disconnected'}</span>
                </div>
                <span className="font-mono text-[10px] text-slate-400">
                  {item.connected ? 'Active' : 'Off'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
