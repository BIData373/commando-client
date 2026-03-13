import styled from '@emotion/styled';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ClipboardList,
  Clock,
  Flag,
  Plus,
  Settings,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { IInstructionListItem, IInstructionStats } from '../../../types';
import { formatDateShort } from '../../../utils/dateUtils';
import PriorityChip from '../../shared/PriorityChip';
import StatusChip from '../../shared/StatusChip';
import UserAvatarGroup from '../../shared/UserAvatarGroup';
import ImportantPieChart from './ImportantPieChart';
import QuickActionButton from './QuickActionButton';

interface EnvironmentHomeDashboardProps {
  envId: string;
  stats: IInstructionStats;
  instructions: IInstructionListItem[];
  onViewInstruction: (id: string) => void;
  onNavigateToInstructions: () => void;
  onCreateInstruction: () => void;
}

interface KpiCardData {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

export default function EnvironmentHomeDashboard({
  envId,
  stats,
  instructions,
  onViewInstruction,
  onNavigateToInstructions,
  onCreateInstruction,
}: EnvironmentHomeDashboardProps) {
  const navigate = useNavigate();

  const activeCount = stats.total - stats.archived;
  const completedThisWeek = instructions.filter((i) => i.status === 'completed').length;
  const allImportant = instructions.filter((i) => i.isImportant && i.status !== 'archived');
  const importantCompleted = allImportant.filter((i) => i.status === 'completed').length;
  const importantInstructions = [...allImportant]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);
  const recentInstructions = [...instructions]
    .filter((i) => i.status !== 'archived')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const kpiCards: KpiCardData[] = [
    {
      label: 'סה״כ הנחיות פעילות',
      value: activeCount,
      icon: <ClipboardList size={24} />,
      color: 'var(--color-info)',
    },
    {
      label: 'הנחיות דחופות',
      value: stats.urgent,
      icon: <AlertTriangle size={24} />,
      color: 'var(--color-error)',
    },
    {
      label: 'ממתינות לביצוע',
      value: stats.open,
      icon: <Clock size={24} />,
      color: 'var(--color-warning)',
    },
    {
      label: 'בוצעו השבוע',
      value: completedThisWeek,
      icon: <CheckCircle2 size={24} />,
      color: 'var(--color-success)',
    },
  ];

  function handleNavigateSettings() {
    navigate(`/env/${envId}/settings`);
  }

