import styled from "@emotion/styled";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { StrictMode } from "react";
import { ErrorModal } from "../components/ErrorModal";
import Header from "../components/Header";
import { useErrorModal } from "../providers/ErrorModalProvider";
import { TitleBarProvider } from "../providers/TitleBarProvider";
import "../styles.css";
import { ErrorCode, isErrorCode } from "src/utils/error-utils";

function NotFoundComponent() {
	const error = useErrorModal()
	error?.setErrorCode(ErrorCode.NOT_FOUND);
	return null;
}

interface RouteError {
	status?: number;
	response?: { status?: number };
}

interface RootErrorComponentProps {
	error: Error
}

function RootErrorComponent({ error } : RootErrorComponentProps) {
	const errorModal = useErrorModal()

	const routeError = error as RouteError;
	const status = routeError?.status ?? routeError?.response?.status;
	const code = status && isErrorCode(status) ? status : ErrorCode.SERVER_ERROR;
	errorModal?.setErrorCode(code);

	return null;
}

export const Route = createRootRoute({
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: RootErrorComponent,
});

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
			<ErrorModal />
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
