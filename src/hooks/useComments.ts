import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '@/api/endpoints';
import { commentMapper } from '@/api/mappers';
import type { Comment } from '@/types';
import type { CreateCommentDto } from '@/api/dtos';

export const commentKeys = {
  list: (instructionId: string) => ['comments', instructionId] as const,
};

export function useComments(instructionId: string) {
  return useQuery({
    queryKey: commentKeys.list(instructionId),
    queryFn: async (): Promise<Comment[]> => {
      const data = await commentsApi.getByInstruction(instructionId);
      return data.map(commentMapper.toDomain);
    },
    enabled: !!instructionId,
  });
}

export function useCreateComment(instructionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentDto) =>
      commentsApi.create(instructionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(instructionId),
      });
    },
  });
}
