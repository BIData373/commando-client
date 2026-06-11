import styled from "@emotion/styled"
import { X } from "lucide-react"
import { useRef } from "react"
import { useListAssignees } from "src/api/assignee/assignee"
import type { WorkspaceStatusDto } from "src/api/model"
import { StatusDropdown } from "../Tasks/StatusDropdown"
import { AssigneeAvatar } from "./AssigneeAvatar"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AssigneeExtra {
	status?: WorkspaceStatusDto
	description?: string
}

interface AssigneeRowListProps {
	workspaceId: number
	assigneeIds: number[]
	directiveTitle: string
	assigneeExtras?: Record<number, AssigneeExtra>
	showDetail?: boolean
	detailPlaceholder?: string
	onDetailChange: (id: number, value: string) => void
	onRemove: (id: number) => void
	onStatusChange?: (
		taskId: number,
		assigneeId: number,
		statusId: number,
	) => void
	taskId?: number
}

// ─── Component ──────────────────────────────────────────────────────────────

function AssigneeRowList({
	workspaceId,
	assigneeIds,
	directiveTitle,
	assigneeExtras,
	showDetail = true,
	detailPlaceholder = "פירוט לאחראי",
	onDetailChange,
	onRemove,
	onStatusChange,
	taskId,
}: AssigneeRowListProps) {
	const detailRefs = useRef<Record<number, HTMLSpanElement | null>>({})

	const { data: assignees } = useListAssignees({ workspaceId })

	const filteredAssignees = (assignees ?? []).filter(({ id }) =>
		assigneeIds.includes(id),
	)

	function handleDetailInput(id: number, e: React.FormEvent<HTMLSpanElement>) {
		onDetailChange(id, e.currentTarget.textContent ?? "")
	}

	function handleDetailKeyDown(e: React.KeyboardEvent<HTMLSpanElement>) {
		if (e.key === "Enter") {
			e.preventDefault()
		}
	}

	function handleWrapperClick(id: number) {
		detailRefs.current[id]?.focus()
	}

	function handleDetailRef(id: number, el: HTMLSpanElement | null) {
		detailRefs.current[id] = el

		if (el && assigneeExtras?.[id]?.description && !el.textContent) {
			el.textContent = assigneeExtras[id].description!
		}
	}

	return (
		<RowsList>
			{filteredAssignees.map((assignee) => (
				<RowItem key={assignee.id}>
					<RemoveButton onClick={() => onRemove(assignee.id)}>
						<X size={14} />
					</RemoveButton>

					<RowContainer>
						{showDetail && (
							<TextareaWrapper onClick={() => handleWrapperClick(assignee.id)}>
								{directiveTitle && (
									<DirectiveTitleText>
										{directiveTitle} -&nbsp;
									</DirectiveTitleText>
								)}

								<DetailEditable
									ref={(el) => handleDetailRef(assignee.id, el)}
									contentEditable
									suppressContentEditableWarning
									onInput={(e) => handleDetailInput(assignee.id, e)}
									onKeyDown={handleDetailKeyDown}
									data-placeholder={detailPlaceholder}
								/>
							</TextareaWrapper>
						)}

						{assigneeExtras?.[assignee.id]?.status &&
							onStatusChange &&
							taskId != null && (
								<StatusDropdown
									status={assigneeExtras[assignee.id].status!}
									taskId={taskId}
									assigneeId={assignee.id}
									workspaceId={workspaceId}
									onUpdate={onStatusChange}
									withArrow={true}
								/>
							)}

						<InfoBlock>
							<RoleText>{assignee.name}</RoleText>

							<AssigneeAvatar assignee={assignee} />
						</InfoBlock>
					</RowContainer>
				</RowItem>
			))}
		</RowsList>
	)
}

export default AssigneeRowList

// ─── Styled Components ──────────────────────────────────────────────────────

const RowsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`

const RowItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`

const RemoveButton = styled.button`
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

const RowContainer = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
  padding: 7px 12px;
  background: #fafafa;
  border: 0.8px solid var(--colors-base-neutral-3);
  border-radius: 8px;
`

const TextareaWrapper = styled.div`
  direction: rtl;
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
  font-size: var(--fs-btn);
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
  font-size: var(--fs-btn);
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

const InfoBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 161px;
  flex-shrink: 0;
  justify-content: flex-end;
  min-width: 0;
`

const RoleText = styled.span`
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.88);
  white-space: nowrap;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
`
