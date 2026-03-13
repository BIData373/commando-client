import styled from '@emotion/styled';
import { type MouseEvent, useEffect, useState } from 'react';
import { useInstruction } from '../../../hooks/useInstructions';
import Spinner from '../Spinner';
import ChatDrawer from './ChatDrawer';
import EditInstructionView from './EditInstructionView';
import HistoryDrawer from './HistoryDrawer';
import ReadOnlyView from './ReadOnlyView';

interface InstructionViewModalProps {
  open: boolean;
  onClose: () => void;
  instructionId: string;
  envId: string;
  initialEditMode?: boolean;
}

export default function InstructionViewModal({
  open,
  onClose,
  instructionId,
  envId,
  initialEditMode = false,
}: InstructionViewModalProps) {
  const { data: instruction, isLoading } = useInstruction(instructionId);
  const [chatOpen, setChatOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(initialEditMode);

  useEffect(() => {
    setIsEditing(initialEditMode);
  }, [initialEditMode, instructionId]);

  function handleClickModalContainer(e: MouseEvent) {
    e.stopPropagation();
  }

  function handleCloseEdit() {
    setIsEditing(false);
  }

  function handleEdit() {
    setIsEditing(true);
  }

  function handleCloseChat() {
    setChatOpen(false);
  }

  function handleHistoryChat() {
    setHistoryOpen(false);
  }

  return open ? (
    <>
      <Backdrop onClick={onClose}>
        <ModalContainer onClick={handleClickModalContainer}>
          {isLoading || !instruction ? (
            <LoadingWrapper>
              <Spinner $size={32} />
            </LoadingWrapper>
          ) : isEditing ? (
            <EditInstructionView
              instruction={instruction}
              envId={envId}
              onClose={handleCloseEdit}
              onSaved={handleEdit}
            />
          ) : (
            <ReadOnlyView
              instruction={instruction}
              onClose={onClose}
              onEdit={handleEdit}
              chatOpen={chatOpen}
              setChatOpen={setChatOpen}
              setHistoryOpen={setHistoryOpen}
            />
          )}
        </ModalContainer>
      </Backdrop>

      {chatOpen && instruction && !isEditing && (
        <ChatDrawer instructionId={instructionId} onClose={handleCloseChat} />
      )}

      {historyOpen && instruction && !isEditing && (
        <HistoryDrawer instructionId={instructionId} onClose={handleHistoryChat} />
      )}
    </>
  ) : null;
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(0 0 0 / 0.4);
`;

const ModalContainer = styled.div`
  position: relative;
  z-index: 50;
  width: 62vw;
  min-width: 720px;
  max-width: 1100px;
  max-height: 90vh;
  background-color: var(--color-paper);
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const LoadingWrapper = styled.div`
  padding: 5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
