import type { IWorkspaceSettings } from '../../types';

export const mockWorkspaceSettings: Record<string, IWorkspaceSettings> = {
    'env-01': { name: 'מפקדת חטיבה', command: 'פיקוד צפון', logoUrl: null },
};

export function getOrInitWorkspaceSettings(urlName: string): IWorkspaceSettings {
    if (!mockWorkspaceSettings[urlName]) {
        mockWorkspaceSettings[urlName] = { name: urlName, command: null, logoUrl: null };
    }
    return mockWorkspaceSettings[urlName];
}
