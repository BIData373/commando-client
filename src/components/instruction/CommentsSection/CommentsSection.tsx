import styled from '@emotion/styled';
import { type ChangeEvent, useState } from 'react';
import { useComments, useCreateComment } from '../../../hooks/useComments';
import { useToast } from '../../../hooks/useToast';
import Spinner from '../../shared/Spinner';
import CommentItem from './CommentItem';

interface CommentsSectionProps {
  instructionId: string;
  currentUserId?: string;
  isAdmin?: boolean;
}

export default function CommentsSection({
  instructionId,
  currentUserId,
  isAdmin = true,
}: CommentsSectionProps) {
  const toast = useToast();
  const [newComment, setNewComment] = useState('');
  const { data: comments, isLoading } = useComments(instructionId);
  const createMutation = useCreateComment(instructionId);

  const sortedComments = comments
    ? [...comments].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;
    createMutation.mutate(
      { content: newComment.trim() },
      {
        onSuccess: () => setNewComment(''),
        onError: () => toast.error('שגיאה בשליחת הדיווח'),
      }
    );
  }

  function handleChangeComment(e: ChangeEvent<HTMLTextAreaElement>) {
    setNewComment(e.target.value);
  }

  return (
    <Section>
      <SectionTitleRow>
        <SectionTitle>דיווחים ועדכונים</SectionTitle>
        <CommentCount>({sortedComments.length})</CommentCount>
      </SectionTitleRow>

      <CommentForm onSubmit={handleSubmit}>
        <CommentTextarea
          placeholder="הוסף דיווח לסגל..."
          value={newComment}
          onChange={handleChangeComment}
          disabled={createMutation.isPending}
          maxLength={5000}
          aria-label="כתוב דיווח"
        />
        <SubmitRow>
          <SubmitButton type="submit" disabled={!newComment.trim() || createMutation.isPending}>
            {createMutation.isPending ? 'מפיץ...' : 'הפץ'}
          </SubmitButton>
        </SubmitRow>
      </CommentForm>

      {isLoading && (
        <CenteredRow>
          <Spinner $size={24} />
        </CenteredRow>
      )}

      {sortedComments.length === 0 && !isLoading && (
        <CenteredRow>
          <EmptyText>אין דיווחים עדיין. היה הראשון לדווח!</EmptyText>
        </CenteredRow>
      )}

      {sortedComments.length > 0 && (
        <CommentList>
          {sortedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
            />
          ))}
        </CommentList>
      )}
    </Section>
  );
}

const Section = styled.section`
  padding-top: 3rem;
  border-top: 1px solid var(--color-gray-100);
`;

const SectionTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-primary);
`;

const CommentCount = styled.span`
  font-size: 0.75rem;
  color: var(--color-text-disabled);
`;

const CommentForm = styled.form`
  margin-bottom: 3rem;
`;

const CommentTextarea = styled.textarea`
  width: 100%;
  background-color: var(--color-paper);
  border: 1px solid var(--color-gray-200);
  border-radius: 0.75rem;
  padding: 1rem;
  font-size: 0.875rem;
  outline: none;
  min-height: 100px;
  resize: none;
  color: var(--color-text-primary);
  transition: border-color 150ms;

  &::placeholder {
    color: var(--color-text-disabled);
  }

  &:focus {
    border-color: var(--color-primary);
  }
`;

const SubmitRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0.75rem;
`;

const SubmitButton = styled.button`
  background-color: var(--color-primary);
  color: var(--color-paper);
  padding: 0.375rem 1.25rem;
  border-radius: 0.5rem;
  border: none;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 150ms;

  &:hover {
    background-color: var(--color-primary-dark);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CenteredRow = styled.div`
  padding: 2rem 0;
  text-align: center;
`;

const EmptyText = styled.span`
  font-size: 0.875rem;
  color: var(--color-text-disabled);
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;
