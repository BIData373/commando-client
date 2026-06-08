import { useMemo } from "react"
import type { TaskDto } from "src/api/model"
import { matchesQuickFilter } from "src/functions/filter-utils"
import type { QuickFilter } from "src/utils/filter-utils"
import { useFuse } from "./useFuse"

export function useFilteredTasks<TTask extends TaskDto>(
	tasks: TTask[],
	activeQuickFilters: Set<QuickFilter>,
	activeTopicFilters: Set<string>,
	searchQuery: string,
) {
	const searchedTasks = useFuse(tasks, searchQuery, {
		threshold: 0.5,
		keys: ["title", "description", "notes"],
	})

	return useMemo(() => {
		const hasQuickFilters = activeQuickFilters.size > 0
		const hasTopicFilters = activeTopicFilters.size > 0

		return hasQuickFilters || hasTopicFilters
			? searchedTasks.filter(
					(t) =>
						(hasQuickFilters &&
							Array.from(activeQuickFilters).some((f) =>
								matchesQuickFilter(t, f),
							)) ||
						(hasTopicFilters &&
							t.tags.some((tag) => activeTopicFilters.has(tag.name))),
				)
			: searchedTasks
	}, [activeQuickFilters, activeTopicFilters, searchQuery, searchedTasks])
}
