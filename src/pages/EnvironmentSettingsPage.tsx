import { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Settings, Shield, User as UserIcon,
  Plus, X, Trash2, Users, Search, Edit2, Check,
  UserPlus, Upload, Mail,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEnvironment, useResponsibleGroups, useCreateResponsibleGroup, useUpdateResponsibleGroup, useDeleteResponsibleGroup } from '@/hooks/useEnvironments';
import { EnvironmentTopbar } from '@/components/environment/EnvironmentSidebar';
import { LoadingState, ErrorState } from '@/components/common';
import type { MemberRole } from '@/types';
import { ROLE_LABELS } from '@/types';

// ─── Mock data ───
const MOCK_MEMBERS = [
  { id: 'u1-aaaa-bbbb-cccc-dddddddddddd', name: 'סא"ל כהן', email: 'yael@example.com', role: 'manager' as MemberRole },
  { id: 'u2-aaaa-bbbb-cccc-dddddddddddd', name: 'רס"ן לוי', email: 'avi@example.com', role: 'manager' as MemberRole },
  { id: 'u3-aaaa-bbbb-cccc-dddddddddddd', name: 'סרן מזרחי', email: 'dana@example.com', role: 'responsible' as MemberRole },
  { id: 'u4-aaaa-bbbb-cccc-dddddddddddd', name: 'רב"ט ישראלי', email: 'moshe@example.com', role: 'responsible' as MemberRole },
  { id: 'u5-aaaa-bbbb-cccc-dddddddddddd', name: 'סמ"ר ברק', email: 'noa@example.com', role: 'responsible' as MemberRole },
];

type SettingsTab = 'general' | 'assignees' | 'permissions';

const TABS: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { key: 'general', label: 'הגדרות כלליות', icon: <Settings size={16} /> },
  { key: 'assignees', label: 'מקבלי הנחיות', icon: <Users size={16} /> },
  { key: 'permissions', label: 'הרשאות סגל', icon: <Shield size={16} /> },
];

