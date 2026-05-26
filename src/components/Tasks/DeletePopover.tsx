import styled from "@emotion/styled"
import { CircleAlert } from "lucide-react"
import { type ReactNode, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

interface DeletePopoverProps {
	count: number
	trigger: ReactNode
	side?: "top" | "bottom"
	align?: "center" | "start" | "end"
	onConfirm: () => void
}

export function DeletePopover({
	count,
	trigger,
	side = "top",
	align = "center",
	onConfirm,
}: DeletePopoverProps) {
	const [open, setOpen] = useState(false)

	function handleConfirm() {
		setOpen(false)
		onConfirm()
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>{trigger}</PopoverTrigger>
			<Content side={side} sideOffset={12} align={align}>
				<Head>
					<TextWrapper>
						<Title>מחיקת {count} הנחיות</Title>
						<Description>.שים לב לא ניתן לבטל פעולה זו</Description>
					</TextWrapper>
					<IconWrapper>
						<CircleAlert size={16} />
					</IconWrapper>
				</Head>
				<Actions>
					<DeleteButton onClick={handleConfirm}>מחק הנחיות</DeleteButton>
					<CancelButton onClick={() => setOpen(false)}>ביטול</CancelButton>
				</Actions>
			</Content>
		</Popover>
	)
}

const Content = styled(PopoverContent)`
  direction: ltr;
  width: 326px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-radius: 4px;
  background: white;
  box-shadow:
    0px 6px 16px 0px rgba(0, 0, 0, 0.08),
    0px 3px 6px -4px rgba(0, 0, 0, 0.12),
    0px 9px 28px 8px rgba(0, 0, 0, 0.05);
`

const Head = styled.div`
  display: flex;
  gap: 8px;
  align-items: start;
  justify-content: flex-end;
`

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 0;
  gap: 4px;
  text-align: end;
`

const Title = styled.p`
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.88);
`

const Description = styled.p`
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.88);
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-block: 2px;
  color: #faad14;
  flex-shrink: 0;
`

const Actions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding-inline: 8px;
  border: none;
  border-radius: 2px;
  background: #ff4d4f;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: white;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #ff7875;
  }
`

const CancelButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding-inline: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  background: white;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.88);
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    border-color: #4096ff;
    color: #4096ff;
  }
`
