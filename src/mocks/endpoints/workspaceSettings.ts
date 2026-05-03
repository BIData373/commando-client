import type { IUpdateWorkspaceSettings, IWorkspaceSettings } from '../../types';
import { getOrInitWorkspaceSettings, mockWorkspaceSettings } from '../data/workspaceSettings';

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

export const workspaceSettingsApi = {
    async getSettings(urlName: string): Promise<IWorkspaceSettings> {
        await delay();
        return { ...getOrInitWorkspaceSettings(urlName) };
    },

    async updateSettings(urlName: string, data: IUpdateWorkspaceSettings): Promise<IWorkspaceSettings> {
        await delay();
        const current = getOrInitWorkspaceSettings(urlName);
        mockWorkspaceSettings[urlName] = { ...current, ...data };
        return { ...mockWorkspaceSettings[urlName] };
    },
};
