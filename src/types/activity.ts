import type { ActivityAction } from './common';
import type { IUserSummary } from './user';

/** Activity event metadata - varies by action type */
export interface ActivityMetadata {
  oldValue?: string;
  newValue?: string;
  targetUser?: IUserSummary;
  tagName?: string;
  fileName?: string;
  commentPreview?: string;
}

/** Activity log event */
export interface IActivityEvent {
  id: string;
  instructionId: string;
  user: IUserSummary;
  action: ActivityAction;
  metadata: ActivityMetadata;
  createdAt: string;
}
