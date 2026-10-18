import styled from "@emotion/styled"
import { useDisclosure } from "@mantine/hooks"
import type { ReactNode } from "react"
import type { TaskRowDto } from "src/api/model"
import { LoadingSpinner } from "src/components/shared/LoadingSpinner"
import type { StatusTaskCount } from "src/functions/status-counts"
import { useFilteredTasks } from "src/hooks/useFilteredTasks"
import { useTasksFilters } from "src/providers/TasksFiltersProvider"
import MobileHeader from "./MobileHeader"
import MobileFilterSheet, {
	matchesColumnFilters,
} from "./Workspace/MobileFilterSheet"
import MobileTasksToolbar from "./Workspace/MobileTasksToolbar"

interface MobileTasksPageProps<T extends TaskRowDto> {
	title: string
	icon?: string | null
	tasks: T[]
	isLoading: boolean
	statusSegments: StatusTaskCount[]
	renderCard(task: T, searchQuery: string): ReactNode
}

export default function MobileTasksPage<T extends TaskRowDto>({
	title,
	icon,
	tasks,
	isLoading,
	statusSegments,
	renderCard,
}: MobileTasksPageProps<T>) {
	const { searchQuery, columnsFilters } = useTasksFilters()

	const [filterSheetOpen, filterSheet] = useDisclosure()
	const [searchFocused, searchFocus] = useDisclosure()
	const searchActive = searchFocused || searchQuery !== ""

	function matchesActiveColumnFilters(task: T): boolean {
		return matchesColumnFilters(task, columnsFilters)
	}

	// An always-true filter would be OR'ed with the quick filters and cancel them out
	const filtered = useFilteredTasks(tasks, {
		additionalFilter:
			columnsFilters.length > 0 ? matchesActiveColumnFilters : undefined,
	})

	return (
		<PageRoot>
			<MobileHeader icon={icon} title={title} minimal={searchFocused} />

			<Content>
				<MobileTasksToolbar
					tasks={tasks}
					statusSegments={statusSegments}
					matchCount={filtered.length}
					searchActive={searchActive}
					onSearchFocus={searchFocus.open}
					onSearchBlur={searchFocus.close}
					onOpenFilters={filterSheet.open}
				/>

				<CardList>
					{isLoading ? (
						<CenteredState>
							<LoadingSpinner />
						</CenteredState>
					) : filtered.length === 0 ? (
						<EmptyState>לא נמצאו הנחיות</EmptyState>
					) : (
						filtered.map((task) => renderCard(task, searchQuery))
					)}
				</CardList>
			</Content>

			<MobileFilterSheet
				open={filterSheetOpen}
				onClose={filterSheet.close}
				tasks={tasks}
				filteredCount={filtered.length}
			/>
		</PageRoot>
	)
}

const PageRoot = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	background: var(--background-mobile);

	button,
	[role="button"] {
		&:active:not(:disabled) {
			opacity: 0.7;
		}
	}
`

const Content = styled.div`
	direction: ltr;
	display: flex;
	flex-direction: column;
	gap: 12px;
	padding: 12px 16px;
	flex: 1;
	min-height: 0;
	overflow-y: auto;

	&::-webkit-scrollbar {
		display: none;
	}

	scrollbar-width: none;
`

const CardList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	flex: 1;
	min-height: 0;
`

const CenteredState = styled.div`
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: center;
`

const EmptyState = styled(CenteredState)`
	color: var(--sea-ink-soft);
	font-size: var(--fs-base);
`
