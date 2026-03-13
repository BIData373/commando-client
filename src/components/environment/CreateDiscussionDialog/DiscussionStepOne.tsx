import styled from '@emotion/styled';
import { Calendar, Upload } from 'lucide-react';
import FieldWithCounter from '../FieldWithCounter';

interface DiscussionStepOneProps {
  discussionName: string;
  discussionDate: string;
  onChangeName: (v: string) => void;
  onChangeDate: (v: string) => void;
}

export default function DiscussionStepOne({
  discussionName,
  discussionDate,
  onChangeName,
  onChangeDate,
}: DiscussionStepOneProps) {
  return (
    <StepWrapper>
      <TopRow>
        <DiscussionNameField>
          <FieldWithCounter
            label="שם הדיון"
            value={discussionName}
            onChange={onChangeName}
            placeholder="הזן את שם הדיון"
            maxLength={60}
            autoFocus
          />
        </DiscussionNameField>

        <DateField>
          <DateLabel>תאריך הדיון</DateLabel>
          <DateInputWrapper>
            <CalendarIcon size={16} />
            <DateInput
              type="date"
              value={discussionDate}
              onChange={(e) => onChangeDate(e.target.value)}
            />
          </DateInputWrapper>
        </DateField>
      </TopRow>

      <div>
        <UploadLabel>צירוף קובץ</UploadLabel>
        <UploadArea>
          <Upload size={32} />
          <UploadText>לחץ או גרור את הקובץ לאזור זה כדי להעלות</UploadText>
          <UploadSubtext>תמיכה בהעלאה בודדת או בכמות גדולה</UploadSubtext>
        </UploadArea>
      </div>
    </StepWrapper>
  );
}

const StepWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const DiscussionNameField = styled.div`
  flex: 1;
`;

const DateField = styled.div`
  width: 11rem;
`;

const DateLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 0.375rem;
  text-align: end;
`;

const DateInputWrapper = styled.div`
  position: relative;
`;

const CalendarIcon = styled(Calendar)`
  position: absolute;
  inset-inline-end: 0.625rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-disabled);
  pointer-events: none;
`;

const DateInput = styled.input`
  display: flex;
  height: 2.25rem;
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid var(--color-gray-300);
  background-color: var(--color-paper);
  padding: 0.25rem 2.25rem 0.25rem 0.75rem;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 150ms;

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 30%, transparent);
  }
`;

const UploadLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 0.375rem;
  text-align: end;
`;

const UploadArea = styled.div`
  border: 2px dashed var(--color-gray-200);
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 150ms;
  color: var(--color-text-disabled);

  &:hover {
    border-color: color-mix(in srgb, var(--color-primary) 40%, transparent);
  }
`;

const UploadText = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: 0.75rem;
`;

const UploadSubtext = styled.p`
  font-size: 0.75rem;
  color: var(--color-text-disabled);
  margin-top: 0.375rem;
`;
