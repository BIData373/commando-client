import styled from "@emotion/styled"
import { useNavigate, useParams } from "@tanstack/react-router"
import { isWithinInterval, setYear, subMonths } from "date-fns"
import { useMemo, useState } from "react"
import type { DateRange } from "react-day-picker"
import { getListTasksQueryKey, useListTasks } from "src/api/task/task"
import { toTaskRows } from "src/functions/tasks-table"
import type { TaskRow } from "src/providers/TasksFiltersProvider"
import { useWorkspace } from "src/providers/WorkspaceProvider"
import { DATE_TYPE } from "src/utils/data-type-utils"
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

	const [dataType, setDataType] = useState(DATE_TYPE.CREATION_DATE)
	const [range, setRange] = useState<DateRange | undefined>()

	const tasksQueryKey = getListTasksQueryKey({ workspaceId: id })
	const { data: rawTasks = [] } = useListTasks({ workspaceId: id })
	const tasks = useMemo(() => toTaskRows(rawTasks), [rawTasks])

	const filteredTasks = useMemo(() => {
		const refYear = range?.from?.getFullYear() ?? new Date().getFullYear()

		function getTaskDate(task: TaskRow, year: number): Date | null {
			switch (dataType) {
				case DATE_TYPE.CREATION_DATE:
					return new Date(task.createdAt)
				case DATE_TYPE.EXPECTED_END:
					return new Date(task.dueDate)
				case DATE_TYPE.INSTRUCTION_DATE:
					return setYear(subMonths(task.source.date, 1), year)
				case DATE_TYPE.UPDATING_DATE:
					return new Date(task.updatedAt)
				default:
					return new Date(task.createdAt)
			}
		}

		const from = range?.from
		const to = range?.to

		let filtered =
			from && to
				? tasks.filter((task) => {
						const date = getTaskDate(task, refYear)
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
			{/* <DashboardDatePicker
        dateType={dataType}
        onDateTypeChange={setDataType}
        setRange={setRange}
      /> */}

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
