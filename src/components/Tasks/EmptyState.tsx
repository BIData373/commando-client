import styled from "@emotion/styled"
import emptyStateImage from "../../../public/empty-state.svg"
import noResultsFoundImage from "../../assets/no-results-found.svg"

interface EmptyStateProps {
	variant?: "default" | "search"
}

function EmptyState({ variant = "default" }: EmptyStateProps) {
	const isDefault = variant === "default"

	return (
		<Container>
			<IconWrapper>
				<img
					src={isDefault ? emptyStateImage : noResultsFoundImage}
					width={100}
					height={100}
					alt="no-results"
				/>
			</IconWrapper>
			<Title>{isDefault ? "טרם נוצרו הנחיות" : "לא הצלחנו למצוא הנחיות"}</Title>
			<Subtitle>
				{isDefault
					? "לאחר שהנחיות יוצרו, ההנחיות האחרונות יופיעו כאן"
					: "יש לנסות ניסוח אחר או לבדוק אם ההנחיה נמצאת בארכיון"}
			</Subtitle>
		</Container>
	)
}

export { EmptyState }

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding-block: 72px;
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  margin-block-end: 8px;
  color: var(--sea-ink-soft);
  opacity: 0.4;
`

const Title = styled.p`
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  color: #1e2939;
`

const Subtitle = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: #6a7282;
  text-align: center;
  max-width: 262px;
`
