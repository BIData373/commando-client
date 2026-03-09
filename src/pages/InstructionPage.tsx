import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useInstruction, useUpdateInstruction } from '@/hooks/useInstructions';
import { InstructionHeader } from '@/components/instruction/InstructionHeader';
import { InstructionDetails } from '@/components/instruction/InstructionDetails';
import { CommentsSection } from '@/components/instruction/CommentsSection';
import { ActivityTimeline } from '@/components/instruction/ActivityTimeline';
import { LoadingState, ErrorState } from '@/components/common';
import type { InstructionStatus } from '@/types';

export function InstructionPage() {
  const { envId, instructionId } = useParams<{
    envId: string;
    instructionId: string;
  }>();
  const [activityOpen, setActivityOpen] = useState(false);

  const {
    data: instruction,
    isLoading,
    isError,
    refetch,
  } = useInstruction(instructionId || '');

  const updateMutation = useUpdateInstruction(envId || '');

  const handleStatusChange = (status: InstructionStatus) => {
    if (!instructionId) return;
    updateMutation.mutate({
      instructionId,
      data: { status },
    });
  };

  const handleAssigneeStatusChange = (assigneeId: string, status: InstructionStatus) => {
    if (!instruction) return;
    // Update assignee status locally via the instruction update mutation
    // In a real app, this would call a dedicated endpoint
    const updatedAssignees = instruction.assignees.map((a) =>
      a.id === assigneeId ? { ...a, status } : a
    );
    const allCompleted = updatedAssignees.every((a) => a.status === 'completed');
    const anyInProgress = updatedAssignees.some((a) => a.status === 'in_progress' || a.status === 'completed');
    const overallStatus: InstructionStatus = allCompleted ? 'completed' : anyInProgress ? 'in_progress' : 'open';

    if (instructionId) {
      updateMutation.mutate({
        instructionId,
        data: { status: overallStatus },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <LoadingState message="טוען הנחיה..." />
      </div>
    );
  }

  if (isError || !instruction) {
    return (
      <div className="min-h-screen bg-white">
        <ErrorState
          message="תקלה בטעינת ההנחיה"
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky top bar */}
      <InstructionHeader
        instruction={instruction}
        envId={envId || ''}
        onOpenActivity={() => setActivityOpen(true)}
      />

      {/* Content */}
      <div className="max-w-4xl mx-auto p-8 space-y-12">
        {/* Details section */}
        <InstructionDetails
          instruction={instruction}
          onStatusChange={handleStatusChange}
          onAssigneeStatusChange={handleAssigneeStatusChange}
        />

        {/* Comments section */}
        <CommentsSection instructionId={instructionId || ''} />
      </div>

      {/* History side panel */}
      <ActivityTimeline
        open={activityOpen}
        onClose={() => setActivityOpen(false)}
        instructionId={instructionId || ''}
      />
    </div>
  );
}
