import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import * as mockHandlers from 'src/api/index.msw'; // Orval generated MSW handlers
import { queryClient } from "./queryClient";
import router from "./router";
import { USE_MOCK_API } from "./utils/envUtils";

const handlers = Object.values(mockHandlers).flatMap((getHandlers) => getHandlers())

async function enableMocking() {
	if (!USE_MOCK_API) {
		const { setupWorker } = await import('msw/browser');
		const worker = setupWorker(...handlers);

		return worker.start();
	}
}


declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

enableMocking().then(() => {
	const rootElement = document.getElementById("app")!;

	if (!rootElement.innerHTML) {
		const root = ReactDOM.createRoot(rootElement);
		root.render(
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>,
		);
	}
})