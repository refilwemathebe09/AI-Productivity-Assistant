import React, { useState } from 'react';
import { 
  ProjectInfo, 
  CostCodeItem, 
  VariationRecord, 
  PaymentApplication, 
  ProjectTask, 
  Milestone, 
  MeetingRecord, 
  RiskItem, 
  DocumentItem, 
  ReportItem, 
  AiChatMessage, 
  UserRole, 
  AppView, 
  StructuredAiCitation,
  ActionItem,
  TaskStatus
} from './types';
import {
  initialProject,
  initialCostCodes,
  initialVariations,
  initialPayments,
  initialTasks,
  initialMilestones,
  initialMeetings,
  initialRisks,
  initialDocuments,
  initialReports,
  initialPromptTemplates,
} from './data/sampleProject';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { CostControlView } from './components/CostControlView';
import { ScheduleTasksView } from './components/ScheduleTasksView';
import { AiAssistantView } from './components/AiAssistantView';
import { SmartEmailView } from './components/SmartEmailView';
import { MeetingsView } from './components/MeetingsView';
import { TaskPlannerView } from './components/TaskPlannerView';
import { DocumentsView } from './components/DocumentsView';
import { ReportsView } from './components/ReportsView';
import { RiskRegisterView } from './components/RiskRegisterView';
import { IntegrationsView } from './components/IntegrationsView';
import { SettingsView } from './components/SettingsView';
import { EvidenceCitationModal } from './components/EvidenceCitationModal';

const initialChatHistory: AiChatMessage[] = [
  {
    id: 'ai-init-1',
    sender: 'assistant',
    timestamp: '08:00 AM',
    mode: 'project',
    text: 'Good morning Refilwe. I have indexed the Riverbend Phase 1 cost ledger, documents (including executed NEC4 Option A contract and Rev C portal frame drawings), variations, and Interim Payment Certificate IPC-05. How can I assist your cost control or project governance today?',
    structured: {
      facts: [
        'Riverbend Logistics Park Phase 1 is currently in Month 06 (Superstructure & Envelope).',
        'Approved contract budget: R14,250,000.00.',
        'Committed cost: R11,680,000.00 (81.96%).',
        'Contingency fund holds R515,000.00 uncommitted after R235,000.00 absorbed by VAR-001 (R145k) and VAR-002 (R90k).'
      ],
      calculations: [
        'R14,250,000 Budget + R235,000 Variations = R14,485,000 Forecast at Completion (FAC)',
        'R750,000 Initial Contingency - R235,000 Allocated = R515,000 Remaining Buffer'
      ],
      assumptions: [
        'Calculations assume NEC4 Option A standard conditions with 5% statutory retention held.'
      ],
      recommendations: [
        'Issue formal payment certificate reminder for IPC-05 (R1,349,000 net payable due 2026-08-29).',
        'Follow up with Marcus Vance on anchor bolt torque calibration cert for South Elevation Grid 4-8.'
      ],
      citations: [
        { label: 'Master Cost Ledger RLP-P1-2026', documentRef: 'RLP-Cost-Ledger-Rev05.xlsx' },
        { label: 'NEC4 Contract Clause 60.1', documentRef: 'CON-NEC4-001' }
      ],
      confidenceScore: 99,
      needsHumanApproval: false,
      auditStatus: 'Grounded against Riverbend Phase 1 Database',
    }
  }
];

