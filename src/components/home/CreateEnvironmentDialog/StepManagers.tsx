import styled from '@emotion/styled';
import { ChevronDown, Search, UserPlus, X } from 'lucide-react';
import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import { mockUserSummaries } from '../../../mocks/data';
import { type EnvironmentFormData, getIconComponent } from '../../../utils/environmentUtils';
import Button from '../../shared/Button';
import DialogContent from '../../shared/Dialog/DialogContent';
import DialogFooter from '../../shared/Dialog/DialogFooter';
import DialogHeader from '../../shared/Dialog/DialogHeader';
import DialogTitle from '../../shared/Dialog/DialogTitle';
import Spinner from '../../shared/Spinner';
import UserInitials from './UserInitials';

interface StepManagersProps {
  form: EnvironmentFormData;
  updateForm: (patch: Partial<EnvironmentFormData>) => void;
  onBack: () => void;
  onCreate: () => void;
  onReset: () => void;
  isPending: boolean;
}

export default function StepManagers({
  form,
  updateForm,
  onBack,
  onCreate,
  onReset,
  isPending,
}: StepManagersProps) {
  const users = mockUserSummaries;
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const IconComp = getIconComponent(form.iconName);

  useEffect(() => {
    if (!searchOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [searchOpen]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      setSearch('');
    }
  }, [searchOpen]);

  const availableUsers = users.filter(
    (u) =>
      !form.managerIds.includes(u.id) && (search.trim() === '' || u.name.includes(search.trim()))
  );
  const selectedManagers = users.filter((u) => form.managerIds.includes(u.id));
  const hasManagers = form.managerIds.length > 0;

  function handleClickSearchOpen() {
    setSearchOpen(!searchOpen);
  }

  function handleChangeSearch(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  function addManager(userId: string) {
    updateForm({ managerIds: [...form.managerIds, userId] });
    setSearchOpen(false);
    setSearch('');
  }

  function removeManager(userId: string) {
    updateForm({ managerIds: form.managerIds.filter((id) => id !== userId) });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>מנהלי סביבה</DialogTitle>
        <Subtitle>בחרו מי ינהל את הסביבה.</Subtitle>
      </DialogHeader>

      <DialogContent>
        <FormStack>
          <FieldGroup>
            <FieldLabel>מנהלי סביבה</FieldLabel>

            <SearchWrapper ref={ref}>
              <SearchTrigger type="button" onClick={handleClickSearchOpen} $open={searchOpen}>
                <UserPlus size={16} />
                <SearchPlaceholder>הוסיפו מנהל סביבה...</SearchPlaceholder>
                <ChevronIcon size={16} $open={searchOpen} />
              </SearchTrigger>

              {searchOpen && (
                <SearchDropdown>
                  <SearchInputRow>
                    <SearchIconWrapper>
                      <Search size={14} />
                    </SearchIconWrapper>
                    <SearchInput
                      ref={searchRef}
                      type="text"
                      placeholder="חיפוש לפי שם..."
                      value={search}
                      onChange={handleChangeSearch}
                    />
                  </SearchInputRow>
                  <UserList>
                    {availableUsers.length === 0 ? (
                      <EmptyMessage>לא נמצאו משתמשים</EmptyMessage>
                    ) : (
                      availableUsers.map((user) => (
                        <UserOption key={user.id} type="button" onClick={() => addManager(user.id)}>
                          <UserInitials name={user.name} size={24} />
                          <span>{user.name}</span>
                        </UserOption>
                      ))
                    )}
                  </UserList>
                </SearchDropdown>
              )}
            </SearchWrapper>
          </FieldGroup>

          {selectedManagers.length > 0 && (
            <ManagerTagList>
              {selectedManagers.map((user) => (
                <ManagerTag key={user.id}>
                  <UserInitials name={user.name} size={20} />
                  {user.name}
                  <RemoveButton
                    type="button"
                    onClick={() => removeManager(user.id)}
                    aria-label={`הסרת ${user.name}`}
                    disabled={isPending}
                  >
                    <X size={14} />
                  </RemoveButton>
                </ManagerTag>
              ))}
            </ManagerTagList>
          )}

          <PreviewCard>
            <PreviewLabel>תצוגה מקדימה</PreviewLabel>
            <PreviewRow>
              <PreviewAvatar>
                <IconComp size={20} />
              </PreviewAvatar>
              <PreviewInfo>
                <PreviewName>{form.name || 'שם המערך'}</PreviewName>
                <PreviewSubtext>
                  {hasManagers ? (
                    selectedManagers.map((u) => u.name).join(', ')
                  ) : (
                    <DisabledText>טרם שובצו מנהלים</DisabledText>
                  )}
                </PreviewSubtext>
              </PreviewInfo>
            </PreviewRow>
          </PreviewCard>
        </FormStack>
      </DialogContent>

      <SpacedDialogFooter>
        <Button type="button" variant="ghost" size="sm" onClick={onReset} disabled={isPending}>
          נקה טופס
        </Button>
        <FooterActions>
          <Button type="button" variant="ghost" onClick={onBack} disabled={isPending}>
            חזרה
          </Button>
          <Button type="button" disabled={!hasManagers || isPending} onClick={onCreate}>
            {isPending && <ButtonSpinner $size={18} />}
            {isPending ? 'שולח בקשה...' : 'שלח בקשה'}
          </Button>
        </FooterActions>
      </SpacedDialogFooter>
    </>
  );
}

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: 0.25rem;
`;

const FormStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const FieldLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
`;

const SearchWrapper = styled.div`
  position: relative;
`;

const SearchTrigger = styled.button<{ $open: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  color: var(--color-text-disabled);

  &:hover {
    border-color: ${({ $open }) => ($open ? 'var(--color-primary)' : 'var(--color-gray-300)')};
  }
`;

const SearchPlaceholder = styled.span`
  color: var(--color-text-disabled);
  flex: 1;
  text-align: start;
`;

const ChevronIcon = styled(ChevronDown)<{ $open: boolean }>`
  color: var(--color-text-secondary);
  flex-shrink: 0;
  margin-inline-start: auto;
  transition: transform 150ms;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'none')};
