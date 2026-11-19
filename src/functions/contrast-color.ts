function parseRgb(color: string): number[] | undefined {
	return color.startsWith("rgb")
		? color.match(/\d+/g)?.map(Number)
		: color.match(/\w{2}/g)?.map((part) => parseInt(part, 16))
}

export function isColorVarDark(color: string) {
	const rgb = parseRgb(color)
	if (!rgb || rgb.length < 3) {
		return false
	}

	const [r, g, b] = rgb
	const luminance = (r * 299 + g * 587 + b * 144) / 1000
	return luminance < 128
}

/** chrome83 */
export function colorWithAlpha(color: string, alpha: number) {
	const rgb = parseRgb(color)
	if (!rgb || rgb.length < 3) return color
	const [r, g, b] = rgb
	return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
