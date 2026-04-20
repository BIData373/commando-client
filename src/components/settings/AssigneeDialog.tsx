import styled from '@emotion/styled'
import { useForm } from '@tanstack/react-form'
import { UserPlus } from 'lucide-react'
import { useState } from 'react'
import { useCreateAssignee, useUpdateAssignee } from '#/hooks/useAssignees'
import { useUsers } from '#/hooks/useUsers'
import type { IAssignee, IUser } from '#/types'
import { concatName } from '#/utils/userUtils'
import { Button } from '../ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { ColorPicker } from './ColorPicker'
import { DropdownUsers } from './DropdownUsers'
import { UserLists } from './UserLists'

const DEFAULT_COLOR = '#3B82F6'

interface AssigneeDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    assignee?: IAssignee
}

export function AssigneeDialog({ assignee, open, onOpenChange }: AssigneeDialogProps) {
    const isUpdate = !!assignee

    const createAssignee = useCreateAssignee()
    const updateAssignee = useUpdateAssignee()
    const { data: users = [] } = useUsers()

    const initialAssignees = assignee
        ? users.filter(u => assignee.userIds.includes(u.id))
        : []
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
    const [localAssignees, setLocalAssignees] = useState<IUser[]>(initialAssignees)

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
            if (assignee) {
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
        setLocalAssignees(prev => prev.filter(u => u.id !== id))
    }

    function handleSearchSelect(user: IUser | null) {
        if (user) {
            const userConcatName = concatName(user)
            form.setFieldValue('userSearch', userConcatName)
        }
        setSelectedUser(user)
    }

    function handleSearchClear() {
        form.setFieldValue('userSearch', '')
        setSelectedUser(null)
    }

    function handleColorChange(color: string) {
        form.setFieldValue('color', color)
    }

    function handleInteractOutside() {
        const savedAssignees = assignee
            ? users.filter(u => assignee.userIds.includes(u.id))
            : []
        setLocalAssignees(savedAssignees)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <WideDialogContent onInteractOutside={handleInteractOutside}>
                <DialogTitleLarge>{isUpdate ? 'עריכת אחראי' : 'יצירת אחראי'}</DialogTitleLarge>
                <StyledDialogDescription>
                    'אחראי' אליו ניתן לשייך הנחיות.
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
                                <ColorPicker
                                    selectedColor={field.state.value}
                                    onChange={handleColorChange}
                                />
                                <ColorLabel>צבע לאחראי</ColorLabel>
                            </ColorRow>
                        )}
                    </form.Field>

                    <form.Field name="userSearch">
                        {(field) => (
                            <FieldGroup>
                                <FieldLabel>הוספת משתמשים מכותבים</FieldLabel>
                                <SearchRow>
                                    <DropdownUsers
                                        value={field.state.value}
                                        onChange={field.handleChange}
                                        onSelect={handleSearchSelect}
                                        onClear={handleSearchClear}
                                        placeholder='חפש שם/ תפקיד/ מספר אישי'
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
                                <UserLists users={localAssignees} onRemove={handleRemoveAssignee} />
                            </FieldGroup>
                        )}
                    </form.Field>
                </DialogBody>

                <DialogActions>
                    <DialogClose asChild>
                        <Button variant="outline">ביטול</Button>
                    </DialogClose>
                    <GradientButton type="button" onClick={form.handleSubmit}>{isUpdate ? 'שמור' : 'צור'}</GradientButton>
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

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
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

const AddUserButton = styled.button<{ $enabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 8px;
  border: 1px solid var(--line);
  cursor: ${({ $enabled }) => ($enabled ? 'pointer' : 'default')};
  background: ${({ $enabled }) => ($enabled ? 'linear-gradient(135deg, #615FFF 0%, #9810FA 100%)' : 'var(--chip-bg)')};
`
