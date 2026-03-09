import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { environmentsApi } from '@/api/endpoints';
import { environmentMapper } from '@/api/mappers';
import type { EnvironmentWithRole, EnvironmentMember, Tag, ResponsibleGroup } from '@/types';
import type { CreateEnvironmentDto, CreateResponsibleGroupDto } from '@/api/dtos';

export const environmentKeys = {
  all: ['environments'] as const,
  detail: (id: string) => ['environments', id] as const,
  members: (id: string) => ['environments', id, 'members'] as const,
  tags: (id: string) => ['environments', id, 'tags'] as const,
  responsibleGroups: (id: string) => ['environments', id, 'responsibleGroups'] as const,
};

export function useEnvironments() {
  return useQuery({
    queryKey: environmentKeys.all,
    queryFn: async (): Promise<EnvironmentWithRole[]> => {
      const data = await environmentsApi.getAll();
      return data.map(environmentMapper.toDomain);
    },
  });
}

export function useEnvironment(envId: string) {
  return useQuery({
    queryKey: environmentKeys.detail(envId),
    queryFn: async (): Promise<EnvironmentWithRole> => {
      const data = await environmentsApi.getById(envId);
      return environmentMapper.toDomain(data);
    },
    enabled: !!envId,
  });
}

export function useCreateEnvironment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEnvironmentDto) => environmentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: environmentKeys.all });
    },
  });
}

// ── Members ──

export function useEnvironmentMembers(envId: string) {
  return useQuery({
    queryKey: environmentKeys.members(envId),
    queryFn: async (): Promise<EnvironmentMember[]> => {
      const data = await environmentsApi.getMembers(envId);
      return data.map(environmentMapper.memberToDomain);
    },
    enabled: !!envId,
  });
}

// ── Tags ──

export function useEnvironmentTags(envId: string) {
  return useQuery({
    queryKey: environmentKeys.tags(envId),
    queryFn: async (): Promise<Tag[]> => {
      const data = await environmentsApi.getTags(envId);
      return data.map(environmentMapper.tagToDomain);
    },
    enabled: !!envId,
  });
}

// ── Responsible Groups ──

export function useResponsibleGroups(envId: string) {
  return useQuery({
    queryKey: environmentKeys.responsibleGroups(envId),
    queryFn: async (): Promise<ResponsibleGroup[]> => {
      const data = await environmentsApi.getResponsibleGroups(envId);
      return data.map(environmentMapper.responsibleGroupToDomain);
    },
    enabled: !!envId,
  });
}

export function useCreateResponsibleGroup(envId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateResponsibleGroupDto) =>
      environmentsApi.createResponsibleGroup(envId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: environmentKeys.responsibleGroups(envId) });
    },
  });
}

export function useUpdateResponsibleGroup(envId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, data }: { groupId: string; data: CreateResponsibleGroupDto }) =>
      environmentsApi.updateResponsibleGroup(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: environmentKeys.responsibleGroups(envId) });
    },
  });
}

export function useDeleteResponsibleGroup(envId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupId: string) => environmentsApi.deleteResponsibleGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: environmentKeys.responsibleGroups(envId) });
    },
  });
}
