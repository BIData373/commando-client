import styled from '@emotion/styled'
import { DEADLINE_LABELS, type DeadlineType } from '../Tasks/TaskTable'

interface DeadlineTagProps {
    deadlineType: DeadlineType
}

export const DeadlineTag = ({ deadlineType }: DeadlineTagProps) => {
    return (
        <Tag $type={deadlineType}>
            {DEADLINE_LABELS[deadlineType]}
        </Tag>
    )
}

const Tag = styled.span<{ $type: DeadlineType }>`
  display: inline-flex;
  align-items: center;
  padding: 1px 8px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
  ${({ $type }) => {
        switch ($type) {
            case 'ongoing':
                return `
          background: rgba(230, 244, 255, 0.8);
          border: 1px solid rgba(145, 202, 255, 0.8);
          color: rgba(22, 119, 255, 0.9);
        `
            case 'immediate':
                return `
          background: #FFF1F0;
          border: 1px solid #FFA39E;
          color: #F5222D;
        `
            default:
                return `
          background: var(--chip-bg);
          border: 1px solid var(--chip-line);
          color: var(--sea-ink-soft);
        `
        }
    }}
`