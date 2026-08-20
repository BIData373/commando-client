import styled from "@emotion/styled"
import { useMemo } from "react"

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

	const content = useMemo(() => {
		if (!normalizedQuery) return text

		const escapedQuery = normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
		const regex = new RegExp(`(${escapedQuery})`, "gi")
		const parts = text.split(regex)

		const Highlight = variant === "mark" ? HighlightMark : HighlightBold
		const normalizedQueryLowerCase = normalizedQuery.toLowerCase()

		return parts.map((part, index) => {
			const isMatch = part.toLowerCase() === normalizedQueryLowerCase
			const key = `${part}-${index}`

			return isMatch ? (
				<Highlight key={`match-${key}`}>{part}</Highlight>
			) : (
				<span key={`text-${key}`}>{part}</span>
			)
		})
	}, [normalizedQuery, text, variant])

	return <span>{content}</span>
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
