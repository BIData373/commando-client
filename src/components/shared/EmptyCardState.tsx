import styled from "@emotion/styled"
import type { PropsWithChildren, ReactNode } from "react"

export interface EmptyCardStateProps extends PropsWithChildren {
	imgSrc?: string
	title: ReactNode
	description?: string
	isChildTitleIcon?: boolean
}

export const EmptyCardState = ({
	imgSrc,
	title,
	description,
	children,
	isChildTitleIcon = false,
}: EmptyCardStateProps) => {
	return (
		<EmptyState>
			{imgSrc && <EmptyImage src={imgSrc} alt="" />}
			{isChildTitleIcon ? (
				<TitleContainer>
					{children}
					<EmptyTitle>{title}</EmptyTitle>
				</TitleContainer>
			) : (
				<EmptyTitle>{title}</EmptyTitle>
			)}

			{description && (
				<EmptyDescription>
					{description.split("\n").map((line) => (
						<span key={line}>{line}</span>
					))}
				</EmptyDescription>
			)}

			{isChildTitleIcon ? null : children}
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
  line-height: 22px;
  direction: rtl;
`

const EmptyImage = styled.img`
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1/1;
`
const TitleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`
