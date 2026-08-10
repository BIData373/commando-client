import styled from "@emotion/styled"
import { Archive, ArchiveX, Trash2, X } from "lucide-react"
import { useState } from "react"
import type { WorkspaceStatusDto } from "src/api/model"
import { StatusTag } from "../shared/StatusTag"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { DeletePopover } from "./DeletePopover"

const ANIMATION_MS = 300

interface BulkActionsBarProps {
	isVisible: boolean
	selectedCount: number
	statuses?: WorkspaceStatusDto[]
	deleteDisabled?: boolean
	statusDisabled?: boolean
	isPersonal?: boolean
	onChangeStatus: (status: WorkspaceStatusDto) => void
	onArchive?: () => void
	onUnarchive?: () => void
	onDelete: () => void
	onExitSelect: () => void
}

export function BulkActionsBar({
	isVisible,
	selectedCount,
	statuses,
	deleteDisabled = false,
	statusDisabled = false,
	onChangeStatus,
	onArchive,
	onUnarchive,
	onDelete,
	onExitSelect,
	isPersonal,
}: BulkActionsBarProps) {
	const [popoverOpen, setPopoverOpen] = useState(false)

	function handleDeleteClick() {
		if (!deleteDisabled) setPopoverOpen(true)
	}

	return (
		<Bar $visible={isVisible}>
			<ActionsSection>
				{!isPersonal && (
					<>
						<DeletePopover
							count={selectedCount}
							onConfirm={onDelete}
							open={popoverOpen}
							onOpenChange={setPopoverOpen}
							trigger={
								<GhostButton
									$danger
									$disabled={deleteDisabled}
									onClick={handleDeleteClick}
								>
									מחק הנחיה
									<Trash2 size={16} />
								</GhostButton>
							}
						/>
						<BarDivider />
					</>
				)}
				{
					<>
						{onArchive && (
							<GhostButton onClick={onArchive}>
								העבר לארכיון
								<Archive size={16} />
							</GhostButton>
						)}
						{onUnarchive && (
							<GhostButton onClick={onUnarchive}>
								הסר מארכיון
								<ArchiveX size={16} />
							</GhostButton>
						)}
					</>
				}
				{!onUnarchive && statuses && (
					<>
						<BarDivider />
						<DropdownMenu>
							<DropdownMenuTrigger asChild disabled={statusDisabled}>
								<GhostButton $disabled={statusDisabled}>עדכן סטטוס</GhostButton>
							</DropdownMenuTrigger>
							<StatusContent align="start" sideOffset={12}>
								{statuses.map((s) => (
									<StatusItem key={s.id} onSelect={() => onChangeStatus(s)}>
										<StatusTag status={s} />
									</StatusItem>
								))}
							</StatusContent>
						</DropdownMenu>
					</>
				)}
			</ActionsSection>
			<SelectedButton onClick={onExitSelect}>
				<X size={16} />
				{selectedCount} משימות נבחרו
			</SelectedButton>
		</Bar>
	)
}

const Bar = styled.div<{ $visible: boolean }>`
  position: fixed;
  bottom: 32px;
  left: 50%;
  min-width: 630px;
  transform: translateX(-50%);
  z-index: var(--z-dropdown);
  direction: ltr;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 11px;
  background: #131629;
  border: 1px solid var(--Border-color-border-secondary);
  border-radius: 8px;
  box-shadow: var(--card-shadow-hover);
  transition: opacity ${ANIMATION_MS}ms ease, visibility ${ANIMATION_MS}ms ease;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? "visible" : "hidden")};
  animation: ${({ $visible }) => ($visible ? `slide-up ${ANIMATION_MS}ms cubic-bezier(0.16, 1, 0.3, 1) both` : "none")};
`

const ActionsSection = styled.div`
  display: flex;
  flex: 1 0 0;
  align-items: center;
  gap: 8px;
`

const GhostButton = styled.button<{ $danger?: boolean; $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 32px;
  padding-inline: 12px;
  border: none;
  border-radius: 2px;
  background: transparent;
  font-size: var(--fs-base);
  font-weight: 400;
  line-height: 22px;
  color: ${({ $danger, $disabled }) =>
		$disabled
			? "var(--Text-color-text-disabled, rgba(255,255,255,0.25))"
			: $danger
				? "var(--Error-color-error)"
				: "var(--Text-color-text)"};
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.45 : 1)};
  white-space: nowrap;
  pointer-events: ${({ $disabled }) => ($disabled ? "none" : "auto")};

  &:hover,
  &[data-state="open"] {
    background: var(--Background-color-bg-text-active-bar);
  }
`

const BarDivider = styled.div`
  width: 1px;
  height: 20px;
  background: var(--Border-color-border);
  flex-shrink: 0;
`

const SelectedButton = styled.button`
direction: rtl;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 32px;
  padding-inline: 15px;
  background: var(--Components-Button-Component-defaultBg);
  border: 1px solid var(--Border-color-border);
  border-radius: 6px;
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--Text-color-text);
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background: var(--Background-color-bg-text-active-bar);
    border-color: var(--Border-color-border);
  }
`

const StatusContent = styled(DropdownMenuContent)`
  min-width: 100px;
  padding: 8px 4px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  box-shadow: var(--card-shadow-hover);
`

const StatusItem = styled(DropdownMenuItem)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  outline: none;

  &[data-highlighted],
  &:hover {
    background: var(--selected-item);
    color: inherit;
  }
`
