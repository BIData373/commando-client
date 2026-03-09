import {
  mockInstructions,
  toListItem,
  getStatsForEnv,
  mockTags,
  mockUserSummaries,
  currentUser,
} from '@/mocks/data';
import type {
  InstructionDto,
  InstructionListItemDto,
  CreateInstructionDto,
  UpdateInstructionDto,
  InstructionStatsDto,
} from '../dtos';

/** Simulate async delay */
const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

export interface InstructionFilters {
  status?: string;
  priority?: string;
  assigneeId?: string;
  tagId?: string;
  search?: string;
  overdue?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

/** Instruction API endpoints — In-memory mock implementation */
export const instructionsApi = {
  async getByEnvironment(
    envId: string,
    _filters?: InstructionFilters
  ): Promise<{ data: InstructionListItemDto[]; total: number }> {
    await delay();
    const items = mockInstructions.filter((i) => i.environment_id === envId);
    return {
      data: items.map(toListItem),
      total: items.length,
    };
  },

  async getById(instructionId: string): Promise<InstructionDto> {
    await delay();
    const inst = mockInstructions.find((i) => i.id === instructionId);
    if (!inst) throw new Error('Instruction not found');
    return { ...inst };
  },

  async create(envId: string, data: CreateInstructionDto): Promise<InstructionDto> {
    await delay(300);
    const newInst: InstructionDto = {
      id: `inst-new-${Date.now()}`,
      environment_id: envId,
      title: data.title,
      description: data.description || null,
      status: data.status || 'open',
      priority: data.priority || 'medium',
      due_date_type: data.due_date_type || 'routine',
      due_date_from: data.due_date_from || null,
      due_date: data.due_date || null,
      source: data.source || null,
      created_by: currentUser,
      assignees: (data.assignee_ids || []).map((uid, idx) => ({
        id: `asgn-new-${idx}`,
        user: mockUserSummaries.find((u) => u.id === uid) || currentUser,
        assigned_at: new Date().toISOString(),
        assigned_by: currentUser,
        status: data.status || 'open' as const,
      })),
      tags: (data.tag_ids || [])
        .map((tid) => mockTags.find((t) => t.id === tid))
        .filter((t): t is NonNullable<typeof t> => t !== undefined),
      comment_count: 0,
      attachment_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      completed_at: null,
      archived: false,
      is_important: data.is_important || false,
    };
    mockInstructions.push(newInst);
    return { ...newInst };
  },

  async update(
    instructionId: string,
    data: UpdateInstructionDto
  ): Promise<InstructionDto> {
    await delay(300);
    const idx = mockInstructions.findIndex((i) => i.id === instructionId);
    if (idx === -1) throw new Error('Instruction not found');

    const current = mockInstructions[idx];
    const updated = {
      ...current,
      ...data,
      updated_at: new Date().toISOString(),
      completed_at:
        data.status === 'completed'
          ? new Date().toISOString()
          : current.completed_at,
    };
    mockInstructions[idx] = updated;
    return { ...updated };
  },

  async delete(instructionId: string): Promise<void> {
    await delay(200);
    const idx = mockInstructions.findIndex((i) => i.id === instructionId);
    if (idx === -1) throw new Error('Instruction not found');
    mockInstructions.splice(idx, 1);
  },

  async getStats(envId: string): Promise<InstructionStatsDto> {
    await delay();
    return getStatsForEnv(envId);
  },
};