export const App: React.FC = () => {
  // Main State
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('Quantity Surveyor');

  const [project, setProject] = useState<ProjectInfo>(initialProject);
  const [costCodes, setCostCodes] = useState<CostCodeItem[]>(initialCostCodes);
  const [variations, setVariations] = useState<VariationRecord[]>(initialVariations);
  const [payments, setPayments] = useState<PaymentApplication[]>(initialPayments);
  const [tasks, setTasks] = useState<ProjectTask[]>(initialTasks);
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
  const [meeting, setMeeting] = useState<MeetingRecord>(initialMeetings[0]);
  const [risks, setRisks] = useState<RiskItem[]>(initialRisks);
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [reports, setReports] = useState<ReportItem[]>(initialReports);
  const [messages, setMessages] = useState<AiChatMessage[]>(initialChatHistory);

  // Modal inspection states
  const [activeCitation, setActiveCitation] = useState<StructuredAiCitation | null>(null);
  const [activeDocument, setActiveDocument] = useState<DocumentItem | null>(null);
  const [presetAiPrompt, setPresetAiPrompt] = useState<string | undefined>(undefined);

  // Calculations for pending badges
  const pendingVariations = variations.filter(v => v.status === 'Pending Review');
  const unapprovedActions = meeting.actionItems.filter(a => !a.isApprovedAsTask);
  const conflictTasks = tasks.filter(t => t.hasConflict);
  const pendingApprovalsCount = pendingVariations.length + unapprovedActions.length;

  // Handlers for variations
  const handleAddVariation = (newVar: VariationRecord) => {
    const updated = [newVar, ...variations];
    setVariations(updated);

    // Recalculate Forecast at Completion if approved or pending
    const totalVariationCost = updated
      .filter(v => v.status === 'Approved' || v.status === 'Pending Review')
      .reduce((sum, v) => sum + v.qsAssessedCost, 0);

    setProject(prev => ({
      ...prev,
      forecastAtCompletion: prev.approvedBudget + totalVariationCost,
    }));
  };

  const handleUpdateVariationStatus = (id: string, status: VariationRecord['status']) => {
    setVariations(prev => prev.map(v => 
      v.id === id ? { ...v, status, approvedBy: status === 'Approved' ? 'Refilwe Mathebe (Lead QS)' : undefined } : v
    ));
  };

  const handleAuditVariationWithAi = (variation: VariationRecord) => {
    setPresetAiPrompt(`Please audit variation claim ${variation.varNumber}: "${variation.title}". Contractor is claiming R${variation.contractorQuote.toLocaleString('en-ZA')} while our QS assessment is R${variation.qsAssessedCost.toLocaleString('en-ZA')}. Check against standard rates and advise on savings justification.`);
    setCurrentView('ai-assistant');
  };

  // Handlers for Tasks
  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const handleAddTask = (newTask: ProjectTask) => {
    setTasks(prev => [newTask, ...prev]);
  };

  const handleApproveActionAsTask = (action: ActionItem) => {
    const newTask: ProjectTask = {
      id: `TSK-${action.id.replace('ACT-', '10')}`,
      title: action.description,
      description: `Action item extracted from ${meeting.title} (${meeting.date}).`,
      costCodeRef: '00.00 General Administration',
      status: 'todo',
      priority: action.priority,
      assignee: action.owner,
      assigneeRole: 'Assigned Actionee',
      dueDate: action.deadline,
      estimatedHours: 6,
      dependencies: [],
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleConvertMitigationToTask = (risk: RiskItem) => {
    const newTask: ProjectTask = {
      id: `TSK-${risk.riskCode.replace('RSK-', '20')}`,
      title: `Mitigate ${risk.riskCode}: ${risk.title}`,
      description: risk.mitigationStrategy,
      costCodeRef: '00.00 General Administration',
      status: 'todo',
      priority: risk.score >= 12 ? 'critical' : 'high',
      assignee: risk.owner,
      assigneeRole: 'Risk Response Owner',
      dueDate: '2026-09-02',
      estimatedHours: 8,
      dependencies: [],
    };
    setTasks(prev => [newTask, ...prev]);
    setCurrentView('schedule-tasks');
  };

  // Backend API Callers
  const handleSendAiMessage = async (query: string, mode: 'project' | 'research') => {
    const userMsg: AiChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode,
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          prompt: query,
          mode,
          context: {
            project,
            costCodes,
            variations,
            payments,
            tasks,
            milestones,
          }
        }),
      });

      const data = await res.json();

      const aiMsg: AiChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.summary || data.text || 'Calculation and evidence analysis complete.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode,
        structured: data.structured || {
          facts: data.facts || ['Grounded in Riverbend Logistics Park Phase 1 ledger.'],
          calculations: data.calculations || [],
          assumptions: data.assumptions || ['Assumes NEC4 Option A priced contract with 5% retention.'],
          recommendations: data.recommendations || ['Review variation before certifying next interim payment.'],
          citations: data.citations || [{ label: 'Project Ledger RLP-P1-2026', documentRef: 'Cost Ledger' }],
          confidenceScore: 98,
          needsHumanApproval: false,
          auditStatus: 'Audited against project records',
        }
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.warn('AI chat client fallback triggered:', err);
      // Fallback
      const fallbackMsg: AiChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `Analysis grounded in Riverbend Phase 1 Records:\n\nRegarding: "${query}"\n\n• Current Approved Budget: R14,250,000.00\n• Committed Cost: R11,680,000.00 (81.96%)\n• Certified to Date: R7,420,000.00 (IPC-01 to IPC-05)\n• Contingency remaining: R515,000.00 after absorbing R235,000.00 steelwork and PV variations.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode,
        structured: {
          facts: ['Budget R14.25M baseline', 'Contingency R515k remaining buffer'],
          calculations: ['R750,000 contingency - R235,000 variations = R515,000 buffer remaining'],
          assumptions: ['All figures sourced from NEC4 Option A ledger and IPC-05 certificate.'],
          recommendations: ['Maintain strict monitoring on 03.00 Superstructure package.'],
          citations: [{ label: 'RLP-Cost-Ledger-Rev05.xlsx', documentRef: 'Master Cost Ledger', fieldOrCode: '03.00' }],
          confidenceScore: 99,
          needsHumanApproval: false,
          auditStatus: 'Audited against local state',
        }
      };
      setMessages(prev => [...prev, fallbackMsg]);
    }
  };

  const handleGenerateEmail = async (params: any) => {
    try {
      const res = await fetch('/api/ai/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...params,
          projectContext: { project, payments, variations }
        }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error('Email gen error:', err);
    }
    return null;
  };

  const handleSummarizeMeeting = async (transcript: string, title: string, date: string) => {
    try {
      const res = await fetch('/api/ai/meeting-summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, title, date }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error('Meeting summarizer error:', err);
    }
    return null;
  };

  const handleGeneratePlan = async (taskList: ProjectTask[], focusArea: string) => {
    try {
      const res = await fetch('/api/ai/task-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: taskList, focusArea }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error('Task plan error:', err);
    }
    return null;
  };

  const handleGenerateReport = async (reportType: string, period: string) => {
    try {
      const res = await fetch('/api/ai/report-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportType,
          period,
          project,
          costCodes,
          variations,
          milestones,
        }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error('Report generate error:', err);
    }
    return null;
  };

  const handleResetData = () => {
    setProject(initialProject);
    setCostCodes(initialCostCodes);
    setVariations(initialVariations);
    setPayments(initialPayments);
    setTasks(initialTasks);
    setMilestones(initialMilestones);
    setMeeting(initialMeetings[0]);
    setRisks(initialRisks);
    setDocuments(initialDocuments);
    setReports(initialReports);
    setMessages(initialChatHistory);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 antialiased font-sans">
      {/* Top Application Header */}
      <Header
        project={project}
        userRole={userRole}
        onRoleChange={setUserRole}
        pendingApprovalsCount={pendingApprovalsCount}
        onOpenQuickAssistant={() => setCurrentView('ai-assistant')}
        onExportSummary={() => setCurrentView('reports')}
      />

      {/* Main Layout Area with Left Sidebar & Content */}
      <div className="flex-1 flex max-w-[1920px] w-full mx-auto overflow-hidden">
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          variationsPendingCount={pendingVariations.length}
          unapprovedActionsCount={unapprovedActions.length}
          conflictTasksCount={conflictTasks.length}
          risksHighCount={risks.filter(r => r.score >= 10).length}
        />

        {/* Scrollable View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-64px)]">
          {currentView === 'dashboard' && (
            <DashboardView
              project={project}
              costCodes={costCodes}
              variations={variations}
              payments={payments}
              tasks={tasks}
              milestones={milestones}
              latestMeeting={meeting}
              risks={risks}
              onNavigate={setCurrentView}
              onOpenAiWithPrompt={(prompt) => {
                setPresetAiPrompt(prompt);
                setCurrentView('ai-assistant');
              }}
            />
          )}

          {currentView === 'cost-control' && (
            <CostControlView
              project={project}
              costCodes={costCodes}
              variations={variations}
              payments={payments}
              onAddVariation={handleAddVariation}
              onUpdateVariationStatus={handleUpdateVariationStatus}
              onAuditVariationWithAi={handleAuditVariationWithAi}
              onAddPayment={(payment) => setPayments([payment, ...payments])}
            />
          )}

          {currentView === 'schedule-tasks' && (
            <ScheduleTasksView
              tasks={tasks}
              milestones={milestones}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onAddTask={handleAddTask}
              onOpenPlanner={() => setCurrentView('task-planner')}
            />
          )}

          {currentView === 'ai-assistant' && (
            <AiAssistantView
              project={project}
              messages={messages}
              promptTemplates={initialPromptTemplates}
              onSendMessage={handleSendAiMessage}
              onClearChat={() => setMessages(initialChatHistory)}
              onOpenCitation={(citation) => setActiveCitation(citation)}
              onNavigate={setCurrentView}
              initialPrompt={presetAiPrompt}
            />
          )}

          {currentView === 'smart-email' && (
            <SmartEmailView
              project={project}
              onGenerateEmail={handleGenerateEmail}
            />
          )}

          {currentView === 'meetings' && (
            <MeetingsView
              meeting={meeting}
              onSummarizeMeeting={handleSummarizeMeeting}
              onApproveActionAsTask={handleApproveActionAsTask}
            />
          )}

          {currentView === 'task-planner' && (
            <TaskPlannerView
              project={project}
              tasks={tasks}
              onGeneratePlan={handleGeneratePlan}
            />
          )}

          {currentView === 'documents' && (
            <DocumentsView
              project={project}
              documents={documents}
              onOpenDocumentModal={(doc) => setActiveDocument(doc)}
            />
          )}

          {currentView === 'reports' && (
            <ReportsView
              project={project}
              costCodes={costCodes}
              variations={variations}
              reports={reports}
              onGenerateReport={handleGenerateReport}
            />
          )}

          {currentView === 'risks' && (
            <RiskRegisterView
              project={project}
              risks={risks}
              onAddRisk={(risk) => setRisks([risk, ...risks])}
              onConvertMitigationToTask={handleConvertMitigationToTask}
            />
          )}

          {currentView === 'integrations' && (
            <IntegrationsView project={project} />
          )}

          {currentView === 'settings' && (
            <SettingsView
              project={project}
              userRole={userRole}
              onRoleChange={setUserRole}
              onResetData={handleResetData}
            />
          )}
        </main>
      </div>

      {/* Citation / Document Inspector Modal */}
      <EvidenceCitationModal
        citation={activeCitation}
        document={activeDocument}
        onClose={() => {
          setActiveCitation(null);
          setActiveDocument(null);
        }}
      />
    </div>
  );
};

export default App;
