import styled from "@emotion/styled"
import { useDisclosure } from "@mantine/hooks"
import { useNavigate } from "@tanstack/react-router"
import { useDeferredValue, useRef } from "react"
import type { TaskRowDto } from "src/api/model"
import { useListTaskRows } from "src/api/task/task"
import { LoadingSpinner } from "src/components/shared/LoadingSpinner"
import { useFilteredTasks } from "src/hooks/useFilteredTasks"
import { useHeadlessTable } from "src/hooks/useHeadlessTable"
import { useTasksFilters } from "src/providers/TasksFiltersProvider"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { buildCountingColumns } from "src/utils/task-table-utils"
import MobileHeader from "../MobileHeader"
import MobileFilterSheet from "./MobileFilterSheet"
import MobileTaskList from "./MobileTaskList"
import MobileTasksToolbar from "./MobileTasksToolbar"

const TASK_COLUMNS = buildCountingColumns<TaskRowDto>()

export default function MobileWorkspace() {
	const {
		workspace: { id: workspaceId, icon, title, urlName },
	} = useWorkspace()
	const navigate = useNavigate()
	const { searchQuery, columnsFilters } = useTasksFilters()

	const { data: tasks = [], isLoading } = useListTaskRows({
		workspaceId,
		isArchived: false,
	})

	const [filterSheetOpen, filterSheet] = useDisclosure()
	const [searchFocused, searchFocus] = useDisclosure()

	const searchedTasks = useFilteredTasks(tasks)
	const deferredSearchQuery = useDeferredValue(searchQuery)

	const table = useHeadlessTable({
		data: searchedTasks,
		columns: TASK_COLUMNS,
		columnFilters: columnsFilters,
	})

	const rows = table.getRowModel().rows
	const contentRef = useRef<HTMLDivElement>(null)

	function handleOpenTask(task: TaskRowDto) {
		navigate({
			to: "/workspace/$urlName/tasks/$taskId",
			params: { urlName, taskId: String(task.id) },
		})
	}

	return (
		<PageRoot>
			<MobileHeader icon={icon} title={title} minimal={searchFocused} />

			<Content ref={contentRef}>
				<MobileTasksToolbar
					tasks={tasks}
					matchCount={rows.length}
					searchFocused={searchFocused}
					onSearchFocus={searchFocus.open}
					onSearchBlur={searchFocus.close}
					onOpenFilters={filterSheet.open}
				/>

				<CardList>
					{isLoading ? (
						<LoadingWrapper>
							<LoadingSpinner />
						</LoadingWrapper>
					) : rows.length === 0 ? (
						<EmptyState>לא נמצאו הנחיות</EmptyState>
					) : (
						<MobileTaskList
							tasks={rows.map(({ original }) => original)}
							searchQuery={deferredSearchQuery}
							scrollContainerRef={contentRef}
							onOpenTask={handleOpenTask}
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

const LoadingWrapper = styled.div`
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: center;
`

const EmptyState = styled.div`
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: center;
	color: var(--sea-ink-soft);
	font-size: var(--fs-base);
`
