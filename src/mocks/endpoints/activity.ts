import type { IActivityEvent } from '../../types';
import { mockActivity } from '../data';

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

/** Activity log API endpoints — In-memory mock implementation */
export const activityApi = {
  async getByInstruction(instructionId: string): Promise<IActivityEvent[]> {
    await delay();
    return mockActivity
      .filter((a) => a.instructionId === instructionId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
};
