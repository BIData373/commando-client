import type {
    ICreateInstruction,
    IInstruction,
    IInstructionFilters,
    IInstructionListItem,
    IInstructionStats,
    IUpdateInstruction,
} from '../../types';
import {
    currentUser,
    getStatsForEnv,
    mockInstructions,
    mockTags,
    mockUserSummaries,
    toListItem,
} from '../data';

/** Simulate async delay */
const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

/** Instruction API endpoints — In-memory mock implementation */
export const instructionsApi = {
    async getByEnvironment(
        envId: string,
        _filters?: IInstructionFilters
    ): Promise<{ data: IInstructionListItem[]; total: number }> {
        await delay();
        const items = mockInstructions.filter((i) => i.environmentId === envId);
        return {
            data: items.map(toListItem),
            total: items.length,
        };
    },

    async getById(instructionId: string): Promise<IInstruction> {
        await delay();
        const inst = mockInstructions.find((i) => i.id === instructionId);
        if (!inst) throw new Error('Instruction not found');
        return { ...inst };
    },

    async create(envId: string, data: ICreateInstruction): Promise<IInstruction> {
        await delay(300);
        const newInst: IInstruction = {
            id: `inst-new-${Date.now()}`,
            environmentId: envId,
            title: data.title,
            description: data.description || null,
            status: data.status || 'open',
            priority: data.priority || 'medium',
            dueDateType: data.dueDateType || 'routine',
            dueDateFrom: data.dueDateFrom || null,
            dueDate: data.dueDate || null,
            source: data.source || null,
            createdBy: currentUser,
            assignees: (data.assigneeIds || []).map((uid, idx) => ({
                id: `asgn-new-${idx}`,
                user: mockUserSummaries.find((u) => u.id === uid) || currentUser,
                assignedAt: new Date().toISOString(),
                assignedBy: currentUser,
                status: data.status || ('open' as const),
            })),
            tags: (data.tagIds || [])
                .map((tid) => mockTags.find((t) => t.id === tid))
                .filter((t): t is NonNullable<typeof t> => t !== undefined),
            commentCount: 0,
            attachmentCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            completedAt: null,
            archived: false,
            isImportant: data.isImportant || false,
        };
        mockInstructions.push(newInst);
        return { ...newInst };
    },

    async update(instructionId: string, data: IUpdateInstruction): Promise<IInstruction> {
        await delay(300);
        const idx = mockInstructions.findIndex((i) => i.id === instructionId);
        if (idx === -1) throw new Error('Instruction not found');

        const current = mockInstructions[idx];
        const updated = {
            ...current,
            ...data,
            updatedAt: new Date().toISOString(),
            completedAt: data.status === 'completed' ? new Date().toISOString() : current.completedAt,
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

    async getStats(envId: string): Promise<IInstructionStats> {
        await delay();
        return getStatsForEnv(envId);
    },
};
