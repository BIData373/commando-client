import styled from '@emotion/styled'
import { useForm } from '@tanstack/react-form'
import { UserPlus, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useCreateAssignee, useUpdateAssignee } from '#/hooks/useAssignees'
import { useUsers } from '#/hooks/useUsers'
import type { IAssignee, IUser } from '#/types'
import { Button } from '../ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { SearchDropdown } from './SearchDropdown'

const PRESET_COLORS = [
    '#00474f', '#006d75', '#08979c', '#5cdbd3',
    '#135200', '#237804', '#7cb305', '#95de64',
    '#2f54eb', '#85a5ff', '#531dab', '#9254de',
    '#ad4e00', '#d48806', '#d4b106', '#faad14',
    '#d4380d', '#fa541c', '#ff7a45', '#ffec3d',
    '#9e1068', '#eb2f96', '#ff85c0', '#8c8c8c',
]


interface AssigneeDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    assignee?: IAssignee
}

const DEFAULT_COLOR = '#3B82F6'

function concatName(user: IUser) {
    return `${user.name} ${user.id} ${user.email} / ${user.role}`
}

function renderUserItem(user: IUser) {
    return (
        <>
            <AssigneeUserName>{user.name} - {user.id}</AssigneeUserName>
            <AssigneeUserMeta>{user.email} / {user.role}</AssigneeUserMeta>
        </>
    )
}

export function AssigneeDialog({ assignee, open, onOpenChange }: AssigneeDialogProps) {
    const isUpdate = !!assignee

    const { data: users = [] } = useUsers()
    const createAssignee = useCreateAssignee()
    const updateAssignee = useUpdateAssignee()

    const userIds = assignee?.userIds ?? [];
    const assignees = useMemo(() => users.filter(user => userIds.includes(user.id)), [userIds, users])

    const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
    const [localAssignees, setLocalAssignees] = useState<IUser[]>(assignees)
    const [userSearchValue, setUserSearchValue] = useState('')

    const filteredUsers = userSearchValue.trim()
        ? users.filter((u) => u.name.includes(userSearchValue) || u.email.includes(userSearchValue))
        : []

    const form = useForm({
        defaultValues: {
            name: assignee ? assignee.name : '',
            color: assignee?.color ?? DEFAULT_COLOR,
            userSearch: '',
        },
        onSubmit: async ({ value }) => {
            const payload = {
                name: value.name,
                color: value.color,
                userIds: localAssignees.map((u) => u.id),
            }
            if (isUpdate && assignee) {
                await updateAssignee.mutateAsync({ assigneeId: assignee.id, data: payload })
            } else {
                await createAssignee.mutateAsync(payload)
            }
            onOpenChange(false)
        },
    })

    function handleAddUserList() {
        if (!selectedUser) return
        const alreadyAdded = localAssignees.some(u => u.id === selectedUser.id)
        if (!alreadyAdded) {
            setLocalAssignees(prev => [...prev, selectedUser])
        }
        form.setFieldValue('userSearch', '')
        setSelectedUser(null)
    }

    function handleRemoveAssignee(id: number) {
        const changeAssignees = localAssignees.filter(assignee => assignee.id !== id)
        setLocalAssignees(changeAssignees)
    }

    async function handleSubmit() {
        await form.handleSubmit()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <WideDialogContent>
                <DialogTitleLarge>{isUpdate ? 'עריכת אחראי' : 'יצירת אחראי'}</DialogTitleLarge>
                <StyledDialogDescription>
                    ‘אחראי’ אליו ניתן לשייך הנחיות.
                    <br />
                    לכל אחראי ניתן לכתב מספר משתמשים, אשר יקבלו את ההנחיות לאזור האישי שלהם.
                </StyledDialogDescription>

                <DialogBody>
                    <form.Field name="name">
                        {(field) => (
                            <FieldGroup>
                                <FieldLabel>שם אחראי</FieldLabel>
                                <Input
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder='לדוגמה: מג"ד, רע"ן מפקדים, קמב"צ...'
                                />
                            </FieldGroup>
                        )}
                    </form.Field>

                    <form.Field name="color">
                        {(field) => (
                            <ColorRow>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <ColorSwatchContainer>
                                            <ColorSwatch $color={field.state.value} />
                                        </ColorSwatchContainer>
                                    </PopoverTrigger>
                                    <StyledPopoverContent side="top" align="start">
                                        <ColorPickerPopup>
                                            <ColorGrid>
                                                {PRESET_COLORS.map(color => (
                                                    <ColorOption
                                                        key={color}
                                                        $color={color}
                                                        $selected={field.state.value === color}
                                                        onClick={() => field.handleChange(color)}
                                                    />
                                                ))}
                                            </ColorGrid>
                                            <OtherColorLabel>
                                                <HiddenColorInput
                                                    type="color"
                                                    value={field.state.value}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                />
                                                אחר
                                            </OtherColorLabel>
                                        </ColorPickerPopup>
                                    </StyledPopoverContent>
                                </Popover>
                                <ColorLabel>צבע לאחראי</ColorLabel>
                            </ColorRow>
                        )}
                    </form.Field>

                    <form.Field name="userSearch">
                        {(field) => (
                            <FieldGroup>
                                <FieldLabel>הוספת משתמשים מכותבים</FieldLabel>
                                <SearchRow>
                                    <SearchDropdown<IUser>
                                        items={filteredUsers}
                                        value={field.state.value}
                                        onChange={(v) => { field.handleChange(v); setUserSearchValue(v); if (!v) setSelectedUser(null) }}
                                        onSelect={(user) => { field.handleChange(concatName(user)); setUserSearchValue(concatName(user)); setSelectedUser(user) }}
                                        onClear={() => { field.handleChange(''); setUserSearchValue(''); setSelectedUser(null) }}
                                        placeholder="חפש שם/ תפקיד/ מספר אישי"
                                        renderItem={renderUserItem}
                                    />
                                    {field.state.value.length > 0 && (
                                        <AddUserButton
                                            type="button"
                                            $enabled={!!selectedUser}
                                            disabled={!selectedUser}
                                            onClick={handleAddUserList}
                                        >
                                            <UserPlus size={16} />
                                        </AddUserButton>
                                    )}
                                </SearchRow>
                                <UserListArea>
                                    {localAssignees.length > 0 && (
                                        <UserCard>
                                            {localAssignees.map(user => (
                                                <UserCardItem key={user.id}>
                                                    <UserCardInfo>
                                                        <UserCardName>{user.name} - {user.id}</UserCardName>
                                                        <UserCardRole>{user.email} {user.role}</UserCardRole>
                                                    </UserCardInfo>
                                                    <UserCardClose type="button">
                                                        <X size={12} onClick={() => handleRemoveAssignee(user.id)} />
                                                    </UserCardClose>
                                                </UserCardItem>
                                            ))}
                                        </UserCard>)}
                                </UserListArea>
                            </FieldGroup>
                        )}
                    </form.Field>
                </DialogBody>

                <DialogActions>
                    <DialogClose asChild>
                        <Button variant="outline">ביטול</Button>
                    </DialogClose>
                    <GradientButton type="button" onClick={handleSubmit}>{isUpdate ? 'שמור' : 'צור'}</GradientButton>
                </DialogActions>
            </WideDialogContent>
        </Dialog>
    )
}


