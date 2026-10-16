import styled from "@emotion/styled"
import { createFileRoute, Outlet, useMatchRoute } from "@tanstack/react-router"
import { DashboardContent } from "src/components/Dashboard/DashboardContent"
import MobileWorkspace from "src/components/Mobile/Workspace/MobileWorkspace"
import { WorkspaceTabs } from "src/components/WorkspaceTabs"
import { useIsMobile } from "src/hooks/use-mobile"
import { TasksFiltersProvider } from "src/providers/TasksFiltersProvider"

export const Route = createFileRoute("/workspace/$urlName/dashboard")({
	component: Dashboard,
})

function Dashboard() {
	const matchRoute = useMatchRoute()
	const isTaskOpen = matchRoute({ to: "/workspace/$urlName/dashboard/$taskId" })
	const isMobile = useIsMobile()

	return isMobile ? (
		<>
			{!isTaskOpen && <MobileWorkspace />}
			<Outlet />
		</>
	) : (
		<TasksFiltersProvider>
			<WorkspaceTabs isActive={false} />
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
  min-height: 100%;
`
