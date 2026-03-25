import { type FakeUser } from '#/routes/workspace/$urlName/settings/permissions'
import styled from '@emotion/styled'
import { useForm } from '@tanstack/react-form'
import { Search, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

const PRESET_COLORS = [
    '#00474f', '#006d75', '#08979c', '#5cdbd3',
    '#135200', '#237804', '#7cb305', '#95de64',
    '#2f54eb', '#85a5ff', '#531dab', '#9254de',
    '#ad4e00', '#d48806', '#d4b106', '#faad14',
    '#d4380d', '#fa541c', '#ff7a45', '#ffec3d',
    '#9e1068', '#eb2f96', '#ff85c0', '#8c8c8c',
]

interface AssigneeInfo {
    name: string
    color: string
}

interface AssigneeDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    assignees?: FakeUser[]
    assignee?: AssigneeInfo
}

export function AssigneeDialog({ assignees, assignee, open, onOpenChange }: AssigneeDialogProps) {
    const isUpdate = !!assignee

    const form = useForm({
        defaultValues: {
            name: assignee?.name ?? '',
            color: assignee?.color ?? '#3B82F6',
            userSearch: '',
        },
        onSubmit: async () => {

        },
    })

    async function handleSubmit() {
        onOpenChange(false)
        await form.handleSubmit();
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
                                <InputGroup>
                                    <InputGroupAddon align="inline-start">
                                        <Search size={16} />
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="חפש שם/ תפקיד/ מספר אישי"
                                    />
                                </InputGroup>
                                <UserListArea>
                                    {assignees && <UserCard>
                                        {assignees.map(user => (
                                            <UserCardItem key={user.id}>
                                                <UserCardInfo>
                                                    <UserCardName>{user.name} - {user.personalId}</UserCardName>
                                                    <UserCardRole>{user.unit} {user.jobTitle}</UserCardRole>
                                                </UserCardInfo>
                                                <UserCardClose type="button"><X size={12} /></UserCardClose>
                                            </UserCardItem>
                                        ))}
                                    </UserCard>
                                    }
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
  color: rgba(0, 0, 0, 0.65);
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
    border: 1px solid #D9D9D9;
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
  color: rgba(0, 0, 0, 0.65);
  line-height: 22px;
`

const ColorSwatchContainer = styled.div`
  background: white;
  border: 1px solid #d9d9d9;
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

const UserListArea = styled.div`
  min-height: 127px;
  max-height: 127px;
  width: 100%;
  
  overflow-y: auto;

  scrollbar-width: thin;

  border-radius: 8px;
  background-color: #fafafa;
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