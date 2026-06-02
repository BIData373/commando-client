export enum SettingTabPath {
	GENERAL = "general",
	ASSIGNEES = "assignees",
	PERMISSIONS = "permissions",
}

export const SETTINGS_TABS: Record<SettingTabPath, string> = {
	[SettingTabPath.GENERAL]: "פרטי הסביבה",
	[SettingTabPath.ASSIGNEES]: "מקבלי הנחיות",
	[SettingTabPath.PERMISSIONS]: "הרשאות ניהול וצפיה",
}
