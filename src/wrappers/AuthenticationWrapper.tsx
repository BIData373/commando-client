import { useQuery } from "@tanstack/react-query"
import type { PropsWithChildren } from "react"
import {
	getStoredToken,
	getTokenExpiry,
	REFRESH_BUFFER_SECONDS,
	refreshAccessToken,
	storeToken,
} from "src/utils/auth-utils"
import { USE_MOCK_API, USE_SSO } from "src/utils/env-utils"

async function resolveToken(): Promise<string> {
	const existing = await getStoredToken()
	if (existing) {
		const expiry = getTokenExpiry(existing)
		if (
			!expiry ||
			expiry > Math.floor(Date.now() / 1000) + REFRESH_BUFFER_SECONDS
		) {
			return existing
		}
	}

	const token = await refreshAccessToken()
	if (token) {
		await storeToken(token)
		return token
	}

	throw new Error(
		"SSO token refresh failed. Ensure the SSO service is running.",
	)
}

function useAuthToken() {
	return useQuery({
		queryKey: ["auth-token"],
		queryFn: resolveToken,
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
		staleTime: Infinity,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		retry: false,
	})
}

export function AuthenticationWrapper({ children }: PropsWithChildren) {
	if (USE_MOCK_API || !USE_SSO) {
		return children
	}

	return <AuthGuard>{children}</AuthGuard>
}

function AuthGuard({ children }: PropsWithChildren) {
	const { isPending, isError, error } = useAuthToken()

	if (isPending) {
		return "Authenticating..."
	}

	if (isError) {
		const message =
			error instanceof Error ? error.message : "SSO service unavailable."
		return `Authentication error: ${message}`
	}

	return children
}
