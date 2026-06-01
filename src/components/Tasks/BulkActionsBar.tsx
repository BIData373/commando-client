import styled from "@emotion/styled";
import { Archive, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { WorkspaceStatusDto } from "src/api/model";
import { useWorkspace } from "src/providers/WorkspaceProvider";
import { StatusTag } from "../shared/StatusTag";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DeletePopover } from "./DeletePopover";

interface BulkActionsBarProps {
  selectedCount: number;
  onChangeStatus: (status: WorkspaceStatusDto) => void;
  onArchive: () => void;
  onDelete: () => void;
  onExitSelect: () => void;
}

export function BulkActionsBar({
  selectedCount,
  onChangeStatus,
  onArchive,
  onDelete,
  onExitSelect,
}: BulkActionsBarProps) {
  const { statuses } = useWorkspace()
  const [popoverOpen, setPopoverOpen] = useState(false);

  function handleDeleteClick() {
    setPopoverOpen(true);
  }

  return (
    <Bar>
      <ActionsSection>
        <DeletePopover
          count={selectedCount}
          onConfirm={onDelete}
          open={popoverOpen}
          onOpenChange={setPopoverOpen}
          trigger={
            <GhostButton $danger onClick={handleDeleteClick}>
              מחק הנחיה
              <Trash2 size={16} />
            </GhostButton>
          }
        />
        <GhostButton onClick={onArchive}>
          העבר לארכיון
          <Archive size={16} />
        </GhostButton>
        <BarDivider />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <GhostButton>עדכן סטטוס</GhostButton>
          </DropdownMenuTrigger>
          <StatusContent align="start" sideOffset={12}>
            {Object.values(statuses).map((s) => (
              <StatusItem key={s.id} onSelect={() => onChangeStatus(s)}>
                <StatusTag status={s} />
              </StatusItem>
            ))}
          </StatusContent>
        </DropdownMenu>
      </ActionsSection>
      <SelectedButton onClick={onExitSelect}>
        <X size={16} />
        {selectedCount} משימות נבחרו
      </SelectedButton>
    </Bar>
  );
}

const Bar = styled.div`
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--z-dropdown);
  direction: ltr;
  width: 627px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 11px;
  background: var(--Colors-Base-Geekblue-1);
  border: 1px solid var(--Border-color-border-secondary);
  border-radius: 8px;
  box-shadow: var(--card-shadow-hover);
`;

const ActionsSection = styled.div`
  display: flex;
  flex: 1 0 0;
  align-items: center;
  gap: 8px;
`;

const GhostButton = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 32px;
  padding-inline: 12px;
  border: none;
  border-radius: 2px;
  background: transparent;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  color: ${({ $danger }) => ($danger ? "var(--Error-color-error)" : "var(--Text-color-text)")};
  cursor: pointer;
  white-space: nowrap;

  &:hover,
  &[data-state="open"] {
    background: var(--Background-color-bg-text-active-bar);
  }
`;

const BarDivider = styled.div`
  width: 1px;
  height: 20px;
  background: var(--Border-color-border);
  flex-shrink: 0;
`;

const SelectedButton = styled.button`
direction: rtl;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 32px;
  padding-inline: 15px;
  background: var(--Components-Button-Component-defaultBg);
  border: 1px solid var(--Border-color-border);
  border-radius: 6px;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--Text-color-text);
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background: var(--Background-color-bg-text-active-bar);
    border-color: var(--Border-color-border);
  }
`;

const StatusContent = styled(DropdownMenuContent)`
  min-width: 100px;
  padding: 8px 4px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  box-shadow: var(--card-shadow-hover);
`;

const StatusItem = styled(DropdownMenuItem)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  outline: none;

  &[data-highlighted],
  &:hover {
    background: var(--selected-item);
    color: inherit;
  }
`;
