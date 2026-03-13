import styled from '@emotion/styled';
import type { ChangeEvent } from 'react';

interface FieldWithCounterProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  maxLength: number;
  autoFocus?: boolean;
}

export default function FieldWithCounter({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  autoFocus,
}: FieldWithCounterProps) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length <= maxLength) {
      onChange(e.target.value);
    }
  }

  return (
    <FieldWrapper>
      <FieldLabel>{label}</FieldLabel>
      <InputWrapper>
        <FieldInput
          type="text"
          autoFocus={autoFocus}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          dir="rtl"
        />
        <Counter>
          {value.length} / {maxLength}
        </Counter>
      </InputWrapper>
    </FieldWrapper>
  );
}

const FieldWrapper = styled.div``;

const FieldLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 0.375rem;
  text-align: end;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const FieldInput = styled.input`
  display: flex;
  height: 2.25rem;
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid var(--color-gray-300);
  background-color: var(--color-paper);
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  transition: border-color 150ms;
  outline: none;

  &::placeholder {
    color: var(--color-text-disabled);
  }

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 30%, transparent);
  }
`;

const Counter = styled.span`
  position: absolute;
  inset-inline-start: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75rem;
  color: var(--color-text-disabled);
  pointer-events: none;
`;
