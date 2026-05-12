import styled from '@emotion/styled'
import { useForm } from '@tanstack/react-form'
import { UserPlus } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useCreateAssignee, useUpdateAssignee } from '#/hooks/useAssignees'
import { type IMesibaIcon, useMesibaIconByName } from '#/hooks/useMesiba'
import { useUsers } from '#/hooks/useUsers'
import type { IAssignee, IUser } from '#/types'
import { concatName } from '#/utils/userUtils'
import { PrimaryButton } from '../shared/PrimaryButton'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { ColorPicker, PRESET_COLORS } from './ColorPicker'
import { DropdownUsers } from './DropdownUsers'
import { IconDropdown } from './IconDropdown'
import { UsersLists } from './UsersLists'

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

    const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
    const [localAssignees, setLocalAssignees] = useState<IUser[]>([])
    const [submitError, setSubmitError] = useState<string | null>(null)

    const [iconSearch, setIconSearch] = useState('')
    const [selectedIcon, setSelectedIcon] = useState<IMesibaIcon | null>(null)

    const { data: existingIcon } = useMesibaIconByName(assignee?.emblem ?? '')

    useEffect(() => {
        if (existingIcon) setSelectedIcon(existingIcon)
    }, [existingIcon])

    const randomColor = useMemo(() => {
        if (!open) return
        const randomColorIdx = Math.floor(Math.random() * (PRESET_COLORS.length - 1))
        return PRESET_COLORS[randomColorIdx]
    }, [open]) ?? ''

    const form = useForm({
        defaultValues: {
            name: assignee?.name ?? '',
            color: assignee?.color ?? randomColor,
            emblem: assignee?.emblem ?? '',
            userSearch: '',
        },
        onSubmit: async ({ value }) => {
            const payload = {
                name: value.name.trim(),
                color: value.color,
                emblem: value.emblem || null,
                userIds: localAssignees.map((u) => u.id),
            }
            try {
                if (assignee) {
                    await updateAssignee.mutateAsync({ assigneeId: assignee.id, data: payload })
                } else {
                    await createAssignee.mutateAsync(payload)
                }
                onOpenChange(false)
            } catch {
                setSubmitError('אירעה שגיאה, נסה שנית')
            }
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

    function handleSearchSelect(user: IUser) {
        if (user) {
            form.setFieldValue('userSearch', concatName(user))
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

    function handleIconSelect(icon: IMesibaIcon) {
        form.setFieldValue('emblem', icon.iconName)
        setSelectedIcon(icon)
        setIconSearch('')
    }

    function handleIconClear() {
        form.setFieldValue('emblem', '')
        setSelectedIcon(null)
        setIconSearch('')
    }

    const resetForm = useCallback(() => {
        const savedAssignees = assignee ? users.filter(u => assignee.userIds.includes(u.id)) : []
        setLocalAssignees(savedAssignees)
        setSubmitError(null)
        setIconSearch('')
        setSelectedIcon(existingIcon ?? null)
        form.reset()
    }, [assignee, users, form.reset, existingIcon])

    const scrollRef = useRef<HTMLDivElement>(null)
    const [scrollShadow, setScrollShadow] = useState({ top: false, bottom: false })

    function handleScroll() {
        const el = scrollRef.current
        if (!el) return
        const atTop = el.scrollTop <= 0
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1
        setScrollShadow({ top: !atTop, bottom: !atBottom })
    }

    function handleOpenChange(open: boolean) {
        resetForm()
        onOpenChange(open)
    }

    useEffect(() => {
        resetForm()
    }, [resetForm])

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <WideDialogContent>
                <DialogHeader $shadow={scrollShadow.top}>
                    <DialogTitleLarge>{isUpdate ? 'עריכת אחראי' : 'יצירת אחראי'}</DialogTitleLarge>
                    <StyledDialogDescription>
                        'אחראי' אליו ניתן לשייך הנחיות.
                        <br />
                        לכל אחראי ניתן לכתב מספר משתמשים, אשר יקבלו את ההנחיות לאזור האישי שלהם.
                    </StyledDialogDescription>
                </DialogHeader>

                <ScrollableContent ref={scrollRef} onScroll={handleScroll}>
                    <DialogBody>
                        <form.Field
                            name="name"
                            validators={{ onSubmit: ({ value }) => !value.trim() ? 'שם אחראי הוא שדה חובה' : undefined }}
                        >
                            {(field) => (
                                <FieldGroup>
                                    <FieldLabel>שם אחראי</FieldLabel>
                                    <Input
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder='לדוגמה: מג"ד, רע"ן מפקדים, קמב"צ...'
                                    />
                                    {field.state.meta.errors.length > 0 && (
                                        <ErrorText>{field.state.meta.errors[0]}</ErrorText>
                                    )}
                                </FieldGroup>
                            )}
                        </form.Field>

                        <FieldGroup>
                            <EitherOrRow>
                                <form.Subscribe selector={(s) => s.values.color}>
                                    {(color) => (
                                        <ColorRow>
                                            <ColorLabel>בחר צבע לאחראי</ColorLabel>
                                            <ColorPicker
                                                selectedColor={color}
                                                onChange={handleColorChange}
                                            />
                                        </ColorRow>
                                    )}
                                </form.Subscribe>
                                <OrSeparator>או</OrSeparator>
                                <EmblemSection>
                                    <IconDropdown
                                        value={iconSearch}
                                        onChange={setIconSearch}
                                        onSelect={handleIconSelect}
                                        onClear={handleIconClear}
                                        selectedItem={selectedIcon ?? undefined}
                                    />
                                </EmblemSection>
                            </EitherOrRow>
                            {submitError && <ErrorText>{submitError}</ErrorText>}
                        </FieldGroup>

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
                                    <UsersLists users={localAssignees} onRemove={handleRemoveAssignee} />
                                </FieldGroup>
                            )}
                        </form.Field>
                    </DialogBody>
                </ScrollableContent>

                <DialogActions $shadow={scrollShadow.bottom}>
                    <DialogClose asChild>
                        <CancelButton>ביטול</CancelButton>
                    </DialogClose>
                    <PrimaryButton
                        title={isUpdate ? 'שמור' : 'צור'}
                        onClick={form.handleSubmit}
                    />
                </DialogActions>
            </WideDialogContent>
        </Dialog >
    )
}

const WideDialogContent = styled(DialogContent)`
  max-width: 700px;
  max-height: 70vh;
  padding: 26px 38px;
  text-align: end;
  justify-items: flex-start;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 500;
`

const DialogTitleLarge = styled(DialogTitle)`
  text-align: right;
  font-size: 38px;
  font-weight: 500;
  line-height: 1.2;
  color: var(--sea-ink);
`

const StyledDialogDescription = styled(DialogDescription)`
  direction: rtl;
  text-align: start;
  font-size: 16px;
  color: var(--text-color);
  font-weight: 400;
  line-height: 1.4;
`

const ScrollableContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`

const CancelButton = styled.button`
  height: 40px;
  padding: 0 15px;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  border: 1px solid #D9D9D9;
  border-radius: 8px;
  transition: color, border  0.2s ease-in-out;

  &:hover {
    color: var(--button-color-hover);
    border: 1px solid var(--button-color-hover);
  }
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
  line-height: 1.4;
`

const EitherOrRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  direction: rtl;
`

const EmblemSection = styled.div`
  max-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0;
`

const OrSeparator = styled.span`
  font-size: 16px;
  color: rgba(0, 0, 0, 0.25);
  flex-shrink: 0;
  line-height: 24px;
`

const ColorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`

const ColorLabel = styled.span`
  font-size: 16px;
  color: var(--text-color);
  line-height: 22px;
  white-space: nowrap;
`

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`

const DialogHeader = styled.div<{ $shadow: boolean }>`
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  clip-path: inset(0 0 -20px 0);
  transition: box-shadow 200ms ease;
  box-shadow: ${({ $shadow }) => ($shadow ? '0px 10px 20px 0px rgba(0, 0, 0, 0.06)' : 'none')};
`

const DialogActions = styled.div<{ $shadow: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-block-start: 4px;
  padding-inline-end: 4px;
  justify-self: stretch;
  position: relative;
  z-index: 1;
  clip-path: inset(-20px 0 0 0);
  transition: box-shadow 200ms ease;
  box-shadow: ${({ $shadow }) => ($shadow ? '0px -10px 20px 0px rgba(0, 0, 0, 0.06)' : 'none')};
`


const ErrorText = styled.span`
  font-size: 13px;
  color: var(--color-error, #ef4444);
  line-height: 18px;
`

const AddUserButton = styled.button<{ $enabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 6px;
  border: 1px solid var(--line);
  color: ${({ $enabled }) => $enabled ? 'var(--background)' : 'rgba(0, 0, 0, 0.25)'};
  cursor: ${({ $enabled }) => ($enabled ? 'pointer' : 'default')};
  background: ${({ $enabled }) => ($enabled ? 'linear-gradient(135deg, #615FFF 0%, #9810FA 100%)' : 'rgba(0, 0, 0, 0.04)')};
`