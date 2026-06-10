import { MESIBA_S3_URL } from "./env-utils"

export function formatMesibaIcon(iconName?: string | null) {
	return MESIBA_S3_URL && iconName
		? new URL(iconName, MESIBA_S3_URL).href
		: undefined
}
