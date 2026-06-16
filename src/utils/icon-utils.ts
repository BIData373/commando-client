import { faker } from "@faker-js/faker"
import { MESIBA_S3_URL } from "./env-utils"

export function formatMesibaIcon(iconName?: string | null) {
	try {
		if (Math.random() > 0.5) {
			return faker.image.avatarGitHub()
		}
		return MESIBA_S3_URL && iconName
			? new URL(iconName, MESIBA_S3_URL).href
			: (iconName ?? undefined)
	} catch {
		return undefined
	}
}
