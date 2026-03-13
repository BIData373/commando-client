import styled from '@emotion/styled';
import { Sparkles } from 'lucide-react';
import Button from '../../shared/Button';
import Spinner from '../../shared/Spinner';
import type { DiscussionInstruction, DiscussionMember, ExtractionMethod } from './DiscussionDialog';
import DiscussionTable from './DiscussionTable';

interface DiscussionStepTwoProps {
  discussionName: string;
  formattedDate: string;
  extractionMethod: ExtractionMethod;
  onMethodChange: (m: ExtractionMethod) => void;
  aiText: string;
  onAiTextChange: (v: string) => void;
  aiExtracting: boolean;
  onAiExtract: () => void;
  instructions: DiscussionInstruction[];
  availableMembers: DiscussionMember[];
  onAddRow: () => void;
  onUpdateRow: (id: string, field: keyof DiscussionInstruction, value: unknown) => void;
  onRemoveRow: (id: string) => void;
  onToggleRowAssignee: (rowId: string, memberId: string) => void;
}

export default function DiscussionStepTwo({
  discussionName,
  formattedDate,
  extractionMethod,
  onMethodChange,
  aiText,
  onAiTextChange,
  aiExtracting,
  onAiExtract,
  instructions,
  availableMembers,
  onAddRow,
  onUpdateRow,
  onRemoveRow,
  onToggleRowAssignee,
}: DiscussionStepTwoProps) {
  const showTable = extractionMethod === 'manual' || instructions.length > 0;

  return (
    <StepWrapper>
      {(discussionName || formattedDate) && (
        <DiscussionSummary>
          {discussionName && <SummaryName>{discussionName}</SummaryName>}
          {formattedDate && <SummaryDate>{formattedDate}</SummaryDate>}
        </DiscussionSummary>
      )}

      <MethodToggle>
        <MethodButton
          type="button"
          $active={extractionMethod === 'manual'}
          onClick={() => onMethodChange('manual')}
        >
          הזנה ידנית
        </MethodButton>
        <MethodButton
          type="button"
          $active={extractionMethod === 'ai'}
          onClick={() => onMethodChange('ai')}
        >
          <Sparkles size={16} />
          חילוץ הנחיות עם AI
        </MethodButton>
      </MethodToggle>

      {extractionMethod === 'ai' && instructions.length === 0 && (
        <AiSection>
          <Textarea
            rows={6}
            placeholder="הדבק כאן את תוכן הדיון / פרוטוקול הישיבה..."
            value={aiText}
            onChange={(e) => onAiTextChange(e.target.value)}
          />
          <Button type="button" onClick={onAiExtract} disabled={!aiText.trim() || aiExtracting}>
            {aiExtracting && <AiSpinner $size={16} />}
            <Sparkles size={16} />
            {aiExtracting ? 'מחלץ הנחיות...' : 'חלץ הנחיות'}
          </Button>
        </AiSection>
      )}

      {showTable && (
        <DiscussionTable
          rows={instructions}
          availableMembers={availableMembers}
          onAddRow={onAddRow}
          onUpdateRow={onUpdateRow}
          onRemoveRow={onRemoveRow}
          onToggleRowAssignee={onToggleRowAssignee}
        />
      )}
    </StepWrapper>
  );
}

const StepWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DiscussionSummary = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
`;

const SummaryName = styled.span`
  font-weight: 500;
  color: var(--color-text-primary);
`;

const SummaryDate = styled.span``;

const MethodToggle = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const MethodButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 150ms, color 150ms, border-color 150ms;
  border: 1px solid ${({ $active }) => ($active ? 'var(--color-primary)' : 'var(--color-gray-200)')};
  background-color: ${({ $active }) =>
    $active ? 'color-mix(in srgb, var(--color-primary) 5%, transparent)' : 'transparent'};
  color: ${({ $active }) => ($active ? 'var(--color-primary)' : 'var(--color-text-secondary)')};
  font-weight: ${({ $active }) => ($active ? '500' : '400')};

  &:hover {
    background-color: ${({ $active }) =>
      $active
        ? 'color-mix(in srgb, var(--color-primary) 5%, transparent)'
        : 'var(--color-gray-50)'};
  }
`;

const AiSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const AiSpinner = styled(Spinner)`
  margin-inline-end: 0.375rem;
`;

const Textarea = styled.textarea`
  display: flex;
  min-height: 60px;
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  transition: border-color 150ms, box-shadow 150ms;

  &::placeholder {
    color: var(--color-text-disabled);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 30%, transparent);
    border-color: var(--color-primary);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
