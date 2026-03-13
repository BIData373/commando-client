import styled from '@emotion/styled';

interface EditFieldWithCounterProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  maxLength: number;
  autoFocus?: boolean;
  multiline?: boolean;
}

export default function EditFieldWithCounter({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  autoFocus,
  multiline,
}: EditFieldWithCounterProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxLength) onChange(e.target.value);
  };

  return (
    <Root>
      <Label>{label}</Label>
      <FieldWrapper>
        {multiline ? (
          <TextArea
            autoFocus={autoFocus}
            rows={3}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            dir="rtl"
          />
        ) : (
          <Input
            type="text"
            autoFocus={autoFocus}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            dir="rtl"
          />
        )}
        <Counter>
          {value.length} / {maxLength}
        </Counter>
      </FieldWrapper>
    </Root>
  );
}

const Root = styled.div``;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
  text-align: end;
`;

const FieldWrapper = styled.div`
  position: relative;
`;

const fieldBase = `
  display: flex;
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid var(--color-gray-200);
  background-color: var(--color-paper);
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  transition: border-color 150ms, box-shadow 150ms;
  color: var(--color-text-primary);

  &::placeholder {
    color: var(--color-text-disabled);
  }

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 30%, transparent);
  }
`;

const Input = styled.input`
  ${fieldBase}
  height: 2.5rem;
`;

const TextArea = styled.textarea`
  ${fieldBase}
  resize: none;
`;

const Counter = styled.span`
  position: absolute;
  inset-inline-start: 0.75rem;
  bottom: 0.5rem;
  font-size: 0.6875rem;
  color: var(--color-gray-300);
  pointer-events: none;
`;
