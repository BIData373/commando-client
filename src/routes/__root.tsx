import styled from "@emotion/styled"
import { useOrientation } from "@mantine/hooks"
import { TanStackDevtools } from "@tanstack/react-devtools"
import { createRootRoute, Outlet, redirect } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { StrictMode } from "react"
import { NotFoundComponent } from "src/components/Error/NotFoundComponent"
import { RootErrorComponent } from "src/components/Error/RootErrorComponent"
import { checkForOnboarding } from "src/utils/redirect-utils"
import { ErrorModal } from "../components/ErrorModal"
import { RotateDeviceScreen } from "../components/Mobile/RotateDeviceScreen"
import { Toaster } from "../components/ui/sonner"
import { TooltipProvider } from "../components/ui/tooltip"
import { IS_MOBILE_DEVICE } from "../hooks/use-mobile"
import { HeaderProvider } from "../providers/HeaderProvider"
import "../styles.css"
import { IS_DEV } from "../utils/env-utils"

const VALID_ORIENTATIONS: OrientationType[] = [
	"portrait-primary",
	"portrait-secondary",
]

export const Route = createRootRoute({
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: RootErrorComponent,
	beforeLoad: ({ location }) => {
		if (checkForOnboarding(location.href)) {
			throw redirect({
				to: "/onboarding",
			})
		}
	},
})

function RootComponent() {
	const { type: orientationType } = useOrientation({
		defaultType: "portrait-primary",
		getInitialValueInEffect: false,
	})
	const isValidOrientation = VALID_ORIENTATIONS.includes(orientationType)

	return (
		<StrictMode>
			<TooltipProvider>
				<HeaderProvider>
					<AppShell>
						<PageContainer>
							<Outlet />
						</PageContainer>
					</AppShell>
				</HeaderProvider>
			</TooltipProvider>
			<Toaster />
			<ErrorModal />
			{IS_MOBILE_DEVICE && !isValidOrientation && <RotateDeviceScreen />}
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
  min-height: 0;
  background: var(--primary-foreground);
`
