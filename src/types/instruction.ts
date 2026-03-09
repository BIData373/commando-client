import type { InstructionStatus, InstructionPriority, DueDateType } from './common';
import type { UserSummary } from './user';
import type { Tag } from './environment';

/** Core Instruction type */
export interface Instruction {
  id: string;
  environmentId: string;
  title: string;
  description: string | null;
  status: InstructionStatus;
  priority: InstructionPriority;
  dueDateType: DueDateType;
  dueDateFrom: Date | null;
  dueDate: Date | null;
  source: string | null;
  createdBy: UserSummary;
  assignees: InstructionAssignee[];
  tags: Tag[];
  commentCount: number;
  attachmentCount: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
  archived: boolean;
  isImportant: boolean;
}

/** Instruction list item (lighter version for tables) */
export interface InstructionListItem {
  id: string;
  environmentId: string;
  title: string;
  description: string | null;
  status: InstructionStatus;
  priority: InstructionPriority;
  dueDateType: DueDateType;
  dueDateFrom: Date | null;
  dueDate: Date | null;
  source: string | null;
  assignees: InstructionAssignee[];
  tags: Tag[];
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
  isImportant: boolean;
}

/** Instruction assignee */
export interface InstructionAssignee {
  id: string;
  user: UserSummary;
  assignedAt: Date;
  assignedBy: UserSummary | null;
  status: InstructionStatus;
}

/** Attachment on an instruction */
export interface Attachment {
  id: string;
  instructionId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: UserSummary;
  uploadedAt: Date;
}

/** Source/Discussion reference */
export interface Source {
  id: string;
  label: string;
  type: 'meeting' | 'discussion' | 'email' | 'document' | 'other';
  date: Date | null;
  url: string | null;
}

/** Dashboard statistics for an environment */
export interface InstructionStats {
  total: number;
  open: number;
  inProgress: number;
  completed: number;
  archived: number;
  overdue: number;
  urgent: number;
  dueSoon: number;
}
