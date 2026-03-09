import type { ActivityAction } from './common';
import type { UserSummary } from './user';

/** Activity event metadata - varies by action type */
export interface ActivityMetadata {
  oldValue?: string;
  newValue?: string;
  targetUser?: UserSummary;
  tagName?: string;
  fileName?: string;
  commentPreview?: string;
}

/** Activity log event */
export interface ActivityEvent {
  id: string;
  instructionId: string;
  user: UserSummary;
  action: ActivityAction;
  metadata: ActivityMetadata;
  createdAt: Date;
}
