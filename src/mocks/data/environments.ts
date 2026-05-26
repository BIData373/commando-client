import type {
	IEnvironmentMember,
	IEnvironmentWithRole,
	IResponsibleGroup,
	ITag,
} from "../../types"
import { mockUserSummaries, mockUsers } from "./users"

export const mockTags: ITag[] = [
	{
		id: "tag-01-aaaa-bbbb-cccccccccccc",
		environmentId: "env-01-aaaa-bbbb-cccccccccccc",
		name: "תקציב",
		color: "#3b82f6",
		createdAt: "2025-08-01T08:00:00Z",
	},
	{
		id: "tag-02-aaaa-bbbb-cccccccccccc",
		environmentId: "env-01-aaaa-bbbb-cccccccccccc",
		name: 'כ"א',
		color: "#8b5cf6",
		createdAt: "2025-08-01T08:00:00Z",
	},
	{
		id: "tag-03-aaaa-bbbb-cccccccccccc",
		environmentId: "env-01-aaaa-bbbb-cccccccccccc",
		name: 'תקשו"ב',
		color: "#10b981",
		createdAt: "2025-08-01T08:00:00Z",
	},
	{
		id: "tag-04-aaaa-bbbb-cccccccccccc",
		environmentId: "env-01-aaaa-bbbb-cccccccccccc",
		name: "מבצעים",
		color: "#f59e0b",
		createdAt: "2025-08-01T08:00:00Z",
	},
	{
		id: "tag-05-aaaa-bbbb-cccccccccccc",
		environmentId: "env-01-aaaa-bbbb-cccccccccccc",
		name: 'פקש"ש',
		color: "#ef4444",
		createdAt: "2025-08-01T08:00:00Z",
	},
	{
		id: "tag-06-aaaa-bbbb-cccccccccccc",
		environmentId: "env-02-aaaa-bbbb-cccccccccccc",
		name: "פיתוח",
		color: "#06b6d4",
		createdAt: "2025-09-01T08:00:00Z",
	},
	{
		id: "tag-07-aaaa-bbbb-cccccccccccc",
		environmentId: "env-02-aaaa-bbbb-cccccccccccc",
		name: "בקרה",
		color: "#d946ef",
		createdAt: "2025-09-01T08:00:00Z",
	},
]

export const mockEnvironments: IEnvironmentWithRole[] = [
	{
		id: "env-01-aaaa-bbbb-cccccccccccc",
		name: "מפקדת חטיבה",
		description: "מערך מפקדת החטיבה — ניהול הנחיות והחלטות מפקד",
		logoUrl: null,
		createdBy: mockUsers[0].id,
		createdAt: "2025-06-15T08:00:00Z",
		updatedAt: "2026-02-15T10:00:00Z",
		archived: false,
		memberCount: 5,
		instructionCount: 12,
		currentUserRole: "manager",
	},
	{
		id: "env-02-aaaa-bbbb-cccccccccccc",
		name: 'מערך תקשו"ב',
		description: 'מערך תקשו"ב — ניהול משימות טכניות ותחזוקת מערכות',
		logoUrl: null,
		createdBy: mockUsers[1].id,
		createdAt: "2025-08-01T08:00:00Z",
		updatedAt: "2026-02-10T10:00:00Z",
		archived: false,
		memberCount: 3,
		instructionCount: 8,
		currentUserRole: "manager",
	},
	{
		id: "env-03-aaaa-bbbb-cccccccccccc",
		name: "מערך לוגיסטי",
		description: "מערך לוגיסטי — ניהול אספקה, תחזוקה ושילוח",
		logoUrl: null,
		createdBy: mockUsers[2].id,
		createdAt: "2025-09-01T08:00:00Z",
		updatedAt: "2026-01-20T10:00:00Z",
		archived: false,
		memberCount: 4,
		instructionCount: 5,
		currentUserRole: "responsible",
	},
]

export const mockMembers: IEnvironmentMember[] = [
	{
		id: "mem-01-aaaa-bbbb-cccccccccccc",
		environmentId: "env-01-aaaa-bbbb-cccccccccccc",
		user: mockUserSummaries[0],
		role: "manager",
		joinedAt: "2025-06-15T08:00:00Z",
	},
	{
		id: "mem-02-aaaa-bbbb-cccccccccccc",
		environmentId: "env-01-aaaa-bbbb-cccccccccccc",
		user: mockUserSummaries[1],
		role: "manager",
		joinedAt: "2025-07-01T08:00:00Z",
	},
	{
		id: "mem-03-aaaa-bbbb-cccccccccccc",
		environmentId: "env-01-aaaa-bbbb-cccccccccccc",
		user: mockUserSummaries[2],
		role: "responsible",
		joinedAt: "2025-07-15T08:00:00Z",
	},
	{
		id: "mem-04-aaaa-bbbb-cccccccccccc",
		environmentId: "env-01-aaaa-bbbb-cccccccccccc",
		user: mockUserSummaries[3],
		role: "responsible",
		joinedAt: "2025-08-01T08:00:00Z",
	},
	{
		id: "mem-05-aaaa-bbbb-cccccccccccc",
		environmentId: "env-01-aaaa-bbbb-cccccccccccc",
		user: mockUserSummaries[4],
		role: "responsible",
		joinedAt: "2025-08-15T08:00:00Z",
	},
]

export const mockResponsibleGroups: IResponsibleGroup[] = [
	{
		id: "resp-01-aaaa-bbbb-cccccccccccc",
		environmentId: "env-01-aaaa-bbbb-cccccccccccc",
		nickname: 'מג"ד',
		members: [mockUserSummaries[1], mockUserSummaries[2], mockUserSummaries[3]],
		createdAt: "2025-07-01T08:00:00Z",
	},
	{
		id: "resp-02-aaaa-bbbb-cccccccccccc",
		environmentId: "env-01-aaaa-bbbb-cccccccccccc",
		nickname: "קצין תקשוב",
		members: [mockUserSummaries[4]],
		createdAt: "2025-07-15T08:00:00Z",
	},
	{
		id: "resp-03-aaaa-bbbb-cccccccccccc",
		environmentId: "env-02-aaaa-bbbb-cccccccccccc",
		nickname: "צוות פיתוח",
		members: [mockUserSummaries[1], mockUserSummaries[4]],
		createdAt: "2025-09-01T08:00:00Z",
	},
]
