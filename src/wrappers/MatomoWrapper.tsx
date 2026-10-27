import { type PropsWithChildren, useEffect } from "react"
import { MATOMO_ENABLED, MATOMO_SITE_ID } from "src/utils/env-utils"
import {
	COOKIE_NAME,
	decodeSsoUserJwt,
	normalizeUpn,
	onCookieChange,
} from "src/utils/user-utils"

declare global {
	interface Window {
		_paq: unknown[][]
	}
}

// Decodes the SSO cookie and queues a setUserId command for Matomo.
// Returns false if the user could not be identified.
function setUserId(cookieValue: string): boolean {
	const user = decodeSsoUserJwt(cookieValue)
	const displayName = user?.displayName
	const upn = user?.upn

	if (!upn) {
		return false
	}
	window._paq = window._paq || []
	window._paq.push(["setUserId", `${normalizeUpn(upn)}\n${displayName ?? ""}`])

	return true
}

function loadMatomoTracker(): void {
	window._paq = window._paq || []
	const _paq = window._paq

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
		function identifyAndTrack(cookieValue?: string): void {
			if (!cookieValue || !setUserId(cookieValue)) {
				return
			}
			loadMatomoTracker()
		}

		// Try immediately; if the cookie isn't set yet, wait for SSO to complete.
		cookieStore.get(COOKIE_NAME).then((cookie) => {
			identifyAndTrack(cookie?.value)
		})

		return onCookieChange(COOKIE_NAME, identifyAndTrack)
	}, [])

	return children
}
