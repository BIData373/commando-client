import styled from "@emotion/styled"
import { PermissionType } from "src/api/model"
import { useListPermissions } from "src/api/permission/permission"
import { useGetWorkspace } from "src/api/workspace/workspace"
import logoWithText from "src/assets/logo-with-text-dark.png"
import { ModalContent } from "src/components/shared/ModalContent"
import { PrimaryButton } from "src/components/shared/PrimaryButton"
import { Dialog } from "src/components/ui/dialog"
import { openUserChat } from "src/utils/redirect-utils"
import { z } from "zod"

interface NoPermissionsModalProps {
	sourceId: number
	onClose: () => void
}

export const noPermissionsSearchSchema = z.object({
	sourceId: z.number(),
})

export default function NoPermissionsModal({
	onClose,
	sourceId,
}: NoPermissionsModalProps) {
	const { data: workspace } = useGetWorkspace({ id: sourceId })
	const { data: permissions = [] } = useListPermissions({
		workspaceId: sourceId,
	})

	const managers =
		permissions
			.filter((permission) => permission.type === PermissionType.MANAGER)
			.map((permission) => permission.user) ?? []

	return (
		<Dialog open>
			<ModalContent showCloseButton={false} headerPadding={0}>
				<ModalContentContainer>
					<Logo src={logoWithText} />
					<div>
						<Title>אין לך הרשאות לסביבת {workspace?.title}</Title>
						<h2>פנה למנהל הסביבה לקבלת הרשאות</h2>
						<ManagerList>
							{managers.map((user) => (
								<li key={user.id}>
									<ManagerLink onClick={() => openUserChat(user)}>
										{user.info?.displayName}
									</ManagerLink>
								</li>
							))}
						</ManagerList>
					</div>
					<PrimaryButton
						onClick={onClose}
						title={"הבנתי, תודה"}
					></PrimaryButton>
				</ModalContentContainer>
			</ModalContent>
		</Dialog>
	)
}

const ModalContentContainer = styled.div`
	width: 90vw;
	display: flex;
	gap: 24px;
	flex-direction: column;
	padding: var(--Components-Notification-Global-paddingMD, 20px) var(--Components-Notification-Global-paddingContentHorizontalLG, 24px);
	align-items: center;
`

const Logo = styled.img`
	height: 26px;
	object-fit: contain;
`

const Title = styled.h1`
font-weight: 500;
`

const ManagerList = styled.ol`
list-style: disc;
list-style-position: inside;
`

const ManagerLink = styled.button`
  color: var(--active-color);
  font-size: var(--fs-lg);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`
