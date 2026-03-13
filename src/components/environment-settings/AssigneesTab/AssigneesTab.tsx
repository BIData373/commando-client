import styled from '@emotion/styled';
import { Check, Edit2, Plus, Search, Trash2, User as UserIcon, Users } from 'lucide-react';
import { type ChangeEvent, useState } from 'react';
import {
  useCreateResponsibleGroup,
  useDeleteResponsibleGroup,
  useResponsibleGroups,
  useUpdateResponsibleGroup,
} from '../../../hooks/useEnvironments';
import { useToast } from '../../../hooks/useToast';
import SectionHeader from '../SectionHeader';
import GroupModal from './GroupModal';

interface AssigneesTabProps {
  envId: string;
}

interface GroupMemberForm {
  id: string;
  name: string;
  email: string;
}

export default function AssigneesTab({ envId }: AssigneesTabProps) {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [groupName, setGroupName] = useState('');
  const [groupMembers, setGroupMembers] = useState<GroupMemberForm[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { data: responsibleGroups = [] } = useResponsibleGroups(envId);
  const createGroupMutation = useCreateResponsibleGroup(envId);
  const updateGroupMutation = useUpdateResponsibleGroup(envId);
  const deleteGroupMutation = useDeleteResponsibleGroup(envId);

  const filteredGroups = searchQuery.trim()
    ? responsibleGroups.filter((g) => g.nickname.toLowerCase().includes(searchQuery.toLowerCase()))
    : responsibleGroups;

  const isSaving = createGroupMutation.isPending || updateGroupMutation.isPending;

  function openCreateModal() {
    setEditingGroupId(null);
    setGroupName('');
    setGroupMembers([]);
    setGroupModalOpen(true);
  }

  function openEditModal(group: (typeof responsibleGroups)[number]) {
    setEditingGroupId(group.id);
    setGroupName(group.nickname);
    setGroupMembers(group.members.map((m) => ({ id: m.id, name: m.name, email: '' })));
    setGroupModalOpen(true);
  }

  function closeGroupModal() {
    setGroupModalOpen(false);
    setEditingGroupId(null);
    setGroupName('');
    setGroupMembers([]);
  }

  function handleSaveGroup() {
    if (!groupName.trim() || groupMembers.length === 0) return;
    const payload = { nickname: groupName.trim(), userIds: groupMembers.map((m) => m.id) };

    if (editingGroupId) {
      updateGroupMutation.mutate(
        { groupId: editingGroupId, data: payload },
        {
          onSuccess: closeGroupModal,
          onError: () => toast.error('שגיאה בעדכון הקבוצה'),
        }
      );
    } else {
      createGroupMutation.mutate(payload, {
        onSuccess: closeGroupModal,
        onError: () => toast.error('שגיאה ביצירת הקבוצה'),
      });
    }
  }

  function handleDeleteGroup(groupId: string) {
    deleteGroupMutation.mutate(groupId, {
      onSuccess: () => setDeleteConfirmId(null),
      onError: () => toast.error('שגיאה במחיקת הקבוצה'),
    });
  }

  function addMemberByEmail(email: string) {
    if (groupMembers.some((m) => m.email === email)) return;
    setGroupMembers((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: email.split('@')[0], email },
    ]);
  }

  function removeMember(id: string) {
    setGroupMembers((prev) => prev.filter((m) => m.id !== id));
  }

  function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
  }

  return (
    <TabContent>
      <TabTopRow>
        <SectionHeader
          title="קבוצות אחראים"
          subtitle="הגדר קבוצות אחראים כמאגר שיוך להנחיות. האחראים יראו רק את ההנחיות ששויכו אליהם בסביבה האישית שלהם, ללא גישה להגדרות הסביבה."
        />
        <CreateGroupButton onClick={openCreateModal}>
          <Plus size={16} />
          הוספת קבוצה
        </CreateGroupButton>
      </TabTopRow>

      <SearchWrapper>
        <SearchIcon size={16} />
        <SearchInput
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="חיפוש קבוצה..."
        />
      </SearchWrapper>

      {responsibleGroups.length === 0 && (
        <EmptyStateBox>
          <EmptyIconWrapper>
            <Users size={28} />
          </EmptyIconWrapper>
          <EmptyTitle>לא הוגדרו קבוצות אחראים</EmptyTitle>
          <EmptyDesc>
            צור קבוצות אחראים כדי לשייך אליהן הנחיות. האחראים יראו רק את ההנחיות שלהם בסביבה האישית
          </EmptyDesc>
          <CreateGroupButton onClick={openCreateModal}>
            <Plus size={16} />
            צור קבוצה חדשה
          </CreateGroupButton>
        </EmptyStateBox>
      )}

      {filteredGroups.length > 0 && (
        <GroupsGrid>
          {filteredGroups.map((group) => (
            <GroupCard key={group.id}>
              <CardHeader>
                <GroupIdentity>
                  <GroupIconBox>
                    <Users size={18} />
                  </GroupIconBox>
                  <GroupMeta>
                    <GroupName>{group.nickname}</GroupName>
                    <GroupCount>{group.members.length} משתמשים</GroupCount>
                  </GroupMeta>
                </GroupIdentity>

                <CardActions>
                  <IconButton onClick={() => openEditModal(group)} aria-label="ערוך קבוצה">
                    <Edit2 size={14} />
                  </IconButton>
                  {deleteConfirmId === group.id ? (
                    <ConfirmRow>
                      <DangerIconButton
                        onClick={() => handleDeleteGroup(group.id)}
                        aria-label="אשר מחיקה"
                      >
                        <Check size={14} />
                      </DangerIconButton>
                      <IconButton onClick={() => setDeleteConfirmId(null)} aria-label="בטל מחיקה">
                        <UserIcon size={14} />
                      </IconButton>
                    </ConfirmRow>
                  ) : (
                    <IconButton
                      onClick={() => setDeleteConfirmId(group.id)}
                      aria-label="מחק קבוצה"
                      $danger
                    >
                      <Trash2 size={14} />
                    </IconButton>
                  )}
                </CardActions>
              </CardHeader>

              <MembersSection>
                {group.members.length > 0 ? (
                  <MembersList>
                    {group.members.slice(0, 4).map((member) => (
                      <MemberTag key={member.id}>
                        <MemberAvatar>
                          <UserIcon size={9} />
                        </MemberAvatar>
                        {member.name}
                      </MemberTag>
                    ))}
                    {group.members.length > 4 && (
                      <OverflowTag>+{group.members.length - 4}</OverflowTag>
                    )}
                  </MembersList>
                ) : (
                  <NoMembersText>אין משתמשים בקבוצה</NoMembersText>
                )}
              </MembersSection>
            </GroupCard>
          ))}
        </GroupsGrid>
      )}

      {responsibleGroups.length > 0 && filteredGroups.length === 0 && (
        <NoResultsText>לא נמצאו קבוצות התואמות לחיפוש</NoResultsText>
      )}

      {groupModalOpen && (
        <GroupModal
          isEditing={!!editingGroupId}
          groupName={groupName}
          onGroupNameChange={setGroupName}
          members={groupMembers}
          onAddMember={addMemberByEmail}
          onRemoveMember={removeMember}
          onSave={handleSaveGroup}
          onClose={closeGroupModal}
          isSaving={isSaving}
        />
      )}
    </TabContent>
  );
}

