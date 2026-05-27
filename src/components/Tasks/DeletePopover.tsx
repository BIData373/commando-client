import styled from "@emotion/styled";
import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface DeletePopoverProps {
	count: number;
	trigger?: ReactNode;
	side?: "top" | "bottom" | "left" | "right";
	align?: "center" | "start" | "end";
	onConfirm: () => void;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DeletePopover({
	count,
	trigger,
	side = "top",
	align = "center",
	onConfirm,
	open,
	onOpenChange,
}: DeletePopoverProps) {
	function handleCancel() {
		onOpenChange(false);
	}

	function handleConfirm() {
		onOpenChange(false);
		onConfirm();
	}

	return (
		<Popover open={open}>
			<PopoverTrigger asChild>{trigger}</PopoverTrigger>
			<Content side={side} sideOffset={12} align={align}>
				<Head>
					<TextWrapper>
						<Title>
							{count === 1 ? "מחיקת הנחיה" : `מחיקת ${count} הנחיות`}
						</Title>
						<Description>.שים לב לא ניתן לבטל פעולה זו</Description>
					</TextWrapper>
					<IconWrapper>
						<CircleAlert size={16} />
					</IconWrapper>
				</Head>
				<Actions>
					<DeleteButton onClick={handleConfirm}>
						{count === 1 ? "מחק הנחיה" : "מחק הנחיות"}
					</DeleteButton>
					<CancelButton onClick={handleCancel}>ביטול</CancelButton>
				</Actions>
			</Content>
		</Popover>
	);
}

const Content = styled(PopoverContent)`
  direction: ltr;
  width: 326px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-radius: 4px;
  background: var(--background);
  z-index: 1000;
  box-shadow: var(--card-shadow-hover);
`;

const Head = styled.div`
  display: flex;
  gap: 8px;
  align-items: start;
  justify-content: flex-end;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 0;
  gap: 4px;
  text-align: end;
`;

const Title = styled.p`
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  color: var(--text-color-2);
`;

const Description = styled.p`
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-2);
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-block: 2px;
  color: var(--Warning-color-warning);
  flex-shrink: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding-inline: 8px;
  border: none;
  border-radius: 2px;
  background: var(--Components-Form-Component-labelRequiredMarkColor);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--background);
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: var(--Components-Form-Component-labelRequiredMarkColor);
  }
`;

const CancelButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding-inline: 8px;
  border: 1px solid var(--card-border);
  border-radius: 2px;
  background: var(--background);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-2);
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    border-color: var(--button-color-hover);
    color: var(--button-color-hover);
  }
`;
