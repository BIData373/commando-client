import styled from '@emotion/styled';
import {
  ChevronDown,
  Download,
  FileText,
  LayoutGrid,
  MessagesSquare,
  Plus,
  Search,
  Table2,
  X,
} from 'lucide-react';
import { type ChangeEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import CardsView from '../components/environment/CardsView';
import ConfirmDeleteDialog from '../components/environment/ConfirmDeleteDialog';
import CreateDiscussionDialog from '../components/environment/CreateDiscussionDialog/DiscussionDialog';
import CreateSingleInstructionDialog from '../components/environment/CreateSingleInstructionDialog';
import EnvironmentHomeDashboard from '../components/environment/EnvironmentHomeDashboard/EnvironmentHomeDashboard';
import InstructionFilters from '../components/environment/InstructionFilters';
import InstructionsTable from '../components/environment/InstructionsTable/InstructionsTable';
import Button from '../components/shared/Button';
import DropdownMenu from '../components/shared/DropdownMenu/DropdownMenu';
import DropdownMenuContent from '../components/shared/DropdownMenu/DropdownMenuContent';
import DropdownMenuItem from '../components/shared/DropdownMenu/DropdownMenuItem';
import DropdownMenuTrigger from '../components/shared/DropdownMenu/DropdownMenuTrigger';
import EmptyState from '../components/shared/EmptyState';
import type { SidebarItem } from '../components/shared/EnvironmentHeader/EnvironmentHeader';
import EnvironmentHeader from '../components/shared/EnvironmentHeader/EnvironmentHeader';
import ErrorState from '../components/shared/ErrorState';
import InstructionViewModal from '../components/shared/InstructionViewModal/InstructionViewModal';
import LoadingState from '../components/shared/LoadingState';
import Tooltip from '../components/shared/Tooltip';
import { useEnvironment } from '../hooks/useEnvironments';
import {
  useDeleteInstruction,
  useInstructionStats,
  useInstructions,
  useUpdateInstruction,
} from '../hooks/useInstructions';
import { useTablePreferences } from '../hooks/useTablePreferences';
import { useToast } from '../hooks/useToast';
import { applyAllFilters, buildFilterOptions } from '../utils/filterUtils';
import type { PageParams } from '../utils/paramUtils';

type ViewMode = 'table' | 'cards';
type CreateMode = 'single' | 'discussion';

interface ViewModalState {
  instructionId: string;
  editMode: boolean;
}

export default function EnvironmentPage() {
  const { envId = '' } = useParams<PageParams>();
  const toast = useToast();

  const [sidebarItem, setSidebarItem] = useState<SidebarItem>('home');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [createMode, setCreateMode] = useState<CreateMode>();
  const [viewModal, setViewModal] = useState<ViewModalState | null>(null);
  const [deleteDialogInstructionId, setDeleteDialogInstructionId] = useState<string | null>(null);

  const {
    preferences,
    setSort,
    setColumnFilter,
    clearColumnFilter,
    clearAllFilters,
    setQuickFilter,
    hasActiveFilters,
  } = useTablePreferences(envId);

  const { data: environment, isLoading: envLoading, isError: envError } = useEnvironment(envId);

  const {
    data: instructionsData,
    isLoading: instLoading,
    isError: instError,
    refetch: refetchInstructions,
  } = useInstructions(envId);
  const { data: stats } = useInstructionStats(envId);

  const updateMutation = useUpdateInstruction(envId);
  const deleteMutation = useDeleteInstruction(envId);

  const filterOptions = buildFilterOptions(instructionsData?.data ?? []);
  const filteredAndSortedInstructions = applyAllFilters(
    instructionsData?.data ?? [],
    preferences,
    searchQuery
  );

  const deleteInstruction = instructionsData?.data.find((i) => i.id === deleteDialogInstructionId);

  function handleArchive(instructionId: string) {
    updateMutation.mutate(
      { instructionId, data: { status: 'archived' } },
      {
        onSuccess: () => toast.success('ההנחיה הועברה לארכיון בהצלחה'),
        onError: () => toast.error('תקלה בהעברת ההנחיה לארכיון'),
      }
    );
  }

  function handleRestore(instructionId: string) {
    updateMutation.mutate(
      { instructionId, data: { status: 'open' } },
      {
        onSuccess: () => toast.success('ההנחיה שוחזרה מהארכיון בהצלחה'),
        onError: () => toast.error('תקלה בשחזור ההנחיה מהארכיון'),
      }
    );
  }

  function handleDeleteConfirm() {
    if (!deleteDialogInstructionId) return;
    deleteMutation.mutate(deleteDialogInstructionId, {
      onSuccess: () => {
        setDeleteDialogInstructionId(null);
        toast.success('ההנחיה בוטלה בהצלחה');
      },
      onError: () => toast.error('תקלה בביטול ההנחיה'),
    });
  }

  function handleViewInstruction(id: string) {
    setViewModal({ instructionId: id, editMode: false });
  }

  function handleEditInstruction(id: string) {
    setViewModal({ instructionId: id, editMode: true });
  }

  function handleCloseViewModal() {
    setViewModal(null);
  }

  function handleOpenSingleCreate() {
    setCreateMode('single');
  }

  function handleOpenDiscussionCreate() {
    setCreateMode('discussion');
  }

  function handleCloseCreateDialog() {
    setCreateMode(undefined);
  }

  function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
  }

  function handleClearSearch() {
    setSearchQuery('');
  }

  function handleRetryInstructions() {
    refetchInstructions();
  }

  function handleNavigateToInstructions() {
    setSidebarItem('instructions');
  }

  function handleOpenCreateFromDashboard() {
    // FIX Needs menu instead of single?
    setCreateMode('single');
  }

  const searchAdornment = (
    <FiltersEndSlot>
      <SearchWrapper>
        <SearchIcon size={16} />
        <SearchInput
          type="text"
          placeholder="חיפוש..."
          value={searchQuery}
          onChange={handleSearchChange}
          aria-label="חיפוש הנחיות"
        />
        {searchQuery && (
          <ClearSearchButton onClick={handleClearSearch}>
            <X size={16} />
          </ClearSearchButton>
        )}
      </SearchWrapper>
      <ViewModeToggle>
        {[
          { value: 'cards' as ViewMode, icon: LayoutGrid, label: 'כרטיסיות' },
          { value: 'table' as ViewMode, icon: Table2, label: 'טבלה' },
        ].map((item) => (
          <Tooltip key={item.value} content={item.label}>
            <ViewModeButton
              onClick={() => setViewMode(item.value)}
              $active={viewMode === item.value}
              aria-label={`תצוגת ${item.label}`}
            >
              <item.icon size={16} />
            </ViewModeButton>
          </Tooltip>
        ))}
      </ViewModeToggle>
    </FiltersEndSlot>
  );

  return (
    <PageWrapper>
      {envLoading && <LoadingState message="טוען מערך..." />}

      {(envError || (!envLoading && !environment)) && <ErrorState message="תקלה בטעינת המערך" />}

      {environment && (
        <>
          <EnvironmentHeader
            environmentName={environment.name}
            activeItem={sidebarItem}
            onItemChange={setSidebarItem}
          />

          <SecondaryBar>
            <SecondaryBarInner>
              <PageTitle>{sidebarItem === 'home' ? 'בית' : 'הנחיות'}</PageTitle>

              {sidebarItem !== 'home' && (
                <ActionGroup>
                  <Button variant="outline" size="sm" onClick={() => {}}>
                    <Download size={16} />
                    ייצוא
                  </Button>

                  <DropdownMenu>
                    <CreateMenuTrigger>
                      <Plus size={16} />
                      יצירת הנחיה
                      <ChevronDown size={14} />
                    </CreateMenuTrigger>
                    <DropdownMenuContent align="end">
                      <CreateMenuItem onClick={handleOpenSingleCreate}>
                        <FileText size={16} />
                        <CreateMenuItemText>
                          <CreateMenuItemTitle>הנחיה בודדת</CreateMenuItemTitle>
                          <CreateMenuItemDesc>יצירת הנחיה חדשה</CreateMenuItemDesc>
                        </CreateMenuItemText>
                      </CreateMenuItem>
                      <CreateMenuItem onClick={handleOpenDiscussionCreate}>
                        <MessagesSquare size={16} />
                        <CreateMenuItemText>
                          <CreateMenuItemTitle>מתוך דיון</CreateMenuItemTitle>
                          <CreateMenuItemDesc>חילוץ הנחיות מדיון או ישיבה</CreateMenuItemDesc>
                        </CreateMenuItemText>
                      </CreateMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </ActionGroup>
              )}
            </SecondaryBarInner>
          </SecondaryBar>

          <ContentArea>
            {sidebarItem === 'home' && (
              <>
                {instLoading && <LoadingState message="טוען נתונים..." />}
                {!instLoading && !instError && stats && (
                  <EnvironmentHomeDashboard
                    envId={envId}
                    stats={stats}
                    instructions={instructionsData?.data ?? []}
                    onViewInstruction={handleViewInstruction}
                    onNavigateToInstructions={handleNavigateToInstructions}
                    onCreateInstruction={handleOpenCreateFromDashboard}
                  />
                )}
              </>
            )}

            {sidebarItem === 'instructions' && (
              <>
                <FiltersWrapper>
                  <InstructionFilters
                    activeQuickFilter={preferences.quickFilter}
                    onQuickFilterChange={setQuickFilter}
                    endAdornment={searchAdornment}
                  />
                </FiltersWrapper>

                {instLoading && <LoadingState message="טוען הנחיות..." />}

                {instError && (
                  <ErrorState message="תקלה בטעינת ההנחיות" onRetry={handleRetryInstructions} />
                )}

                {!instLoading &&
                  !instError &&
                  viewMode === 'table' &&
                  filteredAndSortedInstructions.length > 0 && (
                    <InstructionsTable
                      instructions={filteredAndSortedInstructions}
                      sortState={{
                        column: preferences.sortColumn,
                        direction: preferences.sortDirection,
                      }}
                      onSort={setSort}
                      columnFilters={preferences.columnFilters}
                      filterOptions={filterOptions}
                      onFilterApply={setColumnFilter}
                      onFilterReset={clearColumnFilter}
                      onViewInstruction={handleViewInstruction}
                      onEditInstruction={handleEditInstruction}
                      onArchiveInstruction={handleArchive}
                      onRestoreInstruction={handleRestore}
                      onDeleteInstruction={setDeleteDialogInstructionId}
                    />
                  )}

                {!instLoading &&
                  !instError &&
                  viewMode === 'cards' &&
                  filteredAndSortedInstructions.length > 0 && (
                    <CardsView
                      instructions={filteredAndSortedInstructions}
                      envId={envId}
                      onViewInstruction={handleViewInstruction}
                      onArchiveInstruction={handleArchive}
                      onRestoreInstruction={handleRestore}
                    />
                  )}

                {!instLoading && !instError && filteredAndSortedInstructions.length === 0 && (
                  <EmptyState
                    title="אין הנחיות להצגה"
                    description={
                      searchQuery.trim()
                        ? `לא נמצאו תוצאות עבור "${searchQuery}"`
                        : hasActiveFilters
                          ? 'לא נמצאו הנחיות התואמות את הסינון'
                          : 'צור הנחיה חדשה כדי להתחיל'
                    }
                    actionLabel={
                      hasActiveFilters ? 'נקה סינון' : !searchQuery.trim() ? 'צור הנחיה' : undefined
                    }
                    onAction={
                      hasActiveFilters
                        ? clearAllFilters
                        : !searchQuery.trim()
                          ? handleOpenSingleCreate
                          : undefined
                    }
                  />
                )}
              </>
            )}
          </ContentArea>

          <CreateSingleInstructionDialog
            open={createMode === 'single'}
            onClose={handleCloseCreateDialog}
            envId={envId}
          />

          <CreateDiscussionDialog
            open={createMode === 'discussion'}
            onClose={handleCloseCreateDialog}
            envId={envId}
          />

          {/* // FIX Remove condition */}
          {viewModal && (
            <InstructionViewModal
              open
              onClose={handleCloseViewModal}
              instructionId={viewModal.instructionId}
              envId={envId}
              initialEditMode={viewModal.editMode}
            />
          )}

          <ConfirmDeleteDialog
            open={!!deleteDialogInstructionId}
            onClose={() => setDeleteDialogInstructionId(null)}
            onConfirm={handleDeleteConfirm}
            instructionTitle={deleteInstruction?.title ?? ''}
            isLoading={deleteMutation.isPending}
          />
        </>
      )}
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: var(--color-background);
  display: flex;
  flex-direction: column;
`;

const SecondaryBar = styled.div`
  background-color: var(--color-paper);
  border-bottom: 1px solid var(--color-gray-200);
`;

const SecondaryBarInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem 1.5rem;
  gap: 1rem;
`;

const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const CreateMenuTrigger = styled(DropdownMenuTrigger)`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  border: none;
  background-color: var(--color-primary);
  color: white;
  cursor: pointer;
  transition: background-color 150ms;

  &:hover {
    background-color: var(--color-primary-dark);
  }
`;

const CreateMenuItem = styled(DropdownMenuItem)`
  align-items: flex-start;
  padding: 0.625rem 1rem;
  gap: 0.625rem;
  color: var(--color-primary);
`;

const CreateMenuItemText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

const CreateMenuItemTitle = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
`;

const CreateMenuItemDesc = styled.p`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin: 0;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
`;

const FiltersWrapper = styled.div`
  margin-bottom: 1rem;
`;

const FiltersEndSlot = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  inset-inline-start: 0.75rem;
  color: var(--color-text-disabled);
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 220px;
  padding: 0.375rem 2rem 0.375rem 2.25rem;
  font-size: 0.875rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-gray-200);
  background-color: var(--color-gray-50);
  color: var(--color-text-primary);
  outline: none;
  transition: background-color 150ms, border-color 150ms, box-shadow 150ms;

  &::placeholder {
    color: var(--color-text-disabled);
  }

  &:hover {
    background-color: var(--color-gray-100);
  }

  &:focus {
    background-color: var(--color-paper);
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 20%, transparent);
  }
`;

const ClearSearchButton = styled.button`
  position: absolute;
  inset-inline-end: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-disabled);
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 150ms;

  &:hover {
    color: var(--color-text-secondary);
  }
`;

const ViewModeToggle = styled.div`
  display: inline-flex;
  border-radius: 0.5rem;
  border: 1px solid var(--color-gray-200);
  overflow: hidden;
`;

const ViewModeButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 150ms, color 150ms;
  color: ${({ $active }) => ($active ? 'var(--color-primary)' : 'var(--color-text-secondary)')};
  background-color: ${({ $active }) =>
    $active ? 'color-mix(in srgb, var(--color-primary) 10%, transparent)' : 'transparent'};

  &:hover {
    background-color: ${({ $active }) =>
      $active
        ? 'color-mix(in srgb, var(--color-primary) 10%, transparent)'
        : 'var(--color-gray-50)'};
  }
`;
