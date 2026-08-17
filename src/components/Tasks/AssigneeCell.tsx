import styled from "@emotion/styled"
import { Popover as PopoverPrimitive } from "radix-ui"
import { memo } from "react"
import type { AssigneeDto, AssigneeStatusDto } from "src/api/model"
import { AssigneeAvatar } from "../shared/AssigneeAvatar"
import { AssigneeDetailPopover } from "../shared/AssigneeDetailPopover"
import { StatusTag } from "../shared/StatusTag"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

//delete after replace assigneeAvatar
export type AvatarColor = "cyan" | "blue" | "green" | "orange" | "gray"

interface AssigneeCellProps {
	responsible: AssigneeDto | null
	otherAssignees: AssigneeStatusDto[]
}

export const AssigneeCell = memo(function AssigneeCell({
	responsible,
	otherAssignees,
}: AssigneeCellProps) {
	const relatedDirectives = otherAssignees.map((s) => ({
		assignee: s.assignee,
		status: s.status,
	}))

	return (
		<CellRoot>
			{responsible && (
				<AssigneeDetailPopover assignee={responsible}>
					<AssigneeAvatar assignee={responsible} cursor />
				</AssigneeDetailPopover>
			)}
			{relatedDirectives.length > 0 && (
				<Popover>
					<PopoverTrigger asChild>
						<AvatarCircle>{relatedDirectives.length}+</AvatarCircle>
					</PopoverTrigger>
					<CompactContent side="top" sideOffset={10} align="center">
						<PopoverArrow width={12} height={6} />
						<CompactList>
							{relatedDirectives.map((d) => (
								<CompactRow key={d.assignee.id}>
									<StatusTag status={d.status} />
									<CompactRole>{d.assignee.name}</CompactRole>
									<AssigneeAvatar assignee={d.assignee} />
								</CompactRow>
							))}
						</CompactList>
					</CompactContent>
				</Popover>
			)}
		</CellRoot>
	)
})

// ─── Cell layout ──────────────────────────────────────────────────────────────

const CellRoot = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

// FIX Use AssigneeAvatar
const AvatarCircle = styled.button<{ $color?: AvatarColor }>`
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
  ${({ $color }) => `background: ${$color ?? "var(--colors-base-neutral-3)"};`}
`

// ─── Shared popover styles ─────────────────────────────────────────────────────

const POPOVER_SHADOW = `
  box-shadow: var(--card-shadow-hover);
`

const PopoverArrow = styled(PopoverPrimitive.Arrow)`
  fill: var(--background);
`

// ─── Compact popover ──────────────────────────────────────────────────────────

const CompactContent = styled(PopoverContent)`
  width: 236px;
  padding: 12px;
  background: var(--background);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  ${POPOVER_SHADOW}
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
