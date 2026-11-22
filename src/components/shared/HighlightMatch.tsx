import styled from "@emotion/styled"
import { memo, useMemo } from "react"

interface HighlightMatchProps {
	text: string
	query: string
	variant?: "mark" | "bold"
}

// Hebrew geresh/gershayim, standard quotes, hyphens, and common punctuation
const PUNCTUATION_PATTERN = `[\u05F3\u05F4\`'"\\-_.,!?;:]*`
const PUNCTUATION_REGEX = new RegExp(PUNCTUATION_PATTERN, "g")
const WHITESPACE_REGEX = /\s+/
const REGEX_SPECIAL_CHARS = /[.*+?^${}()|[\]\\]/g
// At least one whitespace between words, with optional punctuation around it ("hello, world")
const WORD_SEPARATOR_PATTERN = `(?:${PUNCTUATION_PATTERN}\\s)+${PUNCTUATION_PATTERN}`

const HighlightMatch = memo(
	({ text, query, variant = "bold" }: HighlightMatchProps) => {
		const normalizedQuery = query.trim()

		const content = useMemo(() => {
			if (!normalizedQuery) return text

			// 1. Split query by whitespace runs and strip punctuation; drop words that were only punctuation (".", "-")
			const words = normalizedQuery
				.split(WHITESPACE_REGEX)
				.map((word) => word.replace(PUNCTUATION_REGEX, ""))
				.filter(Boolean)
			if (words.length === 0) return text

			// 2. Build regex for each word allowing optional punctuation between characters
			const wordPatterns = words.map((word) =>
				[...word]
					.map((char) => char.replace(REGEX_SPECIAL_CHARS, "\\$&"))
					.join(PUNCTUATION_PATTERN),
			)

			// 3. Join words so "hello      world" matches "hello world", "hello   world" or "hello, world"
			const regexPattern = wordPatterns.join(WORD_SEPARATOR_PATTERN)

			const regex = new RegExp(`(${regexPattern})`, "gi")
			const parts = text.split(regex)

			if (parts.length === 1) return text

			const Highlight = variant === "mark" ? HighlightMark : HighlightBold

			return parts.map((part, index) => {
				// split() with one capturing group puts matches at odd indexes
				const isMatch = index % 2 === 1

				const key = `${part}-${index}`

				return isMatch ? (
					<Highlight key={`match-${key}`}>{part}</Highlight>
				) : (
					<span key={`text-${key}`}>{part}</span>
				)
			})
		}, [normalizedQuery, text, variant])

		return <span>{content}</span>
	},
)

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
