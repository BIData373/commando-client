import { createFileRoute, redirect } from "@tanstack/react-router"
import { getGetMeQueryOptions } from "src/api/user/user"
import { ONBOARDING_PATH } from "src/utils/redirect-utils"
import { queryClient } from "../../query-client"

export const Route = createFileRoute("/_home/")({
	component: () => null,
	beforeLoad: async () => {
		const { hasOnboarded } = await queryClient.ensureQueryData(
			getGetMeQueryOptions(),
		)

		if (!hasOnboarded) {
			throw redirect({
				to: ONBOARDING_PATH,
			})
		}
	},
})
