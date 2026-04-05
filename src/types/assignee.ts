export interface MetaFields {
    id: number;
    createdAt: string;
    createdBy: number;
    updatedAt: string;
    updatedBy: number;
    deletedAt: string | null;
    deletedBy: number | null;
}

export interface IAssignee extends MetaFields {
    name: string;
    color: string;
    userIds: number[];
}

export interface ICreateAssignee {
    name: string;
    color: string;
    userIds?: number[];
}

export interface IUpdateAssignee {
    name?: string;
    color?: string;
    userIds?: number[];
}
