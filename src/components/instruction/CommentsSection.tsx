import { useState } from 'react';
import { User as UserIcon } from 'lucide-react';
import { Spinner } from '@/components/ui';
import { useComments, useCreateComment } from '@/hooks/useComments';
import type { Comment } from '@/types';

interface CommentsSectionProps {
  instructionId: string;
  currentUserId?: string;
  isAdmin?: boolean;
}

/** 5 minutes in ms — edit window */
const EDIT_WINDOW_MS = 5 * 60 * 1000;

function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diffMs = now - date.getTime();
  const minutes = Math.floor(diffMs / 60_000);
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);

  if (minutes < 1) return 'עכשיו';
  if (minutes < 60) return `לפני ${minutes} דקות`;
  if (hours < 24) return `לפני ${hours} שעות`;
  if (days === 1) return 'אתמול';
  return date.toLocaleDateString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function canEdit(comment: Comment, currentUserId?: string): boolean {
  if (!currentUserId || comment.user.id !== currentUserId) return false;
  return (Date.now() - comment.createdAt.getTime()) < EDIT_WINDOW_MS;
}

function canDelete(comment: Comment, currentUserId?: string, isAdmin?: boolean): boolean {
  if (isAdmin) return true;
  return !!currentUserId && comment.user.id === currentUserId;
}

function CommentItem({
  comment,
  currentUserId,
  isAdmin,
}: {
  comment: Comment;
  currentUserId?: string;
  isAdmin?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const showEdit = canEdit(comment, currentUserId);
  const showDelete = canDelete(comment, currentUserId, isAdmin);

  const handleSaveEdit = () => {
    // TODO: call updateComment mutation when available
    setEditing(false);
  };

  const handleDelete = () => {
    // TODO: call deleteComment mutation when available
  };

  return (
    <div className="flex gap-4">
      <div className="w-9 h-9 rounded-full bg-slate-50 shrink-0 flex items-center justify-center text-slate-400 border border-slate-100">
        <UserIcon size={18} />
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xs text-slate-900">{comment.user.name}</span>
          <span className="text-[10px] text-slate-400">• {formatRelativeTime(comment.createdAt)}</span>
          {comment.edited && (
            <span className="text-[10px] text-slate-400 italic">(עודכן)</span>
          )}
        </div>

        {editing ? (
          <div className="space-y-2">
            <textarea
              rows={2}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-indigo-500 transition-all resize-none"
              maxLength={5000}
            />
            <div className="flex gap-3">
              <button
                onClick={handleSaveEdit}
                disabled={!editContent.trim()}
                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase cursor-pointer disabled:opacity-50"
              >
                אשר
              </button>
              <button
                onClick={() => setEditing(false)}
                className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase cursor-pointer"
              >
                ביטול
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-600 leading-normal">
              {comment.content}
            </p>
            {(showEdit || showDelete) && (
              <div className="flex gap-3 pt-1">
                {showEdit && (
                  <button
                    onClick={() => { setEditContent(comment.content); setEditing(true); }}
                    className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase cursor-pointer"
                  >
                    עדכן
                  </button>
                )}
                {showDelete && (
                  <button
                    onClick={handleDelete}
                    className="text-[10px] font-bold text-slate-400 hover:text-rose-600 transition-colors uppercase cursor-pointer"
                  >
                    בטל
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function CommentsSection({
  instructionId,
  currentUserId = 'u1-aaaa-bbbb-cccc-dddddddddddd',
  isAdmin = true,
}: CommentsSectionProps) {
  const [newComment, setNewComment] = useState('');
  const { data: comments, isLoading } = useComments(instructionId);
  const createMutation = useCreateComment(instructionId);

  // Newest first
  const sortedComments = comments
    ? [...comments].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await createMutation.mutateAsync({ content: newComment.trim() });
      setNewComment('');
    } catch {
      // handled by TanStack Query
    }
  };

  return (
    <section className="pt-12 border-t border-slate-100">
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-lg font-bold text-slate-900">דיווחים ועדכונים</h2>
        <span className="text-slate-400 text-xs">({sortedComments.length})</span>
      </div>

      {/* Add comment */}
      <form onSubmit={handleSubmit} className="mb-12">
        <textarea
          placeholder="הוסף דיווח לסגל..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={createMutation.isPending}
          maxLength={5000}
          className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-indigo-500 transition-all min-h-[100px] resize-none"
          aria-label="כתוב דיווח"
        />
        <div className="flex justify-end mt-3">
          <button
            type="submit"
            disabled={!newComment.trim() || createMutation.isPending}
            className="bg-indigo-600 text-white px-5 py-1.5 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 cursor-pointer"
          >
            {createMutation.isPending ? 'מפיץ...' : 'הפץ'}
          </button>
        </div>
      </form>

      {/* Comments list */}
      {isLoading && (
        <div className="py-8 text-center">
          <Spinner size={24} />
        </div>
      )}

      {sortedComments.length === 0 && !isLoading && (
        <div className="py-8 text-center">
          <span className="text-sm text-slate-400">אין דיווחים עדיין. היה הראשון לדווח!</span>
        </div>
      )}

      {sortedComments.length > 0 && (
        <div className="space-y-10">
          {sortedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </section>
  );
}
