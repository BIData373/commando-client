import type { ICreateUser, IUpdateUser, IUser } from "../../types"
import { mockUsers, mockWorkspaceMemberships } from "../data"

/** Simulate async delay for realistic feel */
const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms))

/** Users API endpoints — In-memory mock implementation */
export const usersApi = {
	async getAll(urlName?: string): Promise<IUser[]> {
		await delay()
		if (urlName) {
			const memberIds = mockWorkspaceMemberships[urlName] ?? []
			return mockUsers.filter((u) => memberIds.includes(u.id))
		}
		return [...mockUsers]
	},

	async getById(userId: number): Promise<IUser> {
		await delay()
		const user = mockUsers.find((u) => u.id === userId)
		if (!user) throw new Error("User not found")
		return { ...user }
	},

	async create(data: ICreateUser): Promise<IUser> {
		await delay()
		const now = new Date().toISOString()
		const newUser: IUser = {
			id: Math.max(...mockUsers.map((u) => u.id)) + 1,
			avatarUrl: data.avatarUrl ?? null,
			lastLogin: null,
			createdAt: now,
			updatedAt: now,
			...data,
		}
		mockUsers.push(newUser)
		return { ...newUser }
	},

	async update(userId: number, data: IUpdateUser): Promise<IUser> {
		await delay()
		const index = mockUsers.findIndex((u) => u.id === userId)
		if (index === -1) throw new Error("User not found")
		mockUsers[index] = {
			...mockUsers[index],
			...data,
			updatedAt: new Date().toISOString(),
		}
		return { ...mockUsers[index] }
	},

	async delete(userId: number, urlName?: string): Promise<void> {
		await delay()
		if (urlName) {
			const memberIds = mockWorkspaceMemberships[urlName]
			if (!memberIds) return
			const idx = memberIds.indexOf(userId)
			if (idx !== -1) memberIds.splice(idx, 1)
			return
		}
		const index = mockUsers.findIndex((u) => u.id === userId)
		if (index === -1) throw new Error("User not found")
		mockUsers.splice(index, 1)
	},

	async addToWorkspace(userId: number, urlName: string): Promise<void> {
		await delay()
		if (!mockWorkspaceMemberships[urlName]) {
			mockWorkspaceMemberships[urlName] = []
		}
		if (!mockWorkspaceMemberships[urlName].includes(userId)) {
			mockWorkspaceMemberships[urlName].push(userId)
		}
	},
}
