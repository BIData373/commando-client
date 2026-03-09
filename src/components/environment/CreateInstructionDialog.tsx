import { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  Dialog, DialogContent,
  Button, Textarea, Spinner,
} from '@/components/ui';
import {
  Calendar, X, Plus, ChevronDown, ChevronUp,
  Upload, Sparkles, Trash2,
  List, Underline, Bold, Link2, Check, Flag,
} from 'lucide-react';
import { useCreateInstruction } from '@/hooks/useInstructions';
import { useEnvironmentMembers, useResponsibleGroups } from '@/hooks/useEnvironments';

const DUE_DATE_TYPES = [
  { value: 'routine', label: 'שוטף' },
  { value: 'immediate', label: 'מיידי' },
  { value: 'date', label: 'תאריך' },
] as const;

type DueDateType = (typeof DUE_DATE_TYPES)[number]['value'];

// ─── Types ───
export type CreationMode = 'single' | 'discussion';
type DiscussionStep = 1 | 2;
type ExtractionMethod = 'manual' | 'ai';

interface DiscussionInstruction {
  id: string;
  title: string;
  description: string;
  assigneeIds: string[];
  dueDateType: DueDateType;
  dueDate: string;
  notes: string;
}

// ─── Props ───
interface CreateInstructionDialogProps {
  open: boolean;
  onClose: () => void;
  envId: string;
  initialMode?: CreationMode;
}

