import { useRef, useState } from 'react'
import styled from '@emotion/styled'
import { X, ChevronDown, Plus, Check } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { MOCK_ASSIGNEES } from '../../data/Assignees'
import type { AvatarColor } from '../Tasks/ResponsibleCell'

// ─── Types ───────────────────────────────────────────────────────────────────

interface AssigneeFieldProps {
  selectedAssignees: number[]
  directiveTitle: string
  onToggle: (id: number) => void
  onRemove: (id: number) => void
  onDetailChange: (id: number, value: string) => void
}

// ─── Component ───────────────────────────────────────────────────────────────

function AssigneeField({
  selectedAssignees,
  directiveTitle,
  onToggle,
  onRemove,
  onDetailChange,
}: AssigneeFieldProps) {
  const [isAssigneeOpen, setIsAssigneeOpen] = useState(false)
  // const [isCreateAssigneeOpen, setIsCreateAssigneeOpen] = useState(false)
  const [search, setSearch] = useState('')
  const detailRefs = useRef<Record<number, HTMLSpanElement | null>>({})

  const assigneesList = Object.values(MOCK_ASSIGNEES)

  const filteredAssignees = assigneesList.filter((assignee) => {
    if (!search.trim()) return true
    return (
      assignee.name.includes(search) ||
      assignee.role.includes(search)
    )
  })

  function handleOpenCreateAssignee() {
    setIsAssigneeOpen(false)
    // setIsCreateAssigneeOpen(true)
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value)
    if (!isAssigneeOpen) setIsAssigneeOpen(true)
  }

  function handleOpenChange(open: boolean) {
    setIsAssigneeOpen(open)
    if (!open) setSearch('')
  }

  function handleDetailInput(id: number, e: React.FormEvent<HTMLSpanElement>) {
    onDetailChange(id, e.currentTarget.textContent ?? '')
  }

  function handleDetailKeyDown(e: React.KeyboardEvent<HTMLSpanElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }

  function handleWrapperClick(id: number) {
    detailRefs.current[id]?.focus()
  }

  function handlePreventAutoFocus(e: Event) {
    e.preventDefault()
  }

  function handleStopWheel(e: React.WheelEvent) {
    e.stopPropagation()
  }

  function handleAssigneeClick(id: number) {
    onToggle(id)
    if (selectedAssignees.length === 0) {
      setIsAssigneeOpen(false)
      setSearch('')
    }
  }

  function handleRemoveClick(id: number) {
    onRemove(id)
  }

  function handleDetailRef(id: number, el: HTMLSpanElement | null) {
    detailRefs.current[id] = el
  }

  return (
    <>
      <AssigneeSection>
        <FormLabelRow>
          <LabelText>אחראי</LabelText>
        </FormLabelRow>
        <Popover open={isAssigneeOpen} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <SelectTriggerButton>
              <SelectChevron size={12} />
              <SearchInput
                value={search}
                onChange={handleSearchChange}
                placeholder="בחירה"
                dir="rtl"
              />
            </SelectTriggerButton>
          </PopoverTrigger>
          <AssigneeDropdown
            align="end"
            sideOffset={4}
            onOpenAutoFocus={handlePreventAutoFocus}
            onWheel={handleStopWheel}
          >
            {filteredAssignees.map((assignee) => (
              <AssigneeOption
                key={assignee.id}
                $selected={selectedAssignees.includes(assignee.id)}
                onClick={() => handleAssigneeClick(assignee.id)}
              >
                <AssigneeOptionEnd>
                  <AvatarCircle $color={assignee.colorToken}>
                    {assignee.initials}
                  </AvatarCircle>

                  <AssigneeOptionName
                    $selected={selectedAssignees.includes(assignee.id)}
                  >
                    {assignee.name}
                  </AssigneeOptionName>
                </AssigneeOptionEnd>

                {selectedAssignees.includes(assignee.id) && (
                  <StyleCheck size={18} />
                )}
              </AssigneeOption>
            ))}
            <CreateNewButton onClick={handleOpenCreateAssignee}>
              צור אחראי חדש
              <Plus size={14} />
            </CreateNewButton>
          </AssigneeDropdown>
        </Popover>

        {selectedAssignees.length === 0 ? (
          <EmptyAssigneesBox>
            <EmptyText>לא נבחרו אחראים. אנא בחר מהרשימה</EmptyText>
          </EmptyAssigneesBox>
        ) : (
          <AssigneeRowsList>
            {selectedAssignees
              .map((id) => MOCK_ASSIGNEES[id])
              .filter(Boolean)
              .map((assignee) => (
                <AssigneeRowItem key={assignee.id}>
                  <RemoveAssigneeButton onClick={() => handleRemoveClick(assignee.id)}>
                    <X size={14} />
                  </RemoveAssigneeButton>

                  <AssigneeRowContainer>
                    {selectedAssignees.length > 1 && (
                      <TextareaWrapper
                        dir="rtl"
                        onClick={() => handleWrapperClick(assignee.id)}
                      >
                        {directiveTitle && (
                          <DirectiveTitleText>
                            {directiveTitle} -&nbsp;
                          </DirectiveTitleText>
                        )}

                        <DetailEditable
                          ref={(el) => handleDetailRef(assignee.id, el)}
                          contentEditable
                          suppressContentEditableWarning
                          onInput={(e) =>
                            handleDetailInput(assignee.id, e)
                          }
                          onKeyDown={handleDetailKeyDown}
                          data-placeholder="פירוט נוסף לאחראי"
                        />
                      </TextareaWrapper>
                    )}

                    <AssigneeInfoBlock>
                      <AssigneeRoleText>{assignee.role}</AssigneeRoleText>
                      <AvatarCircle $color={assignee.colorToken} $size={29}>
                        {assignee.initials}
                      </AvatarCircle>
                    </AssigneeInfoBlock>
                  </AssigneeRowContainer>
                </AssigneeRowItem>
              ))}
          </AssigneeRowsList>
        )}
      </AssigneeSection>

      {/* <CreateAssigneeDialog
        open={isCreateAssigneeOpen}
        onOpenChange={setIsCreateAssigneeOpen}
      /> */}
    </>
  )
}

