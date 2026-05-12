import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '#/axios';
import { workspaceSettingsApi } from '../mocks/endpoints';
import type { MutationOptions, QueryOptions } from '../queryClient';
import type { IUpdateWorkspaceSettings, IWorkspaceSettings } from '../types';
import { USE_MOCK_API } from '../utils/envUtils';

const workspaceSettingsUrl = 'workspace-settings';

export const workspaceSettingsKeys = {
  detail: (urlName: string) => [workspaceSettingsUrl, urlName] as const,
};

export function useWorkspaceSettings(urlName: string, options?: QueryOptions<IWorkspaceSettings>) {
  return useQuery({
    queryKey: workspaceSettingsKeys.detail(urlName),
    queryFn: async (): Promise<IWorkspaceSettings> =>
      USE_MOCK_API
        ? await workspaceSettingsApi.getSettings(urlName)
        : await apiRequest<IWorkspaceSettings>({ method: 'GET', url: `${workspaceSettingsUrl}/${urlName}` }),
    ...options,
  });
}

export function useUpdateWorkspaceSettings(urlName: string, options?: MutationOptions<IUpdateWorkspaceSettings>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: IUpdateWorkspaceSettings) =>
      USE_MOCK_API
        ? await workspaceSettingsApi.updateSettings(urlName, data)
        : await apiRequest<IWorkspaceSettings>({ method: 'PATCH', url: `${workspaceSettingsUrl}/${urlName}`, data }),
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: workspaceSettingsKeys.detail(urlName) });
      options?.onSuccess?.(...args);
    },
  });
}
