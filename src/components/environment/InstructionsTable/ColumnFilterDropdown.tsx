import styled from '@emotion/styled';
import { type MouseEvent, useEffect, useRef, useState } from 'react';
import Button from '../../shared/Button';
import Checkbox from '../../shared/Checkbox';

interface FilterOption {
  value: string;
  label: string;
}

interface ColumnFilterDropdownProps {
  options: FilterOption[];
  selected: string[];
  onApply: (values: string[]) => void;
  onReset: () => void;
  onClose: () => void;
}

export default function ColumnFilterDropdown({
  options,
  selected,
  onApply,
  onReset,
  onClose,
}: ColumnFilterDropdownProps) {
  const [pending, setPending] = useState<Set<string>>(new Set(selected));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: globalThis.MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const toggleOption = (value: string) => {
    setPending((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const handleApply = () => {
    onApply(Array.from(pending));
    onClose();
  };
  const handleReset = () => {
    setPending(new Set());
    onReset();
    onClose();
  };

  function handleClickDropdown(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
  }

  return (
    <Dropdown ref={ref} onClick={handleClickDropdown}>
      <OptionList>
        {options.length === 0 ? (
          <EmptyText>אין אפשרויות</EmptyText>
        ) : (
          options.map((opt) => (
            <OptionLabel key={opt.value} $selected={pending.has(opt.value)}>
              <Checkbox checked={pending.has(opt.value)} onChange={() => toggleOption(opt.value)} />
              <OptionText $selected={pending.has(opt.value)}>{opt.label}</OptionText>
            </OptionLabel>
          ))
        )}
      </OptionList>

      <Footer>
        <FooterButton size="sm" onClick={handleApply}>
          החל
        </FooterButton>
        <FooterButton size="sm" variant="ghost" onClick={handleReset}>
          אפס
        </FooterButton>
      </Footer>
    </Dropdown>
  );
}

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 0.25rem);
  inset-inline-start: 0;
  z-index: var(--z-dropdown);
  background-color: var(--color-paper);
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  border: 1px solid var(--color-gray-200);
  padding: 0.5rem 0;
  min-width: 200px;
`;

const OptionList = styled.div`
  max-height: 13rem;
  overflow-y: auto;
  padding: 0 0.25rem;
`;

const EmptyText = styled.p`
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: var(--color-text-disabled);
  text-align: center;
`;

const OptionLabel = styled.label<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 150ms;
  background-color: ${({ $selected }) => ($selected ? 'color-mix(in srgb, var(--color-primary) 5%, transparent)' : 'transparent')};

  &:hover {
    background-color: var(--color-gray-50);
  }
`;

const OptionText = styled.span<{ $selected: boolean }>`
  font-weight: ${({ $selected }) => ($selected ? '500' : '400')};
  color: ${({ $selected }) => ($selected ? 'var(--color-primary)' : 'inherit')};
`;

const Footer = styled.div`
  border-top: 1px solid var(--color-gray-100);
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FooterButton = styled(Button)`
  flex: 1;
`;
