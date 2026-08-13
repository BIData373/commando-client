import styled from "@emotion/styled"

interface HighlightMatchProps {
	text: string
	query: string
	variant?: "mark" | "bold"
}

const HighlightMatch = ({
	text,
	query,
	variant = "bold",
}: HighlightMatchProps) => {
	const normalizedQuery = query.trim()

	if (!normalizedQuery) {
		return <TextWrapper dir="auto">{text}</TextWrapper>
	}

	const escapedQuery = normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

	const regex = new RegExp(`(${escapedQuery})`, "gi")
	const parts = text.split(regex)

	const Highlight = variant === "mark" ? HighlightMark : HighlightBold

	let position = 0

	return (
		<TextWrapper dir="auto">
			{parts.map((part) => {
				const startPosition = position
				position += part.length

				const isMatch = part.toLowerCase() === normalizedQuery.toLowerCase()

				return isMatch ? (
					<Highlight key={`match-${startPosition}`}>{part}</Highlight>
				) : (
					<span key={`text-${startPosition}`}>{part}</span>
				)
			})}
		</TextWrapper>
	)
}

export default HighlightMatch

// ─── Styles ──────────────────────────────────────────────────────────────────

const HighlightMark = styled.mark`
  background: rgba(255, 235, 130, 0.7);
  color: inherit;
  border-radius: 2px;
  padding: 0 1px;
`

const HighlightBold = styled.span`
  font-weight: 700;
`

const TextWrapper = styled.span`
  unicode-bidi: isolate;
`
