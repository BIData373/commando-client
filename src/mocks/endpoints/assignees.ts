import type { IAssignee, ICreateAssignee, IUpdateAssignee } from "../../types";
import { mockAssignees } from "../data";

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

export const assigneesApi = {
	async getAll(): Promise<IAssignee[]> {
		await delay();
		return [...mockAssignees];
	},

	async getById(assigneeId: number): Promise<IAssignee> {
		await delay();
		const assignee = mockAssignees.find((a) => a.id === assigneeId);
		if (!assignee) throw new Error("Assignee not found");
		return { ...assignee };
	},

	async create(data: ICreateAssignee): Promise<IAssignee> {
		await delay();
		const now = new Date().toISOString();
		const newAssignee: IAssignee = {
			id: Math.max(...mockAssignees.map((a) => a.id), 0) + 1,
			color: "",
			emblem: null,
			userIds: data.userIds ?? [],
			createdAt: now,
			createdBy: 1,
			updatedAt: now,
			updatedBy: 1,
			deletedAt: null,
			deletedBy: null,
			...data,
		};
		mockAssignees.push(newAssignee);
		return { ...newAssignee };
	},

	async update(assigneeId: number, data: IUpdateAssignee): Promise<IAssignee> {
		await delay();
		const index = mockAssignees.findIndex((a) => a.id === assigneeId);
		if (index === -1) throw new Error("Assignee not found");
		mockAssignees[index] = {
			...mockAssignees[index],
			...data,
			updatedAt: new Date().toISOString(),
		};
		return { ...mockAssignees[index] };
	},

	async delete(assigneeId: number): Promise<void> {
		await delay();
		const index = mockAssignees.findIndex((a) => a.id === assigneeId);
		if (index === -1) throw new Error("Assignee not found");
		mockAssignees.splice(index, 1);
	},
};
