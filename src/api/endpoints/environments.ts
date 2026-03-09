import {
  mockEnvironments,
  mockMembers,
  mockTags,
  mockResponsibleGroups,
  mockUserSummaries,
} from '@/mocks/data';
import type {
  EnvironmentWithRoleDto,
  CreateEnvironmentDto,
  EnvironmentMemberDto,
  TagDto,
  ResponsibleGroupDto,
  CreateResponsibleGroupDto,
} from '../dtos';

/** Simulate async delay for realistic feel */
const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

/** Environment API endpoints — In-memory mock implementation */
export const environmentsApi = {
  async getAll(): Promise<EnvironmentWithRoleDto[]> {
    await delay();
    return [...mockEnvironments];
  },

  async getById(envId: string): Promise<EnvironmentWithRoleDto> {
    await delay();
    const env = mockEnvironments.find((e) => e.id === envId);
    if (!env) throw new Error('Environment not found');
    return { ...env };
  },

  async create(data: CreateEnvironmentDto): Promise<EnvironmentWithRoleDto> {
    await delay(300);
    const newEnv: EnvironmentWithRoleDto = {
      id: `env-new-${Date.now()}`,
      name: data.name,
      description: data.description || null,
      logo_url: null,
      created_by: 'u1-aaaa-bbbb-cccc-dddddddddddd',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      archived: false,
      member_count: 1,
      instruction_count: 0,
      current_user_role: 'manager',
    };
    mockEnvironments.push(newEnv);
    return { ...newEnv };
  },

  async getMembers(envId: string): Promise<EnvironmentMemberDto[]> {
    await delay();
    return mockMembers.filter((m) => m.environment_id === envId);
  },

  async getTags(envId: string): Promise<TagDto[]> {
    await delay();
    return mockTags.filter((t) => t.environment_id === envId);
  },

  async getResponsibleGroups(envId: string): Promise<ResponsibleGroupDto[]> {
    await delay();
    return mockResponsibleGroups.filter((g) => g.environment_id === envId);
  },

  async createResponsibleGroup(envId: string, data: CreateResponsibleGroupDto): Promise<ResponsibleGroupDto> {
    await delay(300);
    const newGroup: ResponsibleGroupDto = {
      id: `resp-new-${Date.now()}`,
      environment_id: envId,
      nickname: data.nickname,
      members: data.user_ids
        .map((uid) => mockUserSummaries.find((u) => u.id === uid))
        .filter((u): u is NonNullable<typeof u> => u !== undefined),
      created_at: new Date().toISOString(),
    };
    mockResponsibleGroups.push(newGroup);
    return { ...newGroup };
  },

  async updateResponsibleGroup(groupId: string, data: CreateResponsibleGroupDto): Promise<ResponsibleGroupDto> {
    await delay(300);
    const idx = mockResponsibleGroups.findIndex((g) => g.id === groupId);
    if (idx === -1) throw new Error('Responsible group not found');
    const updated: ResponsibleGroupDto = {
      ...mockResponsibleGroups[idx],
      nickname: data.nickname,
      members: data.user_ids
        .map((uid) => mockUserSummaries.find((u) => u.id === uid))
        .filter((u): u is NonNullable<typeof u> => u !== undefined),
    };
    mockResponsibleGroups[idx] = updated;
    return { ...updated };
  },

  async deleteResponsibleGroup(groupId: string): Promise<void> {
    await delay(200);
    const idx = mockResponsibleGroups.findIndex((g) => g.id === groupId);
    if (idx === -1) throw new Error('Responsible group not found');
    mockResponsibleGroups.splice(idx, 1);
  },
};
