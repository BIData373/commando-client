import styled from "@emotion/styled"
import type { ReactNode } from "react"

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
	let content: ReactNode = text

	if (normalizedQuery) {
		const escapedQuery = normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
		const regex = new RegExp(`(${escapedQuery})`, "gi")
		const parts = text.split(regex)

		const Highlight = variant === "mark" ? HighlightMark : HighlightBold

		content = parts.map((part, index) => {
			const isMatch = part.toLowerCase() === normalizedQuery.toLowerCase()
			const key = `${part}-${index}`
			return isMatch ? (
				<Highlight key={`match-${key}`}>{part}</Highlight>
			) : (
				<span key={`text-${key}`}>{part}</span>
			)
		})
	}

	return <TextWrapper dir="auto">{content}</TextWrapper>
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
