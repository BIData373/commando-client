import styled from '@emotion/styled';
import { Check, ChevronDown, Search } from 'lucide-react';
import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import { getIconComponent, getIconLabel, UNIT_OPTIONS } from '../../../utils/environmentUtils';

interface UnitDropdownProps {
  selectedIcon: string;
  onSelectIcon: (name: string) => void;
}

export default function UnitDropdown({ selectedIcon, onSelectIcon }: UnitDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const SelectedIconComp = getIconComponent(selectedIcon);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      setSearch('');
    }
  }, [open]);

  const filtered = search.trim()
    ? UNIT_OPTIONS.filter((opt) => opt.label.includes(search.trim()))
    : UNIT_OPTIONS;

  function handleClickOpen() {
    setOpen(!open);
  }

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  function handleClickSelect(name: string) {
    onSelectIcon(name);
    setOpen(false);
  }

  return (
    <Wrapper ref={ref}>
      <TriggerButton type="button" onClick={handleClickOpen} $open={open}>
        <IconPreview>
          <SelectedIconComp size={14} />
        </IconPreview>
        <TriggerLabel>{getIconLabel(selectedIcon)}</TriggerLabel>
        <ChevronIcon size={16} $open={open} />
      </TriggerButton>

      {open && (
        <DropdownPanel>
          <SearchRow>
            <SearchIconWrapper>
              <Search size={14} />
            </SearchIconWrapper>
            <SearchInput
              ref={searchRef}
              type="text"
              placeholder="חיפוש יחידה..."
              value={search}
              onChange={handleSearch}
            />
          </SearchRow>

          <OptionList>
            {filtered.length === 0 ? (
              <EmptyMessage>לא נמצאו תוצאות</EmptyMessage>
            ) : (
              filtered.map(({ name, label, icon: Icon }) => (
                <OptionButton
                  key={name}
                  type="button"
                  onClick={() => handleClickSelect(name)}
                  $selected={name === selectedIcon}
                >
                  <OptionIcon>
                    <Icon size={14} />
                  </OptionIcon>
                  <span>{label}</span>
                  {name === selectedIcon && <CheckIcon size={16} />}
                </OptionButton>
              ))
            )}
          </OptionList>
        </DropdownPanel>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
`;

const TriggerButton = styled.button<{ $open: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  height: 2.5rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ $open }) => ($open ? 'var(--color-primary)' : 'var(--color-gray-200)')};
  padding: 0 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
  background: none;
  transition: border-color 150ms, box-shadow 150ms;
  box-shadow: ${({ $open }) =>
    $open ? '0 0 0 2px color-mix(in srgb, var(--color-primary) 30%, transparent)' : 'none'};

  &:hover {
    border-color: ${({ $open }) => ($open ? 'var(--color-primary)' : 'var(--color-gray-300)')};
  }
`;

const IconPreview = styled.div`
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  background: linear-gradient(to bottom right, var(--color-primary-dark), var(--color-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-paper);
  flex-shrink: 0;
`;

const TriggerLabel = styled.span`
  flex: 1;
  text-align: start;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ChevronIcon = styled(ChevronDown)<{ $open: boolean }>`
  color: var(--color-text-secondary);
  flex-shrink: 0;
  transition: transform 150ms;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'none')};
`;

const DropdownPanel = styled.div`
  position: absolute;
  top: calc(100% + 0.25rem);
  inset-inline-start: 0;
  width: 100%;
  z-index: var(--z-dropdown);
  background-color: var(--color-paper);
  border-radius: 0.5rem;
  border: 1px solid var(--color-gray-200);
  box-shadow: 0 10px 30px rgb(0 0 0 / 0.1);
  padding: 0.25rem 0;
`;

const SearchRow = styled.div`
  position: relative;
  padding: 0.375rem 0.5rem;
`;

const SearchIconWrapper = styled.span`
  position: absolute;
  inset-inline-start: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-disabled);
  pointer-events: none;
  display: flex;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 2rem;
  border-radius: 0.375rem;
  border: 1px solid var(--color-gray-200);
  padding-inline-start: 2rem;
  padding-inline-end: 0.75rem;
  font-size: 0.875rem;
  outline: none;

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-primary) 30%, transparent);
  }
`;

const OptionList = styled.div`
  max-height: 12rem;
  overflow-y: auto;
`;

const OptionButton = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  text-align: start;
  border: none;
  cursor: pointer;
  transition: background-color 150ms;
  background-color: ${({ $selected }) =>
    $selected ? 'color-mix(in srgb, var(--color-primary) 5%, transparent)' : 'transparent'};
  color: ${({ $selected }) => ($selected ? 'var(--color-primary)' : 'var(--color-text-primary)')};
  font-weight: ${({ $selected }) => ($selected ? '500' : '400')};

  &:hover {
    background-color: var(--color-gray-50);
  }
`;

const OptionIcon = styled.div`
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  background: linear-gradient(to bottom right, var(--color-primary-dark), var(--color-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-paper);
  flex-shrink: 0;
`;

const CheckIcon = styled(Check)`
  margin-inline-start: auto;
  color: var(--color-primary);
`;

const EmptyMessage = styled.p`
  padding: 0.75rem;
  font-size: 0.875rem;
  color: var(--color-text-disabled);
  text-align: center;
`;
