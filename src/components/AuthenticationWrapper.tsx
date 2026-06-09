import {
	OidcProvider,
	OidcSecure,
	useOidcAccessToken,
} from "@axa-fr/react-oidc"
import type { PropsWithChildren } from "react"
import { useEffect } from "react"
import { USE_MOCK_API, USE_SSO } from "src/utils/env-utils"

const COOKIE_NAME = "ssoUser"

const oidcConfiguration = {
	client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID ?? "",
	redirect_uri: window.location.origin,
	silent_redirect_uri: `${window.location.origin}/authentication/silent-callback.html`,
	scope: "openid profile email",
	authority: `${import.meta.env.VITE_KEYCLOAK_URL}/realms/${import.meta.env.VITE_KEYCLOAK_REALM}`,
	service_worker_only: false,
	refresh_time_before_tokens_expiration_in_second: 70,
}

async function setTokenCookie(token: string | undefined): Promise<void> {
	if (token) {
		await cookieStore.set({
			name: COOKIE_NAME,
			value: token,
			path: "/",
			sameSite: "lax",
		})
	} else {
		await cookieStore.delete(COOKIE_NAME)
	}
}

function TokenCookieSync() {
	const { accessToken } = useOidcAccessToken()

	useEffect(() => {
		setTokenCookie(accessToken)
	}, [accessToken])

	return null
}

export function AuthenticationWrapper({ children }: PropsWithChildren) {
	return USE_MOCK_API || !USE_SSO ? (
		children
	) : (
		<OidcProvider
			configuration={oidcConfiguration}
			loadingComponent={() => "Loading..."}
			authenticatingComponent={() => "Authenticating..."}
			callbackSuccessComponent={() => "Loading..."}
			sessionLostComponent={() => "Session lost, refresh"}
		>
			<OidcSecure>
				<TokenCookieSync />

				{children}
			</OidcSecure>
		</OidcProvider>
	)
}
