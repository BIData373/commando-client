import styled from '@emotion/styled'

export enum DeadlineType {
  Date = 'date',
  Immediate = 'immediate',
  Ongoing = 'ongoing',
}

export const DEADLINE_LABELS: Record<DeadlineType, string> = {
  [DeadlineType.Date]: 'תאריך',
  [DeadlineType.Ongoing]: 'שוטף',
  [DeadlineType.Immediate]: 'מיידי',
}

const DeadlineTag = styled.span<{ $type: DeadlineType }>`
  display: inline-flex;
  align-items: center;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  ${({ $type }) => {
    switch ($type) {
      case DeadlineType.Ongoing:
        return `
          background: var(--Colors-Base-Blue-1);
          border: 1px solid var(--Colors-Base-Blue-3);
          color: var(--Colors-Base-Blue-6);
        `
      case DeadlineType.Immediate:
        return `
          background: var(--Colors-Base-Red-1);
          border: 1px solid var(--Colors-Base-Red-3);
          color: var(--Colors-Base-Red-6);
        `
      case DeadlineType.Date:
        return `
          background: var(--chip-bg);
          border: 1px solid var(--chip-line);
          color: var(--sea-ink-soft);
        `
    }
  }}
`

export default DeadlineTag
