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

function pushMatomoUserId(cookieValue?: string): void {
	const user = cookieValue ? decodeSsoUserJwt(cookieValue) : null
	const displayName = user?.displayName
	const upn = user?.upn

	window._paq = window._paq || []

	window._paq.push([
		"setUserId",
		upn ? `${normalizeUpn(upn)}\n${displayName ?? ""}` : "",
	])
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

		// setUserId must be queued before trackPageView, otherwise the
		// tracked pageview is not attributed to the user.
		cookieStore
			.get(COOKIE_NAME)
			.then((cookie) => {
				pushMatomoUserId(cookie?.value)
			})
			.catch(() => {
				pushMatomoUserId()
			})
			.finally(() => {
				loadMatomoTracker()
			})

		return onCookieChange(COOKIE_NAME, pushMatomoUserId)
	}, [])

	return children
}
