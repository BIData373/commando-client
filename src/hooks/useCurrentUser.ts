import { useLocalStorage } from "@mantine/hooks"
import { useEffect, useState } from "react"
import type { CreateUserDto } from "src/api/model"
import { isBIKey, requestUsernameKey } from "src/axios"
import { getStoredToken } from "src/utils/auth-utils"
import { STATIC_TOKEN } from "src/utils/env-utils"
import {
	COOKIE_NAME,
	decodeSsoUserJwt,
	normalizeUpn,
	onCookieChange,
} from "src/utils/user-utils"

export const adminUserUpn = "s0000000"

function buildAdminUser(username?: string, isBI?: boolean): CreateUserDto {
	const upn = username && username.length > 0 ? username : adminUserUpn

	return {
		upn,
		info: {
			upn,
			name: "Admin",
			displayName: "Admin",
			isBI: isBI !== undefined ? isBI : true,
		},
	}
}

export function useCurrentUser() {
	const [storedUsername] = useLocalStorage({
		key: requestUsernameKey,
	})
	const [storedIsBI] = useLocalStorage<boolean>({
		key: isBIKey,
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

			const upn = ssoUser?.upn
			if (!upn) {
				return
			}

			const normalizedUpn = normalizeUpn(upn)

			setUser({
				upn: normalizedUpn,
				info: {
					upn: normalizedUpn,
					name: ssoUser?.name ?? "",
					displayName: ssoUser?.displayName ?? "",
					isBI: ssoUser?.isBI,
				},
			})
		}

		syncUser()

		return onCookieChange(COOKIE_NAME, syncUser)
	}, [storedUsername, storedIsBI])

	return user
}
