export interface MetaFields {
    id: number;
    createdAt: string;
    createdBy: number;
    updatedAt: string;
    updatedBy: number;
    deletedAt: string | null;
    deletedBy: number | null;
}

export interface Assignee extends MetaFields {
    id: number
    emblem: string | null
    color: string
    name: string
    role: string
    email: string
    userIds: number[]
    canEdit: boolean
}

export interface ICreateAssignee {
    name: string;
    role: string;
    email: string;
    color?: string;
    emblem?: string | null;
    userIds?: number[];
    canEdit?: boolean;
}

export interface IUpdateAssignee {
    name?: string;
    role?: string;
    email?: string;
    color?: string;
    emblem?: string | null;
    userIds?: number[];
    canEdit?: boolean;
}
