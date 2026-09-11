export interface BatchResult {
	succeeded: number
	failed: number
}

export async function runBatch<TItem>(
	items: TItem[],
	run: (item: TItem) => Promise<unknown>,
): Promise<BatchResult> {
	const results = await Promise.allSettled(items.map(run))
	const succeeded = results.filter(
		({ status }) => status === "fulfilled",
	).length

	return { succeeded, failed: results.length - succeeded }
}