const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const TabTopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const CreateGroupButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background-color: var(--color-primary);
  color: white;
  padding: 0.375rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color 150ms;

  &:hover {
    background-color: var(--color-primary-dark);
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  max-width: 24rem;
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
  width: 100%;
  background-color: var(--color-paper);
  border: 1px solid var(--color-gray-200);
  padding: 0.5rem 0.75rem 0.5rem 2.25rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  outline: none;
  color: var(--color-text-primary);
  transition: border-color 150ms, box-shadow 150ms;

  &::placeholder {
    color: var(--color-text-disabled);
  }

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 15%, transparent);
  }
`;

const EmptyStateBox = styled.div`
  text-align: center;
  padding: 4rem 1rem;
  border: 2px dashed var(--color-gray-200);
  border-radius: 0.75rem;
  background-color: var(--color-gray-50);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const EmptyIconWrapper = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 1rem;
  background-color: color-mix(in srgb, var(--color-primary) 10%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: color-mix(in srgb, var(--color-primary) 60%, transparent);
  margin-bottom: 0.5rem;
`;

const EmptyTitle = styled.p`
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
`;

const EmptyDesc = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-disabled);
  max-width: 20rem;
  margin: 0 0 1rem;
`;

const GroupsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1rem;
`;

const GroupCard = styled.div`
  background-color: var(--color-paper);
  border: 1px solid var(--color-gray-200);
  border-radius: 0.75rem;
  padding: 1.25rem;
  transition: box-shadow 150ms;

  &:hover {
    box-shadow: var(--shadow-hover);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const GroupIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const GroupIconBox = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.625rem;
  background-color: color-mix(in srgb, var(--color-primary) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-primary) 15%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  flex-shrink: 0;
`;

const GroupMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

const GroupName = styled.h4`
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
`;

const GroupCount = styled.span`
  font-size: 0.75rem;
  color: var(--color-text-disabled);
`;

const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.125rem;
`;

const IconButton = styled.button<{ $danger?: boolean }>`
  padding: 0.375rem;
  border-radius: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--color-text-disabled);
  transition: color 150ms, background-color 150ms;

  &:hover {
    color: ${({ $danger }) => ($danger ? 'var(--color-error)' : 'var(--color-primary)')};
    background-color: ${({ $danger }) =>
      $danger
        ? 'var(--color-error-light)'
        : 'color-mix(in srgb, var(--color-primary) 10%, transparent)'};
  }
`;

const DangerIconButton = styled.button`
  padding: 0.375rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  color: var(--color-error);
  background-color: var(--color-error-light);
  transition: background-color 150ms;

  &:hover {
    background-color: color-mix(in srgb, var(--color-error) 20%, transparent);
  }
`;

const ConfirmRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-inline-start: 0.25rem;
`;

const MembersSection = styled.div`
  border-top: 1px solid var(--color-gray-100);
  padding-top: 0.75rem;
`;

const MembersList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`;

const MemberTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background-color: var(--color-gray-50);
  color: var(--color-text-secondary);
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid var(--color-gray-100);
`;

const MemberAvatar = styled.div`
  width: 1rem;
  height: 1rem;
  border-radius: 9999px;
  background-color: var(--color-gray-200);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--color-text-disabled);
`;

const OverflowTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-text-disabled);
  background-color: var(--color-gray-50);
  border: 1px solid var(--color-gray-100);
`;

const NoMembersText = styled.p`
  font-size: 0.75rem;
  color: var(--color-text-disabled);
  margin: 0;
`;

const NoResultsText = styled.div`
  text-align: center;
  padding: 2.5rem 0;
  font-size: 0.875rem;
  color: var(--color-text-disabled);
`;
