import { useLocalStorage } from "@mantine/hooks"
import { useEffect, useState } from "react"
import type { UserDto } from "src/api/model"
import { isBIKey, requestUsernameKey, resolveBypassValues } from "src/axios"
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
): UserDto {
	const { username, isBI } = resolveBypassValues(rawUsername, rawIsBI)
	const upn = username ?? adminUserUpn

	return {
		id: 1,
		upn,
		info: {
			id: 1,
			upn,
			name: "Admin",
			displayName: "Admin",
			isBI,
		},
	}
}

export function useCurrentUser(): UserDto {
	const [storedUsername] = useLocalStorage<string | null>({
		key: requestUsernameKey,
		defaultValue: null,
	})
	const [storedIsBI] = useLocalStorage<string | null>({
		key: isBIKey,
		defaultValue: null,
	})

	const [user, setUser] = useState<UserDto>(() =>
		buildAdminUser(storedUsername, storedIsBI),
	)

	useEffect(() => {
		if (STATIC_TOKEN) {
			setUser(buildAdminUser(storedUsername, storedIsBI))
			return
		}

		async function syncUser() {
			const cookie = await cookieStore.get(COOKIE_NAME).catch(() => null)
			const ssoUser = decodeSsoUserJwt(cookie?.value)

			const upn = storedUsername ?? ssoUser?.upn
			const isBI =
				storedIsBI !== null ? storedIsBI === "true" : (ssoUser?.isBI ?? IS_BI)

			if (!upn) {
				return
			}

			setUser({
				id: ssoUser?.id ?? 0,
				upn,
				info: {
					id: ssoUser?.id ?? 0,
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
