import styled from "@emotion/styled"
import { Send } from "lucide-react"
import { SpinIcon } from "./SpinIcon"

interface CommentSendButtonProps {
	isSending: boolean
	onSend: () => void
}

export function CommentSendButton({
	isSending,
	onSend,
}: CommentSendButtonProps) {
	return (
		<IconContainer
			$withBorder={!isSending}
			disabled={isSending}
			onClick={onSend}
		>
			{isSending ? (
				<SpinIcon size={16} />
			) : (
				<Send size={16} color="var(--active-color)" />
			)}
		</IconContainer>
	)
}

const IconContainer = styled.button<{ $withBorder: boolean }>`
	flex-shrink: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 32px;
	width: 32px;
	border: ${({ $withBorder }) => ($withBorder ? "1px solid var(--active-color)" : "none")};
	border-radius: 8px;
`
