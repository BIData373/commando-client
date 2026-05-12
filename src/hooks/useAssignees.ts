import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../axios';
import { assigneesApi } from '../mocks/endpoints';
import type { MutationOptions, QueryOptions } from '../queryClient';
import type { IAssignee, ICreateAssignee, IUpdateAssignee } from '../types';
import { USE_MOCK_API } from '../utils/envUtils';

const assigneesUrl = 'assignees';

export const assigneeKeys = {
  all: [assigneesUrl] as const,
  detail: (id: number) => [assigneesUrl, id] as const,
};

interface UpdateAssigneeParams {
  assigneeId: number;
  data: IUpdateAssignee;
}

export function useAssignees(options?: QueryOptions<IAssignee[]>) {
  return useQuery({
    queryKey: assigneeKeys.all,
    queryFn: async (): Promise<IAssignee[]> =>
      USE_MOCK_API
        ? await assigneesApi.getAll()
        : await apiRequest<IAssignee[]>({ method: 'GET', url: assigneesUrl }),
    ...options,
  });
}

export function useCreateAssignee(options?: MutationOptions<ICreateAssignee>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ICreateAssignee) =>
      USE_MOCK_API
        ? await assigneesApi.create(data)
        : await apiRequest<IAssignee>({ method: 'POST', url: assigneesUrl, data }),
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: assigneeKeys.all });
      options?.onSuccess?.(...args);
    },
  });
}

export function useUpdateAssignee(options?: MutationOptions<UpdateAssigneeParams>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ assigneeId, data }: UpdateAssigneeParams) =>
      USE_MOCK_API
        ? await assigneesApi.update(assigneeId, data)
        : await apiRequest<IAssignee>({ method: 'PATCH', url: `${assigneesUrl}/${assigneeId}`, data }),
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: assigneeKeys.all });
      options?.onSuccess?.(...args);
    },
  });
}

export function useDeleteAssignee(options?: MutationOptions<number>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assigneeId: number) =>
      USE_MOCK_API
        ? await assigneesApi.delete(assigneeId)
        : await apiRequest<void>({ method: 'DELETE', url: `${assigneesUrl}/${assigneeId}` }),
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: assigneeKeys.all });
      options?.onSuccess?.(...args);
    },
  });
}
