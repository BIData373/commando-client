import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, LayoutGrid, FolderOpen, User } from 'lucide-react';
import { Button } from '@/components/ui';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/common';
import { LoadingState, ErrorState } from '@/components/common';
import { useEnvironments } from '@/hooks/useEnvironments';
import { EnvironmentCard, PersonalEnvironmentCard } from '@/components/home/EnvironmentCard';
import { CreateEnvironmentDialog } from '@/components/home/CreateEnvironmentDialog';

type TabValue = 'mine' | 'all';

export function HomePage() {
  const navigate = useNavigate();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabValue>('mine');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: environments, isLoading, isError, refetch } = useEnvironments();

  /* ── Filtering ── */
  const filteredByTab = environments
    ? activeTab === 'mine'
      ? environments.filter((env) => env.currentUserRole === 'manager')
      : environments
    : [];

  const filteredEnvironments = searchQuery.trim()
    ? filteredByTab.filter((env) =>
        env.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : filteredByTab;

  const showEmptyState =
    activeTab === 'mine' && !searchQuery.trim() && filteredByTab.length === 0 && !isLoading && !isError;

  const showNoResults =
    searchQuery.trim() && filteredEnvironments.length === 0 && !isLoading && !isError;

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex flex-col" dir="rtl">

      {/* ━━ Top Navbar ━━ */}
      <div className="px-6 pt-4">
        <header className="bg-[#0B0F2F] text-white rounded-2xl mx-auto max-w-[1400px]">
          <div className="flex items-center justify-between h-[58px] px-8">
            <div dir="ltr" className="select-none">
              <span className="text-[22px] font-bold tracking-tight">
                Comman<span className="text-[#b47cff]">Do</span>
              </span>
            </div>
            <button
              onClick={() => navigate('/personal')}
              className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center cursor-pointer hover:border-white/50 transition-colors"
              aria-label="אזור אישי"
            >
              <User className="w-[18px] h-[18px] text-white/60" />
            </button>
          </div>
        </header>
      </div>

      {/* ━━ Page Content ━━ */}
      <div className="max-w-[1400px] mx-auto w-full px-6 flex-1 flex flex-col">

        {/* Title */}
        <div className="pt-8 pb-2 text-center">
          <h1 className="text-[30px] font-bold text-text-primary mb-1">
            מערכת לניהול הנחיות
          </h1>
          <p className="text-sm text-text-secondary">
            בחר סביבת עבודה
          </p>
        </div>

        {/* Actions row: Buttons + Search */}
        <div className="flex items-center gap-2 pb-6 pt-4">
          <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            צור סביבה
          </Button>
          <Button size="sm" variant="outline">
            <LayoutGrid className="w-4 h-4" />
            צפייה במארז הדרכה
          </Button>
          <div className="relative ms-auto">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-disabled pointer-events-none" />
            <input
              placeholder="חפש סביבה"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[220px] ps-9 pe-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 focus:bg-paper focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
            />
          </div>
        </div>

        {/* ━━ Two-Column Grid: Personal panel (right) + Main content (left) ━━ */}
        <div
          className="flex-1 pb-16"
          style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '40px', alignItems: 'start' }}
        >
          {/* ── Right column (RTL col-1 = visually right): Personal Card ── */}
          <div className="sticky top-6" style={{ gridRow: '1 / -1' }}>
            <PersonalEnvironmentCard />
          </div>

          {/* ── Left column (RTL col-2 = visually left): Tabs + Cards ── */}
          <div className="flex flex-col gap-8">
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
              <TabsList>
                <TabsTrigger value="all">כל הסביבות</TabsTrigger>
                <TabsTrigger value="mine">הסביבות שלי</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Cards area */}
            {isLoading && <LoadingState message="טוען סביבות..." />}
            {isError && (
              <ErrorState message="תקלה בטעינת הסביבות" onRetry={() => refetch()} />
            )}

            {showEmptyState && (
              <EmptyState
                icon={<FolderOpen className="w-16 h-16" />}
                title="עדיין אין לך סביבות"
                description="צור סביבה חדשה או בקש הצטרפות לסביבה קיימת כדי להתחיל"
                actionLabel="צור סביבה"
                onAction={() => setCreateDialogOpen(true)}
              />
            )}

            {showNoResults && (
              <EmptyState
                icon={<Search className="w-16 h-16" />}
                title="לא נמצאו תוצאות"
                description={`לא נמצאה סביבה בשם "${searchQuery.trim()}"`}
              />
            )}

            {environments && !showEmptyState && !showNoResults && !isLoading && !isError && (
              <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                {filteredEnvironments.map((env) => (
                  <EnvironmentCard key={env.id} environment={env} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ━━ Create Environment Dialog ━━ */}
      <CreateEnvironmentDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />
    </div>
  );
}
