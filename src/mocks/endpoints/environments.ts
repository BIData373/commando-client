import type {
	ICreateEnvironment,
	ICreateResponsibleGroup,
	IEnvironmentMember,
	IEnvironmentWithRole,
	IResponsibleGroup,
	ITag,
} from "../../types";
import {
	mockEnvironments,
	mockMembers,
	mockResponsibleGroups,
	mockTags,
	mockUserSummaries,
} from "../data";

/** Simulate async delay for realistic feel */
const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

/** Environment API endpoints — In-memory mock implementation */
export const environmentsApi = {
	async getAll(): Promise<IEnvironmentWithRole[]> {
		await delay();
		return [...mockEnvironments];
	},

	async getById(envId: string): Promise<IEnvironmentWithRole> {
		await delay();
		const env = mockEnvironments.find((e) => e.id === envId);
		if (!env) throw new Error("Environment not found");
		return { ...env };
	},

	async create(data: ICreateEnvironment): Promise<IEnvironmentWithRole> {
		await delay(300);
		const newEnv: IEnvironmentWithRole = {
			id: `env-new-${Date.now()}`,
			name: data.name,
			description: data.description || null,
			logoUrl: null,
			createdBy: "u1-aaaa-bbbb-cccc-dddddddddddd",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			archived: false,
			memberCount: 1,
			instructionCount: 0,
			currentUserRole: "manager",
		};
		mockEnvironments.push(newEnv);
		return { ...newEnv };
	},

	async getMembers(envId: string): Promise<IEnvironmentMember[]> {
		await delay();
		return mockMembers.filter((m) => m.environmentId === envId);
	},

	async getTags(envId: string): Promise<ITag[]> {
		await delay();
		return mockTags.filter((t) => t.environmentId === envId);
	},

	async getResponsibleGroups(envId: string): Promise<IResponsibleGroup[]> {
		await delay();
		return mockResponsibleGroups.filter((g) => g.environmentId === envId);
	},

	async createResponsibleGroup(
		envId: string,
		data: ICreateResponsibleGroup,
	): Promise<IResponsibleGroup> {
		await delay(300);
		const newGroup: IResponsibleGroup = {
			id: `resp-new-${Date.now()}`,
			environmentId: envId,
			nickname: data.nickname,
			members: data.userIds
				.map((uid) => mockUserSummaries.find((u) => u.id === uid))
				.filter((u): u is NonNullable<typeof u> => u !== undefined),
			createdAt: new Date().toISOString(),
		};
		mockResponsibleGroups.push(newGroup);
		return { ...newGroup };
	},

	async updateResponsibleGroup(
		groupId: string,
		data: ICreateResponsibleGroup,
	): Promise<IResponsibleGroup> {
		await delay(300);
		const idx = mockResponsibleGroups.findIndex((g) => g.id === groupId);
		if (idx === -1) throw new Error("Responsible group not found");
		const updated = {
			...mockResponsibleGroups[idx],
			nickname: data.nickname,
			members: data.userIds
				.map((uid) => mockUserSummaries.find((u) => u.id === uid))
				.filter((u): u is NonNullable<typeof u> => u !== undefined),
		};
		mockResponsibleGroups[idx] = updated;
		return { ...updated };
	},

	async deleteResponsibleGroup(groupId: string): Promise<void> {
		await delay(200);
		const idx = mockResponsibleGroups.findIndex((g) => g.id === groupId);
		if (idx === -1) throw new Error("Responsible group not found");
		mockResponsibleGroups.splice(idx, 1);
	},
};