`;

const SearchDropdown = styled.div`
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

const SearchInputRow = styled.div`
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

const UserList = styled.div`
  max-height: 10rem;
  overflow-y: auto;
`;

const EmptyMessage = styled.p`
  padding: 0.75rem;
  font-size: 0.875rem;
  color: var(--color-text-disabled);
  text-align: center;
`;

const UserOption = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  text-align: start;
  border: none;
  background: none;
  cursor: pointer;
  transition: background-color 150ms;

  &:hover {
    background-color: var(--color-gray-50);
  }
`;

const ManagerTagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ManagerTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background-color: color-mix(in srgb, var(--color-primary) 10%, transparent);
  color: var(--color-primary);
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  display: flex;
  padding: 0;
  margin-inline-start: 0.125rem;
  transition: opacity 150ms;

  &:hover {
    opacity: 0.7;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const PreviewCard = styled.div`
  border: 2px dashed var(--color-gray-200);
  border-radius: 0.75rem;
  padding: 1rem;
`;

const PreviewLabel = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
`;

const PreviewRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const PreviewAvatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background: linear-gradient(to bottom right, var(--color-primary-dark), var(--color-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-paper);
  flex-shrink: 0;
`;

const PreviewInfo = styled.div`
  min-width: 0;
  flex: 1;
`;

const PreviewName = styled.h4`
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PreviewSubtext = styled.div`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-top: 0.125rem;
`;

const DisabledText = styled.span`
  color: var(--color-text-disabled);
`;

const SpacedDialogFooter = styled(DialogFooter)`
  justify-content: space-between;
`;

const FooterActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ButtonSpinner = styled(Spinner)`
  margin-inline-end: 0.5rem;
`;