  return (
    <Root>
      <PageHeader>
        <PageTitle>מבט מהיר</PageTitle>
        <PageSubtitle>סיכום מצב ההנחיות בסביבה</PageSubtitle>
      </PageHeader>

      <KpiGrid>
        {kpiCards.map((card) => (
          <KpiCard key={card.label}>
            <KpiIconBox $color={card.color}>{card.icon}</KpiIconBox>
            <div>
              <KpiLabel>{card.label}</KpiLabel>
              <KpiValue>{card.value}</KpiValue>
            </div>
          </KpiCard>
        ))}
      </KpiGrid>

      <MainGrid>
        <TablesColumn>
          <Panel>
            <PanelHeader>
              <PanelTitleRow>
                <FlagIconAmber size={20} />
                <PanelTitle>הנחיות חשובות</PanelTitle>
              </PanelTitleRow>
              <ViewAllButton onClick={onNavigateToInstructions}>
                צפה בהכל
                <ChevronLeft size={16} />
              </ViewAllButton>
            </PanelHeader>
            {importantInstructions.length === 0 ? (
              <EmptyRow>אין הנחיות חשובות כרגע</EmptyRow>
            ) : (
              <ItemList>
                {importantInstructions.map((item) => (
                  <ItemButton key={item.id} onClick={() => onViewInstruction(item.id)}>
                    <FlagIconAmberSmall size={16} />
                    <ItemTitle>{item.title}</ItemTitle>
                    <UserAvatarGroup users={item.assignees.map((a) => a.user)} max={3} size={28} />
                    <StatusChip status={item.status} />
                    <DateCell>
                      {formatDateShort(item.dueDate ? new Date(item.dueDate) : null)}
                    </DateCell>
                  </ItemButton>
                ))}
              </ItemList>
            )}
          </Panel>

          <Panel>
            <PanelHeader>
              <PanelTitle>הנחיות אחרונות שנוצרו</PanelTitle>
              <ViewAllButton onClick={onNavigateToInstructions}>
                צפה בהכל
                <ChevronLeft size={16} />
              </ViewAllButton>
            </PanelHeader>
            {recentInstructions.length === 0 ? (
              <EmptyRow>אין הנחיות להצגה</EmptyRow>
            ) : (
              <ItemList>
                {recentInstructions.map((item) => (
                  <ItemButton key={item.id} onClick={() => onViewInstruction(item.id)}>
                    <ItemTitle>{item.title}</ItemTitle>
                    <ChipsRow>
                      <PriorityChip priority={item.priority} />
                      <StatusChip status={item.status} />
                    </ChipsRow>
                    <DateCell>{formatDateShort(new Date(item.createdAt))}</DateCell>
                  </ItemButton>
                ))}
              </ItemList>
            )}
          </Panel>
        </TablesColumn>

        <SideColumn>
          <PaddedPanel>
            <SpacedPanelTitleRow>
              <FlagIconAmber size={20} />
              <PanelTitle>התקדמות הנחיות חשובות</PanelTitle>
            </SpacedPanelTitleRow>
            <ImportantPieChart completed={importantCompleted} total={allImportant.length} />
          </PaddedPanel>

          <PaddedPanel>
            <SpacedPanelTitle>פעולות מהירות</SpacedPanelTitle>
            <QuickActionsStack>
              <QuickActionButton
                icon={<Plus size={20} />}
                label="יצירת הנחיה חדשה"
                description="הוסף הנחיה חדשה למערך"
                onClick={onCreateInstruction}
              />
              <QuickActionButton
                icon={<Users size={20} />}
                label="ניהול אחראים"
                description="הגדרת קבוצות אחראים"
                onClick={handleNavigateSettings}
              />
              <QuickActionButton
                icon={<Settings size={20} />}
                label="פרמטרי מערך"
                description="הגדרות כלליות, תגיות והרשאות"
                onClick={handleNavigateSettings}
              />
            </QuickActionsStack>
          </PaddedPanel>
        </SideColumn>
      </MainGrid>
    </Root>
  );
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PageHeader = styled.div``;

const PageTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
`;

const PageSubtitle = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: 0.25rem;
`;

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
`;

const KpiCard = styled.div`
  background-color: var(--color-paper);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--color-gray-100);
  padding: 1.25rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const KpiIconBox = styled.div<{ $color: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${({ $color }) => $color};
  background-color: color-mix(in srgb, ${({ $color }) => $color} 10%, transparent);
`;

const KpiLabel = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-weight: 500;
`;

const KpiValue = styled.p`
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-top: 0.25rem;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
`;

const TablesColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SideColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Panel = styled.div`
  background-color: var(--color-paper);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--color-gray-100);
`;

const PaddedPanel = styled(Panel)`
  padding: 1.5rem;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-gray-100);
`;

const PanelTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SpacedPanelTitleRow = styled(PanelTitleRow)`
  margin-bottom: 1.25rem;
`;

const PanelTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text-primary);
`;

const SpacedPanelTitle = styled(PanelTitle)`
  margin-bottom: 1rem;
`;

const FlagIconAmber = styled(Flag)`
  color: var(--color-warning);
  fill: var(--color-warning);
`;

const FlagIconAmberSmall = styled(Flag)`
  color: var(--color-warning);
  fill: var(--color-warning);
  flex-shrink: 0;
`;

const ViewAllButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 150ms;

  &:hover {
    color: var(--color-primary-dark);
  }
`;

const ItemList = styled.div`
  & > * + * {
    border-top: 1px solid var(--color-gray-50);
  }
`;

const ItemButton = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 0.875rem 1.5rem;
  text-align: start;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 150ms;

  &:hover {
    background-color: var(--color-gray-50);
  }
`;

const ItemTitle = styled.span`
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ChipsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
`;

const DateCell = styled.span`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  flex-shrink: 0;
  width: 70px;
  text-align: center;
`;

const EmptyRow = styled.div`
  padding: 2rem 1.5rem;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
`;

const QuickActionsStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;
