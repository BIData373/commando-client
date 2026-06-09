import { type PropsWithChildren, useEffect } from "react"
import type { UserInfoDto } from "src/api/model"
import { MATOMO_ENABLED } from "src/utils/env-utils"

declare global {
	interface Window {
		_paq: unknown[][]
	}
}

function decodeJwtUser(jwtValue: string): {
	userName?: string
	privateNumber?: string
} {
	const base64Url = jwtValue.split(".")?.[1]
	const base64 = base64Url?.replace(/-/g, "+")?.replace(/_/g, "/")

	const jsonPayload = base64
		? new TextDecoder().decode(
				Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)),
			)
		: ""

	let resultParsed: UserInfoDto | undefined
	try {
		resultParsed = JSON.parse(jsonPayload)?.user
	} catch {
		resultParsed = undefined
	}

	return {
		userName: resultParsed?.displayName,
		privateNumber: resultParsed?.upn,
	}
}

function pushMatomoUserId(cookieValue?: string): void {
	const { userName, privateNumber } = cookieValue
		? decodeJwtUser(cookieValue)
		: {}

	window._paq = window._paq || []

	window._paq.push([
		"setUserId",
		privateNumber && userName ? `${privateNumber}\n${userName}` : "",
	])
}

export default function MatomoWrapper({ children }: PropsWithChildren) {
	useEffect(() => {
		if (!MATOMO_ENABLED) return

		window._paq = window._paq || []
		const _paq = window._paq

		_paq.push(["setDocumentTitle", `${document.domain}/${document.title}`])
		_paq.push(["setCookieDomain", "*.vector.idf.cts"])
		_paq.push(["trackPageView"])
		_paq.push(["enableLinkTracking"])

		const u = "//matomo.idf.cts/"
		_paq.push(["setTrackerUrl", `${u}matomo.php`])
		_paq.push(["setSiteId", "2073"])

		const d = document,
			g = d.createElement("script"),
			s = d.getElementsByTagName("script")[0]

		g.type = "text/javascript"
		g.async = true
		g.src = `${u}matomo.js`
		s.parentNode?.insertBefore(g, s)

		cookieStore
			.get("ssoUser")
			.then((cookie) => {
				pushMatomoUserId(cookie?.value)
			})
			.catch(() => {
				pushMatomoUserId()
			})

		const handleCookieChange = (event: CookieChangeEvent) => {
			const newValue = event.changed?.find((c) => c.name === "ssoUser")?.value
			const wasDeleted = event.deleted?.some((c) => c.name === "ssoUser")

			if (newValue !== undefined || wasDeleted) {
				pushMatomoUserId(newValue)
			}
		}

		cookieStore.addEventListener("change", handleCookieChange)

		return () => {
			cookieStore.removeEventListener("change", handleCookieChange)
		}
	}, [])

	return children
}
