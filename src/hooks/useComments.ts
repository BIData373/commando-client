import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sendRequest } from '../axios';
import { commentsApi } from '../mocks/endpoints';
import type { MutationOptions, QueryOptions } from '../queryClient';
import type { IComment, ICreateComment } from '../types';
import { USE_MOCK_API } from '../utils/envUtils';

export const commentKeys = {
  list: (instructionId: string) => ['comments', instructionId] as const,
};

export function useComments(instructionId: string, options?: QueryOptions<IComment[]>) {
  return useQuery({
    queryKey: commentKeys.list(instructionId),
    queryFn: async (): Promise<IComment[]> => {
      const data = USE_MOCK_API
        ? await commentsApi.getByInstruction(instructionId)
        : await sendRequest<IComment[]>({
            method: 'GET',
            url: `/instructions/${instructionId}/comments`,
          });
      return data;
    },
    enabled: !!instructionId,
    ...options,
  });
}

export function useCreateComment(instructionId: string, options?: MutationOptions<ICreateComment>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateComment) =>
      USE_MOCK_API
        ? commentsApi.create(instructionId, data)
        : sendRequest<IComment>({
            method: 'POST',
            url: `/instructions/${instructionId}/comments`,
            data,
          }),
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(instructionId) });
      options?.onSuccess?.(...args);
    },
  });
}
