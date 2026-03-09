import { useState, useEffect, useRef, useMemo } from 'react';
import {
  History, X, Calendar, User as UserIcon,
  MessageCircle, Send, ChevronDown, ChevronUp,
  Link as LinkIcon, ListChecks, Check,
  List, Underline, Bold, Link2, Flag,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Spinner } from '@/components/ui';
import { useInstruction, useUpdateInstruction } from '@/hooks/useInstructions';
import { useEnvironmentMembers } from '@/hooks/useEnvironments';
import { useComments, useCreateComment } from '@/hooks/useComments';
import { useActivity } from '@/hooks/useActivity';
import { useToast } from '@/components/ui';
import { StatusChip, PriorityChip } from './StatusChip';
import {
  DUE_DATE_TYPE_LABELS, STATUS_LABELS, STATUS_COLORS,
} from '@/types';
import type {
  ActivityAction, ActivityEvent, Comment,
  InstructionStatus, DueDateType, Instruction,
} from '@/types';

/* ─── Constants ─── */
const EDITABLE_STATUSES: { value: InstructionStatus; label: string }[] = [
  { value: 'open', label: STATUS_LABELS.open },
  { value: 'in_progress', label: STATUS_LABELS.in_progress },
  { value: 'completed', label: STATUS_LABELS.completed },
];

const DUE_DATE_TYPES: { value: DueDateType; label: string }[] = [
  { value: 'routine', label: 'שוטף' },
  { value: 'immediate', label: 'מיידי' },
  { value: 'date', label: 'תאריך' },
];

/* ─── Helpers ─── */
function formatDateShort(date: Date | null): string {
  if (!date) return '—';
  return date.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function formatDateHebrew(date: Date | null): string {
  if (!date) return '';
  return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
}

function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diffMs = now - date.getTime();
  const minutes = Math.floor(diffMs / 60_000);
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);
  if (minutes < 1) return 'עכשיו';
  if (minutes < 60) return `לפני ${minutes} דקות`;
  if (hours < 24) return `לפני ${hours === 1 ? 'שעה' : `${hours} שעות`}`;
  if (days === 1) return 'אתמול';
  return date.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatActivityDate(date: Date): string {
  return date.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function toInputDate(date: Date | null): string {
  if (!date) return '';
  return date.toISOString().split('T')[0];
}

/* ─── Activity descriptions ─── */
function getActivityDesc(event: ActivityEvent): string {
  const actionMap: Record<ActivityAction, string> = {
    created: 'יצר את ההנחיה',
    status_changed: 'עודכן סטטוס',
    assigned: 'שובץ',
    unassigned: 'הוסר שיבוץ',
    commented: 'הוסיף הערה',
    edited: 'עודכן',
    tag_added: 'הוסיף תגית',
    tag_removed: 'הסיר תגית',
    due_date_changed: 'עודכן זמנים',
    priority_changed: 'עודכנה עדיפות',
    attachment_added: 'הוסיף קובץ',
    attachment_removed: 'הסיר קובץ',
    archived: 'הועבר לארכיון',
    restored: 'שוחזר מארכיון',
  };

  let desc = actionMap[event.action] || event.action;
  if (event.action === 'status_changed' && event.metadata.oldValue && event.metadata.newValue) {
    desc += `: מ-"${event.metadata.oldValue}" ל-"${event.metadata.newValue}"`;
  }
  if (event.action === 'due_date_changed' && event.metadata.oldValue && event.metadata.newValue) {
    desc += `: מ-${event.metadata.oldValue} ל-${event.metadata.newValue}`;
  }
  if (event.action === 'edited' && event.metadata.oldValue) {
    desc += `: ${event.metadata.oldValue}`;
  }
  if ((event.action === 'tag_added' || event.action === 'tag_removed') && event.metadata.tagName) {
    desc += `: ${event.metadata.tagName}`;
  }
  if (event.action === 'assigned' && event.metadata.targetUser) {
    desc += ` את ${event.metadata.targetUser.name}`;
  }
  return desc;
}

/* ─── click-outside hook ─── */
function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  onClose: () => void,
  active: boolean,
) {
  useEffect(() => {
    if (!active) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [active, ref, onClose]);
}

/* ─── Due-date type badge colors ─── */
const DUE_DATE_TYPE_STYLES: Record<string, string> = {
  routine: 'bg-blue-50 text-blue-700 border-blue-200',
  immediate: 'bg-amber-50 text-amber-700 border-amber-200',
  date: 'bg-slate-50 text-slate-600 border-slate-200',
};

/* ════════════════════════════════════════════
   Main Modal — Props
   ════════════════════════════════════════════ */
interface InstructionViewModalProps {
  open: boolean;
  onClose: () => void;
  instructionId: string;
  envId: string;
  initialEditMode?: boolean;
}

export function InstructionViewModal({
  open,
  onClose,
  instructionId,
  envId,
  initialEditMode = false,
}: InstructionViewModalProps) {
  const { data: instruction, isLoading } = useInstruction(instructionId);
  const [chatOpen, setChatOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(initialEditMode);

  // Sync isEditing when initialEditMode changes (e.g. reopening for edit)
  useEffect(() => {
    setIsEditing(initialEditMode);
  }, [initialEditMode, instructionId]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="fixed inset-0" onClick={onClose} />

        {/* Modal container */}
        <div className="relative z-50 w-[62vw] min-w-[720px] max-w-[1100px] max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {isLoading || !instruction ? (
            <div className="py-20 flex items-center justify-center">
              <Spinner size={32} />
            </div>
          ) : isEditing ? (
            <EditInstructionView
              instruction={instruction}
              envId={envId}
              onClose={() => setIsEditing(false)}
              onSaved={() => setIsEditing(false)}
            />
          ) : (
            <ReadOnlyView
              instruction={instruction}
              onClose={onClose}
              onEdit={() => setIsEditing(true)}
              chatOpen={chatOpen}
              setChatOpen={setChatOpen}
              setHistoryOpen={setHistoryOpen}
            />
          )}
        </div>
      </div>

      {/* Bottom drawer — Chat */}
      {chatOpen && instruction && !isEditing && (
        <ChatDrawer
          instructionId={instructionId}
          onClose={() => setChatOpen(false)}
        />
      )}

      {/* Side drawer — History */}
      {historyOpen && instruction && !isEditing && (
        <HistoryDrawer
          instructionId={instructionId}
          onClose={() => setHistoryOpen(false)}
        />
      )}
    </>
  );
}

