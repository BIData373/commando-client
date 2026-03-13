import styled from '@emotion/styled';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import ActivityTimeline from '../components/instruction/ActivityTimeline';
import CommentsSection from '../components/instruction/CommentsSection/CommentsSection';
import InstructionDetails from '../components/instruction/InstructionDetails/InstructionDetails';
import InstructionHeader from '../components/instruction/InstructionHeader';
import ErrorState from '../components/shared/ErrorState';
import LoadingState from '../components/shared/LoadingState';
import { useInstruction, useUpdateInstruction } from '../hooks/useInstructions';
import { useToast } from '../hooks/useToast';
import type { InstructionStatus } from '../types';
import type { PageParams } from '../utils/paramUtils';

export default function InstructionPage() {
  const toast = useToast();
  const { envId, instructionId } = useParams<PageParams>();
  const [activityOpen, setActivityOpen] = useState(false);

  const { data: instruction, isLoading, isError, refetch } = useInstruction(instructionId ?? '');
  const updateMutation = useUpdateInstruction(envId ?? '');

  function handleStatusChange(status: InstructionStatus) {
    if (!instructionId) return;
    updateMutation.mutate(
      { instructionId, data: { status } },
      { onError: () => toast.error('שגיאה בעדכון הסטטוס') }
    );
  }

  function handleAssigneeStatusChange(assigneeId: string, status: InstructionStatus) {
    if (!instruction || !instructionId) return;

    const updatedAssignees = instruction.assignees.map((a) =>
      a.id === assigneeId ? { ...a, status } : a
    );
    const allCompleted = updatedAssignees.every((a) => a.status === 'completed');
    const anyInProgress = updatedAssignees.some(
      (a) => a.status === 'inProgress' || a.status === 'completed'
    );
    const overallStatus: InstructionStatus = allCompleted
      ? 'completed'
      : anyInProgress
        ? 'inProgress'
        : 'open';

    updateMutation.mutate(
      { instructionId, data: { status: overallStatus } },
      { onError: () => toast.error('שגיאה בעדכון הסטטוס') }
    );
  }

  function handleOpenActivity() {
    setActivityOpen(true);
  }

  function handleCloseActivity() {
    setActivityOpen(false);
  }

  function handleRetry() {
    refetch();
  }

  return (
    <PageWrapper>
      {isLoading && <LoadingState message="טוען הנחיה..." />}

      {(isError || (!isLoading && !instruction)) && (
        <ErrorState message="תקלה בטעינת ההנחיה" onRetry={handleRetry} />
      )}

      {instruction && (
        <>
          <InstructionHeader
            instruction={instruction}
            envId={envId ?? ''}
            onOpenActivity={handleOpenActivity}
          />

          <ContentArea>
            <InstructionDetails
              instruction={instruction}
              onStatusChange={handleStatusChange}
              onAssigneeStatusChange={handleAssigneeStatusChange}
            />
            <CommentsSection instructionId={instructionId ?? ''} />
          </ContentArea>

          <ActivityTimeline
            open={activityOpen}
            onClose={handleCloseActivity}
            instructionId={instructionId ?? ''}
          />
        </>
      )}
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: var(--color-paper);
`;

const ContentArea = styled.div`
  max-width: 56rem;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;
