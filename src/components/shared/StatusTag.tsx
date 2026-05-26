import styled from '@emotion/styled'
import { ChevronDown } from 'lucide-react'

export type DirectiveStatus = 'not_started' | 'in_progress' | 'completed'

export const STATUS_LABELS: Record<DirectiveStatus, string> = {
  not_started: 'טרם בוצע',
  in_progress: 'בעבודה',
  completed: 'בוצע',
}

export const STATUS_KEYS: DirectiveStatus[] = ['not_started', 'in_progress', 'completed']

export function getStatusStyle(status: DirectiveStatus) {
  switch (status) {
    case 'not_started': return { fontColor: 'var(--Colors-Base-Volcano-6)', bgColor: 'var(--Colors-Base-Volcano-1)' }
    case 'in_progress': return { fontColor: 'var(--Colors-Base-Geekblue-6)', bgColor: 'var(--Colors-Base-Geekblue-1)' }
    case 'completed': return { fontColor: 'var(--Colors-Base-Green-6)', bgColor: 'var(--Colors-Base-Green-1)' }
  }
}

interface StatusTagProps {
  status: DirectiveStatus
  interactive?: boolean
  showChevron?: boolean
}

export function StatusTag({ status, interactive, showChevron }: StatusTagProps) {
  return (
    <Tag $status={status} $interactive={interactive}>
      {showChevron && <StyledChevron size={12} />}
      {STATUS_LABELS[status]}
    </Tag>
  )
}

const Tag = styled.span<{ $status: DirectiveStatus; $interactive?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 76px;
  gap: 2px;
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

const StyledChevron = styled(ChevronDown)`
  color: var(--Components-Dropdown-Global-colorTextDescription);
`
