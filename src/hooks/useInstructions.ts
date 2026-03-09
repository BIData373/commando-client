import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { instructionsApi } from '@/api/endpoints';
import type { InstructionFilters } from '@/api/endpoints';
import { instructionMapper } from '@/api/mappers';
import type { InstructionListItem, Instruction, InstructionStats } from '@/types';
import type { CreateInstructionDto, UpdateInstructionDto } from '@/api/dtos';

export const instructionKeys = {
  all: ['instructions'] as const,
  list: (envId: string, filters?: InstructionFilters) =>
    ['instructions', 'list', envId, filters] as const,
  detail: (id: string) => ['instructions', 'detail', id] as const,
  stats: (envId: string) => ['instructions', 'stats', envId] as const,
};

export function useInstructions(envId: string, filters?: InstructionFilters) {
  return useQuery({
    queryKey: instructionKeys.list(envId, filters),
    queryFn: async (): Promise<{ data: InstructionListItem[]; total: number }> => {
      const response = await instructionsApi.getByEnvironment(envId, filters);
      return {
        data: response.data.map(instructionMapper.listItemToDomain),
        total: response.total,
      };
    },
    enabled: !!envId,
  });
}

export function useInstruction(instructionId: string) {
  return useQuery({
    queryKey: instructionKeys.detail(instructionId),
    queryFn: async (): Promise<Instruction> => {
      const data = await instructionsApi.getById(instructionId);
      return instructionMapper.toDomain(data);
    },
    enabled: !!instructionId,
  });
}

export function useInstructionStats(envId: string) {
  return useQuery({
    queryKey: instructionKeys.stats(envId),
    queryFn: async (): Promise<InstructionStats> => {
      const data = await instructionsApi.getStats(envId);
      return instructionMapper.statsToDomain(data);
    },
    enabled: !!envId,
  });
}

export function useCreateInstruction(envId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInstructionDto) =>
      instructionsApi.create(envId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['instructions', 'list', envId],
      });
      queryClient.invalidateQueries({
        queryKey: instructionKeys.stats(envId),
      });
    },
  });
}

export function useUpdateInstruction(envId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      instructionId,
      data,
    }: {
      instructionId: string;
      data: UpdateInstructionDto;
    }) => instructionsApi.update(instructionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['instructions', 'list', envId],
      });
      queryClient.invalidateQueries({
        queryKey: instructionKeys.stats(envId),
      });
    },
  });
}

export function useDeleteInstruction(envId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (instructionId: string) =>
      instructionsApi.delete(instructionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['instructions', 'list', envId],
      });
      queryClient.invalidateQueries({
        queryKey: instructionKeys.stats(envId),
      });
    },
  });
}
