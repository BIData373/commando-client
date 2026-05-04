import styled from '@emotion/styled'
import { ChevronDown } from 'lucide-react'
import AssigneePicker from '../shared/AssigneePicker'
import type { TaskRow, TaskTableMeta } from '../CreateTasksFromDiscussion/TasksColumns'
import type { AvatarColor } from '../Tasks/ResponsibleCell'
import { MOCK_ASSIGNEES } from '#/data/Assignees'

interface AssigneeTableCellProps {
  row: TaskRow
  meta: TaskTableMeta
}

function AssigneeTableCell({ row, meta }: AssigneeTableCellProps) {
  const assigneeIds = row.assigneeIds
  const hasMultiple = assigneeIds.length > 1
  const isExpanded = meta.expandedRows.has(row.id)

  function handleToggleAssignee(assigneeId: number) {
    const isRemoving = assigneeIds.includes(assigneeId)
    const nextIds = isRemoving
      ? assigneeIds.filter((id) => id !== assigneeId)
      : [...assigneeIds, assigneeId]

    const nextDetails = { ...row.assigneeDetails }

    if (isRemoving) {
      delete nextDetails[assigneeId]
    }

    meta.updateRow(row.id, {
      assigneeIds: nextIds,
      assigneeDetails: nextDetails,
    })
  }

  if (hasMultiple && !isExpanded) {
    return (
      <CollapsedAssigneeButton type="button" onClick={() => meta.toggleRowExpansion(row.id)}>
        <ChevronDown size={16} />
        <CollapsedAssigneeLabel>{assigneeIds.length} אחראים</CollapsedAssigneeLabel>
      </CollapsedAssigneeButton>
    )
  }

  return (
    <AssigneeCellOuter $highlighted={hasMultiple && isExpanded}>
      <AssigneePicker
        selectedAssignees={assigneeIds}
        onToggle={handleToggleAssignee}
        trigger={() => (
          <CompactTriggerButton type="button">
            <CompactChevron size={16} />

            {hasMultiple ? (
              <CompactAvatarStack>
                {assigneeIds.map((id) => {
                  const assignee = MOCK_ASSIGNEES[id]
                  if (!assignee) return null

                  return (
                    <CompactStackedAvatar key={id} $color={assignee.colorToken}>
                      {assignee.initials}
                    </CompactStackedAvatar>
                  )
                })}
              </CompactAvatarStack>
            ) : assigneeIds.length === 1 ? (
              <AssigneeTag>
                <AssigneeTagRole>
                  {MOCK_ASSIGNEES[assigneeIds[0]]?.role}
                </AssigneeTagRole>
                <AssigneeTagAvatar
                  $color={MOCK_ASSIGNEES[assigneeIds[0]]?.colorToken}
                >
                  {MOCK_ASSIGNEES[assigneeIds[0]]?.initials}
                </AssigneeTagAvatar>
              </AssigneeTag>
            ) : (
              <CompactLabel>בחר אחראי</CompactLabel>
            )}
          </CompactTriggerButton>
        )}
      />
    </AssigneeCellOuter>
  )
}

export default AssigneeTableCell

const AssigneeCellOuter = styled.div<{ $highlighted: boolean }>`
  display: flex;
  align-items: center;
  height: 100%;
  margin: 0 -12px;
  padding: 0 12px;
  ${({ $highlighted }) =>
    $highlighted ? 'outline: 1px solid #4096ff; outline-offset: -1px;' : ''}
`

const CollapsedAssigneeButton = styled.button`
  direction: ltr;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
`

const CollapsedAssigneeLabel = styled.span`
  direction: rtl;
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.88);
  white-space: nowrap;
`

const CompactTriggerButton = styled.button`
  direction: ltr;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  cursor: pointer;
`

const CompactChevron = styled(ChevronDown)`
  color: rgba(0, 0, 0, 0.25);
  flex-shrink: 0;
`

const CompactLabel = styled.span`
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.25);
  white-space: nowrap;
  text-align: end;
`

const CompactAvatarStack = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
`

const CompactStackedAvatar = styled.div<{ $color?: AvatarColor }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 10px;
  color: rgba(0, 0, 0, 0.88);
  border: 1.5px solid white;
  margin-inline-start: -6px;

  &:last-of-type {
    margin-inline-start: 0;
  }

  ${({ $color }) => getAvatarBackground($color)}
`

const AssigneeTag = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 4px;
`

const AssigneeTagRole = styled.span`
  font-size: 12px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.88);
  white-space: nowrap;
`

const AssigneeTagAvatar = styled.div<{ $color?: AvatarColor }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  font-size: 9.5px;
  color: rgba(0, 0, 0, 0.88);
  flex-shrink: 0;

  ${({ $color }) => getAvatarBackground($color)}
`

function getAvatarBackground(color?: AvatarColor) {
  switch (color) {
    case 'cyan':
      return 'background: #87e8de;'
    case 'blue':
      return 'background: #91caff;'
    case 'green':
      return 'background: #b7eb8f;'
    case 'orange':
      return 'background: #ffd591;'
    case 'gray':
      return 'background: #f5f5f5;'
    default:
      return 'background: #f5f5f5;'
  }
}