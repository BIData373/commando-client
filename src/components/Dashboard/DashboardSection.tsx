import styled from "@emotion/styled"
import type { ReactNode } from "react"

interface DashboardSectionProps {
	title: string
	viewMore: ReactNode
	children: ReactNode
}

export function DashboardSection({
	title,
	viewMore,
	children,
}: DashboardSectionProps) {
	return (
		<Section>
			<SectionTitle>{title}</SectionTitle>
			{children}
			{viewMore}
		</Section>
	)
}

const Section = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 1300px) {
    grid-column: 1 / -1;
  }
`

const SectionTitle = styled.h2`
  margin: 0;
  font-size: var(--fs-heading-2);
  font-weight: 400;
  color: var(--sea-ink);
  text-align: start;
`
