import { http, HttpResponse } from 'msw';
import {
  mockEnvironments,
  mockMembers,
  mockTags,
  mockInstructions,
  toListItem,
  getStatsForEnv,
  mockComments,
  mockActivity,
  currentUser,
  mockUsers,
  mockUserSummaries,
  mockNotifications,
  mockNotificationPreferences,
} from './data';
import type { NotificationPreferencesDto } from './data';
import type { CreateInstructionDto, UpdateInstructionDto } from '@/api/dtos';

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
      logo_url: null,
      created_by: currentUser.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      archived: false,
      member_count: 1,
      instruction_count: 0,
      current_user_role: 'manager' as const,
    };
    mockEnvironments.push(newEnv);
    return HttpResponse.json(newEnv, { status: 201 });
  }),

  // ─── Environment Members ─────────────────────
  http.get(`${API}/environments/:envId/members`, ({ params }) => {
    const members = mockMembers.filter(
      (m) => m.environment_id === params.envId
    );
    return HttpResponse.json(members);
  }),

  // ─── Tags ────────────────────────────────────
  http.get(`${API}/environments/:envId/tags`, ({ params }) => {
    const tags = mockTags.filter((t) => t.environment_id === params.envId);
    return HttpResponse.json(tags);
  }),

  // ─── Instructions ────────────────────────────
  http.get(`${API}/environments/:envId/instructions`, ({ params, request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const overdue = url.searchParams.get('overdue');
    const sortBy = url.searchParams.get('sort_by');
    const sortDir = url.searchParams.get('sort_direction') || 'desc';

    let items = mockInstructions.filter(
      (i) => i.environment_id === params.envId
    );

    // Filter by status
    if (status) {
      items = items.filter((i) => i.status === status);
    }

    // Filter overdue
    if (overdue === 'true') {
      const now = new Date();
      items = items.filter(
        (i) =>
          i.due_date &&
          new Date(i.due_date) < now &&
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
    const inst = mockInstructions.find(
      (i) => i.id === params.instructionId
    );
    if (!inst) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(inst);
  }),

  // ─── Create Instruction ─────────────────────
  http.post(
    `${API}/environments/:envId/instructions`,
    async ({ params, request }) => {
      const body = (await request.json()) as CreateInstructionDto;
      const newInst = {
        id: `inst-new-${Date.now()}`,
        environment_id: params.envId as string,
        title: body.title,
        description: body.description || null,
        status: body.status || ('open' as const),
        priority: body.priority || ('medium' as const),
        due_date_type: body.due_date_type || ('routine' as const),
        due_date_from: body.due_date_from || null,
        due_date: body.due_date || null,
        source: body.source || null,
        created_by: currentUser,
        assignees: (body.assignee_ids || []).map((uid, idx) => ({
          id: `asgn-new-${idx}`,
          user: mockUserSummaries.find((u) => u.id === uid) || currentUser,
          assigned_at: new Date().toISOString(),
          assigned_by: currentUser,
          status: body.status || ('open' as const),
        })),
        tags: (body.tag_ids || [])
          .map((tid) => mockTags.find((t) => t.id === tid))
          .filter(Boolean) as typeof mockTags,
        comment_count: 0,
        attachment_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completed_at: null,
        archived: false,
        is_important: body.is_important || false,
      };
      mockInstructions.push(newInst);
      return HttpResponse.json(newInst, { status: 201 });
    }
  ),

  // ─── Update Instruction ─────────────────────
  http.patch(
    `${API}/instructions/:instructionId`,
    async ({ params, request }) => {
      const body = (await request.json()) as UpdateInstructionDto;
      const idx = mockInstructions.findIndex(
        (i) => i.id === params.instructionId
      );
      if (idx === -1) {
        return new HttpResponse(null, { status: 404 });
      }

      const current = mockInstructions[idx];
      const updated = {
        ...current,
        ...body,
        updated_at: new Date().toISOString(),
        completed_at:
          body.status === 'completed'
            ? new Date().toISOString()
            : current.completed_at,
      };
      mockInstructions[idx] = updated;
      return HttpResponse.json(updated);
    }
  ),

  // ─── Delete Instruction ─────────────────────
  http.delete(`${API}/instructions/:instructionId`, ({ params }) => {
    const idx = mockInstructions.findIndex(
      (i) => i.id === params.instructionId
    );
    if (idx === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    mockInstructions.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // ─── Comments ────────────────────────────────
  http.get(
    `${API}/instructions/:instructionId/comments`,
    ({ params }) => {
      const comments = mockComments.filter(
        (c) => c.instruction_id === params.instructionId
      );
      return HttpResponse.json(comments);
    }
  ),

  http.post(
    `${API}/instructions/:instructionId/comments`,
    async ({ params, request }) => {
      const body = (await request.json()) as { content: string };
      const newComment = {
        id: `cmt-new-${Date.now()}`,
        instruction_id: params.instructionId as string,
        user: currentUser,
        content: body.content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        edited: false,
      };
      mockComments.push(newComment);
      return HttpResponse.json(newComment, { status: 201 });
    }
  ),

  // ─── Activity ────────────────────────────────
  http.get(
    `${API}/instructions/:instructionId/activity`,
    ({ params }) => {
      const events = mockActivity
        .filter((a) => a.instruction_id === params.instructionId)
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );
      return HttpResponse.json(events);
    }
  ),

  // ─── Notifications ──────────────────────────
  http.get(`${API}/notifications`, () => {
    const sorted = [...mockNotifications].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return HttpResponse.json(sorted);
  }),

  http.patch(`${API}/notifications/:id/read`, ({ params }) => {
    const notif = mockNotifications.find((n) => n.id === params.id);
    if (!notif) return new HttpResponse(null, { status: 404 });
    notif.read = true;
    return HttpResponse.json(notif);
  }),

  http.post(`${API}/notifications/read-all`, () => {
    mockNotifications.forEach((n) => { n.read = true; });
    return HttpResponse.json({ success: true });
  }),

  // ─── Notification Preferences ───────────────
  http.get(`${API}/notification-preferences`, () => {
    return HttpResponse.json(mockNotificationPreferences);
  }),

  http.post(`${API}/notification-preferences`, async ({ request }) => {
    const body = (await request.json()) as NotificationPreferencesDto;
    Object.assign(mockNotificationPreferences, body);
    return HttpResponse.json(mockNotificationPreferences);
  }),
];
