const PUNCTUATION_REGEX = /[^\p{L}\p{N}\s]/gu
const WHITESPACE_RUN_REGEX = /\s+/gu
const SPACE = " "

/**
 * Lowercase, strip punctuation/symbols, collapse whitespace runs and trim.
 */
export function normalizeSearchText(text: string): string {
	return text
		.replace(PUNCTUATION_REGEX, "")
		.replace(WHITESPACE_RUN_REGEX, SPACE)
		.trim()
		.toLowerCase()
}
