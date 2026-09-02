import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/workspace/$urlName/")({
	beforeLoad: ({ params }) => {
		/*if(DB_VAR) {
			throw redirect({
				to: "/workspace/$urlName/settings/assignees",
				params,
			})
		}*/
		throw redirect({
			to: "/workspace/$urlName/dashboard",
			params,
		})
	},
})
