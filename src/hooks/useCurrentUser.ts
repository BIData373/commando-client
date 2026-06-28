import { useEffect, useState } from "react"
import type { CreateUserDto } from "src/api/model"
import { getStoredToken } from "src/utils/auth-utils"
import { STATIC_TOKEN } from "src/utils/env-utils"
import {
	COOKIE_NAME,
	decodeSsoUserJwt,
	normalizeUpn,
	onCookieChange,
} from "src/utils/user-utils"
import { useBIBypass } from "./useBIBypass"

export const adminUserUpn = "s0000000"

function buildAdminUser(
	username?: string | null,
	isBI?: boolean | null,
): CreateUserDto {
	const upn = username && username.length > 0 ? username : adminUserUpn

	return {
		upn,
		info: {
			upn,
			name: "Admin",
			displayName: "Admin",
			isBI: isBI !== undefined && isBI !== null ? isBI : true,
		},
	}
}

export function useCurrentUser() {
	const { username, isBI } = useBIBypass()

	const [user, setUser] = useState(() => buildAdminUser(username, isBI))

	useEffect(() => {
		if (STATIC_TOKEN) {
			setUser(buildAdminUser(username, isBI))
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
	}, [username, isBI])

	return user
}
