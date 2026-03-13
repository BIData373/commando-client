import { useQuery } from '@tanstack/react-query';
import { sendRequest } from '../axios';
import { activityApi } from '../mocks/endpoints';
import type { QueryOptions } from '../queryClient';
import type { IActivityEvent } from '../types';
import { USE_MOCK_API } from '../utils/envUtils';

export const activityKeys = {
  list: (instructionId: string) => ['activity', instructionId] as const,
};

export function useActivity(instructionId: string, options?: QueryOptions<IActivityEvent[]>) {
  return useQuery({
    queryKey: activityKeys.list(instructionId),
    queryFn: async (): Promise<IActivityEvent[]> =>
      USE_MOCK_API
        ? await activityApi.getByInstruction(instructionId)
        : await sendRequest<IActivityEvent[]>({
            method: 'GET',
            url: `/instructions/${instructionId}/activity`,
          }),
    enabled: !!instructionId,
    ...options,
  });
}
