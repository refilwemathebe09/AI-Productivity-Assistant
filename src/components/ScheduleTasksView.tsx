import React, { useState } from 'react';
import {
  Kanban as KanbanIcon,
  Calendar,
  AlertTriangle,
  Plus,
  CheckCircle2,
  Clock,
  User,
  ArrowRight,
  ShieldCheck,
  Flag,
  Sparkles
} from 'lucide-react';
import { ProjectTask, Milestone, TaskStatus, TaskPriority } from '../types';
import { useCurrency } from '../context/CurrencyContext';

interface ScheduleTasksViewProps {
  tasks: ProjectTask[];
  milestones: Milestone[];
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: (task: ProjectTask) => void;
  onOpenPlanner: () => void;
}

export const ScheduleTasksView: React.FC<ScheduleTasksViewProps> = ({
  tasks,
  milestones,
  onUpdateTaskStatus,
  onAddTask,
  onOpenPlanner,
}) => {
  const { formatMoney, formatCompact } = useCurrency();
  const [activeTab, setActiveTab] = useState<'kanban' | 'milestones' | 'conflicts'>('kanban');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCostCode, setNewCostCode] = useState('03.00 Superstructure Frame');
  const [newAssignee, setNewAssignee] = useState('Refilwe Mathebe');
  const [newAssigneeRole, setNewAssigneeRole] = useState('Lead Quantity Surveyor');
  const [newPriority, setNewPriority] = useState<TaskPriority>('high');
  const [newDueDate, setNewDueDate] = useState('2026-09-05');
  const [newHours, setNewHours] = useState('8');

  const columns: { id: TaskStatus; label: string; bg: string }[] = [
    { id: 'backlog', label: 'Backlog', bg: 'bg-slate-100' },
    { id: 'todo', label: 'To Do (Ready)', bg: 'bg-blue-50' },
    { id: 'in_progress', label: 'In Progress (Active)', bg: 'bg-amber-50' },
    { id: 'review', label: 'Under QS / PM Review', bg: 'bg-indigo-50' },
    { id: 'completed', label: 'Completed & Certified', bg: 'bg-emerald-50' },
  ];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: ProjectTask = {
      id: `TSK-${Date.now().toString().slice(-3)}`,
      title: newTitle,
      description: newDesc,
      costCodeRef: newCostCode,
      status: 'todo',
      priority: newPriority,
      assignee: newAssignee,
      assigneeRole: newAssigneeRole,
      dueDate: newDueDate,
      estimatedHours: parseInt(newHours, 10) || 4,
      dependencies: [],
    };

    onAddTask(newTask);
    setShowAddTaskModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  const conflictTasks = tasks.filter(t => t.hasConflict);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <KanbanIcon className="w-6 h-6 text-blue-600" />
            <span>Schedule, Kanban & Milestones</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronized critical path tracking with automated dependency conflict detection.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Tab Switcher */}
          <div className="flex items-center bg-slate-200/80 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('kanban')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'kanban' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kanban Board ({tasks.length})
            </button>
            <button
              onClick={() => setActiveTab('milestones')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'milestones' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Milestones ({milestones.length})
            </button>
            <button
              onClick={() => setActiveTab('conflicts')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1 ${
                activeTab === 'conflicts' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Conflicts</span>
              {conflictTasks.length > 0 && (
                <span className="bg-red-100 text-red-800 text-[10px] font-mono px-1.5 rounded-full font-bold">
                  {conflictTasks.length}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={() => setShowAddTaskModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Kanban Board */}
      {activeTab === 'kanban' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {columns.map((col) => {
              const colTasks = tasks.filter(t => t.status === col.id);
              return (
                <div key={col.id} className="bg-slate-100/90 rounded-xl p-3 flex flex-col min-h-[500px]">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                    <span className="font-display font-bold text-xs text-slate-800">{col.label}</span>
                    <span className="bg-white text-slate-700 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200">
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 flex-1 overflow-y-auto">
                    {colTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`bg-white rounded-lg p-3 border shadow-2xs hover:shadow-xs transition-all space-y-2 ${
                          task.hasConflict ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                        }`}
                      >
                        {/* Tags */}
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-mono text-slate-500">{task.id}</span>
                          <span className={`font-semibold px-1.5 py-0.5 rounded ${
                            task.priority === 'critical' ? 'bg-red-100 text-red-800' :
                            task.priority === 'high' ? 'bg-amber-100 text-amber-800' :
                            task.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {task.priority.toUpperCase()}
                          </span>
                        </div>

                        <h4 className="font-semibold text-xs text-slate-900 leading-snug">
                          {task.title}
                        </h4>

                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>

                        {/* Conflict Alert Banner on card */}
                        {task.hasConflict && (
                          <div className="bg-red-50 border border-red-200 p-2 rounded text-[10px] text-red-800 space-y-1">
                            <div className="flex items-center space-x-1 font-bold">
                              <AlertTriangle className="w-3 h-3 text-red-600" />
                              <span>Dependency Blocked</span>
                            </div>
                            <div>{task.conflictReason}</div>
                          </div>
                        )}

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                          <div className="flex items-center space-x-1 truncate max-w-[110px]" title={task.assignee}>
                            <User className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{task.assignee.split(' ')[0]}</span>
                          </div>

                          <div className="flex items-center space-x-1 font-mono">
                            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{task.dueDate}</span>
                          </div>
                        </div>

                        {/* Quick status transition dropdown */}
                        <div className="pt-1 flex items-center justify-end">
                          <select
                            value={task.status}
                            onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as TaskStatus)}
                            className="text-[10px] bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 font-medium cursor-pointer"
                          >
                            <option value="backlog">Move to Backlog</option>
                            <option value="todo">Move to To Do</option>
                            <option value="in_progress">Move to In Progress</option>
                            <option value="review">Move to Review</option>
                            <option value="completed">Move to Completed</option>
                          </select>
                        </div>
                      </div>
                    ))}

                    {colTasks.length === 0 && (
                      <div className="h-32 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-[11px] text-slate-400">
                        No tasks
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Milestones & Critical Path */}
      {activeTab === 'milestones' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <h3 className="font-display font-bold text-base text-slate-900 mb-1">
              Contract Critical Path Schedule
            </h3>
            <p className="text-xs text-slate-500">
              Approved baseline dates vs real-time site forecast dates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {milestones.map((m) => (
              <div key={m.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs text-slate-500 font-bold">{m.id}</span>
                    <h4 className="font-display font-bold text-base text-slate-900 mt-0.5">{m.name}</h4>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    m.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                    m.status === 'On Track' ? 'bg-blue-100 text-blue-800' :
                    'bg-rose-100 text-rose-800 font-bold'
                  }`}>
                    {m.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg text-xs font-mono">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Baseline Target</div>
                    <div className="font-semibold text-slate-800">{m.baselineDate}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Current Forecast</div>
                    <div className="font-semibold text-blue-700">{m.forecastDate}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Financial Value</div>
                    <div className="font-semibold text-slate-900">{formatCompact(m.financialMilestoneValue)}</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-medium text-slate-600">
                    <span>Progress to Completion</span>
                    <span className="font-mono">{m.completionPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${m.status === 'Completed' ? 'bg-emerald-600' : m.status === 'At Risk' ? 'bg-rose-500' : 'bg-blue-600'}`}
                      style={{ width: `${m.completionPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Conflict Auditor */}
      {activeTab === 'conflicts' && (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 shadow-xs space-y-2">
            <div className="flex items-center space-x-2 text-red-900 font-bold">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span>Flagged Dependency & Schedule Conflicts ({conflictTasks.length})</span>
            </div>
            <p className="text-xs text-red-800">
              The AI engine continually checks task prerequisites, engineering inspection sign-offs, and procurement deliveries.
            </p>
          </div>

          {conflictTasks.map((t) => (
            <div key={t.id} className="bg-white rounded-xl border border-red-300 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                  {t.id} • {t.costCodeRef}
                </span>
                <span className="text-xs font-semibold text-slate-500">Assignee: {t.assignee}</span>
              </div>

              <h4 className="font-display font-bold text-base text-slate-900">{t.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{t.description}</p>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-900 space-y-1">
                <div className="font-bold">Root Cause of Blockage:</div>
                <div>{t.conflictReason}</div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  Target Handover: <strong className="font-mono text-slate-800">{t.dueDate}</strong>
                </div>
                <button
                  onClick={onOpenPlanner}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Optimize in AI Planner</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-base text-slate-900">
                Create New Project Task
              </h3>
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Conduct second-fix MEP inspection on Ground Floor"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description & Deliverable</label>
                <textarea
                  rows={2}
                  placeholder="Task scope details..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assignee</label>
                  <input
                    type="text"
                    required
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Est. Hours</label>
                  <input
                    type="number"
                    value={newHours}
                    onChange={(e) => setNewHours(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
