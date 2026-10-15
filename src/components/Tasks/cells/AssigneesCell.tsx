import styled from "@emotion/styled"
import type { CellContext } from "@tanstack/react-table"
import { Popover as PopoverPrimitive } from "radix-ui"
import { memo } from "react"
import type { TaskRowDto } from "src/api/model"
import type { AppTableFeatures } from "src/utils/table-features"
import { AssigneeAvatar } from "../../shared/AssigneeAvatar"
import { AssigneeDetailPopover } from "../../shared/AssigneeDetailPopover"
import { StatusTag } from "../../shared/StatusTag"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"

type AssigneesCellProps<TTask extends TaskRowDto, TValue> = CellContext<
	AppTableFeatures,
	TTask,
	TValue
>

function AssigneesCellContent<TTask extends TaskRowDto, TValue>({
	row: {
		original: { assignee, otherAssignees },
	},
}: AssigneesCellProps<TTask, TValue>) {
	if (!assignee) return null

	return (
		<CellRoot>
			<AssigneeDetailPopover assignee={assignee}>
				<AssigneeAvatar assignee={assignee} cursor />
			</AssigneeDetailPopover>
			{otherAssignees && otherAssignees.length > 0 && (
				<Popover>
					<PopoverTrigger asChild>
						<AvatarCircle>{otherAssignees.length}+</AvatarCircle>
					</PopoverTrigger>
					<CompactContent side="top" sideOffset={10} align="center">
						<PopoverArrow width={12} height={6} />
						<CompactList>
							{otherAssignees.map((otherAssignee) => (
								<CompactRow key={otherAssignee.assignee.id}>
									<StatusTag status={otherAssignee.status} />
									<CompactRole>{otherAssignee.assignee.name}</CompactRole>
									<AssigneeAvatar assignee={otherAssignee.assignee} />
								</CompactRow>
							))}
						</CompactList>
					</CompactContent>
				</Popover>
			)}
		</CellRoot>
	)
}

function isSameRow<TTask extends TaskRowDto, TValue>(
	prev: AssigneesCellProps<TTask, TValue>,
	next: AssigneesCellProps<TTask, TValue>,
) {
	return prev.row.original === next.row.original
}

// memo() drops generics; cast back so the column definition keeps its TTask
export const AssigneesCell = memo(
	AssigneesCellContent,
	isSameRow,
) as typeof AssigneesCellContent

// ─── Cell layout ──────────────────────────────────────────────────────────────

const CellRoot = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

// FIX Use AssigneeAvatar
const AvatarCircle = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 29px;
  height: 29px;
  border-radius: 50%;
  font-size: var(--fs-sm);
  font-weight: 400;
  line-height: 20px;
  color: var(--sea-ink);
  flex-shrink: 0;
  cursor: pointer;
  border: none;
  padding: 0;
  background: var(--colors-base-neutral-3);
`

// ─── Popover ──────────────────────────────────────────────────────────────────

const PopoverArrow = styled(PopoverPrimitive.Arrow)`
  fill: var(--background);
`

const CompactContent = styled(PopoverContent)`
  width: 236px;
  padding: 12px;
  background: var(--background);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: var(--card-shadow-hover);
`

const CompactList = styled.div`
  direction: ltr;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 120px;
  overflow-y: auto;
`

const CompactRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-inline-end: 8px;
`

const CompactRole = styled.span`
  direction: rtl;
  font-size: var(--fs-btn);
  color: var(--sea-ink);
  flex: 1;
  min-width: 0;
  text-align: start;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
