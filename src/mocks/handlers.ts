import { HttpResponse, http } from 'msw';
import type { ICreateInstruction, IUpdateInstruction } from '../types';
import {
  currentUser,
  getStatsForEnv,
  mockActivity,
  mockComments,
  mockEnvironments,
  mockInstructions,
  mockMembers,
  mockTags,
  mockUserSummaries,
  mockUsers,
  toListItem,
} from './data';

const API = '/api';

export const handlers = [
  // ─── Health ──────────────────────────────────
  http.get(`${API}/health`, () => {
    return HttpResponse.json({ status: 'ok' });
  }),

  // ─── Current User ────────────────────────────
  http.get(`${API}/me`, () => {
    return HttpResponse.json(mockUsers[0]);
  }),

  // ─── Environments ────────────────────────────
  http.get(`${API}/environments`, () => {
    return HttpResponse.json(mockEnvironments);
  }),

  http.get(`${API}/environments/:envId`, ({ params }) => {
    const env = mockEnvironments.find((e) => e.id === params.envId);
    if (!env) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(env);
  }),

  http.post(`${API}/environments`, async ({ request }) => {
    const body = (await request.json()) as { name: string; description?: string };
    const newEnv = {
      id: `env-new-${Date.now()}`,
      name: body.name,
      description: body.description || null,
      logoUrl: null,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      archived: false,
      memberCount: 1,
      instructionCount: 0,
      currentUserRole: 'manager' as const,
    };
    mockEnvironments.push(newEnv);
    return HttpResponse.json(newEnv, { status: 201 });
  }),

  // ─── Environment Members ─────────────────────
  http.get(`${API}/environments/:envId/members`, ({ params }) => {
    const members = mockMembers.filter((m) => m.environmentId === params.envId);
    return HttpResponse.json(members);
  }),

  // ─── Tags ────────────────────────────────────
  http.get(`${API}/environments/:envId/tags`, ({ params }) => {
    const tags = mockTags.filter((t) => t.environmentId === params.envId);
    return HttpResponse.json(tags);
  }),

  // ─── Instructions ────────────────────────────
  http.get(`${API}/environments/:envId/instructions`, ({ params, request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const overdue = url.searchParams.get('overdue');
    const sortBy = url.searchParams.get('sort_by');
    const sortDir = url.searchParams.get('sort_direction') || 'desc';

    let items = mockInstructions.filter((i) => i.environmentId === params.envId);

    // Filter by status
    if (status) {
      items = items.filter((i) => i.status === status);
    }

    // Filter overdue
    if (overdue === 'true') {
      const now = new Date();
      items = items.filter(
        (i) =>
          i.dueDate &&
          new Date(i.dueDate) < now &&
          i.status !== 'completed' &&
          i.status !== 'archived'
      );
    }

    // Sort
    if (sortBy) {
      items = [...items].sort((a, b) => {
        const aVal = a[sortBy as keyof typeof a];
        const bVal = b[sortBy as keyof typeof b];
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        const compare = String(aVal).localeCompare(String(bVal));
        return sortDir === 'desc' ? -compare : compare;
      });
    }

    return HttpResponse.json({
      data: items.map(toListItem),
      total: items.length,
    });
  }),

  // ─── Instruction Stats ──────────────────────
  http.get(`${API}/environments/:envId/instructions/stats`, ({ params }) => {
    return HttpResponse.json(getStatsForEnv(params.envId as string));
  }),

  // ─── Single Instruction ─────────────────────
  http.get(`${API}/instructions/:instructionId`, ({ params }) => {
    const inst = mockInstructions.find((i) => i.id === params.instructionId);
    if (!inst) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(inst);
  }),

  // ─── Create Instruction ─────────────────────
  http.post(`${API}/environments/:envId/instructions`, async ({ params, request }) => {
    const body = (await request.json()) as ICreateInstruction;
    const newInst = {
      id: `inst-new-${Date.now()}`,
      environmentId: params.envId as string,
      title: body.title,
      description: body.description || null,
      status: body.status || ('open' as const),
      priority: body.priority || ('medium' as const),
      dueDateType: body.dueDateType || ('routine' as const),
      dueDateFrom: body.dueDateFrom || null,
      dueDate: body.dueDate || null,
      source: body.source || null,
      createdBy: currentUser,
      assignees: (body.assigneeIds || []).map((uid, idx) => ({
        id: `asgn-new-${idx}`,
        user: mockUserSummaries.find((u) => u.id === uid) || currentUser,
        assignedAt: new Date().toISOString(),
        assignedBy: currentUser,
        status: body.status || ('open' as const),
      })),
      tags: (body.tagIds || [])
        .map((tid) => mockTags.find((t) => t.id === tid))
        .filter(Boolean) as typeof mockTags,
      commentCount: 0,
      attachmentCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null,
      archived: false,
      isImportant: body.isImportant || false,
    };
    mockInstructions.push(newInst);
    return HttpResponse.json(newInst, { status: 201 });
  }),

  // ─── Update Instruction ─────────────────────
  http.patch(`${API}/instructions/:instructionId`, async ({ params, request }) => {
    const body = (await request.json()) as IUpdateInstruction;
    const idx = mockInstructions.findIndex((i) => i.id === params.instructionId);
    if (idx === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    const current = mockInstructions[idx];
    const updated = {
      ...current,
      ...body,
      updatedAt: new Date().toISOString(),
      completedAt: body.status === 'completed' ? new Date().toISOString() : current.completedAt,
    };
    mockInstructions[idx] = updated;
    return HttpResponse.json(updated);
  }),

  // ─── Delete Instruction ─────────────────────
  http.delete(`${API}/instructions/:instructionId`, ({ params }) => {
    const idx = mockInstructions.findIndex((i) => i.id === params.instructionId);
    if (idx === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    mockInstructions.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // ─── Comments ────────────────────────────────
  http.get(`${API}/instructions/:instructionId/comments`, ({ params }) => {
    const comments = mockComments.filter((c) => c.instructionId === params.instructionId);
    return HttpResponse.json(comments);
  }),

  http.post(`${API}/instructions/:instructionId/comments`, async ({ params, request }) => {
    const body = (await request.json()) as { content: string };
    const newComment = {
      id: `cmt-new-${Date.now()}`,
      instructionId: params.instructionId as string,
      user: currentUser,
      content: body.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      edited: false,
    };
    mockComments.push(newComment);
    return HttpResponse.json(newComment, { status: 201 });
  }),

  // ─── Activity ────────────────────────────────
  http.get(`${API}/instructions/:instructionId/activity`, ({ params }) => {
    const events = mockActivity
      .filter((a) => a.instructionId === params.instructionId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return HttpResponse.json(events);
  }),
];
