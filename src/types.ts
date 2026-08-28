export type UserRole = 'Quantity Surveyor' | 'Project Manager' | 'Cost Controller' | 'Commercial Director' | 'Client Representative';

export type AppView = 
  | 'dashboard' 
  | 'cost-control' 
  | 'schedule-tasks' 
  | 'ai-assistant' 
  | 'smart-email' 
  | 'meetings' 
  | 'task-planner' 
  | 'documents' 
  | 'reports' 
  | 'risks' 
  | 'integrations' 
  | 'settings';

export interface ProjectInfo {
  id: string;
  name: string;
  code: string;
  client: string;
  contractor: string;
  qsLead: string;
  pmLead: string;
  location: string;
  contractType: string;
  startDate: string;
  plannedFinishDate: string;
  forecastFinishDate: string;
  currentPhase: string;
  progressPercent: number;
  approvedBudget: number;
  committedCost: number;
  actualCost: number;
  forecastAtCompletion: number;
  contingencyBudget: number;
  contingencyCommitted: number;
}

export interface CostCodeItem {
  id: string;
  code: string;
  category: string;
  description: string;
  originalBudget: number;
  approvedVariations: number;
  currentBudget: number;
  committedCost: number;
  actualCost: number;
  forecastCost: number;
  variance: number;
  status: 'Under Budget' | 'On Track' | 'Overrun Alert' | 'Critical Overrun';
  sourceRef: string;
  lastUpdated: string;
}

export interface VariationRecord {
  id: string;
  varNumber: string; // e.g. VAR-001
  title: string;
  description: string;
  costCodeRef: string;
  originator: string;
  contractorQuote: number;
  qsAssessedCost: number;
  status: 'Draft' | 'Pending Review' | 'Approved' | 'Rejected';
  timeImpactDays: number;
  submissionDate: string;
  reviewDate?: string;
  approvedBy?: string;
  sourceDocument: string;
  justification: string;
}

export interface PaymentApplication {
  id: string;
  certNumber: string; // e.g. IPC-05
  periodEnding: string;
  contractorClaimed: number;
  qsCertified: number;
  retentionDeducted: number; // 5%
  previousPayments: number;
  netPayable: number;
  status: 'Pending Assessment' | 'Certified' | 'Paid' | 'Overdue';
  submittedDate: string;
  certifiedDate?: string;
  dueDate: string;
  paymentRef?: string;
}

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  costCodeRef?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  assigneeRole: string;
  dueDate: string;
  estimatedHours: number;
  dependencies: string[];
  hasConflict?: boolean;
  conflictReason?: string;
  convertedFromActionId?: string;
  completedDate?: string;
}

export interface Milestone {
  id: string;
  name: string;
  baselineDate: string;
  forecastDate: string;
  actualDate?: string;
  status: 'Completed' | 'On Track' | 'At Risk' | 'Delayed';
  isCriticalPath: boolean;
  financialMilestoneValue: number;
  completionPercent: number;
}

export interface ActionItem {
  id: string;
  description: string;
  owner: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  isApprovedAsTask: boolean;
  linkedTaskId?: string;
  category: string;
}

export interface MeetingRecord {
  id: string;
  title: string;
  date: string;
  location: string;
  chairperson: string;
  attendees: string[];
  rawTranscript: string;
  summary: string;
  decisions: string[];
  actionItems: ActionItem[];
  sourceDocumentRef: string;
}

export interface DocumentItem {
  id: string;
  refCode: string;
  title: string;
  category: 'Contract' | 'Drawings' | 'BOQ & Pricing' | 'Correspondence' | 'Site Instruction' | 'Specification';
  version: string;
  status: 'Active Valid' | 'Superseded' | 'Draft' | 'Under Review';
  fileSize: string;
  uploadDate: string;
  author: string;
  summary: string;
  supersededBy?: string;
  linkedCostCodes: string[];
}

export interface RiskItem {
  id: string;
  riskCode: string;
  title: string;
  category: 'Ground Conditions' | 'Procurement' | 'Design Changes' | 'Weather & Delay' | 'Commercial' | 'Health & Safety';
  rootCause: string;
  likelyCostEffect: number;
  likelyScheduleEffectDays: number;
  likelihood: number; // 1 - 5
  impact: number; // 1 - 5
  score: number; // likelihood * impact (1 - 25)
  mitigationStrategy: string;
  owner: string;
  status: 'Open' | 'Mitigated' | 'Transferred' | 'Closed';
  sourceReference: string;
}

export interface IntegrationConnector {
  id: string;
  name: string;
  category: 'Storage' | 'Email' | 'Meetings' | 'Calendar' | 'Spreadsheets' | 'AI Models';
  description: string;
  icon: string;
  status: 'Connected' | 'Disconnected' | 'Syncing';
  lastSync: string;
  itemCount: number;
}

export interface StructuredAiCitation {
  label: string;
  documentRef?: string;
  fieldOrCode?: string;
  date?: string;
  quote?: string;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  mode: 'project' | 'research';
  text: string;
  structured?: {
    facts: string[];
    calculations: string[];
    assumptions: string[];
    recommendations: string[];
    citations: StructuredAiCitation[];
    confidenceScore: number;
    needsHumanApproval: boolean;
    auditStatus: string;
  };
}

export interface PromptTemplate {
  id: string;
  title: string;
  category: 'Cost Control' | 'Meetings & Actions' | 'Correspondence' | 'Reporting' | 'Risk & Claims';
  description: string;
  promptText: string;
  sampleInput: string;
  role: string;
  objective: string;
  constraints: string[];
  qualityCheck: string;
}

export interface ReportItem {
  id: string;
  reportNumber: string;
  title: string;
  type: 'Monthly Cost Report' | 'Executive Progress Report' | 'Variation & Risk Audit' | 'Payment & Cashflow Analysis';
  period: string;
  author: string;
  dataCutOffDate: string;
  status: 'Draft' | 'Reviewed' | 'Approved';
  executiveSummary: string;
  keyMetrics: {
    budget: number;
    committed: number;
    actual: number;
    forecast: number;
    variance: number;
    contingencyLeft: number;
  };
  generatedByAI: boolean;
  contentMarkdown: string;
}

export type CurrencyCode = 'ZAR' | 'USD' | 'GBP' | 'EUR' | 'AED' | 'AUD' | 'BWP' | 'KES';

export interface AppSettings {
  userRole: UserRole;
  currency: CurrencyCode;
  convertRateEnabled: boolean;
  requireHumanApprovalEmails: boolean;
  requireHumanApprovalTasks: boolean;
  strictEvidenceGrounding: boolean;
  ledgerDecimals: 2 | 4;
  showTraceabilityBadges: boolean;
  disclaimerAccepted: boolean;
}
