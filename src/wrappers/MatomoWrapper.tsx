import { type PropsWithChildren, useEffect } from "react"
import { getStoredToken } from "src/utils/auth-utils"
import { MATOMO_ENABLED, MATOMO_SITE_ID } from "src/utils/env-utils"
import {
	decodeSsoUserJwt,
	normalizeUpn,
	onCookieChange,
	TOKEN_NAME,
} from "src/utils/user-utils"

declare global {
	interface Window {
		_paq: unknown[][]
	}
}

function getUserId(token: string): string | null {
	const user = decodeSsoUserJwt(token)
	const upn = user?.upn

	if (!upn) {
		return null
	}
	return `${normalizeUpn(upn)}\n${user?.displayName ?? ""}`
}

function loadMatomoTracker(userId: string): void {
	window._paq = window._paq || []
	const _paq = window._paq

	_paq.push(["setUserId", userId])
	_paq.push(["setDocumentTitle", `${document.domain}/${document.title}`])
	_paq.push(["setCookieDomain", "*.vector.idf.cts"])
	_paq.push(["trackPageView"])
	_paq.push(["enableLinkTracking"])

	const u = "//matomo.idf.cts/"
	_paq.push(["setTrackerUrl", `${u}matomo.php`])
	_paq.push(["setSiteId", MATOMO_SITE_ID])

	const d = document,
		g = d.createElement("script"),
		s = d.getElementsByTagName("script")[0]

	g.type = "text/javascript"
	g.async = true
	g.src = `${u}matomo.js`
	s.parentNode?.insertBefore(g, s)
}

export default function MatomoWrapper({ children }: PropsWithChildren) {
	useEffect(() => {
		if (!(MATOMO_ENABLED && MATOMO_SITE_ID)) {
			return
		}

		// Only load Matomo after successfully identifying the user — avoids anonymous visits.
		function identifyAndTrack(token?: string): void {
			if (!token) {
				return
			}
			const userId = getUserId(token)
			if (!userId) {
				return
			}
			loadMatomoTracker(userId)
		}

		// Try immediately; if the token isn't set yet, wait for SSO to complete.
		getStoredToken().then(identifyAndTrack)

		return onCookieChange(TOKEN_NAME, identifyAndTrack)
	}, [])

	return children
}
