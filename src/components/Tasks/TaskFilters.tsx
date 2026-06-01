import styled from "@emotion/styled";
import type { ReactNode } from "react";
import { QuickFilter } from "src/utils/filterUtils";
import { matchesQuickFilter } from "../../functions/filter-utils";
import type { TaskColumnMeta } from "../../hooks/useTaskColumns";
import { useTasks } from "../../providers/TasksProvider";
import { FilterBar, FilterDivider, FilterPill } from "../shared/FilterBar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface TaskFiltersProps {
	onClearAllFilters: () => void;
	onExport: () => void;
	hasExtraActiveFilters?: boolean;
	extraFilters?: ReactNode;
	extraColumnsMeta?: TaskColumnMeta[];
	tabFilter: QuickFilter[];
	onToggleTabFilter: (filter: QuickFilter) => void;
}

function TaskFilters({
	onClearAllFilters,
	onExport,
	hasExtraActiveFilters,
	extraFilters,
	extraColumnsMeta,
	tabFilter,
	onToggleTabFilter,
}: TaskFiltersProps) {
	const {
		tasks,
		searchQuery,
		setSearchQuery,
		columnOrder,
		setColumnOrder,
		hiddenColumns,
		toggleColumn,
	} = useTasks();

	const hasActiveFilters = tabFilter.length > 0 || !!hasExtraActiveFilters;

	const overdueCount = tasks.filter((t) =>
		matchesQuickFilter(t, QuickFilter.OVERDUE),
	).length;
	const approachingCount = tasks.filter((t) =>
		matchesQuickFilter(t, QuickFilter.APPROACHING),
	).length;
	const flaggedCount = tasks.filter((t) =>
		matchesQuickFilter(t, QuickFilter.FLAGGED),
	).length;

	return (
		<FilterBar
			hasActiveFilters={hasActiveFilters}
			onClearAll={onClearAllFilters}
			searchQuery={searchQuery}
			onSearchChange={setSearchQuery}
			onExport={onExport}
			columnOrder={columnOrder}
			hiddenColumns={hiddenColumns}
			onColumnOrderChange={setColumnOrder}
			onToggleColumn={toggleColumn}
			extraColumnsMeta={extraColumnsMeta}
		>
			{extraFilters}

			<FilterPill
				$active={tabFilter.includes(QuickFilter.FLAGGED)}
				onClick={() => onToggleTabFilter(QuickFilter.FLAGGED)}
			>
				חשובות{flaggedCount > 0 && ` (${flaggedCount})`}
			</FilterPill>

			<Tooltip>
				<WarningTrigger>
					<FilterPill
						$active={tabFilter.includes(QuickFilter.APPROACHING)}
						onClick={() => onToggleTabFilter(QuickFilter.APPROACHING)}
					>
						תג"ב מתקרב{approachingCount > 0 && ` (${approachingCount})`}
					</FilterPill>
				</WarningTrigger>

				<TooltipContent>תג"ב בעוד 2 ימים או פחות</TooltipContent>
			</Tooltip>

			<FilterPill
				$active={tabFilter.includes(QuickFilter.OVERDUE)}
				onClick={() => onToggleTabFilter(QuickFilter.OVERDUE)}
			>
				חריגה מתג"ב{overdueCount > 0 && ` (${overdueCount})`}
			</FilterPill>

			<FilterDivider />

			<FilterPill $active={!hasActiveFilters} onClick={onClearAllFilters}>
				הכל ({tasks.length})
			</FilterPill>
		</FilterBar>
	);
}

export { TaskFilters };

const WarningTrigger = styled(TooltipTrigger)`
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  cursor: default;
  line-height: 0;
`;
