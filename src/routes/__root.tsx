import styled from "@emotion/styled"
import { TanStackDevtools } from "@tanstack/react-devtools"
import { createRootRoute, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { StrictMode } from "react"
import { NotFoundComponent } from "src/components/Error/NotFoundComponent"
import { RootErrorComponent } from "src/components/Error/RootErrorComponent"
import { ErrorModal } from "../components/ErrorModal"
import { Toaster } from "../components/ui/sonner"
import { TooltipProvider } from "../components/ui/tooltip"
import { HeaderProvider } from "../providers/HeaderProvider"
import "../styles.css"
import { IS_DEV } from "../utils/env-utils"

export const Route = createRootRoute({
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: RootErrorComponent,
})

function RootComponent() {
	return (
		<StrictMode>
			<TooltipProvider>
				<HeaderProvider>
					<AppShell>
						<Toaster />
						<PageContainer>
							<Outlet />
						</PageContainer>
					</AppShell>
				</HeaderProvider>
			</TooltipProvider>
			<ErrorModal />
			{IS_DEV && (
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "TanStack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
			)}
		</StrictMode>
	)
}

const AppShell = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  isolation: isolate;
`

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  min-height: 0;
  background: var(--primary-foreground);
`
