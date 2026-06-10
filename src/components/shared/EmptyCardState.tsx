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
			{imgSrc && (
				<EmptyIconWrapper>
					<img src={imgSrc} alt="" style={{ aspectRatio: "1/1" }} />
				</EmptyIconWrapper>
			)}
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
  max-width: none;
  text-align: center;
`

const EmptyTitle = styled.p`
  font-size: 15px;
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
`

const EmptyIconWrapper = styled.div`
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--purple-start);
`
