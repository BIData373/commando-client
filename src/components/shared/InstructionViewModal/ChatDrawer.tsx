import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { MessageCircle, Send, X } from 'lucide-react';
import { useState } from 'react';
import { useComments, useCreateComment } from '../../../hooks/useComments';
import { useToast } from '../../../hooks/useToast';
import Spinner from '../Spinner';
import ChatBubble from './ChatBubble';

interface ChatDrawerProps {
  instructionId: string;
  onClose: () => void;
}

export default function ChatDrawer({ instructionId, onClose }: ChatDrawerProps) {
  const toast = useToast();
  const { data: comments, isLoading } = useComments(instructionId);
  const createMutation = useCreateComment(instructionId);
  const [newMessage, setNewMessage] = useState('');

  const sortedComments = comments
    ? [...comments].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    : [];

  function handleSend() {
    if (!newMessage.trim()) return;
    createMutation.mutate(
      { content: newMessage.trim() },
      {
        onSuccess: () => setNewMessage(''),
        onError: () => toast.error('שגיאה בשליחת העדכון'),
      }
    );
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Backdrop onClick={onClose}>
      <Sheet onClick={(e) => e.stopPropagation()}>
        <HandleBar>
          <Handle />
        </HandleBar>

        <DrawerHeader>
          <TitleRow>
            <MessageCircle size={16} />
            <DrawerTitle>שיחה ועדכונים</DrawerTitle>
          </TitleRow>
          <CloseButton onClick={onClose}>
            <X size={18} />
          </CloseButton>
        </DrawerHeader>

        <CommentList>
          {isLoading && (
            <SpinnerWrapper>
              <Spinner $size={20} />
            </SpinnerWrapper>
          )}
          {sortedComments.length === 0 && !isLoading && (
            <EmptyText>אין עדכונים עדיין. היה הראשון לעדכן!</EmptyText>
          )}
          {sortedComments.map((comment) => (
            <ChatBubble key={comment.id} comment={comment} />
          ))}
        </CommentList>

        <InputRow>
          <MessageInput
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="הוסף הערה לעדכון הצוות..."
            disabled={createMutation.isPending}
          />
          <SendButton
            onClick={handleSend}
            disabled={!newMessage.trim() || createMutation.isPending}
          >
            <SendIcon size={16} />
          </SendButton>
        </InputRow>
      </Sheet>
    </Backdrop>
  );
}

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 60;
`;

const Sheet = styled.div`
  position: absolute;
  bottom: 0;
  inset-inline: 0;
  background-color: var(--color-paper);
  border-radius: 1rem 1rem 0 0;
  box-shadow: 0 -4px 30px rgb(0 0 0 / 0.12);
  border-top: 1px solid var(--color-gray-200);
  max-height: 50vh;
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 0.35s cubic-bezier(0.05, 0.7, 0.1, 1);
`;

const HandleBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 0 0.25rem;
`;

const Handle = styled.div`
  width: 2.5rem;
  height: 0.25rem;
  border-radius: 9999px;
  background-color: var(--color-gray-300);
`;

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid var(--color-gray-100);
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-secondary);
`;

const DrawerTitle = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-text-primary);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-disabled);
  transition: color 150ms;

  &:hover {
    color: var(--color-text-primary);
  }
`;

const CommentList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SpinnerWrapper = styled.div`
  padding: 1.5rem 0;
  text-align: center;
`;

const EmptyText = styled.div`
  padding: 1.5rem 0;
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-text-disabled);
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  border-top: 1px solid var(--color-gray-100);
`;

const MessageInput = styled.input`
  flex: 1;
  background-color: var(--color-gray-50);
  border: 1px solid var(--color-gray-200);
  border-radius: 9999px;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 150ms;
  color: var(--color-text-primary);

  &::placeholder {
    color: var(--color-text-disabled);
  }

  &:focus {
    border-color: var(--color-primary);
  }

  &:disabled {
    opacity: 0.5;
  }
`;

const SendButton = styled.button`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color 150ms;

  &:hover {
    background-color: var(--color-primary-dark);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const SendIcon = styled(Send)`
  transform: rotate(180deg);
`;
