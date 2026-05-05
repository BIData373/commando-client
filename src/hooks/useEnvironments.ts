import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sendRequest } from '../axios';
import { environmentsApi } from '../mocks/endpoints';
import type { MutationOptions, QueryOptions } from '../queryClient';
import type {
    ICreateEnvironment,
    ICreateResponsibleGroup,
    IEnvironmentMember,
    IEnvironmentWithRole,
    IResponsibleGroup,
    ITag,
} from '../types';
import { USE_MOCK_API } from '../utils/envUtils';

const environmentsUrl = 'environments';

export const environmentKeys = {
    all: [environmentsUrl] as const,
    detail: (id: string) => [environmentsUrl, id] as const,
    members: (id: string) => [environmentsUrl, id, 'members'] as const,
    tags: (id: string) => [environmentsUrl, id, 'tags'] as const,
    responsibleGroups: (id: string) => [environmentsUrl, id, 'responsibleGroups'] as const,
};

interface UpdateResponsibleGroupParams {
    groupId: string;
    data: ICreateResponsibleGroup;
}

export function useEnvironments(options?: QueryOptions<IEnvironmentWithRole[]>) {
    return useQuery({
        queryKey: environmentKeys.all,
        queryFn: async (): Promise<IEnvironmentWithRole[]> =>
            USE_MOCK_API
                ? await environmentsApi.getAll()
                : await sendRequest<IEnvironmentWithRole[]>({ method: 'GET', url: environmentsUrl }),
        ...options,
    });
}

export function useEnvironment(envId: string, options?: QueryOptions<IEnvironmentWithRole>) {
    return useQuery({
        queryKey: environmentKeys.detail(envId),
        queryFn: async (): Promise<IEnvironmentWithRole> =>
            USE_MOCK_API
                ? await environmentsApi.getById(envId)
                : await sendRequest<IEnvironmentWithRole>({
                    method: 'GET',
                    url: `${environmentsUrl}/${envId}`,
                }),
        enabled: !!envId,
        ...options,
    });
}

export function useCreateEnvironment(options?: MutationOptions<ICreateEnvironment>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ICreateEnvironment) =>
            USE_MOCK_API
                ? await environmentsApi.create(data)
                : await sendRequest<IEnvironmentWithRole>({ method: 'POST', url: environmentsUrl, data }),
        ...options,
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: environmentKeys.all });
            options?.onSuccess?.(...args);
        },
    });
}

export function useEnvironmentMembers(envId: string, options?: QueryOptions<IEnvironmentMember[]>) {
    return useQuery({
        queryKey: environmentKeys.members(envId),
        queryFn: async (): Promise<IEnvironmentMember[]> =>
            USE_MOCK_API
                ? await environmentsApi.getMembers(envId)
                : await sendRequest<IEnvironmentMember[]>({
                    method: 'GET',
                    url: `${environmentsUrl}/${envId}/members`,
                }),
        enabled: !!envId,
        ...options,
    });
}

export function useEnvironmentTags(envId: string, options?: QueryOptions<ITag[]>) {
    return useQuery({
        queryKey: environmentKeys.tags(envId),
        queryFn: async (): Promise<ITag[]> =>
            USE_MOCK_API
                ? await environmentsApi.getTags(envId)
                : await sendRequest<ITag[]>({ method: 'GET', url: `${environmentsUrl}/${envId}/tags` }),
        enabled: !!envId,
        ...options,
    });
}

// FIX Move to useResponsibleGroup file?
// ── Responsible Groups ──

export function useResponsibleGroups(envId: string, options?: QueryOptions<IResponsibleGroup[]>) {
    return useQuery({
        queryKey: environmentKeys.responsibleGroups(envId),
        queryFn: async (): Promise<IResponsibleGroup[]> =>
            USE_MOCK_API
                ? await environmentsApi.getResponsibleGroups(envId)
                : await sendRequest<IResponsibleGroup[]>({
                    method: 'GET',
                    url: `${environmentsUrl}/${envId}/responsible-groups`,
                }),
        enabled: !!envId,
        ...options,
    });
}

export function useCreateResponsibleGroup(
    envId: string,
    options?: MutationOptions<ICreateResponsibleGroup>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ICreateResponsibleGroup) =>
            USE_MOCK_API
                ? await environmentsApi.createResponsibleGroup(envId, data)
                : await sendRequest<IResponsibleGroup>({
                    method: 'POST',
                    url: `${environmentsUrl}/${envId}/responsible-groups`,
                    data,
                }),
        ...options,
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: environmentKeys.responsibleGroups(envId) });
            options?.onSuccess?.(...args);
        },
    });
}

export function useUpdateResponsibleGroup(
    envId: string,
    options?: MutationOptions<UpdateResponsibleGroupParams>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ groupId, data }: UpdateResponsibleGroupParams) =>
            USE_MOCK_API
                ? await environmentsApi.updateResponsibleGroup(groupId, data)
                : await sendRequest<IResponsibleGroup>({
                    method: 'PATCH',
                    url: `/responsible-groups/${groupId}`,
                    data,
                }),
        ...options,
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: environmentKeys.responsibleGroups(envId) });
            options?.onSuccess?.(...args);
        },
    });
}

export function useDeleteResponsibleGroup(envId: string, options?: MutationOptions<string>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (groupId: string) =>
            USE_MOCK_API
                ? await environmentsApi.deleteResponsibleGroup(groupId)
                : await sendRequest<void>({ method: 'DELETE', url: `/responsible-groups/${groupId}` }),
        ...options,
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: environmentKeys.responsibleGroups(envId) });
            options?.onSuccess?.(...args);
        },
    });
}
