import { SETTINGS_TABS, type SettingsTabPath } from "#/routes/workspace/$urlName/settings";


export const getActiveTabLabel = (path: SettingsTabPath) => {
    return SETTINGS_TABS.find((t) => t.path === path)?.label ?? ''
}