import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sendRequest } from '../axios';
import { usersApi } from '../mocks/endpoints';
import type { MutationOptions, QueryOptions } from '../queryClient';
import type { ICreateUser, IUpdateUser, IUser } from '../types';
import { USE_MOCK_API } from '../utils/envUtils';

const usersUrl = 'users';

export const userKeys = {
    all: [usersUrl] as const,
    detail: (id: number) => [usersUrl, id] as const,
};

interface UpdateUserParams {
    userId: number;
    data: IUpdateUser;
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

export function useDeleteUser(options?: MutationOptions<number>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userId: number) =>
            USE_MOCK_API
                ? await usersApi.delete(userId)
                : await sendRequest<void>({ method: 'DELETE', url: `${usersUrl}/${userId}` }),
        ...options,
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: userKeys.all });
            options?.onSuccess?.(...args);
        },
    });
}
