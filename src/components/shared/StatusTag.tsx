import styled from '@emotion/styled'

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

interface StatusTagProps {
  status: DirectiveStatus
  interactive?: boolean
}

export function StatusTag({ status, interactive }: StatusTagProps) {
  return (
    <Tag $status={status} $interactive={interactive}>
      {STATUS_LABELS[status]}
    </Tag>
  )
}

const Tag = styled.span<{ $status: DirectiveStatus; $interactive?: boolean }>`
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
