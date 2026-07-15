import { io } from "socket.io-client"
import {
	IS_BI_HEADER,
	REQUEST_USERNAME_HEADER,
	STATIC_TOKEN_HEADER,
} from "../axios"
import { getStoredToken } from "../utils/auth-utils"
import { API_BASE_URL, STATIC_TOKEN } from "../utils/env-utils"
import { getRequestIdentity } from "../utils/request-utils"

export function createSocket(urlName: string) {
	return io(API_BASE_URL, {
		transports: ["websocket"],
		reconnection: true,
		autoConnect: false,
		query: { urlName },
		auth: async (cb) => {
			const ssoUser = await getStoredToken()
			const { username, isBI } = getRequestIdentity()
			cb({
				ssoUser,
				...(STATIC_TOKEN && { [STATIC_TOKEN_HEADER]: STATIC_TOKEN }),
				...(username &&
					username.length > 0 && { [REQUEST_USERNAME_HEADER]: username }),
				...(isBI !== null && { [IS_BI_HEADER]: String(isBI) }),
			})
		},
		withCredentials: true,
	})
}