export function EnvironmentSettingsPage() {
  const { envId } = useParams<{ envId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  const { data: environment, isLoading, isError, refetch } = useEnvironment(envId || '');

  if (isLoading) {
    return <div className="min-h-screen bg-white"><LoadingState message="טוען פרמטרים..." /></div>;
  }

  if (isError || !environment) {
    return <div className="min-h-screen bg-white"><ErrorState message="תקלה בטעינת הפרמטרים" onRetry={() => refetch()} /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Environment top bar */}
      <EnvironmentTopbar
        environmentName={environment.name}
        activeItem="settings"
        onItemChange={(item) => {
          if (item === 'instructions' || item === 'home') {
            navigate(`/env/${envId}`);
          }
        }}
      />

      {/* Page header */}
      <div className="bg-paper border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-2.5 gap-4">
          <h1 className="text-[30px] font-bold text-text-primary">הגדרות הסביבה</h1>
          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-disabled" />
            <input
              type="text"
              placeholder="חיפוש..."
              aria-label="חיפוש בפרמטרים"
              className="w-[220px] ps-9 pe-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 focus:bg-paper focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-8">
        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-100 mb-10">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer',
                activeTab === tab.key
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'general' && <GeneralTab envName={environment.name} envDescription={environment.description} />}
        {activeTab === 'assignees' && <AssigneesTab envId={envId || ''} />}
        {activeTab === 'permissions' && <PermissionsTab envId={envId || ''} />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// Tab 1: הגדרות כלליות (General Settings)
// ═══════════════════════════════════════════════
function GeneralTab({ envName, envDescription }: { envName: string; envDescription: string | null }) {
  const [name, setName] = useState(envName);
  const [description, setDescription] = useState(envDescription || '');

  return (
    <div className="space-y-10">
      <SectionHeader title="פרטים כלליים" subtitle="שם הסביבה, תיאור וסמל" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 max-w-2xl">
        <div className="col-span-2">
          <FieldLabel>שם הסביבה</FieldLabel>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 transition-all max-w-sm"
            maxLength={100}
          />
        </div>

        <div className="col-span-2">
          <FieldLabel>סמל / אייקון</FieldLabel>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-indigo-300 transition-colors cursor-pointer max-w-sm">
            <Upload className="w-8 h-8 mx-auto text-slate-300 mb-3" />
            <p className="text-sm text-slate-500">
              לחץ או גרור קובץ להעלאת סמל
            </p>
            <p className="text-xs text-slate-400 mt-1.5">
              PNG, JPG עד 2MB
            </p>
          </div>
        </div>

        <div className="col-span-2">
          <FieldLabel>תיאור</FieldLabel>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm text-slate-700 outline-none focus:border-indigo-500 transition-all resize-none"
            placeholder="תיאור מטרת הסביבה..."
            maxLength={500}
          />
        </div>
      </div>

      <div className="pt-4">
        <button className="bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all active:scale-95 cursor-pointer">
          שמור שינויים
        </button>
      </div>

      {/* Danger zone */}
      <div className="border-t border-slate-100 pt-10 mt-10">
        <SectionHeader title="אזור מסוכן" subtitle="פעולות בלתי הפיכות" />
        <div className="flex items-center justify-between bg-rose-50 border border-rose-100 rounded-lg p-4 mt-6">
          <div>
            <p className="text-sm font-bold text-slate-900">ביטול סביבה</p>
            <p className="text-xs text-slate-500 mt-0.5">פעולה זו תבטל את הסביבה וכל ההנחיות בה לצמיתות</p>
          </div>
          <button className="bg-white border border-rose-200 text-rose-600 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-rose-50 transition-all cursor-pointer">
            בטל סביבה
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// Tab 2: מקבלי הנחיות (Assignees / Recipients)
// ═══════════════════════════════════════════════
function AssigneesTab({ envId }: { envId: string }) {
  const [searchQuery, setSearchQuery] = useState('');

  // ── Group modal state ──
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [groupName, setGroupName] = useState('');
  const [groupMembers, setGroupMembers] = useState<{ id: string; name: string; email: string }[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // ── Responsible Groups (API-backed) ──
  const { data: responsibleGroups = [] } = useResponsibleGroups(envId);
  const createGroupMutation = useCreateResponsibleGroup(envId);
  const updateGroupMutation = useUpdateResponsibleGroup(envId);
  const deleteGroupMutation = useDeleteResponsibleGroup(envId);

  // Filter groups by search
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return responsibleGroups;
    return responsibleGroups.filter((g) =>
      g.nickname.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [responsibleGroups, searchQuery]);

  // ── Group modal helpers ──
  const openCreateModal = () => {
    setEditingGroupId(null);
    setGroupName('');
    setGroupMembers([]);
    setGroupModalOpen(true);
  };

  const openEditModal = (group: typeof responsibleGroups[number]) => {
    setEditingGroupId(group.id);
    setGroupName(group.nickname);
    setGroupMembers(group.members.map((m) => ({ id: m.id, name: m.name, email: '' })));
    setGroupModalOpen(true);
  };

  const closeGroupModal = () => {
    setGroupModalOpen(false);
    setEditingGroupId(null);
    setGroupName('');
    setGroupMembers([]);
  };

  const handleSaveGroup = () => {
    if (!groupName.trim() || groupMembers.length === 0) return;
    const payload = { nickname: groupName.trim(), user_ids: groupMembers.map((m) => m.id) };

    if (editingGroupId) {
      updateGroupMutation.mutate(
        { groupId: editingGroupId, data: payload },
        { onSuccess: closeGroupModal }
      );
    } else {
      createGroupMutation.mutate(payload, { onSuccess: closeGroupModal });
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    deleteGroupMutation.mutate(groupId, {
      onSuccess: () => setDeleteConfirmId(null),
    });
  };

  const addMemberByEmail = (email: string) => {
    if (groupMembers.some((m) => m.email === email)) return;
    const newMember = {
      id: crypto.randomUUID(),
      name: email.split('@')[0],
      email,
    };
    setGroupMembers((prev) => [...prev, newMember]);
  };

  const removeMember = (id: string) => {
    setGroupMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const isSaving = createGroupMutation.isPending || updateGroupMutation.isPending;

  return (
    <div className="space-y-8">
      {/* Header with search + create button */}
      <div className="flex items-center justify-between">
        <SectionHeader
          title="קבוצות אחראים"
          subtitle='הגדר קבוצות אחראים כמאגר שיוך להנחיות. האחראים יראו רק את ההנחיות ששויכו אליהם בסביבה האישית שלהם, ללא גישה להגדרות הסביבה.'
        />
        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all cursor-pointer shrink-0"
        >
          <Plus size={16} />
          הוספת קבוצה
        </button>
      </div>

      {/* Search bar */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="חיפוש קבוצה..."
          className="w-full bg-white border border-slate-200 ps-9 pe-3 py-2 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
        />
      </div>

      {/* Empty State */}
      {responsibleGroups.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <Users size={28} className="text-indigo-400" />
          </div>
          <p className="text-base font-bold text-slate-700 mb-1">לא הוגדרו קבוצות אחראים</p>
          <p className="text-sm text-slate-400 mb-6 max-w-xs mx-auto">
            צור קבוצות אחראים כדי לשייך אליהן הנחיות. האחראים יראו רק את ההנחיות שלהם בסביבה האישית
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all cursor-pointer"
          >
            <Plus size={16} />
            צור קבוצה חדשה
          </button>
        </div>
      )}

      {/* Group Cards */}
      {filteredGroups.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow group"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shrink-0">
                    <Users size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{group.nickname}</h4>
                    <span className="text-xs text-slate-400">{group.members.length} משתמשים</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(group)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                    aria-label="ערוך קבוצה"
                  >
                    <Edit2 size={14} />
                  </button>
                  {deleteConfirmId === group.id ? (
                    <div className="flex items-center gap-1 ms-1">
                      <button
                        onClick={() => handleDeleteGroup(group.id)}
                        className="p-1.5 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
                        aria-label="אשר מחיקה"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
                        aria-label="בטל מחיקה"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(group.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                      aria-label="מחק קבוצה"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Members Preview */}
              <div className="border-t border-slate-100 pt-3">
                {group.members.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {group.members.slice(0, 4).map((member) => (
                      <span
                        key={member.id}
                        className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-600 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-100"
                      >
                        <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                          <UserIcon size={9} className="text-slate-500" />
                        </div>
                        {member.name}
                      </span>
                    ))}
                    {group.members.length > 4 && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold text-slate-400 bg-slate-50 border border-slate-100">
                        +{group.members.length - 4}
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">אין משתמשים בקבוצה</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No results from search */}
      {responsibleGroups.length > 0 && filteredGroups.length === 0 && (
        <div className="text-center py-10 text-sm text-slate-400">
          לא נמצאו קבוצות התואמות לחיפוש
        </div>
      )}

      {/* ── Group Create/Edit Modal ── */}
      {groupModalOpen && (
        <GroupModal
          isEditing={!!editingGroupId}
          groupName={groupName}
          onGroupNameChange={setGroupName}
          members={groupMembers}
          onAddMember={addMemberByEmail}
          onRemoveMember={removeMember}
          onSave={handleSaveGroup}
          onClose={closeGroupModal}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════
// Tab 3: הרשאות סגל (Permissions & Staff)
// ═══════════════════════════════════════════════
function PermissionsTab({ envId: _envId }: { envId: string }) {
  const [managers, setManagers] = useState(
    MOCK_MEMBERS.filter((m) => m.role === 'manager')
  );
  const [showAddManager, setShowAddManager] = useState(false);
  const [newManagerEmail, setNewManagerEmail] = useState('');

  const handleAddManager = () => {
    if (!newManagerEmail.trim()) return;
    const newManager = {
      id: crypto.randomUUID(),
      name: newManagerEmail.split('@')[0],
      email: newManagerEmail,
      role: 'manager' as MemberRole,
    };
    setManagers((prev) => [...prev, newManager]);
    setNewManagerEmail('');
    setShowAddManager(false);
  };

  const handleRemoveManager = (managerId: string) => {
    setManagers((prev) => prev.filter((m) => m.id !== managerId));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <SectionHeader title="מנהלי הסביבה" subtitle="רק משתמשים המופיעים כאן רשאים לצפות בהגדרות הסביבה, לערוך אותן ולנהל את המערכת" />
        <button
          onClick={() => setShowAddManager(true)}
          className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all cursor-pointer"
        >
          <Plus size={16} />
          הוסף מנהל
        </button>
      </div>

      {/* Add manager inline form */}
      {showAddManager && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-end gap-3">
          <div className="flex-1">
            <FieldLabel>אימייל</FieldLabel>
            <input
              value={newManagerEmail}
              onChange={(e) => setNewManagerEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm outline-none focus:border-indigo-500 transition-all"
            />
          </div>
          <button
            onClick={handleAddManager}
            disabled={!newManagerEmail.trim()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all cursor-pointer disabled:opacity-50"
          >
            הוסף
          </button>
          <button
            onClick={() => setShowAddManager(false)}
            className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Managers table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_140px_48px] gap-2 bg-slate-50 px-4 py-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
          <span>שם</span>
          <span>אימייל</span>
          <span>תפקיד</span>
          <span />
        </div>

        {managers.map((manager) => (
          <div
            key={manager.id}
            className="grid grid-cols-[1fr_1fr_140px_48px] gap-2 px-4 py-3 border-b border-slate-100 last:border-b-0 items-center"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200 shrink-0">
                <UserIcon size={14} />
              </div>
              <span className="text-sm font-medium text-slate-800 truncate">{manager.name}</span>
            </div>

            <span className="text-sm text-slate-500 truncate">{manager.email}</span>

            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-amber-50 text-amber-700 border-amber-100 w-fit">
              {ROLE_LABELS.manager}
            </span>

            <div className="text-center">
              <button
                onClick={() => handleRemoveManager(manager.id)}
                className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                aria-label="הסר מנהל"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// Group Create/Edit Modal (email-based)
// ═══════════════════════════════════════════════
function GroupModal({
  isEditing,
  groupName,
  onGroupNameChange,
  members,
  onAddMember,
  onRemoveMember,
  onSave,
  onClose,
  isSaving,
}: {
  isEditing: boolean;
  groupName: string;
  onGroupNameChange: (v: string) => void;
  members: { id: string; name: string; email: string }[];
  onAddMember: (email: string) => void;
  onRemoveMember: (id: string) => void;
  onSave: () => void;
  onClose: () => void;
  isSaving: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [emailInput, setEmailInput] = useState('');

  // Focus input on open
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const isValidEmail = emailInput.includes('@') && emailInput.includes('.');
  const isValid = groupName.trim().length > 0 && members.length > 0;

  const handleAddEmail = () => {
    if (!isValidEmail) return;
    onAddMember(emailInput.trim());
    setEmailInput('');
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              {isEditing ? <Edit2 size={16} /> : <UserPlus size={16} />}
            </div>
            <h2 className="text-base font-bold text-slate-900">
              {isEditing ? 'עריכת קבוצה' : 'יצירת קבוצה חדשה'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">שם הקבוצה</label>
            <input
              ref={inputRef}
              value={groupName}
              onChange={(e) => onGroupNameChange(e.target.value)}
              placeholder='לדוגמה: מג"ד, צוות תפעול...'
              className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
              maxLength={50}
            />
          </div>

          {/* Add member by email */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">הוספת משתמש לפי אימייל</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Mail size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={handleEmailKeyDown}
                  placeholder="user@example.com"
                  className="w-full bg-slate-50 border border-slate-200 ps-9 pe-3 py-2.5 rounded-xl text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
                  dir="ltr"
                />
              </div>
              <button
                onClick={handleAddEmail}
                disabled={!isValidEmail}
                className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <Plus size={14} />
                הוסף
              </button>
            </div>
          </div>

          {/* Members pills */}
          {members.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                חברי הקבוצה ({members.length})
              </label>
              <div className="flex flex-wrap gap-1.5">
                {members.map((member) => (
                  <span
                    key={member.id}
                    className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-xs font-bold border border-indigo-100"
                  >
                    {member.email || member.name}
                    <button
                      onClick={() => onRemoveMember(member.id)}
                      className="hover:text-indigo-900 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          {/* Validation hint */}
          <span className="text-xs text-slate-400">
            {members.length === 0 ? 'יש להוסיף לפחות משתמש אחד' : ''}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              ביטול
            </button>
            <button
              onClick={onSave}
              disabled={!isValid || isSaving}
              className="flex items-center gap-1.5 bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Check size={16} />
              )}
              {isEditing ? 'עדכון' : 'שמירה'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// Shared components
// ═══════════════════════════════════════════════

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[11px] font-bold text-slate-400 block mb-2 uppercase tracking-wider">
      {children}
    </label>
  );
}
