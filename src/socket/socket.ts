import { io } from "socket.io-client"
import {
	IS_BI_HEADER,
	REQUEST_USERNAME_HEADER,
	STATIC_TOKEN_HEADER,
} from "../axios"
import { BEARER_PREFIX, getStoredToken } from "../utils/auth-utils"
import { API_BASE_URL, STATIC_TOKEN } from "../utils/env-utils"
import { getRequestIdentity } from "../utils/request-utils"

export function createSocket(urlName: string) {
	return io(API_BASE_URL, {
		transports: ["websocket"],
		reconnection: true,
		autoConnect: false,
		query: { urlName },
		auth: (cb) => {
			const token = getStoredToken()
			const { username, isBI } = getRequestIdentity()
			cb({
				...(token && { Authorization: `${BEARER_PREFIX}${token}` }),
				...(STATIC_TOKEN && { [STATIC_TOKEN_HEADER]: STATIC_TOKEN }),
				...(username &&
					username.length > 0 && { [REQUEST_USERNAME_HEADER]: username }),
				...(isBI !== null && { [IS_BI_HEADER]: String(isBI) }),
			})
		},
		withCredentials: false,
	})
}
