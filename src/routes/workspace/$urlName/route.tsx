import { createFileRoute, Outlet, useMatch } from "@tanstack/react-router"
import { PermissionType } from "src/api/model"
import { ContentScrollArea } from "src/components/shared/ContentScrollArea"
import { PageShell } from "src/components/shared/PageShell"
import { WorkspaceTabs } from "src/components/WorkspaceTabs"
import { WorkspaceTitle } from "src/components/WorkspaceTitle"
import { WorkspaceUserDropdown } from "src/components/WorkspaceUserDropdown"
import { WorkspaceProvider } from "src/providers/WorkspaceProvider"
import { AuthorizationWrapper } from "src/wrappers/AuthorizationWrapper"
import Header from "../../../components/Header"

export const Route = createFileRoute("/workspace/$urlName")({
	component: RouteComponent,
})

function RouteComponent() {
	const isArchive = !!useMatch({
		from: "/workspace/$urlName/archive",
		shouldThrow: false,
	})
	const isTasksOrArchive =
		!!useMatch({ from: "/workspace/$urlName/tasks", shouldThrow: false }) ||
		isArchive

	return (
		<WorkspaceProvider>
			<AuthorizationWrapper type={PermissionType.VIEWER}>
				<PageShell>
					<Header />

					<WorkspaceUserDropdown />
					<WorkspaceTabs
						isTasksOrArchive={isTasksOrArchive}
						isArchive={isArchive}
					/>
					<WorkspaceTitle />

					<ContentScrollArea>
						<Outlet />
					</ContentScrollArea>
				</PageShell>
			</AuthorizationWrapper>
		</WorkspaceProvider>
	)
}