export default AssigneeField

// ─── Styled Components ──────────────────────────────────────────────────────

const AssigneeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
  width: 100%;
`

const FormLabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  padding-block-end: 8px;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  white-space: nowrap;
`

const LabelText = styled.span`
  color: rgba(0, 0, 0, 0.88);
`

const SelectTriggerButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  padding-inline: 12px;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
  position: relative;

  &:hover {
    border-color: #4096ff;
  }
`

const SelectChevron = styled(ChevronDown)`
  position: absolute;
  inset-inline-start: 12px;
  inset-block-start: 50%;
  transform: translateY(-50%);
  color: rgba(0, 0, 0, 0.25);
`

const SearchInput = styled.input`
  flex: 1;
  font-size: 16px;
  font-weight: 400;
  line-height: 40px;
  text-align: right;
  color: rgba(0, 0, 0, 0.88);
  border: none;
  outline: none;
  background: transparent;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &::placeholder {
    color: rgba(0, 0, 0, 0.25);
  }
`

const AssigneeDropdown = styled(PopoverContent)`
  width: var(--radix-popover-trigger-width);
  max-height: 200px;
  overflow-y: auto;
  padding: 4px;
  gap: 1.5px;
`

const AssigneeOption = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border: none;
  background: ${({ $selected }) => ($selected ? '#e6f4ff' : 'transparent')};
  cursor: pointer;
  border-radius: 2px;

  &:hover {
    background: ${({ $selected }) => ($selected ? '#e6f4ff' : 'rgba(0, 0, 0, 0.04)')};
  }
`

const AssigneeOptionEnd = styled.div`
display: flex;
align-items: center;
gap: 8px;
padding: 0 12px;
height: 32px;
`

const AvatarCircle = styled.div<{ $color: AvatarColor; $size?: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => $size ?? 16}px;
  height: ${({ $size }) => $size ?? 16}px;
  border-radius: 50%;
 font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  color: var(--sea-ink);
  flex-shrink: 0;
  ${({ $color }) => {
    switch ($color) {
      case 'cyan': return 'background: #87e8de;'
      case 'blue': return 'background: #91caff;'
      case 'green': return 'background: #b7eb8f;'
      case 'orange': return 'background: #ffd591;'
      case 'gray': return 'background: #f5f5f5;'
    }
  }}
`

const AssigneeOptionName = styled.span<{ $selected: boolean }>`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: ${({ $selected }) => ($selected ? '#1677ff' : 'rgba(0, 0, 0, 0.88)')};
  white-space: nowrap;
`

const CreateNewButton = styled.button`
  direction: ltr;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  width: 100%;
  padding: 0 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 6px;
  color:rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 32px;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`

const EmptyAssigneesBox = styled.div`
  width: 100%;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const EmptyText = styled.span`
  font-size: 16px;
  font-weight: 400;
  line-height: 40px;
  color: rgba(0, 0, 0, 0.25);
  text-align: center;
`

const AssigneeRowsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`

const AssigneeRowItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`

const RemoveAssigneeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.45);
  flex-shrink: 0;
  padding: 0;

  &:hover {
    color: rgba(0, 0, 0, 0.88);
    background: rgba(0, 0, 0, 0.04);
  }
`

const AssigneeRowContainer = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
  padding: 7px 12px;
  background: #fafafa;
  border: 0.8px solid #f5f5f5;
  border-radius: 8px;
`

const AssigneeInfoBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 161px;
  flex-shrink: 0;
  justify-content: flex-end;
`

const AssigneeRoleText = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.88);
  white-space: nowrap;
  text-align: center;
`

const TextareaWrapper = styled.div`
  flex: 1;
  min-width: 0;
  height: 52px;
  padding: 4px 11px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: white;
  cursor: text;
  box-sizing: border-box;
  overflow-y: auto;
  line-height: 18px;
  
  &:focus-within {
    border-color: #4096ff;
    box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
  }
`

const DirectiveTitleText = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  word-break: break-word;
  pointer-events: none;
`

const DetailEditable = styled.span`
  display: inline-block;
  min-width: 1px;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
  color: rgba(0, 0, 0, 0.88);
  outline: none;
  word-break: break-word;
  caret-color: rgba(0, 0, 0, 0.88);

  &:empty::before {
    content: attr(data-placeholder);
    color: rgba(0, 0, 0, 0.25);
  }
`
const StyleCheck = styled(Check)`
  color: #1677ff;
`