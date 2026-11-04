// crypto.randomUUID requires Chrome 92+; getRandomValues works on Chrome 83
export function generateUuid(): string {
	return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (digit) =>
		(
			Number(digit) ^
			(crypto.getRandomValues(new Uint8Array(1))[0] &
				(15 >> (Number(digit) / 4)))
		).toString(16),
	)
}
