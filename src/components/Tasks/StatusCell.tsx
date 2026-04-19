import styled from '@emotion/styled'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '../ui/dropdown-menu'

export type DirectiveStatus = 'not_started' | 'in_progress' | 'completed'

export const STATUS_LABELS: Record<DirectiveStatus, string> = {
  not_started: 'טרם בוצע',
  in_progress: 'בעבודה',
  completed: 'בוצע',
}

export const STATUS_KEYS: DirectiveStatus[] = ['not_started', 'in_progress', 'completed']

export function getStatusStyle(status: DirectiveStatus) {
  switch (status) {
    case 'not_started': return { fontColor: '#FA541C', bgColor: '#FFF2E8' }
    case 'in_progress': return { fontColor: '#2F54EB', bgColor: '#F0F5FF' }
    case 'completed': return { fontColor: '#52c41a', bgColor: '#f6ffed' }
  }
}

interface StatusCellProps {
  status: DirectiveStatus
  taskId: number
  onUpdate: (taskId: number, status: DirectiveStatus) => void
}

export function StatusCell({ status, taskId, onUpdate }: StatusCellProps) {
  function handleSelectStatus(newStatus: DirectiveStatus) {
    onUpdate(taskId, newStatus)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <StatusChip $status={status} $interactive tabIndex={0}>
          {STATUS_LABELS[status]}
        </StatusChip>
      </DropdownMenuTrigger>
      <StatusDropdownContent align="center" sideOffset={6}>
        {STATUS_KEYS.map((s) => (
          <StatusDropdownItem key={s} $selected={s === status} onSelect={() => handleSelectStatus(s)}>
            <StatusChip $status={s}>{STATUS_LABELS[s]}</StatusChip>
          </StatusDropdownItem>
        ))}
      </StatusDropdownContent>
    </DropdownMenu>
  )
}

export const StatusChip = styled.span<{ $status: DirectiveStatus; $interactive?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  padding: 1px 8px;
  border-radius: 999px;
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
  cursor: ${({ $interactive }) => ($interactive ? 'pointer' : 'default')};
  ${({ $status }) => {
    const { fontColor, bgColor } = getStatusStyle($status)
    return `
      background: ${bgColor};
      color: ${fontColor};
    `
  }}

  :focus-visible {
    outline: none;
}
`

const StatusDropdownContent = styled(DropdownMenuContent)`
  width: 100px;
  min-width: 100px;
  padding: 8px 4px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.08),
    0px 3px 6px rgba(0, 0, 0, 0.12),
    0px 9px 28px rgba(0, 0, 0, 0.05);
`

const StatusDropdownItem = styled(DropdownMenuItem) <{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 4px;
  border-radius: 4px;
  background: ${({ $selected }) => ($selected ? 'rgba(230, 244, 255, 1)' : 'transparent')};
  cursor: pointer;
  outline: none;

  &[data-highlighted],
  &:hover {
    background: rgba(230, 244, 255, 1);
    color: inherit;
  }
`
