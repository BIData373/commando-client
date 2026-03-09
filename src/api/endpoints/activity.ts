import { mockActivity } from '@/mocks/data';
import type { ActivityEventDto } from '../dtos';

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

/** Activity log API endpoints — In-memory mock implementation */
export const activityApi = {
  async getByInstruction(instructionId: string): Promise<ActivityEventDto[]> {
    await delay();
    return mockActivity
      .filter((a) => a.instruction_id === instructionId)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  },
};
