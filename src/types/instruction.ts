import type {
	DueDateType,
	InstructionPriority,
	InstructionStatus,
} from "./common";
import type { ITag } from "./environment";
import type { IUserSummary } from "./user";

/** Core Instruction type */
export interface IInstruction {
	id: string;
	environmentId: string;
	title: string;
	description: string | null;
	status: InstructionStatus;
	priority: InstructionPriority;
	dueDateType: DueDateType;
	dueDateFrom: string | null;
	dueDate: string | null;
	source: string | null;
	createdBy: IUserSummary;
	assignees: IInstructionAssignee[];
	tags: ITag[];
	commentCount: number;
	attachmentCount: number;
	createdAt: string;
	updatedAt: string;
	completedAt: string | null;
	archived: boolean;
	isImportant: boolean;
}

/** Instruction list item (lighter version for tables) */
export interface IInstructionListItem {
	id: string;
	environmentId: string;
	title: string;
	description: string | null;
	status: InstructionStatus;
	priority: InstructionPriority;
	dueDateType: DueDateType;
	dueDateFrom: string | null;
	dueDate: string | null;
	source: string | null;
	assignees: IInstructionAssignee[];
	tags: ITag[];
	commentCount: number;
	createdAt: string;
	updatedAt: string;
	isImportant: boolean;
}

export interface IPersonalInstruction extends IInstructionListItem {
	environmentName: string;
}

/** Instruction assignee */
export interface IInstructionAssignee {
	id: string;
	user: IUserSummary;
	assignedAt: string;
	assignedBy: IUserSummary | null;
	status: InstructionStatus;
}

/** Attachment on an instruction */
export interface IAttachment {
	id: string;
	instructionId: string;
	fileName: string;
	fileUrl: string;
	fileSize: number;
	mimeType: string;
	uploadedBy: IUserSummary;
	uploadedAt: string;
}

/** Source/Discussion reference */
export interface ISource {
	id: string;
	label: string;
	type: "meeting" | "discussion" | "email" | "document" | "other";
	date: string | null;
	url: string | null;
}

/** Dashboard statistics for an environment */
export interface IInstructionStats {
	total: number;
	open: number;
	inProgress: number;
	completed: number;
	archived: number;
	overdue: number;
	urgent: number;
	dueSoon: number;
}

/** Create instruction request */
export interface ICreateInstruction {
	title: string;
	description?: string;
	status?: InstructionStatus;
	priority?: InstructionPriority;
	dueDateType?: DueDateType;
	dueDateFrom?: string;
	dueDate?: string;
	source?: string;
	assigneeIds?: string[];
	responsibleGroupIds?: string[];
	tagIds?: string[];
	isImportant?: boolean;
}

/** Update instruction request */
export interface IUpdateInstruction {
	title?: string;
	description?: string;
	status?: InstructionStatus;
	priority?: InstructionPriority;
	dueDateType?: DueDateType;
	dueDateFrom?: string | null;
	dueDate?: string | null;
	source?: string | null;
	assigneeIds?: string[];
	responsibleGroupIds?: string[];
	tagIds?: string[];
	isImportant?: boolean;
}

export interface IInstructionFilters {
	status?: string;
	priority?: string;
	assigneeId?: string;
	tagId?: string;
	search?: string;
	overdue?: boolean;
	page?: number;
	pageSize?: number;
	sortBy?: string;
	sortDirection?: "asc" | "desc";
}
