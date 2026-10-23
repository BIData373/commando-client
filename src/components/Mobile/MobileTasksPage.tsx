import styled from "@emotion/styled"
import { useDisclosure } from "@mantine/hooks"
import { type ReactNode, useRef } from "react"
import type { TaskRowDto } from "src/api/model"
import { LoadingSpinner } from "src/components/shared/LoadingSpinner"
import type { StatusTaskCount } from "src/functions/status-counts"
import { useFilteredTasks } from "src/hooks/useFilteredTasks"
import { useHeadlessTable } from "src/hooks/useHeadlessTable"
import { useTasksFilters } from "src/providers/TasksFiltersProvider"
import { buildCountingColumns } from "src/utils/task-table-utils"
import MobileHeader from "./MobileHeader"
import MobileFilterSheet from "./Workspace/MobileFilterSheet"
import MobileTaskList from "./Workspace/MobileTaskList"
import MobileTasksToolbar from "./Workspace/MobileTasksToolbar"

const TASK_COLUMNS = buildCountingColumns<TaskRowDto>()

interface MobileTasksPageProps<T extends TaskRowDto> {
	title: string
	icon?: string | null
	tasks: T[]
	isLoading: boolean
	statusSegments: StatusTaskCount[]
	renderCard(task: T): ReactNode
}

export default function MobileTasksPage<T extends TaskRowDto>({
	title,
	icon,
	tasks,
	isLoading,
	statusSegments,
	renderCard,
}: MobileTasksPageProps<T>) {
	const { columnsFilters, setSearchQuery } = useTasksFilters()

	const [filterSheetOpen, filterSheet] = useDisclosure()
	const [searchFocused, searchFocus] = useDisclosure()

	function handleSearchBack() {
		setSearchQuery("")
	}

	const searchedTasks = useFilteredTasks(tasks)

	const table = useHeadlessTable<TaskRowDto>({
		data: searchedTasks,
		columns: TASK_COLUMNS,
		columnFilters: columnsFilters,
	})

	const rows = table.getRowModel().rows
	const contentRef = useRef<HTMLDivElement>(null)

	return (
		<PageRoot>
			<MobileHeader
				icon={icon}
				title={title}
				minimal={searchFocused}
				onBack={handleSearchBack}
			/>

			<Content ref={contentRef}>
				<MobileTasksToolbar
					tasks={tasks}
					statusSegments={statusSegments}
					matchCount={rows.length}
					searchFocused={searchFocused}
					onSearchFocus={searchFocus.open}
					onSearchBlur={searchFocus.close}
					onOpenFilters={filterSheet.open}
				/>

				<CardList>
					{isLoading ? (
						<CenteredState>
							<LoadingSpinner />
						</CenteredState>
					) : rows.length === 0 ? (
						<EmptyState>לא נמצאו הנחיות</EmptyState>
					) : (
						<MobileTaskList
							tasks={rows.map(({ original }) => original as T)}
							scrollContainerRef={contentRef}
							renderCard={renderCard}
						/>
					)}
				</CardList>
			</Content>

			<MobileFilterSheet
				open={filterSheetOpen}
				onClose={filterSheet.close}
				tasks={tasks}
				table={table}
				filteredCount={rows.length}
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
	position: relative;
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
