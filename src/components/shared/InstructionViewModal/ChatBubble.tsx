import styled from '@emotion/styled';
import { UserIcon } from 'lucide-react';
import type { IComment } from '../../../types';
import { formatRelativeTime } from '../../../utils/dateUtils';

interface ChatBubbleProps {
  comment: IComment;
}

export default function ChatBubble({ comment }: ChatBubbleProps) {
  return (
    <Root>
      <Avatar>
        <UserIcon size={14} />
      </Avatar>
      <Content>
        <Meta>
          <AuthorName>{comment.user.name}</AuthorName>
          <Timestamp>{formatRelativeTime(new Date(comment.createdAt))}</Timestamp>
        </Meta>
        <Bubble>{comment.content}</Bubble>
      </Content>
    </Root>
  );
}

const Root = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const Avatar = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background-color: color-mix(in srgb, var(--color-primary) 15%, transparent);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Content = styled.div`
  flex: 1;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

const AuthorName = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-text-primary);
`;

const Timestamp = styled.span`
  font-size: 0.625rem;
  color: var(--color-text-disabled);
`;

const Bubble = styled.div`
  background-color: var(--color-gray-50);
  border-radius: 0.75rem 0.75rem 0.125rem 0.75rem;
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  border: 1px solid var(--color-gray-100);
`;
