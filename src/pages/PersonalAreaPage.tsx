import styled from '@emotion/styled';
import { Download } from 'lucide-react';
import { type ChangeEvent, useState } from 'react';
import FiltersBar, {
  type QuickFilter,
  type StatusTab,
  type ViewMode,
} from '../components/personal-area/FiltersBar';
import KpiBar from '../components/personal-area/KpiBar';
import PersonalCards from '../components/personal-area/PersonalCards';
import PersonalHeader from '../components/personal-area/PersonalHeader';
import PersonalTable from '../components/personal-area/PersonalTable';
import SearchBar from '../components/personal-area/SearchBar';
import InstructionViewModal from '../components/shared/InstructionViewModal/InstructionViewModal';
import Tooltip from '../components/shared/Tooltip';
import { getMyInstructions, getMyStats } from '../mocks/data';
import type { InstructionStatus } from '../types';
import { STATUS_LABELS } from '../types';
import { formatDate } from '../utils/dateUtils';
import { exportToCsv } from '../utils/exportCsv';

interface ViewModalState {
  instructionId: string;
  envId: string;
}

interface StatusOverrides {
  [id: string]: InstructionStatus;
}

export default function PersonalAreaPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [activeTab, setActiveTab] = useState<StatusTab>('all');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [envFilter, setEnvFilter] = useState<string>('all');
  const [dueDateFilter, setDueDateFilter] = useState<string>('all');
  const [viewModal, setViewModal] = useState<ViewModalState | null>(null);
  const [statusOverrides, setStatusOverrides] = useState<StatusOverrides>({});

  const rawInstructions = getMyInstructions();
  const stats = getMyStats();

  const instructions = rawInstructions.map((i) =>
    statusOverrides[i.id] ? { ...i, status: statusOverrides[i.id] } : i
  );

  const envOptions = Array.from(
    new Map(instructions.map((i) => [i.environmentId, i.environmentName])),
    ([id, name]) => ({ id, name })
  );

  const now = new Date();
  const filteredInstructions = instructions.filter((i) => {
    const statusMatch =
      activeTab === 'archived'
        ? i.status === 'archived'
        : activeTab !== 'all'
          ? i.status === activeTab
          : i.status !== 'archived';

    const quickFilterMatch =
      quickFilter === 'overdue'
        ? !!i.dueDate &&
          new Date(i.dueDate).getTime() < now.getTime() &&
          i.status !== 'completed' &&
          i.status !== 'archived'
        : quickFilter === 'routine'
          ? i.dueDateType === 'routine'
          : quickFilter === 'important'
            ? i.priority === 'high' || i.priority === 'urgent' || i.isImportant
            : true;

    const envMatch = envFilter === 'all' || i.environmentId === envFilter;
    const dueDateMatch = dueDateFilter === 'all' || i.dueDateType === dueDateFilter;

    const trimmedSearchQuery = searchQuery.trim().toLowerCase();
    const searchMatch =
      !trimmedSearchQuery ||
      i.title.toLowerCase().includes(trimmedSearchQuery) ||
      i.source?.toLowerCase().includes(trimmedSearchQuery) ||
      i.environmentName.toLowerCase().includes(trimmedSearchQuery) ||
      i.assignees.some((a) => a.user.name.toLowerCase().includes(trimmedSearchQuery));

    return statusMatch && quickFilterMatch && envMatch && dueDateMatch && searchMatch;
  });

  function handleArchive(id: string) {
    setStatusOverrides((prev) => ({ ...prev, [id]: 'archived' }));
  }

  function handleRestore(id: string) {
    setStatusOverrides((prev) => ({ ...prev, [id]: 'open' }));
  }

  function handleViewInstruction(instructionId: string, envId: string) {
    setViewModal({ instructionId, envId });
  }

  function handleCloseModal() {
    setViewModal(null);
  }

  function handleChangeSearchQuery(e: ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
  }

  function handleClickResetSearch() {
    setSearchQuery('');
  }

  function handleExport() {
    const headers = ['שם', 'תאריך הפקה', 'תג״ב', 'ממונה', 'מצב', 'מערך', 'גורם מפקד'];
    const rows = filteredInstructions.map((i) => [
      i.title,
      formatDate(new Date(i.createdAt)),
      formatDate(i.dueDate ? new Date(i.dueDate) : null),
      i.assignees.map((a) => a.user.name).join(', '),
      STATUS_LABELS[i.status],
      i.environmentName,
      i.source || '',
    ]);

    exportToCsv(headers, rows, `הנחיות_${formatDate(new Date())}.csv`);
  }

  return (
    <PageWrapper>
      <PersonalHeader activeItem="instructions" userName="" />

      <SecondaryBar>
        <SecondaryBarInner>
          <PageTitle>ההנחיות שלי</PageTitle>

          <ActionGroup>
            <SearchBar
              value={searchQuery}
              onChange={handleChangeSearchQuery}
              onClear={handleClickResetSearch}
            />

            <Tooltip content="ייצוא לאקסל">
              <ExportButton onClick={handleExport}>
                <Download size={16} />
                ייצוא
              </ExportButton>
            </Tooltip>
          </ActionGroup>
        </SecondaryBarInner>
      </SecondaryBar>

      <KpiBar stats={stats} />

      <ContentArea>
        <FiltersWrapper>
          <FiltersBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            quickFilter={quickFilter}
            onQuickFilterChange={setQuickFilter}
            envFilter={envFilter}
            onEnvFilterChange={setEnvFilter}
            envOptions={envOptions}
            dueDateFilter={dueDateFilter}
            onDueDateFilterChange={setDueDateFilter}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </FiltersWrapper>

        {filteredInstructions.length === 0 ? (
          <EmptyState>
            <EmptyText>לא נמצאו הנחיות תואמות</EmptyText>
          </EmptyState>
        ) : (
          <>
            {viewMode === 'table' && (
              <PersonalTable
                instructions={filteredInstructions}
                onArchive={handleArchive}
                onRestore={handleRestore}
                onViewInstruction={handleViewInstruction}
              />
            )}
            {viewMode === 'cards' && (
              <PersonalCards
                instructions={filteredInstructions}
                onViewInstruction={handleViewInstruction}
                onArchive={handleArchive}
                onRestore={handleRestore}
              />
            )}
          </>
        )}
      </ContentArea>

      {viewModal && (
        <InstructionViewModal
          open
          onClose={handleCloseModal}
          instructionId={viewModal.instructionId}
          envId={viewModal.envId}
        />
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

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  border: 1px solid var(--color-gray-200);
  background: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background-color 150ms;

  &:hover {
    background-color: var(--color-gray-50);
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
`;

const FiltersWrapper = styled.div`
  margin-bottom: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 5rem 0;
`;

const EmptyText = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
`;
