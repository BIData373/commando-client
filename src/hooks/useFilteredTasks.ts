import Fuse from "fuse.js"
import { useMemo } from "react"
import type { TaskDto } from "src/api/model"
import { matchesQuickFilter } from "src/functions/filter-utils"
import type { QuickFilter } from "src/utils/filter-utils"

const FUSE_OPTIONS = {
	threshold: 0.4,
	keys: ["title", "description", "notes"],
}

export function useFilteredTasks<TTask extends TaskDto>(
	tasks: TTask[],
	activeQuickFilters: Set<QuickFilter>,
	activeTopicFilters: Set<string>,
	searchQuery: string,
) {
	const fuse = useMemo(() => new Fuse(tasks, FUSE_OPTIONS), [tasks])

	return useMemo(() => {
		let result = searchQuery.trim()
			? fuse.search(searchQuery).map((r) => r.item)
			: tasks

		const hasQuickFilters = activeQuickFilters.size > 0
		const hasTopicFilters = activeTopicFilters.size > 0

		if (hasQuickFilters || hasTopicFilters) {
			result = result.filter((t) => {
				const matchesQuick =
					hasQuickFilters &&
					Array.from(activeQuickFilters).some((f) => matchesQuickFilter(t, f))
				const matchesTopic =
					hasTopicFilters &&
					t.tags.some((tag) => activeTopicFilters.has(tag.name))
				return matchesQuick || matchesTopic
			})
		}

		return result
	}, [fuse, tasks, activeQuickFilters, activeTopicFilters, searchQuery])
}
