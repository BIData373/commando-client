import type { IComment, ICreateComment } from '../../types';
import { currentUser, mockComments } from '../data';

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

/** Comment API endpoints — In-memory mock implementation */
export const commentsApi = {
  async getByInstruction(instructionId: string): Promise<IComment[]> {
    await delay();
    return mockComments.filter((c) => c.instructionId === instructionId);
  },

  async create(instructionId: string, data: ICreateComment): Promise<IComment> {
    await delay(300);
    const newComment: IComment = {
      id: `cmt-new-${Date.now()}`,
      instructionId,
      user: currentUser,
      content: data.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      edited: false,
    };
    mockComments.push(newComment);
    return { ...newComment };
  },
};
