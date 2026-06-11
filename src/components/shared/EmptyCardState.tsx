import styled from "@emotion/styled"
import type { PropsWithChildren, ReactNode } from "react"

export interface EmptyCardStateProps extends PropsWithChildren {
	imgSrc?: string
	title: ReactNode
	description?: string
}

export const EmptyCardState = ({
	imgSrc,
	title,
	description,
	children,
}: EmptyCardStateProps) => {
	return (
		<EmptyState>
			{imgSrc && <EmptyImage src={imgSrc} alt="" />}

			<EmptyTitle>{title}</EmptyTitle>

			{description && (
				<EmptyDescription>
					{description.split("\n").map((line) => (
						<span key={line}>{line}</span>
					))}
				</EmptyDescription>
			)}

			{children}
		</EmptyState>
	)
}

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 24px;
  max-width: none;
  text-align: center;
`

const EmptyTitle = styled.p`
  font-size: var(--fs-xl);
  font-weight: 500;
  color: var(--sea-ink);
  margin: 0;
`

const EmptyDescription = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: var(--fs-btn);
  color: var(--sea-ink-soft);
  margin: 0 0 12px;
  line-height: 22px;
`

const EmptyImage = styled.img`
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1/1;
`
