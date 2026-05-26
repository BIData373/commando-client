import styled from "@emotion/styled";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { matchesQuickFilter } from "#/functions/filter-utils";
import { QuickFilter as FocusedTab, QuickFilter } from "#/utils/filterUtils";
import searchInstruction from "../../assets/icons/searchInstruction.svg";
import type { Task } from "../../data/Tasks";
import { useTaskColumns } from "../../hooks/useTaskColumns";
import { EmptyCardState } from "./EmptyCardState";
import { ViewMoreInstructions } from "./ViewMoreInstructions";

interface TabConfig {
  id: FocusedTab;
  label: string;
  count: number;
  weekDelta: number;
}

interface EmptyMessage {
  title: string;
  description: string;
}

interface IFocusedInstruction {
  urlName: string;
  tasks: Task[];
}

const TAB_LABELS: Pick<TabConfig, "id" | "label" | "weekDelta">[] = [
  { id: FocusedTab.FLAGGED, label: "הנחיות חשובות", weekDelta: 0 },
  { id: FocusedTab.APPROACHING, label: "הנחיות לביצוע מידיות", weekDelta: 0 },
  { id: FocusedTab.OVERDUE, label: 'חריגות מתג"ב', weekDelta: 0 },
];

const EMPTY_MESSAGES: Record<FocusedTab, EmptyMessage> = {
  [FocusedTab.FLAGGED]: {
    title: "לא נמצאו הנחיות חשובות",
    description: "לאחר שהנחיות יוגדרו כחשובות,\nההנחיות האחרונות יופיעו כאן",
  },
  [FocusedTab.APPROACHING]: {
    title: "לא נמצאו הנחיות לביצוע מידיות",
    description: "הנחיות לביצוע מידיות יופיעו כאן",
  },
  [FocusedTab.OVERDUE]: {
    title: 'לא נמצאו חריגות מתג"ב',
    description: 'חריגות מתג"ב יופיעו כאן',
  },
};

const coreRowModel = getCoreRowModel();

function getFilteredTasks(tab: FocusedTab, tasks: Task[]): Task[] {
  switch (tab) {
    case FocusedTab.FLAGGED:
      return tasks.filter((t) => t.flagged);
    case FocusedTab.APPROACHING:
      return tasks.filter((t) => t.deadlineType === "immediate");
    case FocusedTab.OVERDUE:
      return tasks.filter((t) => t.isOverdue);
  }
}

export default function FocusedInstructions({
  urlName,
  tasks,
}: IFocusedInstruction) {
  const [activeTab, setActiveTab] = useState<FocusedTab>(FocusedTab.FLAGGED);

  function handleTabClick(tabId: FocusedTab) {
    setActiveTab(tabId);
  }

  const tabs: TabConfig[] = TAB_LABELS.map((tab) => ({
    ...tab,
    count:
      tab.id === FocusedTab.FLAGGED
        ? tasks.filter((t) => matchesQuickFilter(t, QuickFilter.FLAGGED)).length
        : tab.id === FocusedTab.APPROACHING
          ? tasks.filter((t) => t.deadlineType === "immediate").length
          : tasks.filter((t) => matchesQuickFilter(t, QuickFilter.OVERDUE))
            .length,
  }));

  const emptyMsg = EMPTY_MESSAGES[activeTab];
  const filteredTasks = useMemo(
    () => getFilteredTasks(activeTab, tasks),
    [activeTab, tasks],
  );

  const { columns } = useTaskColumns({
    visibleColumns: ["title", "status", "responsible", "deadlineType"],
    searchQuery: "",
    filterOptionsMap: {},
    onUpdateStatus: () => { },
  });

  const table = useReactTable({
    data: filteredTasks,
    columns,
    getCoreRowModel: coreRowModel,
  });

  return (
    <Section>
      <SectionTitle>הנחיות במיקוד</SectionTitle>
      <TabsWrapper>
        <TabsHeader>
          {tabs.map((tab) => (
            <TabItem
              key={tab.id}
              $active={tab.id === activeTab}
              onClick={() => handleTabClick(tab.id)}
            >
              <TabTitle $active={tab.id === activeTab}>{tab.label}</TabTitle>
              <TabBottom>
                <TabCount $active={tab.id === activeTab}>{tab.count}</TabCount>
              </TabBottom>
            </TabItem>
          ))}
        </TabsHeader>
        <ContentPanel $hasContent={filteredTasks.length > 0}>
          {filteredTasks.length === 0 ? (
            <EmptyCardState
              imgSrc={searchInstruction}
              title={emptyMsg.title}
              description={emptyMsg.description}
            />
          ) : (
            <TaskList>
              {table.getRowModel().rows.map((row) => (
                <TaskRow key={row.id}>
                  {row.getVisibleCells().map((cell) =>
                    cell.column.id === "title" ? (
                      <TitleCellWrapper key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TitleCellWrapper>
                    ) : (
                      <FixedCell key={cell.id} $width={cell.column.getSize()}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </FixedCell>
                    ),
                  )}
                </TaskRow>
              ))}
            </TaskList>
          )}
        </ContentPanel>
      </TabsWrapper>
      <ViewMoreInstructions urlName={urlName} tabFilter={activeTab} />
    </Section>
  );
}

