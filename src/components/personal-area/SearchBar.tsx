import styled from '@emotion/styled';
import { Search, X } from 'lucide-react';
import type { ChangeEvent } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export default function SearchBar({ value, onChange, onClear }: SearchBarProps) {
  return (
    <SearchWrapper>
      <SearchIcon size={16} />

      <SearchInput type="text" placeholder="חיפוש..." value={value} onChange={onChange} />

      {value && (
        <ClearButton onClick={onClear}>
          <X size={16} />
        </ClearButton>
      )}
    </SearchWrapper>
  );
}

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  inset-inline-start: 0.75rem;
  color: var(--color-text-disabled);
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 220px;
  padding: 0.375rem 2rem 0.375rem 2.25rem;
  font-size: 0.875rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-gray-200);
  background-color: var(--color-gray-50);
  color: var(--color-text-primary);
  outline: none;
  transition: background-color 150ms, box-shadow 150ms, border-color 150ms;

  &::placeholder {
    color: var(--color-text-disabled);
  }

  &:hover {
    background-color: var(--color-gray-100);
  }

  &:focus {
    background-color: var(--color-paper);
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 20%, transparent);
  }
`;

const ClearButton = styled.button`
  position: absolute;
  inset-inline-end: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-disabled);
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 150ms;

  &:hover {
    color: var(--color-text-secondary);
  }
`;
