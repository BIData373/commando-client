import styled from "@emotion/styled"
import { TanStackDevtools } from "@tanstack/react-devtools"
import { createRootRoute, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { StrictMode } from "react"
import Header from "../components/Header"
import { TitleBarProvider } from "../providers/TitleBarProvider"
import "../styles.css"

export const Route = createRootRoute({
	component: RootComponent,
})

function RootComponent() {
	return (
		<StrictMode>
			<TitleBarProvider>
				<AppShell>
					<Header />
					<PageContainer>
						<Outlet />
					</PageContainer>
				</AppShell>
			</TitleBarProvider>
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
		</StrictMode>
	)
}

const AppShell = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`

const PageContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  background: var(--primary-foreground);
  padding-inline: 24px;
`
