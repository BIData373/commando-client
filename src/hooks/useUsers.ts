import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sendRequest } from '../axios';
import { usersApi } from '../mocks/endpoints';
import type { MutationOptions, QueryOptions } from '../queryClient';
import type { ICreateUser, IUpdateUser, IUser } from '../types';
import { USE_MOCK_API } from '../utils/envUtils';

const usersUrl = 'users';

export const userKeys = {
    all: [usersUrl] as const,
    workspace: (urlName: string) => [usersUrl, 'workspace', urlName] as const,
    detail: (id: number) => [usersUrl, id] as const,
};

interface UpdateUserParams {
    userId: number;
    data: IUpdateUser;
}

interface DeleteUserParams {
    userId: number;
    urlName?: string;
}

interface AddUserToWorkspaceParams {
    userId: number;
    urlName: string;
}

export function useUsers(options?: QueryOptions<IUser[]>) {
    return useQuery({
        queryKey: userKeys.all,
        queryFn: async (): Promise<IUser[]> =>
            USE_MOCK_API
                ? await usersApi.getAll()
                : await sendRequest<IUser[]>({ method: 'GET', url: usersUrl }),
        ...options,
    });
}

export function useWorkspaceUsers(urlName: string, options?: QueryOptions<IUser[]>) {
    return useQuery({
        queryKey: userKeys.workspace(urlName),
        queryFn: async (): Promise<IUser[]> =>
            USE_MOCK_API
                ? await usersApi.getAll(urlName)
                : await sendRequest<IUser[]>({ method: 'GET', url: `${usersUrl}?workspace=${urlName}` }),
        ...options,
    });
}

export function useUser(userId: number, options?: QueryOptions<IUser>) {
    return useQuery({
        queryKey: userKeys.detail(userId),
        queryFn: async (): Promise<IUser> =>
            USE_MOCK_API
                ? await usersApi.getById(userId)
                : await sendRequest<IUser>({ method: 'GET', url: `${usersUrl}/${userId}` }),
        enabled: !!userId,
        ...options,
    });
}

export function useCreateUser(options?: MutationOptions<ICreateUser>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ICreateUser) =>
            USE_MOCK_API
                ? await usersApi.create(data)
                : await sendRequest<IUser>({ method: 'POST', url: usersUrl, data }),
        ...options,
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: userKeys.all });
            options?.onSuccess?.(...args);
        },
    });
}

export function useUpdateUser(options?: MutationOptions<UpdateUserParams>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, data }: UpdateUserParams) =>
            USE_MOCK_API
                ? await usersApi.update(userId, data)
                : await sendRequest<IUser>({ method: 'PATCH', url: `${usersUrl}/${userId}`, data }),
        ...options,
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: userKeys.all });
            options?.onSuccess?.(...args);
        },
    });
}

export function useDeleteUser(options?: MutationOptions<DeleteUserParams>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, urlName }: DeleteUserParams) =>
            USE_MOCK_API
                ? await usersApi.delete(userId, urlName)
                : await sendRequest<void>({ method: 'DELETE', url: `${usersUrl}/${userId}` }),
        ...options,
        onSuccess: (...args) => {
            const { urlName } = args[1];
            if (urlName) {
                queryClient.invalidateQueries({ queryKey: userKeys.workspace(urlName) });
            } else {
                queryClient.invalidateQueries({ queryKey: userKeys.all });
            }
            options?.onSuccess?.(...args);
        },
    });
}

export function useAddUserToWorkspace(options?: MutationOptions<AddUserToWorkspaceParams>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, urlName }: AddUserToWorkspaceParams) =>
            USE_MOCK_API
                ? await usersApi.addToWorkspace(userId, urlName)
                : await sendRequest<void>({ method: 'POST', url: `${usersUrl}/${userId}/workspace/${urlName}` }),
        ...options,
        onSuccess: (...args) => {
            const { urlName } = args[1];
            queryClient.invalidateQueries({ queryKey: userKeys.workspace(urlName) });
            options?.onSuccess?.(...args);
        },
    });
}
