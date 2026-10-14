import styled from "@emotion/styled"
import { X } from "lucide-react"
import { useState } from "react"
import { useDeleteMessage, useListMessages } from "src/api/message/message"
import { PermissionType, type TaskWithWorkspaceDto } from "src/api/model"
import { useGetMyPermission } from "src/api/permission/permission"
import { GradientGhostButton } from "src/components/shared/GradientGhostButton"
import { GradientText } from "src/components/shared/GradientText"
import TaskComment from "src/components/shared/TaskComment"
import TaskCommentsSection from "src/components/shared/TaskCommentsSection"
import { Drawer, DrawerContent } from "src/components/ui/drawer"
import { handleSettled } from "src/functions/comment-utils"
import { useCurrentUser } from "src/hooks/useCurrentUser"

interface MobileTaskCommentsProps {
	task: TaskWithWorkspaceDto
}

export function MobileTaskComments({
	task: {
		id,
		workspace: { id: workspaceId },
	},
}: MobileTaskCommentsProps) {
	const [isCommentsOpen, setIsCommentsOpen] = useState(false)
	const { data: messages = [] } = useListMessages({ taskIds: [id] })

	const currentUser = useCurrentUser()

	const { data: permission } = useGetMyPermission({ workspaceId })

	const isManager = permission?.type === PermissionType.MANAGER

	function handleOpenChange() {
		setIsCommentsOpen(!isCommentsOpen)
	}
	const { mutate: deleteMessage } = useDeleteMessage({
		mutation: {
			meta: { toast: { error: true } },
			onSettled: () => handleSettled(id),
		},
	})

	function handleDeleteComment(id: number) {
		deleteMessage({ pathParams: { id } })
	}

	const headerText = `תגובות (${messages.length})`

	return (
		<Wrapper>
			<Header>
				<Title>{headerText}</Title>
				<GradientGhostButton onClick={handleOpenChange}>
					הוספת תגובה
				</GradientGhostButton>
			</Header>
			{messages.length > 0 && (
				<TaskComment
					canDelete={isManager || messages[0].user.upn === currentUser.upn}
					message={messages[0]}
					onDelete={handleDeleteComment}
				/>
			)}
			<ShowMoreButton onClick={handleOpenChange}>
				<GradientText>הצג עוד</GradientText>
			</ShowMoreButton>
			<Drawer open={isCommentsOpen} onOpenChange={handleOpenChange}>
				<StyledDrawerContent>
					<CommentsHeader>
						<CommentsHeaderTitle>{headerText}</CommentsHeaderTitle>
						<CloseButton onClick={handleOpenChange}>
							<X size={16} />
						</CloseButton>
					</CommentsHeader>
					<TaskCommentsSection isManager={isManager} taskId={id} />
				</StyledDrawerContent>
			</Drawer>
		</Wrapper>
	)
}

const Wrapper = styled.section`
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
`

const Header = styled.header`
    display: flex;
    justify-content: space-between;
`

const Title = styled.h2`
    font-size: var(--fs-base);
    font-weight: 500;
    color: black;
`
const StyledDrawerContent = styled(DrawerContent)`
    border: none;
    outline: none;
    & > div:first-of-type {
        display: none;
    }
`
const ShowMoreButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: flex-end;
    position: absolute;
    bottom: 0;
    left: 50%;
    height: 75px;
    width: 100%;
    padding-bottom: 1rem;
    transform: translateX(-50%);
    background: linear-gradient(rgba(255, 255, 255, 0), #ffffff 65%);
`

const CloseButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: var(--sea-ink);
`

const CommentsHeader = styled.header`
    display: flex;
    align-items: center;
    padding: 1.5rem 1.5rem 1rem;
    border-bottom: 1px solid var(--button-hover);
    box-shadow: var(--card-shadow-default);
`

const CommentsHeaderTitle = styled.span`
    align-self: flex-start;
    flex: 1;
    font-size: var(--fs-base);
    font-weight: 400;
    color: var(--sea-ink);
`
