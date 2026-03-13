import type { IUserSummary } from './user';

/** Comment on an instruction */
export interface IComment {
  id: string;
  instructionId: string;
  user: IUserSummary;
  content: string;
  createdAt: string;
  updatedAt: string;
  edited: boolean;
}

/** Create comment request */
export interface ICreateComment {
  content: string;
}
