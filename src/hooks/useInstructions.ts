import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sendRequest } from '../axios';
import { instructionsApi } from '../mocks/endpoints';
import type { MutationOptions, QueryOptions } from '../queryClient';
import type {
  ICreateInstruction,
  IInstruction,
  IInstructionFilters,
  IInstructionListItem,
  IInstructionStats,
  IUpdateInstruction,
} from '../types';
import { USE_MOCK_API } from '../utils/envUtils';

const instructionsUrl = 'instructions';

export const instructionKeys = {
  all: [instructionsUrl] as const,
  list: (envId: string, filters?: IInstructionFilters) =>
    [instructionsUrl, 'list', envId, filters] as const,
  detail: (id: string) => [instructionsUrl, 'detail', id] as const,
  stats: (envId: string) => [instructionsUrl, 'stats', envId] as const,
};

interface InstructionListResult {
  data: IInstructionListItem[];
  total: number;
}

interface UpdateInstructionParams {
  instructionId: string;
  data: IUpdateInstruction;
}

// FIX Move to environments
export function useInstructions(
  envId: string,
  filters?: IInstructionFilters,
  options?: QueryOptions<InstructionListResult>
) {
  return useQuery({
    queryKey: instructionKeys.list(envId, filters),
    queryFn: async (): Promise<InstructionListResult> => {
      const response = USE_MOCK_API
        ? await instructionsApi.getByEnvironment(envId, filters)
        : await sendRequest<{ data: IInstructionListItem[]; total: number }>({
            method: 'GET',
            url: `/environments/${envId}/instructions`,
            params: filters,
          });
      return response;
    },
    enabled: !!envId,
    ...options,
  });
}

export function useInstruction(instructionId: string, options?: QueryOptions<IInstruction>) {
  return useQuery({
    queryKey: instructionKeys.detail(instructionId),
    queryFn: async (): Promise<IInstruction> => {
      const data = USE_MOCK_API
        ? await instructionsApi.getById(instructionId)
        : await sendRequest<IInstruction>({ method: 'GET', url: `/instructions/${instructionId}` });
      return data;
    },
    enabled: !!instructionId,
    ...options,
  });
}

export function useInstructionStats(envId: string, options?: QueryOptions<IInstructionStats>) {
  return useQuery({
    queryKey: instructionKeys.stats(envId),
    queryFn: async (): Promise<IInstructionStats> => {
      const data = USE_MOCK_API
        ? await instructionsApi.getStats(envId)
        : await sendRequest<IInstructionStats>({
            method: 'GET',
            url: `/environments/${envId}/instructions/stats`,
          });
      return data;
    },
    enabled: !!envId,
    ...options,
  });
}

export function useCreateInstruction(envId: string, options?: MutationOptions<ICreateInstruction>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateInstruction) =>
      USE_MOCK_API
        ? instructionsApi.create(envId, data)
        : sendRequest<IInstruction>({
            method: 'POST',
            url: `/environments/${envId}/instructions`,
            data,
          }),
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: instructionKeys.list(envId) });
      queryClient.invalidateQueries({ queryKey: instructionKeys.stats(envId) });
      options?.onSuccess?.(...args);
    },
  });
}

export function useUpdateInstruction(
  envId: string,
  options?: MutationOptions<UpdateInstructionParams>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ instructionId, data }: UpdateInstructionParams) =>
      USE_MOCK_API
        ? instructionsApi.update(instructionId, data)
        : sendRequest<IInstruction>({
            method: 'PATCH',
            url: `/instructions/${instructionId}`,
            data,
          }),
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: instructionKeys.list(envId) });
      queryClient.invalidateQueries({ queryKey: instructionKeys.stats(envId) });
      options?.onSuccess?.(...args);
    },
  });
}

export function useDeleteInstruction(envId: string, options?: MutationOptions<string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (instructionId: string) =>
      USE_MOCK_API
        ? instructionsApi.delete(instructionId)
        : sendRequest<void>({ method: 'DELETE', url: `/instructions/${instructionId}` }),
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: instructionKeys.list(envId) });
      queryClient.invalidateQueries({ queryKey: instructionKeys.stats(envId) });
      options?.onSuccess?.(...args);
    },
  });
}
