import { useQuery } from "@tanstack/react-query"
import type { PropsWithChildren } from "react"
import {
	AUTH_ENABLED,
	authenticateOrExisting,
	getTokenExpiry,
	REFRESH_BUFFER_SECONDS,
} from "src/utils/auth-utils"

export function AuthenticationWrapper({ children }: PropsWithChildren) {
	const { isPending, isError, error } = useQuery({
		queryKey: ["auth-token"],
		queryFn: authenticateOrExisting,
		enabled: AUTH_ENABLED,
		staleTime: Infinity,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		retry: false,
		refetchInterval: (query) => {
			const token = query.state.data
			if (!token) {
				return false
			}
			const expiry = getTokenExpiry(token)
			if (!expiry) {
				return false
			}
			const delay =
				(expiry - Math.floor(Date.now() / 1000) - REFRESH_BUFFER_SECONDS) * 1000
			return delay > 0 ? delay : false
		},
	})

	if (AUTH_ENABLED && isPending) {
		return "Authenticating..."
	}

	if (isError) {
		const message =
			error instanceof Error ? error.message : "SSO service unavailable."
		return `Authentication error: ${message}`
	}

	return children
}
