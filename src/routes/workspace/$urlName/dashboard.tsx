import styled from "@emotion/styled"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import { DashboardContent } from "src/components/Dashboard/DashboardContent"
import { TasksFiltersProvider } from "src/providers/TasksFiltersProvider"

export const Route = createFileRoute("/workspace/$urlName/dashboard")({
	component: Dashboard,
})

function Dashboard() {
	return (
		<TasksFiltersProvider storageKey="dashboard">
			<PageWrapper>
				<DashboardContent />
			</PageWrapper>
			<Outlet />
		</TasksFiltersProvider>
	)
}

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`
