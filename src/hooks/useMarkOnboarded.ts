import { useQueryClient } from "@tanstack/react-query"
import type { UserDto } from "src/api/model"
import { getGetMeQueryKey, useMarkMeOnboarded } from "src/api/user/user"

export function useMarkOnboarded() {
	const queryClient = useQueryClient()
	const { mutate } = useMarkMeOnboarded()

	function markOnboarded() {
		queryClient.setQueryData<UserDto>(
			getGetMeQueryKey(),
			(user) => user && { ...user, hasOnboarded: true },
		)

		mutate()
	}

	return markOnboarded
}
