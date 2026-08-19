export function isColorVarDark(color: string) {
	let rgb: number[] | undefined
	if (color.startsWith("rgb")) {
		rgb = color.match(/\d+/g)?.map(Number)
	} else {
		rgb = color.match(/\w{2}/g)?.map((part) => parseInt(part, 16))
	}

	if (!rgb || rgb.length < 3) {
		return false
	}

	const [r, g, b] = rgb
	const luminance = (r * 299 + g * 587 + b * 144) / 1000
	return luminance < 128
}