export function CreateInstructionDialog({
  open,
  onClose,
  envId,
  initialMode = 'single',
}: CreateInstructionDialogProps) {
  const [mode, setMode] = useState<CreationMode>(initialMode);

  useEffect(() => {
    if (open) setMode(initialMode);
  }, [open, initialMode]);

  const createMutation = useCreateInstruction(envId);

  const handleClose = () => {
    if (!createMutation.isPending) onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} size={mode === 'single' ? 'md' : 'wide'}>
      {mode === 'single' ? (
        <SingleInstructionForm
          onClose={handleClose}
          createMutation={createMutation}
          open={open}
          envId={envId}
        />
      ) : (
        <DiscussionForm
          onClose={handleClose}
          createMutation={createMutation}
          open={open}
          envId={envId}
        />
      )}
    </Dialog>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SINGLE INSTRUCTION FORM — matches Figma design
   ═══════════════════════════════════════════════════════════════ */

interface SingleFormProps {
  onClose: () => void;
  createMutation: ReturnType<typeof useCreateInstruction>;
  open: boolean;
  envId: string;
}

function SingleInstructionForm({ onClose, createMutation, open, envId }: SingleFormProps) {
  const { data: envMembers = [] } = useEnvironmentMembers(envId);
  const { data: envGroups = [] } = useResponsibleGroups(envId);

  const availableMembers = useMemo(
    () => envMembers.map((m) => ({ id: m.user.id, name: m.user.name })),
    [envMembers],
  );
  const availableGroups = useMemo(
    () => envGroups.map((g) => ({ id: g.id, nickname: g.nickname, userIds: g.members.map((m) => m.id) })),
    [envGroups],
  );

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [dueDateType, setDueDateType] = useState<DueDateType>('routine');
  const [dueDate, setDueDate] = useState('');
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [source, setSource] = useState('');
  const [notes, setNotes] = useState('');

  // Dropdown states
  const [dueDateDropdownOpen, setDueDateDropdownOpen] = useState(false);
  const [assigneeDropdownOpen, setAssigneeDropdownOpen] = useState(false);

  const dueDateRef = useRef<HTMLDivElement>(null);
  const assigneeRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useClickOutside(dueDateRef, () => setDueDateDropdownOpen(false), dueDateDropdownOpen);
  useClickOutside(assigneeRef, () => setAssigneeDropdownOpen(false), assigneeDropdownOpen);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setTitle('');
      setDescription('');
      setIsImportant(false);
      setDueDateType('routine');
      setDueDate('');
      setAssigneeIds([]);
      setSelectedGroupIds([]);
      setShowMore(false);
      setSource('');
      setNotes('');
    }
  }, [open]);

  const formValid = title.trim().length > 0;

  const handleSubmit = async () => {
    if (!formValid) return;

    const computedDueDate =
      dueDateType === 'immediate'
        ? new Date().toISOString()
        : dueDate
          ? new Date(dueDate).toISOString()
          : undefined;

    try {
      await createMutation.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
        priority: 'medium',
        status: 'open',
        source: source.trim() || undefined,
        due_date_type: dueDateType,
        due_date: computedDueDate,
        assignee_ids: assigneeIds.length > 0 ? assigneeIds : undefined,
        responsible_group_ids: selectedGroupIds.length > 0 ? selectedGroupIds : undefined,
        is_important: isImportant || undefined,
      });
      onClose();
    } catch {
      // handled by TanStack Query
    }
  };

  // Compute merged unique assignees for preview
  const resolvedUserIds = useMemo(() => {
    const fromGroups = selectedGroupIds.flatMap((gId) => {
      const group = availableGroups.find((g) => g.id === gId);
      return group ? group.userIds : [];
    });
    return [...new Set([...assigneeIds, ...fromGroups])];
  }, [assigneeIds, selectedGroupIds]);

  const toggleGroup = (groupId: string) => {
    setSelectedGroupIds((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  };

  const removeAssignee = (id: string) => setAssigneeIds((prev) => prev.filter((a) => a !== id));
  const addAssignee = (id: string) => {
    if (!assigneeIds.includes(id)) setAssigneeIds((prev) => [...prev, id]);
    setAssigneeDropdownOpen(false);
  };

  const filteredMembers = availableMembers.filter((m) => !assigneeIds.includes(m.id));

  const dueDateLabel = DUE_DATE_TYPES.find((d) => d.value === dueDateType)?.label || 'שוטף';

  return (
    <>
      {/* Header — X button + title */}
      <div className="relative px-6 pt-5 pb-2">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 start-4 p-1.5 rounded-md text-text-disabled hover:text-text-secondary hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="סגור"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-center text-text-primary">יצירת הנחיה</h2>
      </div>

      <DialogContent className="overflow-y-auto flex-1">
        <div className="space-y-5">
          {/* שם ההנחייה */}
          <FieldWithCounter
            label="שם ההנחייה"
            value={title}
            onChange={setTitle}
            placeholder="הזן את שם ההנחיה"
            maxLength={60}
            autoFocus
          />

          {/* תיאור ההנחיה */}
          <FieldWithCounter
            label="תיאור ההנחיה"
            value={description}
            onChange={setDescription}
            placeholder="הזן את תיאור ההנחיה"
            maxLength={60}
          />

          {/* סימון חשיבות */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isImportant}
              onChange={(e) => setIsImportant(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500 cursor-pointer accent-amber-500"
            />
            <Flag className={cn('w-4 h-4', isImportant ? 'text-amber-500 fill-amber-500' : 'text-gray-400')} />
            <span className="text-sm font-medium text-text-primary">סמן חשיבות</span>
          </label>

          {/* תג"ב + אחראים row */}
          <div className="flex items-start gap-6">
            {/* תג"ב */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-text-primary mb-1.5 text-end">תג״ב</label>
              <div className="flex items-center gap-2">
                {/* Due date type badge dropdown */}
                <div ref={dueDateRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setDueDateDropdownOpen(!dueDateDropdownOpen)}
                    className={cn(
                      'inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer',
                      dueDateType === 'routine'
                        ? 'bg-blue-100 text-blue-700'
                        : dueDateType === 'immediate'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-gray-100 text-text-primary'
                    )}
                  >
                    {dueDateLabel}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {dueDateDropdownOpen && (
                    <div className="absolute top-full mt-1 start-0 z-40 bg-paper rounded-lg shadow-xl border border-gray-200 py-1 min-w-[120px]">
                      {DUE_DATE_TYPES.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => { setDueDateType(opt.value); setDueDateDropdownOpen(false); }}
                          className={cn(
                            'w-full px-3 py-2 text-sm text-start hover:bg-gray-50 cursor-pointer transition-colors',
                            dueDateType === opt.value && 'bg-primary/5 text-primary font-medium'
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Date picker(s) */}
                {dueDateType === 'routine' && (
                  <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                    <span>עד</span>
                    <div className="relative">
                      <Calendar className="absolute start-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-disabled pointer-events-none" />
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="h-8 rounded-md border border-gray-200 ps-8 pe-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary"
                      />
                    </div>
                  </div>
                )}
                {dueDateType === 'date' && (
                  <div className="relative">
                    <Calendar className="absolute start-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-disabled pointer-events-none" />
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="h-8 rounded-md border border-gray-200 ps-8 pe-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* אחראים */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-text-primary mb-1.5 text-end">אחראים</label>
              <div ref={assigneeRef} className="relative">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Selected assignee chips */}
                  {assigneeIds.map((id) => {
                    const member = availableMembers.find((m) => m.id === id);
                    if (!member) return null;
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1 bg-gray-100 text-text-primary text-sm px-2.5 py-1 rounded-md border border-gray-200"
                      >
                        {member.name}
                        <button
                          type="button"
                          onClick={() => removeAssignee(id)}
                          className="hover:text-error cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                  {/* Dropdown trigger */}
                  <button
                    type="button"
                    onClick={() => setAssigneeDropdownOpen(!assigneeDropdownOpen)}
                    className="inline-flex items-center text-text-disabled hover:text-text-secondary cursor-pointer p-1"
                  >
                    <ChevronDown className={cn('w-4 h-4 transition-transform', assigneeDropdownOpen && 'rotate-180')} />
                  </button>
                </div>

                {assigneeDropdownOpen && filteredMembers.length > 0 && (
                  <div className="absolute top-full mt-1 end-0 z-40 bg-paper rounded-lg shadow-xl border border-gray-200 py-1 min-w-[180px] max-h-40 overflow-y-auto">
                    {filteredMembers.map((member) => (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => addAssignee(member.id)}
                        className="w-full px-3 py-2 text-sm text-start hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        {member.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ממונים (קבוצות אחראים) */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5 text-end">קבוצות ממונים</label>
            <div className="flex flex-wrap gap-2">
              {availableGroups.map((group) => {
                const isSelected = selectedGroupIds.includes(group.id);
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer',
                      isSelected
                        ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                        : 'bg-white text-text-secondary border-gray-200 hover:bg-gray-50'
                    )}
                  >
                    {group.nickname}
                    <span className="text-[10px] opacity-60">({group.userIds.length})</span>
                    {isSelected && <X className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview: merged unique assignees */}
          {resolvedUserIds.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <span className="block text-xs font-medium text-text-secondary mb-2">
                נמענים סופיים ({resolvedUserIds.length} ייחודיים)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {resolvedUserIds.map((uid) => {
                  const user = availableMembers.find((m) => m.id === uid);
                  return (
                    <span
                      key={uid}
                      className="inline-flex items-center gap-1 bg-white text-text-primary text-xs px-2 py-0.5 rounded-full border border-gray-200"
                    >
                      {user?.name || uid}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Divider + פרטים נוספים */}
          <button
            type="button"
            onClick={() => setShowMore(!showMore)}
            className="flex items-center gap-1.5 w-full text-sm text-text-secondary hover:text-text-primary cursor-pointer transition-colors border-t border-gray-200 pt-3"
          >
            <span className="flex-1" />
            <span>פרטים נוספים</span>
            {showMore ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showMore && (
            <div className="space-y-5">
              {/* מקור */}
              <FieldWithCounter
                label="מקור"
                value={source}
                onChange={setSource}
                placeholder='לדוגמה: חתמ"צ שבועי'
                maxLength={60}
              />

              {/* הערות וקישורים */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5 text-end">הערות וקישורים</label>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Mini toolbar */}
                  <div className="flex items-center gap-0.5 px-3 py-1.5 bg-gray-50 border-b border-gray-200">
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
                    placeholder=""
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>

      {/* Footer — single שמור button */}
      <div className="px-6 pb-5 pt-2">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!formValid || createMutation.isPending}
          className="w-auto"
        >
          {createMutation.isPending && <Spinner size={16} className="me-2" />}
          {createMutation.isPending ? 'שומר...' : 'שמור'}
        </Button>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DISCUSSION FORM — Figma-matching 2-step wizard
   ═══════════════════════════════════════════════════════════════ */

interface DiscussionFormProps {
  onClose: () => void;
  createMutation: ReturnType<typeof useCreateInstruction>;
  open: boolean;
  envId: string;
}

function DiscussionForm({ onClose, createMutation, open, envId }: DiscussionFormProps) {
  const { data: envMembers = [] } = useEnvironmentMembers(envId);

  const availableMembers = useMemo(
    () => envMembers.map((m) => ({ id: m.user.id, name: m.user.name })),
    [envMembers],
  );
  const [discussionStep, setDiscussionStep] = useState<DiscussionStep>(1);
  const [discussionName, setDiscussionName] = useState('');
  const [discussionDate, setDiscussionDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [extractionMethod, setExtractionMethod] = useState<ExtractionMethod>('manual');
  const [discussionInstructions, setDiscussionInstructions] = useState<DiscussionInstruction[]>([]);
  const [aiText, setAiText] = useState('');
  const [aiExtracting, setAiExtracting] = useState(false);

  // Per-row dropdown state: { rowId-field: true }
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setOpenDropdown(null), !!openDropdown);

  useEffect(() => {
    if (!open) {
      setDiscussionStep(1);
      setDiscussionName('');
      setDiscussionDate(new Date().toISOString().split('T')[0]);
      setExtractionMethod('manual');
      setDiscussionInstructions([]);
      setAiText('');
      setAiExtracting(false);
      setOpenDropdown(null);
    }
  }, [open]);

  const handleSubmitDiscussion = async () => {
    if (discussionInstructions.length === 0) return;

    try {
      for (const inst of discussionInstructions) {
        const computedDueDate =
          inst.dueDateType === 'immediate'
            ? new Date().toISOString()
            : inst.dueDateType === 'date' && inst.dueDate
              ? new Date(inst.dueDate).toISOString()
              : undefined;

        await createMutation.mutateAsync({
          title: inst.title.trim(),
          description: inst.description.trim() || undefined,
          priority: 'medium',
          status: 'open',
          source: discussionName.trim() || undefined,
          due_date_type: inst.dueDateType,
          due_date: computedDueDate,
          assignee_ids: inst.assigneeIds.length > 0 ? inst.assigneeIds : undefined,
        });
      }
      onClose();
    } catch {
      // handled by TanStack Query
    }
  };

  const addDiscussionRow = () => {
    setDiscussionInstructions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: '',
        description: '',
        assigneeIds: [],
        dueDateType: 'routine',
        dueDateFrom: '',
        dueDate: '',
        notes: '',
      },
    ]);
  };

  const updateDiscussionRow = (id: string, field: keyof DiscussionInstruction, value: unknown) => {
    setDiscussionInstructions((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const removeDiscussionRow = (id: string) => {
    setDiscussionInstructions((prev) => prev.filter((row) => row.id !== id));
  };

  const toggleRowAssignee = (rowId: string, memberId: string) => {
    setDiscussionInstructions((prev) =>
      prev.map((row) => {
        if (row.id !== rowId) return row;
        const has = row.assigneeIds.includes(memberId);
        return {
          ...row,
          assigneeIds: has
            ? row.assigneeIds.filter((id) => id !== memberId)
            : [...row.assigneeIds, memberId],
        };
      })
    );
  };

  const handleAiExtract = async () => {
    if (!aiText.trim()) return;
    setAiExtracting(true);
    await new Promise((r) => setTimeout(r, 2000));
    const lines = aiText.split('\n').filter((l) => l.trim());
    const extracted: DiscussionInstruction[] = lines.slice(0, 5).map((line) => ({
      id: crypto.randomUUID(),
      title: line.trim().substring(0, 200),
      description: '',
      assigneeIds: [],
      dueDateType: 'routine' as DueDateType,
      dueDate: '',
      tags: [],
      notes: '',
    }));
    setDiscussionInstructions(extracted);
    setAiExtracting(false);
  };

  // Format date for display: "25/02/26"
  const formattedDate = (() => {
    if (!discussionDate) return '';
    const [y, m, d] = discussionDate.split('-');
    return `${d}/${m}/${y?.slice(2)}`;
  })();

  return (
    <>
      {/* Header */}
      <div className="relative px-6 pt-5 pb-2">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 start-4 p-1.5 rounded-md text-text-disabled hover:text-text-secondary hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="סגור"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-center text-text-primary">יצירת הנחיות מתוך דיון</h2>
      </div>

      <DialogContent className="overflow-y-auto flex-1">
        <div className="space-y-5">
          {/* Step indicators */}
          <div className="flex items-center gap-3 mb-2">
            <DiscussionStepIndicator step={1} current={discussionStep} label="פרטי הסביבה" />
            <div className="h-px flex-1 bg-gray-200" />
            <DiscussionStepIndicator step={2} current={discussionStep} label="בעלי תפקידים" />
          </div>

          {/* ─── Step 1 ─── */}
          {discussionStep === 1 && (
            <div className="space-y-5">
              {/* Name + Date on same row */}
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <FieldWithCounter
                    label="שם הדיון"
                    value={discussionName}
                    onChange={setDiscussionName}
                    placeholder="הזן את שם הדיון"
                    maxLength={60}
                    autoFocus
                  />
                </div>
                <div className="w-44">
                  <label className="block text-sm font-medium text-text-primary mb-1.5 text-end">תאריך הדיון</label>
                  <div className="relative">
                    <Calendar className="absolute end-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-disabled pointer-events-none" />
                    <input
                      type="date"
                      value={discussionDate}
                      onChange={(e) => setDiscussionDate(e.target.value)}
                      className="flex h-9 w-full rounded-lg border border-gray-300 bg-white pe-9 ps-3 py-1 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Upload area */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5 text-end">צירוף קובץ</label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-primary/40 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto text-text-disabled mb-3" />
                  <p className="text-sm text-text-secondary">
                    לחץ או גרור את הקובץ לאזור זה כדי להעלות
                  </p>
                  <p className="text-xs text-text-disabled mt-1.5">
                    תמיכה בהעלאה בודדת או בכמות גדולה
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ─── Step 2 ─── */}
          {discussionStep === 2 && (
            <div className="space-y-4">
              {/* Discussion summary */}
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <span className="font-medium text-text-primary">{discussionName}</span>
                {formattedDate && <span>{formattedDate}</span>}
              </div>

              {/* Method toggle */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setExtractionMethod('manual')}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors cursor-pointer',
                    extractionMethod === 'manual'
                      ? 'border-primary bg-primary/5 text-primary font-medium'
                      : 'border-gray-200 text-text-secondary hover:bg-gray-50'
                  )}
                >
                  הזנה ידנית
                </button>
                <button
                  type="button"
                  onClick={() => setExtractionMethod('ai')}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors cursor-pointer',
                    extractionMethod === 'ai'
                      ? 'border-primary bg-primary/5 text-primary font-medium'
                      : 'border-gray-200 text-text-secondary hover:bg-gray-50'
                  )}
                >
                  <Sparkles className="w-4 h-4" />
                  חילוץ הנחיות עם AI
                </button>
              </div>

              {/* AI extraction textarea */}
              {extractionMethod === 'ai' && discussionInstructions.length === 0 && (
                <div className="space-y-3">
                  <Textarea
                    rows={6}
                    placeholder="הדבק כאן את תוכן הדיון / פרוטוקול הישיבה..."
                    value={aiText}
                    onChange={(e) => setAiText(e.target.value)}
                  />
                  <Button
                    type="button"
                    onClick={handleAiExtract}
                    disabled={!aiText.trim() || aiExtracting}
                  >
                    {aiExtracting && <Spinner size={16} className="me-2" />}
                    <Sparkles className="w-4 h-4 me-1.5" />
                    {aiExtracting ? 'מחלץ הנחיות...' : 'חלץ הנחיות'}
                  </Button>
                </div>
              )}

              {/* Instructions table */}
              {(extractionMethod === 'manual' || discussionInstructions.length > 0) && (
                <div>
                  <div className="border border-gray-200 rounded-lg overflow-x-auto" ref={dropdownRef}>
                    <table className="w-full text-sm" style={{ minWidth: 820 }}>
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs font-medium text-text-secondary">
                          <th className="px-3 py-2.5 text-start font-medium" style={{ width: '20%' }}>שם ההנחיה</th>
                          <th className="px-3 py-2.5 text-start font-medium" style={{ width: '18%' }}>תיאור מתומצת</th>
                          <th className="px-3 py-2.5 text-start font-medium" style={{ width: '16%' }}>אחראי</th>
                          <th className="px-3 py-2.5 text-start font-medium" style={{ width: '16%' }}>תג״ב</th>
                          <th className="px-3 py-2.5 text-start font-medium" style={{ width: '15%' }}>הערות וקישורים</th>
                          <th className="px-1 py-2.5" style={{ width: '3%' }} />
                        </tr>
                      </thead>
                      <tbody>
                        {discussionInstructions.map((row) => {
                          const dueDateLabel = DUE_DATE_TYPES.find((d) => d.value === row.dueDateType)?.label || 'שוטף';
                          return (
                            <tr key={row.id} className="border-b border-gray-100 last:border-b-0 align-top">
                              {/* שם ההנחיה */}
                              <td className="px-3 py-2">
                                <input
                                  type="text"
                                  value={row.title}
                                  onChange={(e) => updateDiscussionRow(row.id, 'title', e.target.value)}
                                  placeholder="שם ההנחיה"
                                  className="w-full h-8 rounded-md border border-gray-200 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary bg-white"
                                  dir="rtl"
                                />
                              </td>

                              {/* תיאור מתומצת */}
                              <td className="px-3 py-2">
                                <input
                                  type="text"
                                  value={row.description}
                                  onChange={(e) => updateDiscussionRow(row.id, 'description', e.target.value)}
                                  placeholder="תיאור קצר"
                                  className="w-full h-8 rounded-md border border-gray-200 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary bg-white"
                                  dir="rtl"
                                />
                              </td>

                              {/* אחראי — multi-select chips */}
                              <td className="px-3 py-2">
                                <div className="relative">
                                  <div
                                    className="flex items-center gap-1 flex-wrap min-h-[32px] rounded-md border border-gray-200 px-2 py-1 cursor-pointer bg-white"
                                    onClick={() =>
                                      setOpenDropdown(openDropdown === `${row.id}-assignee` ? null : `${row.id}-assignee`)
                                    }
                                  >
                                    {row.assigneeIds.length === 0 && (
                                      <span className="text-xs text-text-disabled">בחר...</span>
                                    )}
                                    {row.assigneeIds.map((aId) => {
                                      const member = availableMembers.find((m) => m.id === aId);
                                      if (!member) return null;
                                      return (
                                        <span
                                          key={aId}
                                          className="inline-flex items-center gap-0.5 bg-blue-50 text-blue-700 text-[10px] px-1.5 py-0.5 rounded"
                                        >
                                          {member.name}
                                          <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); toggleRowAssignee(row.id, aId); }}
                                            className="hover:text-error cursor-pointer"
                                          >
                                            <X className="w-2.5 h-2.5" />
                                          </button>
                                        </span>
                                      );
                                    })}
                                  </div>
                                  {openDropdown === `${row.id}-assignee` && (
                                    <div className="absolute top-full mt-1 end-0 z-50 bg-paper rounded-lg shadow-xl border border-gray-200 py-1 min-w-[160px] max-h-36 overflow-y-auto">
                                      {availableMembers.map((m) => (
                                        <button
                                          key={m.id}
                                          type="button"
                                          onClick={() => toggleRowAssignee(row.id, m.id)}
                                          className={cn(
                                            'w-full px-3 py-1.5 text-xs text-start hover:bg-gray-50 cursor-pointer flex items-center gap-2 transition-colors',
                                            row.assigneeIds.includes(m.id) && 'bg-primary/5 text-primary font-medium'
                                          )}
                                        >
                                          {row.assigneeIds.includes(m.id) && <Check className="w-3 h-3" />}
                                          {m.name}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* תג"ב — badge + date */}
                              <td className="px-3 py-2">
                                <div className="flex items-center gap-1.5">
                                  <div className="relative">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setOpenDropdown(openDropdown === `${row.id}-due` ? null : `${row.id}-due`)
                                      }
                                      className={cn(
                                        'inline-flex items-center gap-0.5 px-2 py-1 rounded-full text-[10px] font-medium transition-colors cursor-pointer whitespace-nowrap',
                                        row.dueDateType === 'routine'
                                          ? 'bg-blue-100 text-blue-700'
                                          : row.dueDateType === 'immediate'
                                            ? 'bg-amber-100 text-amber-700'
                                            : 'bg-gray-100 text-text-primary'
                                      )}
                                    >
                                      {dueDateLabel}
                                      <ChevronDown className="w-2.5 h-2.5" />
                                    </button>
                                    {openDropdown === `${row.id}-due` && (
                                      <div className="absolute top-full mt-1 start-0 z-50 bg-paper rounded-lg shadow-xl border border-gray-200 py-1 min-w-[100px]">
                                        {DUE_DATE_TYPES.map((opt) => (
                                          <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => { updateDiscussionRow(row.id, 'dueDateType', opt.value); setOpenDropdown(null); }}
                                            className={cn(
                                              'w-full px-3 py-1.5 text-xs text-start hover:bg-gray-50 cursor-pointer transition-colors',
                                              row.dueDateType === opt.value && 'bg-primary/5 text-primary font-medium'
                                            )}
                                          >
                                            {opt.label}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  {row.dueDateType === 'routine' && (
                                    <input
                                      type="date"
                                      value={row.dueDate}
                                      onChange={(e) => updateDiscussionRow(row.id, 'dueDate', e.target.value)}
                                      className="h-7 rounded border border-gray-200 px-1 text-[10px] focus:outline-none focus:ring-1 focus:ring-primary/30 w-[100px]"
                                    />
                                  )}
                                  {row.dueDateType === 'date' && (
                                    <input
                                      type="date"
                                      value={row.dueDate}
                                      onChange={(e) => updateDiscussionRow(row.id, 'dueDate', e.target.value)}
                                      className="h-7 rounded border border-gray-200 px-1 text-[10px] focus:outline-none focus:ring-1 focus:ring-primary/30 w-[100px]"
                                    />
                                  )}
                                </div>
                              </td>

                              {/* הערות וקישורים */}
                              <td className="px-3 py-2">
                                <input
                                  type="text"
                                  value={row.notes}
                                  onChange={(e) => updateDiscussionRow(row.id, 'notes', e.target.value)}
                                  placeholder="הערות..."
                                  className="w-full h-8 rounded-md border border-gray-200 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 bg-white"
                                  dir="rtl"
                                />
                              </td>

                              {/* Delete */}
                              <td className="px-1 py-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => removeDiscussionRow(row.id)}
                                  className="p-1 text-text-disabled hover:text-error rounded cursor-pointer transition-colors"
                                  aria-label="מחק שורה"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        {discussionInstructions.length === 0 && (
                          <tr>
                            <td colSpan={7} className="px-3 py-8 text-center text-sm text-text-disabled">
                              אין הנחיות עדיין — הוסף שורה או חלץ מטקסט
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Add row button — bottom end */}
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={addDiscussionRow}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 transition-colors cursor-pointer shadow-sm"
                      aria-label="הוסף שורה"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>

      {/* Footer */}
      <div className="flex items-center gap-2 px-6 pb-5 pt-2">
        {discussionStep === 1 && (
          <Button
            type="button"
            onClick={() => setDiscussionStep(2)}
            disabled={!discussionName.trim()}
          >
            המשך
          </Button>
        )}
        {discussionStep === 2 && (
          <>
            <Button
              type="button"
              onClick={handleSubmitDiscussion}
              disabled={
                discussionInstructions.length === 0 ||
                discussionInstructions.some((r) => !r.title.trim()) ||
                createMutation.isPending
              }
            >
              {createMutation.isPending && <Spinner size={16} className="me-2" />}
              {createMutation.isPending ? 'שומר...' : 'שמור'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setDiscussionStep(1)}>
              חזור
            </Button>
          </>
        )}
      </div>
    </>
  );
}

/* ─── Helper Components ─── */

function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  onClose: () => void,
  active: boolean
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

function FieldWithCounter({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  autoFocus,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  maxLength: number;
  autoFocus?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-1.5 text-end">{label}</label>
      <div className="relative">
        <input
          type="text"
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= maxLength) onChange(e.target.value);
          }}
          placeholder={placeholder}
          className="flex h-9 w-full rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm transition-colors placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          dir="rtl"
        />
        <span className="absolute start-3 top-1/2 -translate-y-1/2 text-xs text-text-disabled pointer-events-none">
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
      className="p-1.5 rounded hover:bg-gray-200 text-text-secondary transition-colors cursor-pointer"
      aria-label={label}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

function DiscussionStepIndicator({
  step,
  current,
  label,
}: {
  step: number;
  current: number;
  label: string;
}) {
  const isCompleted = current > step;
  const isActive = current >= step;
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
          isCompleted
            ? 'bg-green-500 text-white'
            : isActive
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-text-disabled'
        )}
      >
        {isCompleted ? <Check className="w-4 h-4" /> : step}
      </div>
      <span className={cn('text-sm', isActive ? 'text-text-primary font-medium' : 'text-text-disabled')}>
        {label}
      </span>
    </div>
  );
}
