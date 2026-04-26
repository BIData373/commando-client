import styled from '@emotion/styled'
import { Archive, Trash2, X } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { StatusTag, type DirectiveStatus, STATUS_KEYS } from './StatusCell'
import { DeletePopover } from './DeletePopover'

interface BulkActionsBarProps {
  selectedCount: number
  onChangeStatus: (status: DirectiveStatus) => void
  onArchive: () => void
  onDelete: () => void
  onExitSelect: () => void
}

export function BulkActionsBar({
  selectedCount,
  onChangeStatus,
  onArchive,
  onDelete,
  onExitSelect,
}: BulkActionsBarProps) {
  return (
    <Bar>
      <ActionsSection>
        <DeletePopover
          count={selectedCount}
          onConfirm={onDelete}
          trigger={
            <GhostButton $danger>
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
          <StatusContent align="start" sideOffset={4}>
            {STATUS_KEYS.map((s) => (
              <StatusItem key={s} onSelect={() => onChangeStatus(s)}>
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
  )
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
  background: #131629;
  border: 1px solid #303030;
  border-radius: 8px;
  box-shadow:
    0px 6px 16px 0px rgba(0, 0, 0, 0.08),
    0px 3px 6px -4px rgba(0, 0, 0, 0.12),
    0px 9px 28px 8px rgba(0, 0, 0, 0.05);
`

const ActionsSection = styled.div`
  display: flex;
  flex: 1 0 0;
  align-items: center;
  gap: 8px;
`

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
  color: ${({ $danger }) => ($danger ? '#dc4446' : 'rgba(255, 255, 255, 0.85)')};
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`

const BarDivider = styled.div`
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
`

const SelectedButton = styled.button`
direction: rtl;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 32px;
  padding-inline: 15px;
  background: #141414;
  border: 1px solid #424242;
  border-radius: 6px;
  box-shadow: 0px 2px 0px 0px rgba(255, 255, 255, 0.04);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background: #1f1f1f;
    border-color: #535353;
  }
`

const StatusContent = styled(DropdownMenuContent)`
  min-width: 120px;
  padding: 8px 4px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  box-shadow:
    0px 6px 16px rgba(0, 0, 0, 0.08),
    0px 3px 6px rgba(0, 0, 0, 0.12),
    0px 9px 28px rgba(0, 0, 0, 0.05);
`

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
    background: rgba(230, 244, 255, 1);
    color: inherit;
  }
`

