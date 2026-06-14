import { useLocalStorage } from "@mantine/hooks"
import { useEffect, useState } from "react"
import type { CreateUserDto } from "src/api/model"
import { isBIKey, requestUsernameKey, resolveBypassValues } from "src/axios"
import { getStoredToken } from "src/utils/auth-utils"
import { IS_BI, STATIC_TOKEN } from "src/utils/env-utils"
import {
	COOKIE_NAME,
	decodeSsoUserJwt,
	onCookieChange,
} from "src/utils/user-utils"

export const adminUserUpn = "s0000000"

function buildAdminUser(
	rawUsername: string | null,
	rawIsBI: string | null,
): CreateUserDto {
	const { username, isBI } = resolveBypassValues(rawUsername, rawIsBI)
	const upn = username ?? adminUserUpn

	return {
		upn,
		info: {
			upn,
			name: "Admin",
			displayName: "Admin",
			...(isBI !== null && { isBI }),
		},
	}
}

export function useCurrentUser() {
	const [storedUsername] = useLocalStorage<string | null>({
		key: requestUsernameKey,
		defaultValue: null,
	})
	const [storedIsBI] = useLocalStorage<string | null>({
		key: isBIKey,
		defaultValue: null,
	})

	const [user, setUser] = useState(() =>
		buildAdminUser(storedUsername, storedIsBI),
	)

	useEffect(() => {
		if (STATIC_TOKEN) {
			setUser(buildAdminUser(storedUsername, storedIsBI))
			return
		}

		async function syncUser() {
			const cookie = await getStoredToken()
			const ssoUser = decodeSsoUserJwt(cookie)

			const upn = storedUsername ?? ssoUser?.upn
			const isBI =
				storedIsBI !== null ? storedIsBI === "true" : (ssoUser?.isBI ?? IS_BI)

			if (!upn) {
				return
			}

			setUser({
				upn,
				info: {
					upn,
					name: ssoUser?.name ?? "",
					displayName: ssoUser?.displayName ?? "",
					isBI,
				},
			})
		}

		syncUser()

		return onCookieChange(COOKIE_NAME, syncUser)
	}, [storedUsername, storedIsBI])

	return user
}
