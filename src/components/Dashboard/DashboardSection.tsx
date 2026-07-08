import styled from "@emotion/styled"
import type { ReactNode } from "react"

interface DashboardSectionProps {
	tabButtons: ReactNode
	children: ReactNode
	gap: number
}

export function DashboardSection({
	tabButtons,
	children,
	gap,
}: DashboardSectionProps) {
	return (
		<Section $gap={gap}>
			{tabButtons}
			<ContentPanel>{children}</ContentPanel>
		</Section>
	)
}

const Section = styled.div<{ $gap: number }>`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => $gap}px;

  @media (max-width: 1300px) {
    grid-column: 1 / -1;
  }
`

const ContentPanel = styled.div`
  min-height: 352px;
  max-height: 352px;
  background: var(--background);
  border-radius: 8px;
  overflow: hidden;

  [data-slot="table-container"] {
    overflow-y: auto;
    max-height: 352px;
    direction: ltr;
  }

  table {
    direction: rtl;
    width: 100%;
  }

  [data-slot="table-row"] {
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.04);
    height: 44px;
  }
  
  [data-slot="table-cell"] {
    height: 44px;
    padding-block: 0;
    vertical-align: middle;
    border-inline-start: 0.5px solid rgba(0, 0, 0, 0.04);
  }


  [data-slot="table-cell"]:first-child {
    border-inline-start: none;
    max-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`
