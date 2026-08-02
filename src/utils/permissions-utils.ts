import type { PermissionType } from "src/api/model"

export const PERMISSION_LABEL: Record<PermissionType, string> = {
	VIEWER: "צפייה",
	MANAGER: "ניהול",
}

export const PERMISSION_ORDER: Record<string, number> = {
	MANAGER: 0,
	VIEWER: 1,
}
export const NO_PERMISSION_ORDER = 2
