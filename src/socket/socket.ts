import { io } from "socket.io-client"
import {
	IS_BI_HEADER,
	isBIKey,
	REQUEST_USERNAME_HEADER,
	requestUsernameKey,
	STATIC_TOKEN_HEADER,
} from "../axios"
import { getStoredToken } from "../utils/auth-utils"
import { API_BASE_URL, STATIC_TOKEN } from "../utils/env-utils"

export function createSocket(urlName: string) {
	const rawUsername = localStorage.getItem(requestUsernameKey)
	const username =
		rawUsername !== null ? (JSON.parse(rawUsername) as string | null) : null
	const rawIsBI = localStorage.getItem(isBIKey)
	const isBI = rawIsBI !== null ? rawIsBI === "true" : null

	return io(API_BASE_URL, {
		transports: ["websocket"],
		reconnection: true,
		autoConnect: false,
		query: { urlName },
		extraHeaders: {
			...(STATIC_TOKEN && { [STATIC_TOKEN_HEADER]: STATIC_TOKEN }),
			...(username &&
				username.length > 0 && { [REQUEST_USERNAME_HEADER]: username }),
			...(isBI !== null && { [IS_BI_HEADER]: String(isBI) }),
		},
		auth: async (cb) => {
			const ssoUser = await getStoredToken()
			cb({ ssoUser })
		},
	})
}