const Section = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 1300px) {
    grid-column: 1 / -1;
    grid-row: 1;
  }
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 30px;
  font-weight: 400;
  color: var(--sea-ink);
  text-align: start;
`;

const TabsWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const TabsHeader = styled.div`
  display: flex;
  gap: 2px;
  position: relative;
  max-width: 840px;
`;

const TabItem = styled.button<{ $active: boolean }>`
  word-wrap: break-word;
  min-width: 0;
  padding: 8px 16px;
  width: 280px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  border: 1px solid var(--border);
  border-bottom-color: ${({ $active }) => ($active ? "var(--background)" : "var(--border)")};
  border-radius: 6px 6px 0 0;
  background: ${({ $active }) => ($active ? "var(--background)" : "transparent")};
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
  cursor: pointer;
  margin-bottom: -1px;
  align-items: flex-start;
  flex: 1;
`;

const TabTitle = styled.span<{ $active: boolean }>`
  font-size: 20px;
  font-weight: 400;
  ${({ $active }) =>
    $active
      ? `
      background: linear-gradient(150deg, var(--purple-start) 0%, var(--purple-end) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    `
      : `color: var(--sea-ink);`}
`;

const TabBottom = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
`;

const TabCount = styled.span<{ $active: boolean }>`
  font-size: 38px;
  font-weight: 400;
  line-height: 1.2;
  ${({ $active }) =>
    $active
      ? `
      background: linear-gradient(122deg, var(--purple-start) 0%, var(--purple-end) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    `
      : `color: var(--foreground);`}
`;

const ContentPanel = styled.div<{ $hasContent: boolean }>`
  flex: 1;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 8px;
  border-start-start-radius: 0;
  position: relative;
  display: flex;
  min-height: 310px;
  max-height: 310px;
  ${({ $hasContent }) =>
    $hasContent
      ? `
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-start;
      overflow: hidden;
    `
      : `
      align-items: center;
      justify-content: center;
    `}
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TaskRow = styled.div`
  display: flex;
  align-items: center;
  height: 44px;
  background: rgba(0, 0, 0, 0.02);

  &:nth-of-type(even) {
    background: rgba(0, 0, 0, 0);
  }
`;

const TitleCellWrapper = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 100%;
  padding: 10px 12px;
  background: var(--background);
  direction: rtl;
  border: 0.5px solid rgba(0, 0, 0, 0.01);
`;

const FixedCell = styled.div<{ $width: number }>`
  width: ${({ $width }) => $width}px;
  flex-shrink: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  padding-inline: 12px;
  background: var(--background);
  direction: rtl;
  border: 0.5px solid rgba(0, 0, 0, 0.01);
`;
