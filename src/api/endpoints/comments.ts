import { mockComments, currentUser } from '@/mocks/data';
import type { CommentDto, CreateCommentDto } from '../dtos';

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

/** Comment API endpoints — In-memory mock implementation */
export const commentsApi = {
  async getByInstruction(instructionId: string): Promise<CommentDto[]> {
    await delay();
    return mockComments.filter((c) => c.instruction_id === instructionId);
  },

  async create(
    instructionId: string,
    data: CreateCommentDto
  ): Promise<CommentDto> {
    await delay(300);
    const newComment: CommentDto = {
      id: `cmt-new-${Date.now()}`,
      instruction_id: instructionId,
      user: currentUser,
      content: data.content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      edited: false,
    };
    mockComments.push(newComment);
    return { ...newComment };
  },
};
