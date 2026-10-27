import styled from "@emotion/styled"
import { PermissionType } from "src/api/model"
import { useListPermissions } from "src/api/permission/permission"
import { useGetWorkspace } from "src/api/workspace/workspace"
import denyIcon from "src/assets/icons/deny.svg"
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

	const managers = permissions
		.filter(({ type }) => type === PermissionType.MANAGER)
		.map(({ user }) => user)

	return (
		<Dialog open>
			<Panel showCloseButton={false} headerPadding={0}>
				<Body>
					<Logo src={logoWithText} />
					<MessageRow>
						<DeniedIcon alt="No Permissions" src={denyIcon} />
						<MessageContent>
							<Title>אין לך הרשאות לסביבת {workspace?.title}</Title>
							<Subtitle>פנה למנהל הסביבה לקבלת הרשאות</Subtitle>
							<ManagerList>
								{managers.map((user) => (
									<li key={user.id}>
										<ManagerLink
											type="button"
											onClick={() => openUserChat(user)}
										>
											{user.info?.displayName ?? user.upn}
										</ManagerLink>
									</li>
								))}
							</ManagerList>
						</MessageContent>
					</MessageRow>
					<PrimaryButton onClick={onClose} title="הבנתי, תודה" />
				</Body>
			</Panel>
		</Dialog>
	)
}

const Panel = styled(ModalContent)`
  width: 90vw;
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: var(--Components-Notification-Global-paddingMD, 20px) var(--Components-Notification-Global-paddingContentHorizontalLG, 24px);
`

const Logo = styled.img`
  height: 26px;
  object-fit: contain;
`

const MessageRow = styled.div`
  display: flex;
  align-items: flex-start;
  align-self: stretch;
  gap: var(--Space-Margin-marginXS, 8px);
`

const DeniedIcon = styled.img`
  margin: 2px;
`

const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const Title = styled.h1`
  font-weight: 500;
`

const Subtitle = styled.h2`
  font-size: var(--fs-base);
`

const ManagerList = styled.ul`
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
