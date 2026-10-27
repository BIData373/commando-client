import styled from "@emotion/styled"
import type { CellContext } from "@tanstack/react-table"
import type { TaskRowDto } from "src/api/model"
import type { AppTableFeatures } from "src/consts/table-features"
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip"

export function LastMessageCell<TTask extends TaskRowDto, TValue>({
	row: {
		original: { lastMessage, messageCount },
	},
}: CellContext<AppTableFeatures, TTask, TValue>) {
	const userName = lastMessage?.user?.info?.name ?? lastMessage?.user?.info?.upn
	const text = userName
		? `${userName}: ${lastMessage.content}`
		: (lastMessage?.content ?? "")

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<CommentCell>
					<CommentText>{text}</CommentText>
					{messageCount > 1 && <CommentCount>({messageCount})</CommentCount>}
				</CommentCell>
			</TooltipTrigger>
			{text && <CommentTooltip>{text}</CommentTooltip>}
		</Tooltip>
	)
}

const CommentCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  overflow: hidden;
  width: 100%;
  height: var(--table-row-height, 100%);
  position: sticky;
  top: var(--table-header-height, 0px);
`

const CommentCount = styled.span`
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-400);
  flex-shrink: 0;
  opacity: 0;

  ${CommentCell}:hover & {
    opacity: 1;
  }
`

const CommentTooltip = styled(TooltipContent)`
  background: var(--Components-Tooltip-Global-colorBgSpotlight);
  border-radius: 6px;
  padding: 6px 8px;
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--background);
  text-align: start;
  max-width: 300px;
`

const CommentText = styled.span`
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 16px;
  color: var(--text-color-2);
  text-align: start;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`
