import { readLocalStorageValue } from "@mantine/hooks"
import type { MirageUserDto } from "src/api/model"
import { ONBOARDING_STEP_ORDER } from "src/components/OnboardingModal/OnboardingModal"
import {
	CHAT_CHANNEL_URL,
	CHAT_URL,
	PORTAL_CATALOG_URL,
	USER_GUIDE_URL,
} from "./env-utils"
import { normalizeUpn } from "./user-utils"

export function openUserGuide() {
	window.open(USER_GUIDE_URL, "_blank")
}

export function openSupportChat() {
	window.open(CHAT_CHANNEL_URL, "_blank")
}

export function openMoreOfUs() {
	window.open(PORTAL_CATALOG_URL, "_blank")
}

export function openUserChat(user: MirageUserDto) {
	const upn = normalizeUpn(user.upn)

	return window.open(`${CHAT_URL}/direct/${upn}`)
}

const onboardingPathnames = ONBOARDING_STEP_ORDER.map((step) => {
	return "/onboarding".concat("?step=", step)
})

export function checkForOnboarding(pathname: string) {
	const needsOnboarding =
		readLocalStorageValue({ key: "onboardingRequired" }) ?? true
	const isAlreadyOnboarding = onboardingPathnames.includes(pathname)
	return !isAlreadyOnboarding && needsOnboarding
}
