import styled from "@emotion/styled"
import { createFileRoute } from "@tanstack/react-router"
import { DashboardContent } from "src/components/Dashboard/DashboardContent"
import { TitleSection } from "src/components/Dashboard/TileSection"
import { TasksFiltersProvider } from "src/providers/TasksFiltersProvider"

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
})

function Dashboard() {
	return (
		<TasksFiltersProvider>
			<PageWrapper>
				<DashboardContent />
			</PageWrapper>
		</TasksFiltersProvider>
	)
}

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`
