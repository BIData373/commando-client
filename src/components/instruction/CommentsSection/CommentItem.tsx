import styled from '@emotion/styled';
import { UserIcon } from 'lucide-react';
import { type ChangeEvent, useState } from 'react';
import type { IComment } from '../../../types';
import { formatRelativeTime } from '../../../utils/dateUtils';

const EDIT_WINDOW_MS = 5 * 60 * 1000;

function canEdit(comment: IComment, currentUserId?: string): boolean {
  if (!currentUserId || comment.user.id !== currentUserId) return false;
  return Date.now() - new Date(comment.createdAt).getTime() < EDIT_WINDOW_MS;
}

function canDelete(comment: IComment, currentUserId?: string, isAdmin?: boolean): boolean {
  if (isAdmin) return true;
  return !!currentUserId && comment.user.id === currentUserId;
}

interface CommentItemProps {
  comment: IComment;
  currentUserId?: string;
  isAdmin?: boolean;
}

export default function CommentItem({ comment, currentUserId, isAdmin }: CommentItemProps) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const showEdit = canEdit(comment, currentUserId);
  const showDelete = canDelete(comment, currentUserId, isAdmin);

  function handleSaveEdit() {
    // TODO: call updateComment mutation when available
    setEditing(false);
  }

  function handleDelete() {
    // TODO: call deleteComment mutation when available
  }

  function handleChangeEditArea(e: ChangeEvent<HTMLTextAreaElement>) {
    setEditContent(e.target.value);
  }

  function handleClickCancelEdit() {
    setEditing(false);
  }

  function handleClickApply() {
    setEditContent(comment.content);
    setEditing(true);
  }

  return (
    <Row>
      <AvatarBox>
        <UserIcon size={18} />
      </AvatarBox>
      <Body>
        <MetaRow>
          <AuthorName>{comment.user.name}</AuthorName>
          <Timestamp>• {formatRelativeTime(new Date(comment.createdAt))}</Timestamp>
          {comment.edited && <EditedTag>(עודכן)</EditedTag>}
        </MetaRow>

        {editing ? (
          <EditArea>
            <EditTextarea
              rows={2}
              value={editContent}
              onChange={handleChangeEditArea}
              maxLength={5000}
            />
            <ActionRow>
              <ConfirmButton onClick={handleSaveEdit} disabled={!editContent.trim()}>
                אשר
              </ConfirmButton>
              <CancelButton onClick={handleClickCancelEdit}>ביטול</CancelButton>
            </ActionRow>
          </EditArea>
        ) : (
          <>
            <ContentText>{comment.content}</ContentText>
            {(showEdit || showDelete) && (
              <ActionRow>
                {showEdit && <EditButton onClick={handleClickApply}>עדכן</EditButton>}
                {showDelete && <DeleteButton onClick={handleDelete}>בטל</DeleteButton>}
              </ActionRow>
            )}
          </>
        )}
      </Body>
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  gap: 1rem;
`;

const AvatarBox = styled.div`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  background-color: var(--color-gray-50);
  border: 1px solid var(--color-gray-100);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-disabled);
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AuthorName = styled.span`
  font-weight: 700;
  font-size: 0.75rem;
  color: var(--color-text-primary);
`;

const Timestamp = styled.span`
  font-size: 10px;
  color: var(--color-text-disabled);
`;

const EditedTag = styled.span`
  font-size: 10px;
  color: var(--color-text-disabled);
  font-style: italic;
`;

const ContentText = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
`;

const EditArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const EditTextarea = styled.textarea`
  width: 100%;
  background-color: var(--color-paper);
  border: 1px solid var(--color-gray-200);
  border-radius: 0.75rem;
  padding: 0.75rem;
  font-size: 0.875rem;
  outline: none;
  resize: none;
  transition: border-color 150ms;

  &:focus {
    border-color: var(--color-primary);
  }
`;

const ActionRow = styled.div`
  display: flex;
  gap: 0.75rem;
  padding-top: 0.25rem;
`;

const BaseActionButton = styled.button`
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  background: none;
  border: none;
  transition: color 150ms;

  &:disabled {
    opacity: 0.5;
  }
`;

const ConfirmButton = styled(BaseActionButton)`
  color: var(--color-primary);
  &:hover:not(:disabled) { color: color-mix(in srgb, var(--color-primary) 80%, black); }
`;

const CancelButton = styled(BaseActionButton)`
  color: var(--color-text-disabled);
  &:hover { color: var(--color-text-secondary); }
`;

const EditButton = styled(BaseActionButton)`
  color: var(--color-text-disabled);
  &:hover { color: var(--color-primary); }
`;

const DeleteButton = styled(BaseActionButton)`
  color: var(--color-text-disabled);
  &:hover { color: var(--color-error); }
`;
