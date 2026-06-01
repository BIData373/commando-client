import styled from "@emotion/styled";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { isWithinInterval } from "date-fns";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { DashboardDatePicker } from "src/components/Dashboard/DashboardDatePicker/DashboardDatePicker";
import { TitleSection } from "src/components/Dashboard/TileSection";
import { INITIAL_TASKS, type Task } from "src/data/Tasks";
import { DATE_TYPE } from "src/utils/dataTypeUtils";
import FocusedInstructions from "../../../components/Dashboard/FocusedInstructions";
import RecentlyCompleted from "../../../components/Dashboard/RecentlyCompleted";
import StatusCard from "../../../components/Dashboard/StatusCard";
import SystemDistribution from "../../../components/Dashboard/SystemDistribution";

export const Route = createFileRoute("/workspace/$urlName/dashboard")({
	component: Dashboard,
	staticData: {
		header: {
			title: <TitleSection />,
			user: true,
			navigation: true,
			workspace: true,
		},
	},
});

function Dashboard() {
	const { urlName } = Route.useParams();
	const navigate = useNavigate();

	const [dataType, setDataType] = useState(DATE_TYPE.CREATION_DATE);
	const [range, setRange] = useState<DateRange | undefined>();

	const filteredTasks = useMemo(() => {
		const refYear = range?.from?.getFullYear() ?? new Date().getFullYear();

		function getTaskDate(task: Task, year: number): Date | null {
			switch (dataType) {
				case DATE_TYPE.CREATION_DATE:
					return task.createdAt;
				case DATE_TYPE.EXPECTED_END:
					return task.dueDate;
				case DATE_TYPE.INSTRUCTION_DATE: {
					const [day, month] = task.discussionDate.split("/").map(Number);
					return new Date(year, month - 1, day);
				}
				case DATE_TYPE.UPDATING_DATE:
					return task.updatedAt;
				default:
					return task.createdAt;
			}
		}

		const from = range?.from;
		const to = range?.to;

		let tasks =
			from && to
				? INITIAL_TASKS.filter((task) => {
					const date = getTaskDate(task, refYear);
					return (
						date !== null && isWithinInterval(date, { start: from, end: to })
					);
				})
				: [...INITIAL_TASKS];

		if (dataType === DATE_TYPE.UPDATING_DATE) {
			tasks = tasks.sort(
				(a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
			);
		}

		return tasks;
	}, [range, dataType]);

	function handleSetAssignees() {
		navigate({
			to: "/workspace/$urlName/settings/assignees",
			params: { urlName },
		});
	}

	return (
		<PageWrapper>
			<ContentArea>
				<DashboardDatePicker
					dateType={dataType}
					onDateTypeChange={setDataType}
					setRange={setRange}
				/>

				<GridLayout>
					<FocusedInstructions urlName={urlName} tasks={filteredTasks} />
					<StatusCard tasks={filteredTasks} />
					<RecentlyCompleted urlName={urlName} tasks={filteredTasks} />
					<SystemDistribution
						onSetAssignees={handleSetAssignees}
						tasks={filteredTasks}
					/>
				</GridLayout>
			</ContentArea>
		</PageWrapper>
	);
}

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

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
`;

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 450px;
  gap: 72px;

  @media (max-width: 1300px) {
    grid-template-columns: 1fr 1fr;
    gap: 48px 24px;
  }
`;
