import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import {
  Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter,
  Button, Input, Spinner, useToast,
} from '@/components/ui';
import {
  Check, ChevronDown, X, Search, UserPlus,
  Briefcase, Megaphone, BookOpen, Code,
  Globe, Landmark, Lightbulb, Shield, Rocket,
  Building2, GraduationCap, Swords,
} from 'lucide-react';
import { useCreateEnvironment } from '@/hooks/useEnvironments';
import { mockUserSummaries } from '@/mocks/data';

/* ─── Types ─── */

interface EnvironmentFormData {
  name: string;
  iconName: string;
  managerIds: string[];
}

const INITIAL_FORM: EnvironmentFormData = {
  name: '',
  iconName: 'Briefcase',
  managerIds: [],
};

/* ─── Unit Icons ─── */

const UNIT_OPTIONS: { name: string; label: string; Icon: React.ElementType }[] = [
  { name: 'Briefcase', label: 'מטה כללי', Icon: Briefcase },
  { name: 'Shield', label: 'אגף מבצעים', Icon: Shield },
  { name: 'Swords', label: 'פיקוד צפון', Icon: Swords },
  { name: 'Rocket', label: 'חיל האוויר', Icon: Rocket },
  { name: 'Globe', label: 'חיל הים', Icon: Globe },
  { name: 'Landmark', label: 'אגף התכנון', Icon: Landmark },
  { name: 'Lightbulb', label: 'אגף המודיעין', Icon: Lightbulb },
  { name: 'Code', label: 'אגף התקשוב', Icon: Code },
  { name: 'Building2', label: 'בסיס אימונים', Icon: Building2 },
  { name: 'GraduationCap', label: 'בי"ס לקצינים', Icon: GraduationCap },
  { name: 'BookOpen', label: 'מרכז הדרכה', Icon: BookOpen },
  { name: 'Megaphone', label: 'דובר צה"ל', Icon: Megaphone },
];

function getIconComponent(name: string): React.ElementType {
  return UNIT_OPTIONS.find((o) => o.name === name)?.Icon || Briefcase;
}

function getIconLabel(name: string): string {
  return UNIT_OPTIONS.find((o) => o.name === name)?.label || name;
}

/* ─── Props ─── */

interface CreateEnvironmentDialogProps {
  open: boolean;
  onClose: () => void;
}

/* ─── Main Dialog ─── */

export function CreateEnvironmentDialog({ open, onClose }: CreateEnvironmentDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<EnvironmentFormData>(INITIAL_FORM);
  const [nameTouched, setNameTouched] = useState(false);
  const createMutation = useCreateEnvironment();
  const toast = useToast();

  const updateForm = (patch: Partial<EnvironmentFormData>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setNameTouched(false);
    setStep(1);
  };

  // Reset when dialog closes
  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  const handleClose = () => {
    if (!createMutation.isPending) onClose();
  };

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync({
        name: form.name.trim(),
      });
      toast.success('הבקשה ליצירת סביבה נשלחה בהצלחה! יצירתה ממתין לאישור.');
      onClose();
    } catch {
      toast.error('תקלה בשליחת הבקשה. נסו שוב.');
    }
  };

  const nameValid = form.name.trim().length > 0;
  const nameError = nameTouched && !nameValid;

  return (
    <Dialog open={open} onClose={handleClose} size="sm">
      {/* Progress indicator */}
      <div className="px-6 pt-5 pb-0">
        <StepIndicator currentStep={step} totalSteps={2} />
      </div>

      {step === 1 ? (
        <StepDetails
          form={form}
          updateForm={updateForm}
          nameError={nameError}
          nameValid={nameValid}
          onNameBlur={() => setNameTouched(true)}
          onCancel={handleClose}
          onContinue={() => setStep(2)}
          onReset={resetForm}
        />
      ) : (
        <StepManagers
          form={form}
          updateForm={updateForm}
          onBack={() => setStep(1)}
          onCreate={handleCreate}
          onReset={resetForm}
          isPending={createMutation.isPending}
        />
      )}
    </Dialog>
  );
}

/* ─── Step Indicator ─── */