/* ════════════════════════════════════════════
   READ-ONLY VIEW (original view + edit button)
   ════════════════════════════════════════════ */
function ReadOnlyView({
  instruction,
  onClose,
  onEdit,
  chatOpen,
  setChatOpen,
  setHistoryOpen,
}: {
  instruction: Instruction;
  onClose: () => void;
  onEdit: () => void;
  chatOpen: boolean;
  setChatOpen: (v: boolean) => void;
  setHistoryOpen: (v: boolean) => void;
}) {
  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between px-8 pt-7 pb-4 border-b border-slate-100">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-slate-900 leading-tight mb-2">
            {instruction.title}
          </h1>
          <div className="flex items-center gap-3">
            <StatusChip status={instruction.status} size="medium" />
            <PriorityChip priority={instruction.priority} size="small" />
            <span className="text-xs text-slate-400">
              {formatDateHebrew(instruction.createdAt)} {formatTime(instruction.createdAt)}
            </span>
            <button
              onClick={() => setHistoryOpen(true)}
              className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
              title="היסטוריית שינויים"
            >
              <History size={16} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            עריכה
          </Button>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-8 py-5 flex-1 overflow-y-auto">
        {instruction.description && (
          <p className="text-sm text-slate-600 leading-relaxed mb-5">{instruction.description}</p>
        )}

        <div className="grid grid-cols-2 gap-x-12 gap-y-5">
          {/* אחראים */}
          <div>
            <SectionLabel>אחראים</SectionLabel>
            {instruction.assignees.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {instruction.assignees.map((a) => (
                  <div key={a.id} className="flex items-center gap-2.5 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                      <UserIcon size={13} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800 leading-tight">{a.user.name}</span>
                      <StatusChip status={a.status} size="small" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-sm text-slate-400">לא שובצו אחראים</span>
            )}
          </div>

          {/* תג"ב */}
          <div>
            <SectionLabel>תג״ב</SectionLabel>
            <div className="flex items-center gap-2">
              <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full border', DUE_DATE_TYPE_STYLES[instruction.dueDateType] || DUE_DATE_TYPE_STYLES.routine)}>
                {DUE_DATE_TYPE_LABELS[instruction.dueDateType]}
              </span>
              {instruction.dueDateType === 'date' && instruction.dueDateFrom && instruction.dueDate ? (
                <span className="text-sm text-slate-600 flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-400" />
                  {formatDateShort(instruction.dueDateFrom)} - {formatDateShort(instruction.dueDate)}
                </span>
              ) : instruction.dueDate ? (
                <span className="text-sm text-slate-600 flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-400" />
                  עד {formatDateShort(instruction.dueDate)}
                </span>
              ) : null}
            </div>
          </div>

          {/* מקור */}
          <div>
            <SectionLabel>מקור</SectionLabel>
            {instruction.source ? (
              <span className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
                <LinkIcon size={14} />
                {instruction.source}
              </span>
            ) : (
              <span className="text-sm text-slate-400">—</span>
            )}
          </div>
        </div>

        {/* הערות וקישורים */}
        <div className="mt-5">
          <SectionLabel>הערות וקישורים</SectionLabel>
          <NotesSection description={instruction.description} />
        </div>
      </div>

      {/* Chat toggle bar */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="flex items-center justify-between px-8 py-3.5 bg-slate-50 border-t border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <MessageCircle size={16} className="text-slate-500" />
          <span className="text-sm font-bold text-slate-700">שיחה ועדכונים</span>
          {instruction.commentCount > 0 && (
            <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {instruction.commentCount}
            </span>
          )}
        </div>
        {chatOpen ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronUp size={16} className="text-slate-400" />}
      </button>
    </>
  );
}

/* ════════════════════════════════════════════
   EDIT VIEW — Full edit mode
   ════════════════════════════════════════════ */
function EditInstructionView({
  instruction,
  envId,
  onClose,
  onSaved,
}: {
  instruction: Instruction;
  envId: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const toast = useToast();
  const updateMutation = useUpdateInstruction(envId);
  const { data: envMembers = [] } = useEnvironmentMembers(envId);

  const availableMembers = useMemo(
    () => envMembers.map((m) => ({ id: m.user.id, name: m.user.name })),
    [envMembers],
  );

  // ─── Editable state ───
  const [title, setTitle] = useState(instruction.title);
  const [description, setDescription] = useState(instruction.description || '');
  const [status, setStatus] = useState<InstructionStatus>(instruction.status);
  const [dueDateType, setDueDateType] = useState<DueDateType>(instruction.dueDateType);
  const [dueDate, setDueDate] = useState(toInputDate(instruction.dueDate));
  const [dueDateFrom, setDueDateFrom] = useState(toInputDate(instruction.dueDateFrom));
  const [source, setSource] = useState(instruction.source || '');
  const [isImportant, setIsImportant] = useState(instruction.isImportant);
  const [notes, setNotes] = useState('');
  const [assigneeIds, setAssigneeIds] = useState<string[]>(
    instruction.assignees.map((a) => a.user.id)
  );
  // Accordion: additional details open by default
  const [showMore, setShowMore] = useState(true);

  // Dropdown states
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [dueDateDropdownOpen, setDueDateDropdownOpen] = useState(false);
  const [assigneeDropdownOpen, setAssigneeDropdownOpen] = useState(false);

  const statusRef = useRef<HTMLDivElement>(null);
  const dueDateRef = useRef<HTMLDivElement>(null);
  const assigneeRef = useRef<HTMLDivElement>(null);

  useClickOutside(statusRef, () => setStatusDropdownOpen(false), statusDropdownOpen);
  useClickOutside(dueDateRef, () => setDueDateDropdownOpen(false), dueDateDropdownOpen);
  useClickOutside(assigneeRef, () => setAssigneeDropdownOpen(false), assigneeDropdownOpen);

  const formValid = title.trim().length > 0;

  const hasChanges = useMemo(() => {
    return (
      title !== instruction.title ||
      description !== (instruction.description || '') ||
      status !== instruction.status ||
      isImportant !== instruction.isImportant ||
      dueDateType !== instruction.dueDateType ||
      dueDate !== toInputDate(instruction.dueDate) ||
      source !== (instruction.source || '') ||
      JSON.stringify(assigneeIds.sort()) !==
        JSON.stringify(instruction.assignees.map((a) => a.user.id).sort())
    );
  }, [title, description, status, isImportant, dueDateType, dueDate, source, assigneeIds, instruction]);

  const handleSave = async () => {
    if (!formValid) return;

    const computedDueDate =
      dueDateType === 'immediate'
        ? new Date().toISOString()
        : dueDate
          ? new Date(dueDate).toISOString()
          : null;

    const computedDueDateFrom =
      dueDateType === 'date' && dueDateFrom
        ? new Date(dueDateFrom).toISOString()
        : null;

    try {
      await updateMutation.mutateAsync({
        instructionId: instruction.id,
        data: {
          title: title.trim(),
          description: description.trim() || undefined,
          status,
          priority: instruction.priority,
          due_date_type: dueDateType,
          due_date: computedDueDate,
          due_date_from: computedDueDateFrom,
          source: source.trim() || null,
          assignee_ids: assigneeIds,
          is_important: isImportant,
        },
      });
      toast.success('ההנחיה עודכנה בהצלחה');
      onSaved();
    } catch {
      toast.error('תקלה בעדכון ההנחיה');
    }
  };

  const filteredMembers = availableMembers.filter((m) => !assigneeIds.includes(m.id));
  const removeAssignee = (id: string) => setAssigneeIds((prev) => prev.filter((a) => a !== id));
  const addAssignee = (id: string) => {
    if (!assigneeIds.includes(id)) setAssigneeIds((prev) => [...prev, id]);
    setAssigneeDropdownOpen(false);
  };
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-8 pt-6 pb-4 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-900">עריכת הנחיה</h2>
        <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
          <X size={20} />
        </button>
      </div>

      {/* Body — scrollable */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="space-y-6">

          {/* שם ההנחיה */}
          <EditFieldWithCounter
            label="שם ההנחיה"
            value={title}
            onChange={setTitle}
            placeholder="הזן את שם ההנחיה"
            maxLength={60}
            autoFocus
          />

          {/* תיאור */}
          <EditFieldWithCounter
            label="תיאור ההנחיה"
            value={description}
            onChange={setDescription}
            placeholder="הזן את תיאור ההנחיה"
            maxLength={500}
            multiline
          />

          {/* סטטוס + חשיבות row */}
          <div className="flex items-start gap-6">
            {/* סטטוס */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2 text-end">סטטוס</label>
              <div ref={statusRef} className="relative">
                <button
                  type="button"
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  className="flex items-center gap-2 h-10 px-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer w-full justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: STATUS_COLORS[status] }}
                    />
                    <span className="text-sm font-medium text-slate-700">
                      {STATUS_LABELS[status]}
                    </span>
                  </div>
                  <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform', statusDropdownOpen && 'rotate-180')} />
                </button>
                {statusDropdownOpen && (
                  <div className="absolute top-full mt-1 start-0 z-40 bg-white rounded-lg shadow-xl border border-slate-200 py-1 min-w-full">
                    {EDITABLE_STATUSES.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => { setStatus(opt.value); setStatusDropdownOpen(false); }}
                        className={cn(
                          'w-full px-4 py-2.5 text-sm text-start hover:bg-slate-50 cursor-pointer transition-colors flex items-center gap-2',
                          status === opt.value && 'bg-primary/5 font-medium'
                        )}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: STATUS_COLORS[opt.value] }}
                        />
                        {opt.label}
                        {status === opt.value && <Check className="w-4 h-4 text-primary ms-auto" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* סימון חשיבות */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isImportant}
              onChange={(e) => setIsImportant(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer accent-amber-500"
            />
            <Flag className={cn('w-4 h-4', isImportant ? 'text-amber-500 fill-amber-500' : 'text-gray-400')} />
            <span className="text-sm font-medium text-slate-700">סמן חשיבות</span>
          </label>

          {/* תג"ב + מקור row */}
          <div className="flex items-start gap-6">
            {/* תג"ב */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2 text-end">תג״ב</label>
              <div className="flex items-center gap-2">
                <div ref={dueDateRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setDueDateDropdownOpen(!dueDateDropdownOpen)}
                    className={cn(
                      'inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer',
                      dueDateType === 'routine'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : dueDateType === 'immediate'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                    )}
                  >
                    {DUE_DATE_TYPE_LABELS[dueDateType]}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {dueDateDropdownOpen && (
                    <div className="absolute top-full mt-1 start-0 z-40 bg-white rounded-lg shadow-xl border border-slate-200 py-1 min-w-[130px]">
                      {DUE_DATE_TYPES.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => { setDueDateType(opt.value); setDueDateDropdownOpen(false); }}
                          className={cn(
                            'w-full px-3 py-2 text-sm text-start hover:bg-slate-50 cursor-pointer transition-colors',
                            dueDateType === opt.value && 'bg-primary/5 text-primary font-medium'
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {(dueDateType === 'routine' || dueDateType === 'date') && (
                  <div className="flex items-center gap-1.5">
                    {dueDateType === 'date' && (
                      <>
                        <span className="text-xs text-slate-400">מ-</span>
                        <div className="relative">
                          <Calendar className="absolute start-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                          <input
                            type="date"
                            value={dueDateFrom}
                            onChange={(e) => setDueDateFrom(e.target.value)}
                            className="h-9 rounded-lg border border-slate-200 ps-8 pe-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
                          />
                        </div>
                      </>
                    )}
                    <span className="text-xs text-slate-400">עד</span>
                    <div className="relative">
                      <Calendar className="absolute start-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="h-9 rounded-lg border border-slate-200 ps-8 pe-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* מקור */}
            <div className="flex-1">
              <EditFieldWithCounter
                label="מקור"
                value={source}
                onChange={setSource}
                placeholder='לדוגמה: ישיבת הנהלה'
                maxLength={60}
              />
            </div>
          </div>

          {/* אחראים */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 text-end">אחראים</label>
            <div ref={assigneeRef} className="relative">
              <div className="flex items-center gap-1.5 flex-wrap min-h-[40px] rounded-lg border border-slate-200 bg-white px-3 py-2">
                {assigneeIds.map((id) => {
                  const member = availableMembers.find((m) => m.id === id)
                    || instruction.assignees.find((a) => a.user.id === id)?.user;
                  if (!member) return null;
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-sm px-2.5 py-1 rounded-lg border border-indigo-100"
                    >
                      {member.name}
                      <button
                        type="button"
                        onClick={() => removeAssignee(id)}
                        className="hover:text-error cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  );
                })}
                {assigneeIds.length === 0 && (
                  <span className="text-sm text-slate-400">בחר אחראים...</span>
                )}
                <button
                  type="button"
                  onClick={() => setAssigneeDropdownOpen(!assigneeDropdownOpen)}
                  className="inline-flex items-center text-slate-400 hover:text-slate-600 cursor-pointer p-0.5 ms-auto"
                >
                  <ChevronDown className={cn('w-4 h-4 transition-transform', assigneeDropdownOpen && 'rotate-180')} />
                </button>
              </div>

              {assigneeDropdownOpen && filteredMembers.length > 0 && (
                <div className="absolute top-full mt-1 end-0 z-40 bg-white rounded-lg shadow-xl border border-slate-200 py-1 min-w-[200px] max-h-44 overflow-y-auto">
                  {filteredMembers.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => addAssignee(member.id)}
                      className="w-full px-4 py-2.5 text-sm text-start hover:bg-slate-50 cursor-pointer transition-colors flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      {member.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ─── פרטים נוספים (Accordion) ─── */}
          <button
            type="button"
            onClick={() => setShowMore(!showMore)}
            className="flex items-center gap-1.5 w-full text-sm font-medium text-slate-500 hover:text-slate-700 cursor-pointer transition-colors border-t border-slate-100 pt-4"
          >
            <span className="flex-1" />
            <span>פרטים נוספים</span>
            {showMore ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showMore && (
            <div className="space-y-6">
              {/* הערות וקישורים — rich text */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 text-end">הערות וקישורים</label>
                <div className="border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary transition-all">
                  <div className="flex items-center gap-0.5 px-3 py-1.5 bg-slate-50 border-b border-slate-200">
                    <ToolbarButton icon={List} label="רשימה" />
                    <ToolbarButton icon={Underline} label="קו תחתון" />
                    <ToolbarButton icon={Bold} label="מודגש" />
                    <ToolbarButton icon={Link2} label="קישור" />
                  </div>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm focus:outline-none resize-none"
                    placeholder="הוסף הערות, קישורים או מידע נוסף..."
                    dir="rtl"
                  />
                </div>
              </div>

              {/* מידע נוסף — read only meta */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">נוצר על ידי</span>
                  <span className="font-medium text-slate-600">{instruction.createdBy.name}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">תאריך יצירה</span>
                  <span className="font-medium text-slate-600">
                    {formatDateShort(instruction.createdAt)} {formatTime(instruction.createdAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">עדכון אחרון</span>
                  <span className="font-medium text-slate-600">
                    {formatDateShort(instruction.updatedAt)} {formatTime(instruction.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer — Save + Cancel */}
      <div className="flex items-center gap-3 px-8 py-4 border-t border-slate-100 bg-slate-50/50">
        <Button
          type="button"
          onClick={handleSave}
          disabled={!formValid || !hasChanges || updateMutation.isPending}
        >
          {updateMutation.isPending && <Spinner size={16} className="me-2" />}
          {updateMutation.isPending ? 'שומר...' : 'שמור'}
        </Button>
        <Button type="button" variant="ghost" onClick={onClose} disabled={updateMutation.isPending}>
          ביטול
        </Button>
      </div>
    </>
  );
}

/* ═══════════════════════════
   Helper Components
   ═══════════════════════════ */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[11px] font-bold text-slate-400 block mb-2 tracking-wide">
      {children}
    </label>
  );
}

function NotesSection({ description }: { description: string | null }) {
  if (!description) return <span className="text-sm text-slate-400">אין הערות</span>;
  const lines = description.split('\n').map((l) => l.trim()).filter((l) => l.startsWith('-') || l.startsWith('•') || /^\d+\./.test(l));
  if (lines.length === 0) return <span className="text-sm text-slate-400">אין הערות</span>;
  return (
    <ul className="space-y-1">
      {lines.map((line, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
          <ListChecks size={14} className="text-slate-400 mt-0.5 shrink-0" />
          <span>{line.replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, '')}</span>
        </li>
      ))}
    </ul>
  );
}

function EditFieldWithCounter({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  autoFocus,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  maxLength: number;
  autoFocus?: boolean;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2 text-end">{label}</label>
      <div className="relative">
        {multiline ? (
          <textarea
            autoFocus={autoFocus}
            rows={3}
            value={value}
            onChange={(e) => {
              if (e.target.value.length <= maxLength) onChange(e.target.value);
            }}
            placeholder={placeholder}
            className="flex w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
            dir="rtl"
          />
        ) : (
          <input
            type="text"
            autoFocus={autoFocus}
            value={value}
            onChange={(e) => {
              if (e.target.value.length <= maxLength) onChange(e.target.value);
            }}
            placeholder={placeholder}
            className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            dir="rtl"
          />
        )}
        <span className="absolute start-3 bottom-2 text-[11px] text-slate-300 pointer-events-none">
          {value.length} / {maxLength}
        </span>
      </div>
    </div>
  );
}

function ToolbarButton({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <button
      type="button"
      className="p-1.5 rounded hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
      aria-label={label}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

/* ════════════════════════════════════════════
   Chat Bottom Drawer
   ════════════════════════════════════════════ */
function ChatDrawer({ instructionId, onClose }: { instructionId: string; onClose: () => void }) {
  const { data: comments, isLoading } = useComments(instructionId);
  const createMutation = useCreateComment(instructionId);
  const [newMessage, setNewMessage] = useState('');
  const sortedComments = comments ? [...comments].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()) : [];

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      await createMutation.mutateAsync({ content: newMessage.trim() });
      setNewMessage('');
    } catch { /* handled */ }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="fixed inset-0 z-[60]" onClick={onClose}>
      <div
        className="absolute bottom-0 inset-x-0 bg-white rounded-t-2xl shadow-2xl border-t border-slate-200 animate-slide-up max-h-[50vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MessageCircle size={16} className="text-slate-500" />
            <span className="text-sm font-bold text-slate-800">שיחה ועדכונים</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {isLoading && <div className="py-6 text-center"><Spinner size={20} /></div>}
          {sortedComments.length === 0 && !isLoading && (
            <div className="py-6 text-center text-sm text-slate-400">אין עדכונים עדיין. היה הראשון לעדכן!</div>
          )}
          {sortedComments.map((comment) => <ChatBubble key={comment.id} comment={comment} />)}
        </div>
        <div className="px-6 py-3 border-t border-slate-100 flex items-center gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="הוסף הערה לעדכון הצוות..."
            disabled={createMutation.isPending}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-indigo-400 transition-colors placeholder:text-slate-400"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || createMutation.isPending}
            className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-40 cursor-pointer shrink-0"
          >
            <Send size={16} className="rotate-180" />
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.35s cubic-bezier(0.05, 0.7, 0.1, 1); }
      `}</style>
    </div>
  );
}

function ChatBubble({ comment }: { comment: Comment }) {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
        <UserIcon size={14} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-slate-800">{comment.user.name}</span>
          <span className="text-[10px] text-slate-400">{formatRelativeTime(comment.createdAt)}</span>
        </div>
        <div className="bg-slate-50 rounded-xl rounded-tr-sm px-3.5 py-2.5 text-sm text-slate-700 leading-relaxed border border-slate-100">
          {comment.content}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   History Side Drawer
   ════════════════════════════════════════════ */
function HistoryDrawer({ instructionId, onClose }: { instructionId: string; onClose: () => void }) {
  const { data: events, isLoading } = useActivity(instructionId);
  const sortedEvents = events ? [...events].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) : [];

  return (
    <div className="fixed inset-0 z-[60] flex items-stretch justify-start bg-slate-900/10 backdrop-blur-[2px]" onClick={onClose}>
      <div className="bg-white w-full max-w-md h-full shadow-2xl animate-slide-in-left overflow-y-auto border-e border-slate-100" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <History size={18} className="text-slate-500" />
            <h2 className="text-base font-bold text-slate-900">היסטוריית שינויים</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-5">
          {isLoading && <div className="py-8 text-center"><Spinner size={24} /></div>}
          {sortedEvents.length === 0 && !isLoading && (
            <div className="py-8 text-center text-sm text-slate-400">אין רשומות היסטוריה</div>
          )}
          {sortedEvents.length > 0 && (
            <div className="relative before:absolute before:start-[7px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-100">
              {sortedEvents.map((event) => (
                <div key={event.id} className="relative ps-8 pb-6 last:pb-0">
                  <div className="absolute start-0 top-1.5 w-[15px] h-[15px] rounded-full bg-white border-[2.5px] border-indigo-400 z-10" />
                  <div className="text-[10px] font-semibold text-slate-400 mb-0.5">
                    {formatActivityDate(event.createdAt)} • {formatTime(event.createdAt)}
                  </div>
                  <div className="text-xs font-bold text-slate-800 mb-0.5">{event.user.name}</div>
                  <div className="text-xs text-slate-600 leading-relaxed">{getActivityDesc(event)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes slide-in-left { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        .animate-slide-in-left { animation: slide-in-left 0.4s cubic-bezier(0.05, 0.7, 0.1, 1); }
      `}</style>
    </div>
  );
}
