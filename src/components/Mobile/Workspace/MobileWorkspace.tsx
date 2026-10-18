import styled from "@emotion/styled"
import { useDisclosure } from "@mantine/hooks"
import { useNavigate } from "@tanstack/react-router"
import type { TaskRowDto } from "src/api/model"
import { useListTaskRows } from "src/api/task/task"
import { LoadingSpinner } from "src/components/shared/LoadingSpinner"
import { formatSourceLabel } from "src/functions/source-utils"
import { useFilteredTasks } from "src/hooks/useFilteredTasks"
import { useTasksFilters } from "src/providers/TasksFiltersProvider"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import MobileHeader from "../MobileHeader"
import MobileFilterSheet, { type ListFilterKey } from "./MobileFilterSheet"
import MobileTaskCard from "./MobileTaskCard"
import MobileTasksToolbar from "./MobileTasksToolbar"

type ColumnAccessor = (task: TaskRowDto) => string

// TODO - when fixing performance, take a look at this as well
const COLUMN_ACCESSORS: Partial<Record<string, ColumnAccessor>> = {
	assignee: (t) => t.assignee?.name ?? "",
	source: (t) => (t.source ? formatSourceLabel(t.source) : ""),
	status: (t) => t.status.type,
} satisfies Record<ListFilterKey, ColumnAccessor>

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
	const searchActive = searchFocused || searchQuery !== ""

	function matchesColumnFilters(task: TaskRowDto): boolean {
		return columnsFilters.every(({ id, value }) => {
			const accessor = COLUMN_ACCESSORS[id]
			return accessor ? (value as string[]).includes(accessor(task)) : true
		})
	}

	const filtered = useFilteredTasks(tasks, {
		additionalFilter:
			columnsFilters.length > 0 ? matchesColumnFilters : undefined,
	})

	function handleOpenTask(task: TaskRowDto) {
		navigate({
			to: "/workspace/$urlName/tasks/$taskId",
			params: { urlName, taskId: String(task.id) },
		})
	}

	return (
		<PageRoot>
			<MobileHeader icon={icon} title={title} minimal={searchActive} />

			<Content>
				<MobileTasksToolbar
					tasks={tasks}
					matchCount={filtered.length}
					searchActive={searchActive}
					onSearchFocus={searchFocus.open}
					onSearchBlur={searchFocus.close}
					onOpenFilters={filterSheet.open}
				/>

				<CardList>
					{isLoading ? (
						<LoadingWrapper>
							<LoadingSpinner />
						</LoadingWrapper>
					) : filtered.length === 0 ? (
						<EmptyState>לא נמצאו הנחיות</EmptyState>
					) : (
						filtered.map((task) => (
							<MobileTaskCard
								key={task.rowKey}
								task={task}
								searchQuery={searchQuery}
								onClick={() => handleOpenTask(task)}
							/>
						))
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
