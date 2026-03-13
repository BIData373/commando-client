import styled from '@emotion/styled';
import { Upload } from 'lucide-react';
import { type ChangeEvent, useState } from 'react';
import FieldLabel from '../shared/FieldLabel';
import SectionHeader from './SectionHeader';

interface GeneralTabProps {
  envName: string;
  envDescription: string | null;
}

export default function GeneralTab({ envName, envDescription }: GeneralTabProps) {
  const [name, setName] = useState(envName);
  const [description, setDescription] = useState(envDescription || '');

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleChangeDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  return (
    <Root>
      <SectionHeader title="פרטים כלליים" subtitle="שם הסביבה, תיאור וסמל" />

      <FieldsGrid>
        <FullWidth>
          <FieldLabel>שם הסביבה</FieldLabel>
          <TextInput value={name} onChange={handleChangeName} maxLength={100} />
        </FullWidth>

        <FullWidth>
          <FieldLabel>סמל / אייקון</FieldLabel>
          <UploadArea>
            <Upload size={32} />
            <UploadText>לחץ או גרור קובץ להעלאת סמל</UploadText>
            <UploadHint>PNG, JPG עד 2MB</UploadHint>
          </UploadArea>
        </FullWidth>

        <FullWidth>
          <FieldLabel>תיאור</FieldLabel>
          <TextArea
            value={description}
            onChange={handleChangeDescription}
            rows={3}
            placeholder="תיאור מטרת הסביבה..."
            maxLength={500}
          />
        </FullWidth>
      </FieldsGrid>

      <SaveRow>
        <SaveButton>שמור שינויים</SaveButton>
      </SaveRow>

      <DangerSection>
        <SectionHeader title="אזור מסוכן" subtitle="פעולות בלתי הפיכות" />
        <DangerCard>
          <DangerText>
            <DangerTitle>ביטול סביבה</DangerTitle>
            <DangerDesc>פעולה זו תבטל את הסביבה וכל ההנחיות בה לצמיתות</DangerDesc>
          </DangerText>
          <DeleteButton>בטל סביבה</DeleteButton>
        </DangerCard>
      </DangerSection>
    </Root>
  );
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const FieldsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 4rem;
  row-gap: 2rem;
  max-width: 42rem;
`;

const FullWidth = styled.div`
  grid-column: span 2;
`;

const fieldBase = `
  background-color: var(--color-paper);
  border: 1px solid var(--color-gray-200);
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
  outline: none;
  transition: border-color 150ms;

  &:focus {
    border-color: var(--color-primary);
  }
`;

const TextInput = styled.input`
  ${fieldBase}
  width: 100%;
  max-width: 24rem;
`;

const TextArea = styled.textarea`
  ${fieldBase}
  width: 100%;
  resize: none;
`;

const UploadArea = styled.div`
  border: 2px dashed var(--color-gray-200);
  border-radius: 0.75rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  max-width: 24rem;
  transition: border-color 150ms;
  color: var(--color-text-disabled);

  &:hover {
    border-color: var(--color-primary);
  }
`;

const UploadText = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin: 0.75rem 0 0;
`;

const UploadHint = styled.p`
  font-size: 0.75rem;
  color: var(--color-text-disabled);
  margin: 0.375rem 0 0;
`;

const SaveRow = styled.div`
  padding-top: 1rem;
`;

const SaveButton = styled.button`
  background-color: var(--color-text-primary);
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  border: none;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 150ms;

  &:hover {
    background-color: color-mix(in srgb, var(--color-text-primary) 85%, transparent);
  }

  &:active {
    transform: scale(0.97);
  }
`;

const DangerSection = styled.div`
  border-top: 1px solid var(--color-gray-100);
  padding-top: 2.5rem;
`;

const DangerCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--color-error-light);
  border: 1px solid color-mix(in srgb, var(--color-error) 20%, transparent);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 1.5rem;
`;

const DangerText = styled.div``;

const DangerTitle = styled.p`
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
`;

const DangerDesc = styled.p`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin: 0.125rem 0 0;
`;

const DeleteButton = styled.button`
  background-color: var(--color-paper);
  border: 1px solid color-mix(in srgb, var(--color-error) 30%, transparent);
  color: var(--color-error);
  padding: 0.375rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 150ms;

  &:hover {
    background-color: var(--color-error-light);
  }
`;
