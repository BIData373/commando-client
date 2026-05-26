import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/workspace/$urlName/tasks/")({
	component: () => null,
});
