import { type PropsWithChildren, useEffect } from "react"
import { MATOMO_ENABLED, MATOMO_SITE_ID } from "src/utils/env-utils"
import {
	COOKIE_NAME,
	decodeSsoUserJwt,
	onCookieChange,
} from "src/utils/user-utils"

declare global {
	interface Window {
		_paq: unknown[][]
	}
}

function pushMatomoUserId(cookieValue?: string): void {
	const user = cookieValue ? decodeSsoUserJwt(cookieValue) : null
	const userName = user?.displayName
	const privateNumber = user?.upn

	window._paq = window._paq || []

	window._paq.push([
		"setUserId",
		privateNumber && userName ? `${privateNumber}\n${userName}` : "",
	])
}

export default function MatomoWrapper({ children }: PropsWithChildren) {
	useEffect(() => {
		if (!(MATOMO_ENABLED && MATOMO_SITE_ID)) {
			return
		}

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

		cookieStore
			.get(COOKIE_NAME)
			.then((cookie) => {
				pushMatomoUserId(cookie?.value)
			})
			.catch(() => {
				pushMatomoUserId()
			})

		return onCookieChange(COOKIE_NAME, pushMatomoUserId)
	}, [])

	return children
}