function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;
        return (
          <div key={stepNum} className="flex items-center gap-2 flex-1">
            <div
              className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors shrink-0',
                isCompleted
                  ? 'bg-green-500 text-white'
                  : isActive
                    ? 'gradient-primary text-white'
                    : 'bg-gray-200 text-text-disabled'
              )}
            >
              {isCompleted ? <Check className="w-3.5 h-3.5" /> : stepNum}
            </div>
            {i < totalSteps - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 rounded-full transition-colors',
                  isCompleted ? 'bg-green-500' : 'bg-gray-200'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Searchable Unit Dropdown ─── */

interface UnitDropdownProps {
  selectedIcon: string;
  onSelectIcon: (name: string) => void;
}

function UnitDropdown({ selectedIcon, onSelectIcon }: UnitDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      setSearch('');
    }
  }, [open]);

  const filtered = search.trim()
    ? UNIT_OPTIONS.filter((opt) => opt.label.includes(search.trim()))
    : UNIT_OPTIONS;

  const SelectedIconComp = getIconComponent(selectedIcon);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-3 w-full h-10 rounded-lg border px-3 text-sm transition-colors cursor-pointer',
          open
            ? 'border-primary ring-2 ring-primary/30'
            : 'border-gray-300 hover:border-gray-400'
        )}
      >
        <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white shrink-0">
          <SelectedIconComp className="w-3.5 h-3.5" />
        </div>
        <span className="flex-1 text-start truncate">{getIconLabel(selectedIcon)}</span>
        <ChevronDown className={cn('w-4 h-4 text-text-secondary shrink-0 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute top-full mt-1 w-full z-40 bg-white rounded-lg shadow-xl border border-gray-200 py-1">
          {/* Search input */}
          <div className="px-2 py-1.5">
            <div className="relative">
              <Search className="absolute start-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-disabled pointer-events-none" />
              <input
                ref={searchRef}
                type="text"
                placeholder="חיפוש יחידה..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-8 rounded-md border border-gray-200 ps-8 pe-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-3 py-3 text-sm text-text-disabled text-center">לא נמצאו תוצאות</p>
            ) : (
              filtered.map(({ name, label, Icon }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => { onSelectIcon(name); setOpen(false); }}
                  className={cn(
                    'flex items-center gap-3 w-full px-3 py-2 text-sm text-start hover:bg-gray-50 transition-colors cursor-pointer',
                    name === selectedIcon && 'bg-primary/5 text-primary font-medium'
                  )}
                >
                  <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span>{label}</span>
                  {name === selectedIcon && <Check className="w-4 h-4 ms-auto text-primary" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Step 1: פרטי המערך ─── */

interface StepDetailsProps {
  form: EnvironmentFormData;
  updateForm: (patch: Partial<EnvironmentFormData>) => void;
  nameError: boolean;
  nameValid: boolean;
  onNameBlur: () => void;
  onCancel: () => void;
  onContinue: () => void;
  onReset: () => void;
}

function StepDetails({
  form, updateForm, nameError, nameValid, onNameBlur, onCancel, onContinue, onReset,
}: StepDetailsProps) {
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => nameRef.current?.focus(), 100);
  }, []);

  const IconComp = getIconComponent(form.iconName);

  return (
    <>
      <DialogHeader>
        <DialogTitle>פרטי המערך</DialogTitle>
        <p className="text-sm text-text-secondary mt-1">
          הגדירו את שם הסביבה ובחרו סמל יחידה.
        </p>
      </DialogHeader>

      <DialogContent>
        <div className="space-y-5">
          {/* Environment Name */}
          <div>
            <label htmlFor="env-name" className="block text-sm font-medium text-text-primary mb-1.5">
              שם המערך <span className="text-error">*</span>
            </label>
            <Input
              ref={nameRef}
              id="env-name"
              placeholder='לדוגמה: גדוד 101 — מערך הנחיות'
              value={form.name}
              onChange={(e) => updateForm({ name: e.target.value })}
              onBlur={onNameBlur}
              maxLength={255}
              className={cn(nameError && 'border-error focus:ring-error/30 focus:border-error')}
              aria-invalid={nameError}
            />
            {nameError && (
              <p className="text-xs text-error mt-1">יש להזין שם לסביבה</p>
            )}
          </div>

          {/* Unit Icon Dropdown */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              סמל יחידה
            </label>
            <UnitDropdown
              selectedIcon={form.iconName}
              onSelectIcon={(name) => updateForm({ iconName: name })}
            />
          </div>

          {/* Preview Card (dashed border) */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
            <p className="text-xs font-semibold text-text-secondary mb-3 uppercase tracking-wider">
              תצוגה מקדימה
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white shrink-0">
                <IconComp className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-text-primary text-sm truncate">
                  {form.name || 'שם המערך'}
                </h4>
                <p className="text-xs text-text-secondary mt-0.5">
                  {getIconLabel(form.iconName)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      <DialogFooter className="justify-between">
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          נקה טופס
        </Button>
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            ביטול
          </Button>
          <Button type="button" disabled={!nameValid} onClick={onContinue}>
            המשך
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}

/* ─── Step 2: בעלי תפקידים ─── */

interface StepManagersProps {
  form: EnvironmentFormData;
  updateForm: (patch: Partial<EnvironmentFormData>) => void;
  onBack: () => void;
  onCreate: () => void;
  onReset: () => void;
  isPending: boolean;
}

function StepManagers({ form, updateForm, onBack, onCreate, onReset, isPending }: StepManagersProps) {
  const users = mockUserSummaries;
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!searchOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [searchOpen]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      setSearch('');
    }
  }, [searchOpen]);

  const availableUsers = users.filter(
    (u) => !form.managerIds.includes(u.id) &&
      (search.trim() === '' || u.name.includes(search.trim()))
  );

  const selectedManagers = users.filter((u) => form.managerIds.includes(u.id));

  const addManager = (userId: string) => {
    updateForm({ managerIds: [...form.managerIds, userId] });
    setSearchOpen(false);
    setSearch('');
  };

  const removeManager = (userId: string) => {
    updateForm({ managerIds: form.managerIds.filter((id) => id !== userId) });
  };

  const hasManagers = form.managerIds.length > 0;

  return (
    <>
      <DialogHeader>
        <DialogTitle>מנהלי סביבה</DialogTitle>
        <p className="text-sm text-text-secondary mt-1">
          בחרו מי ינהל את הסביבה.
        </p>
      </DialogHeader>

      <DialogContent>
        <div className="space-y-4">
          {/* Manager search */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              מנהלי סביבה
            </label>

            <div ref={ref} className="relative">
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className={cn(
                  'flex items-center gap-2 w-full h-10 rounded-lg border px-3 text-sm transition-colors cursor-pointer',
                  searchOpen
                    ? 'border-primary ring-2 ring-primary/30'
                    : 'border-gray-300 hover:border-gray-400'
                )}
              >
                <UserPlus className="w-4 h-4 text-text-disabled shrink-0" />
                <span className="text-text-disabled">הוסיפו מנהל סביבה...</span>
                <ChevronDown className={cn('w-4 h-4 text-text-secondary shrink-0 ms-auto transition-transform', searchOpen && 'rotate-180')} />
              </button>

              {searchOpen && (
                <div className="absolute top-full mt-1 w-full z-40 bg-white rounded-lg shadow-xl border border-gray-200 py-1">
                  <div className="px-2 py-1.5">
                    <div className="relative">
                      <Search className="absolute start-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-disabled pointer-events-none" />
                      <input
                        ref={searchRef}
                        type="text"
                        placeholder="חיפוש לפי שם..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-8 rounded-md border border-gray-200 ps-8 pe-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="max-h-40 overflow-y-auto">
                    {availableUsers.length === 0 ? (
                      <p className="px-3 py-3 text-sm text-text-disabled text-center">לא נמצאו משתמשים</p>
                    ) : (
                      availableUsers.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => addManager(user.id)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-start hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <UserInitials name={user.name} size={24} />
                          <span>{user.name}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Selected managers as tags */}
          {selectedManagers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedManagers.map((user) => (
                <span
                  key={user.id}
                  className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-sm font-medium px-3 py-1.5 rounded-full"
                >
                  <UserInitials name={user.name} size={20} />
                  {user.name}
                  <button
                    type="button"
                    onClick={() => removeManager(user.id)}
                    className="hover:text-primary/70 cursor-pointer ms-0.5"
                    aria-label={`הסרת ${user.name}`}
                    disabled={isPending}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Preview Card (dashed border) */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
            <p className="text-xs font-semibold text-text-secondary mb-3 uppercase tracking-wider">
              תצוגה מקדימה
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white shrink-0">
                {(() => {
                  const IconComp = getIconComponent(form.iconName);
                  return <IconComp className="w-5 h-5" />;
                })()}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-text-primary text-sm truncate">
                  {form.name || 'שם המערך'}
                </h4>
                <div className="text-xs text-text-secondary mt-0.5">
                  {hasManagers ? (
                    <span>{selectedManagers.map((u) => u.name).join(', ')}</span>
                  ) : (
                    <span className="text-text-disabled">טרם שובצו מנהלים</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      <DialogFooter className="justify-between">
        <Button type="button" variant="ghost" size="sm" onClick={onReset} disabled={isPending}>
          נקה טופס
        </Button>
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" onClick={onBack} disabled={isPending}>
            חזרה
          </Button>
          <Button
            type="button"
            disabled={!hasManagers || isPending}
            onClick={onCreate}
          >
            {isPending && <Spinner size={18} className="me-2" />}
            {isPending ? 'שולח בקשה...' : 'שלח בקשה'}
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}

/* ─── User Initials Avatar ─── */

const AVATAR_COLORS = [
  '#3f51b5', '#7c4dff', '#e91e63', '#009688',
  '#ff5722', '#795548', '#607d8b', '#4caf50',
];

function UserInitials({ name, size = 28 }: { name: string; size?: number }) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  const parts = name.split(' ').filter(Boolean);
  const initials = parts.length >= 2 ? parts[0][0] + parts[1][0] : name.substring(0, 2);

  return (
    <div
      className="rounded-full flex items-center justify-center font-semibold text-white shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.38, backgroundColor: color }}
    >
      {initials}
    </div>
  );
}
