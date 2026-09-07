import { readLocalStorageValue } from "@mantine/hooks"
import { createFileRoute, redirect } from "@tanstack/react-router"

localStorage.setItem("workspaceFirstTime", "true")

export const Route = createFileRoute("/workspace/$urlName/")({
	beforeLoad: ({ params }) => {
		const needsAssigneesRedirect = readLocalStorageValue({
			key: "workspaceFirstTime",
		})
		if (needsAssigneesRedirect) {
			localStorage.setItem("workspaceFirstTime", "false")
			throw redirect({
				to: "/workspace/$urlName/settings/assignees/help",
				params,
			})
		} else
			throw redirect({
				to: "/workspace/$urlName/dashboard",
				params,
			})
	},
})
