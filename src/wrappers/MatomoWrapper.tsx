import { type PropsWithChildren, useEffect } from "react"
import type { UserInfoDto } from "src/api/model"
import { IS_MATOMO_ON } from "src/utils/env-utils"

declare global {
	interface Window {
		_paq: unknown[][]
	}
}

export default function MatomoWrapper({ children }: PropsWithChildren) {
	useEffect(() => {
		if (!IS_MATOMO_ON) return

		const cookieString = document.cookie
		const result = cookieString
			?.match(/ssoUser=([^;]+)/)
			?.pop()
			?.replaceAll('"', "")
		const base64Url = result?.split(".")?.[1]
		const base64 = base64Url?.replace(/-/g, "+")?.replace(/_/g, "/")
		const jsonPayload = base64
			? decodeURIComponent(
					atob(base64)
						?.split("")
						?.map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
						.join(""),
				)
			: ""

		let resultParsed: UserInfoDto | undefined

		try {
			resultParsed = JSON.parse(jsonPayload)?.user
		} catch {
			resultParsed = undefined
		}

		const userName = resultParsed?.displayName
		const privateNumber = resultParsed?.upn

		window._paq = window._paq || []
		const _paq = window._paq

		_paq.push(["setDocumentTitle", `${document.domain}/${document.title}`])
		_paq.push(["setCookieDomain", "*.vector.idf.cts"])
		_paq.push(["trackPageView"])
		_paq.push(["enableLinkTracking"])
		_paq.push([
			"setUserId",
			privateNumber && userName ? `${privateNumber}\n${userName}` : "",
		])

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
	}, [])

	return children
}
