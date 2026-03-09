import { useQuery } from '@tanstack/react-query';
import { activityApi } from '@/api/endpoints';
import { activityMapper } from '@/api/mappers';
import type { ActivityEvent } from '@/types';

export const activityKeys = {
  list: (instructionId: string) => ['activity', instructionId] as const,
};

export function useActivity(instructionId: string) {
  return useQuery({
    queryKey: activityKeys.list(instructionId),
    queryFn: async (): Promise<ActivityEvent[]> => {
      const data = await activityApi.getByInstruction(instructionId);
      return data.map(activityMapper.toDomain);
    },
    enabled: !!instructionId,
  });
}
