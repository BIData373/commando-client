import type { UserSummary } from './user';

/** Comment on an instruction */
export interface Comment {
  id: string;
  instructionId: string;
  user: UserSummary;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  edited: boolean;
}