const StyledDialogDescription = styled(DialogDescription)`
  direction: rtl;
  text-align: start;
  font-size: 18px;
  color: var(--text-color);
  line-height: 24px;
`

const UserCard = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: flex-start;
`

const UserCardItem = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 1px 8px;
    background: rgba(0, 0, 0, 0.02);
    border: 1px solid var(--card-border);
    border-radius: 4px;
`

const UserCardInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    overflow: hidden;
    word-wrap: break-word;
    text-overflow: ellipsis;
    gap: 2px;
    text-align: end;
`

const UserCardName = styled.span`
    font-size: 14px;
    font-weight: 500;
    color: var(--sea-ink);
    line-height: 1.4;
`

const UserCardRole = styled.span`
    font-size: 12px;
    color: var(--sea-ink-soft);
    line-height: 1.4;
`

const UserCardClose = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px;
    color: var(--sea-ink-soft);
    flex-shrink: 0;

    &:hover {
        color: var(--sea-ink);
    }
`

const WideDialogContent = styled(DialogContent)`
  max-width: 600px;
  padding: 36px 48px;
  text-align: end;
  justify-items: flex-start;
`

const DialogTitleLarge = styled(DialogTitle)`
  font-size: 42px;
  font-weight: 600;
  line-height: 50px;
  color: var(--sea-ink);
  margin-block-end: 4px;
`

const DialogBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
`

const FieldLabel = styled.span`
  font-size: 20px;
  font-weight: 400;
  color: var(--sea-ink);
  line-height: 28px;
`

const StyledPopoverContent = styled(PopoverContent)`
    max-width: max-content;
`

const ColorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-start;
  width: 100%;
`

const ColorLabel = styled.span`
  font-size: 16px;
  color: var(--text-color);
  line-height: 22px;
`

const ColorSwatchContainer = styled.div`
  background: var(--backround);
  border: 1px solid var(--card-border);
  border-radius: 100px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ColorSwatch = styled.div<{ $color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  cursor: pointer;
  flex-shrink: 0;
  
`

const ColorPickerPopup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  width: 144px;
  align-items: flex-start;
  align-content: flex-start;
`

const ColorGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
`

const ColorOption = styled.div<{ $color: string; $selected: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 40px;
  background: ${({ $color }) => $color};
  cursor: pointer;
  flex-shrink: 0;
  outline: ${({ $selected }) => $selected ? '2px solid var(--sea-ink)' : 'none'};
  outline-offset: 2px;

  &:hover {
    opacity: 0.85;
  }
`

const OtherColorLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding-inline: 7px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.04);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.88);
  cursor: pointer;
  white-space: nowrap;
  position: relative;
`

const HiddenColorInput = styled.input`
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
`

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`

const AddUserButton = styled.button<{ $enabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 32px;
  height: 32px;

  cursor: ${({ $enabled }) => ($enabled ? 'pointer' : '')};

  border-radius: 8px;
  border: 1px solid #D9D9D9;

  background: ${({ $enabled }) => ($enabled ? 'linear-gradient(135deg, #615FFF 0%, #9810FA 100%);' : 'rgba(0, 0, 0, 0.04)')};
`

const UserListArea = styled.div`
  min-height: 127px;
  max-height: 127px;
  width: 100%;
  
  overflow-y: auto;

  scrollbar-width: thin;

  border-radius: 8px;
  background-color: var(--background-area);
  padding: 8px;
`

const DialogActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-block-start: 4px;
  padding-inline-end: 4px;
  justify-self: stretch;
`

const GradientButton = styled.button`
  height: 40px;
  min-width: 80px;
  padding-inline: 15px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: linear-gradient(153deg, #615fff 0%, #9810fa 100%);
  color: white;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  flex-shrink: 0;
`

const AssigneeUserName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: var(--sea-ink);
`

const AssigneeUserMeta = styled.span`
  font-size: 12px;
  color: var(--sea-ink-soft);
`