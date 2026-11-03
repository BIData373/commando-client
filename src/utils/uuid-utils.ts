const UUID_VERSION_4 = 0x40
const UUID_VARIANT_RFC4122 = 0x80

// crypto.randomUUID requires Chrome 92+; getRandomValues works on Chrome 83
export function generateUuid(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(16))

	bytes[6] = (bytes[6] & 0x0f) | UUID_VERSION_4
	bytes[8] = (bytes[8] & 0x3f) | UUID_VARIANT_RFC4122

	const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"))

	return [
		hex.slice(0, 4),
		hex.slice(4, 6),
		hex.slice(6, 8),
		hex.slice(8, 10),
		hex.slice(10, 16),
	]
		.map((part) => part.join(""))
		.join("-")
}
