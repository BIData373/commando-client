import styled from "@emotion/styled"
import { useLocalStorage } from "@mantine/hooks"
import { useNavigate, useParams } from "@tanstack/react-router"
import { isWithinInterval } from "date-fns"
import { useMemo } from "react"
import type { DateRange } from "react-day-picker"
import { getListTasksQueryKey, useListTasks } from "src/api/task/task"
import { toTaskRows } from "src/functions/tasks-table"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { DATE_TYPE, getTaskDateByDateType } from "src/utils/data-type-utils"
import {
	getDashboardFilterDataTypeKey,
	getDashboardFilterRangeKey,
} from "src/utils/filter-keys-utils"
import { TasksDatePicker } from "../shared/TasksDatePicker/TasksDatePicker"
import FocusedInstructions from "./FocusedInstructions"
import RecentlyCompleted from "./RecentlyCompleted"
import StatusCard from "./StatusCard"
import SystemDistribution from "./SystemDistribution"

export function DashboardContent() {
	const {
		workspace: { id },
	} = useWorkspace()
	const { urlName } = useParams({ from: "/workspace/$urlName" })
	const navigate = useNavigate()

	const [dataType, setDataType] = useLocalStorage<DATE_TYPE>({
		key: getDashboardFilterDataTypeKey(urlName),
		defaultValue: DATE_TYPE.CREATION_DATE,
	})

	const [persistedRange, setPersistedRange] = useLocalStorage<
		DateRange | undefined
	>({
		key: getDashboardFilterRangeKey(urlName),
		defaultValue: undefined,
	})

	const range: DateRange | undefined = persistedRange
		? {
			from: persistedRange.from ? new Date(persistedRange.from) : undefined,
			to: persistedRange.to ? new Date(persistedRange.to) : undefined,
		}
		: undefined

	function handleSetRange(newRange?: DateRange) {
		setPersistedRange(newRange)
	}

	const tasksQueryKey = getListTasksQueryKey({ workspaceId: id })
	const { data: rawTasks = [] } = useListTasks({ workspaceId: id })
	const tasks = useMemo(() => toTaskRows(rawTasks), [rawTasks])

	const filteredTasks = useMemo(() => {
		const from = range?.from
		const to = range?.to

		let filtered =
			from && to
				? tasks.filter((task) => {
					const date = getTaskDateByDateType(task, dataType)
					return (
						date !== null && isWithinInterval(date, { start: from, end: to })
					)
				})
				: [...tasks]

		if (dataType === DATE_TYPE.UPDATING_DATE) {
			filtered = filtered.sort(
				(a, b) =>
					new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
			)
		}

		return filtered
	}, [tasks, range, dataType])

	function handleSetAssignees() {
		navigate({
			to: "/workspace/$urlName/settings/assignees",
			params: { urlName },
		})
	}

	return (
		<ContentArea>
			<TasksDatePicker
				dateType={dataType}
				showTitle={true}
				onDateTypeChange={setDataType}
				setRange={handleSetRange}
				range={range}
			/>

			<GridLayout>
				<FocusedInstructions
					queryKey={tasksQueryKey}
					urlName={urlName}
					tasks={filteredTasks}
				/>
				<StatusCard tasks={filteredTasks} />
				<RecentlyCompleted
					queryKey={tasksQueryKey}
					urlName={urlName}
					tasks={filteredTasks}
				/>
				<SystemDistribution
					onSetAssignees={handleSetAssignees}
					tasks={filteredTasks}
				/>
			</GridLayout>
		</ContentArea>
	)
}

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  padding-block-end: 32px;
  color: var(--sea-ink-soft);
  margin-top: 16px;

  & > *:nth-of-type(1) {
    margin-block-start: 14px;
  }

  & > *:nth-of-type(2) {
    margin-block-start: 72px;
  }
`

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 450px;
  gap: 72px;

  @media (max-width: 1300px) {
    grid-template-columns: 1fr 1fr;
    gap: 48px 24px;
  }
`
