import { keyframes } from "@emotion/react"
import styled from "@emotion/styled"
import { useNavigate, useParams } from "@tanstack/react-router"
import { MessageCircle } from "lucide-react"
import { PermissionType } from "src/api/model"
import { useListPermissions } from "src/api/permission/permission"
import { useListWorkspaces } from "src/api/workspace/workspace"
import { useErrorModal } from "src/providers/ErrorModalProvider"
import { CHAT_CHANNEL_URL } from "src/utils/env-utils"
import { ErrorCode, isErrorCode } from "src/utils/error-utils"
import { navigateToUserChat } from "src/utils/user-utils"

interface ErrorContent {
	title: string
	description: string
}

const ERROR_CONTENT: Record<ErrorCode, ErrorContent> = {
	[ErrorCode.BAD_REQUEST]: {
		title: "משהו השתבש בתקשורת",
		description:
			"כדאי לנסות שוב בעוד מספר רגעים אם הבעיה נמשכת, פנו אלינו לעזרה",
	},
	[ErrorCode.UNAUTHORIZED]: {
		title: "נראה שאין לך הרשאות לפה",
		description: "לקבלת הרשאות פנה למנהל הסביבה ובמידת הצורך ניתן לפנות אלינו",
	},
	[ErrorCode.NOT_FOUND]: {
		title: "אופס, נראה שהעמוד שחיפשת לא נמצא",
		description: "ייתכן שהוא הוסר, הועבר או שהקישור שגוי",
	},
	[ErrorCode.SERVER_ERROR]: {
		title: "משהו השתבש בתקשורת",
		description:
			"כדאי לנסות שוב בעוד מספר רגעים אם הבעיה נמשכת, פנו אלינו לעזרה",
	},
}

export function ErrorModal() {
	const navigate = useNavigate()

	const { errorCode, setErrorCode } = useErrorModal()

	const { urlName = "" } =
		useParams({ from: "/workspace/$urlName", shouldThrow: false }) || {}
	const { data } = useListWorkspaces(
		{ urlName },
		{ query: { enabled: !!urlName } },
	)
	const workspace = data?.[0]
	const { data: usersPermissions = [] } = useListPermissions(
		{ workspaceId: workspace?.id ?? -1 },
		{ query: { enabled: errorCode === ErrorCode.UNAUTHORIZED && !!urlName } },
	)

	const admins = usersPermissions.filter(
		({ type }) => type === PermissionType.MANAGER,
	)

	function handleClose() {
		setErrorCode(null)
	}

	function navigateToHomePage() {
		setErrorCode(null)
		navigate({ to: "/" })
	}

	function navigateToChat() {
		window.open(CHAT_CHANNEL_URL)
	}

	const content =
		errorCode && isErrorCode(errorCode)
			? ERROR_CONTENT[errorCode as ErrorCode]
			: null

	return (
		content &&
		errorCode && (
			<Overlay onClick={handleClose}>
				<Card onClick={(e) => e.stopPropagation()}>
					<ContentContainer>
						<ErrorCodeDisplay>{errorCode}</ErrorCodeDisplay>
						<ErrorText>
							<ErrorTitle>{content.title}</ErrorTitle>
							<ErrorDescription>{content.description}</ErrorDescription>
						</ErrorText>
						{errorCode === ErrorCode.UNAUTHORIZED && admins.length > 0 && (
							<AdminContactsBox>
								<AdminContactsContent>
									<AdminContactsTitle>
										פנו בצ'אט המבצעי לקבלת הרשאות
									</AdminContactsTitle>
									<AdminContactsList>
										{admins.map(({ user }) => (
											<AdminContactRow key={user.id}>
												<AdminContainer>
													<AdminDot />
													<AdminContactLink
														onClick={() => navigateToUserChat(user)}
													>
														{user.info?.name}
														{user.info?.upn}
													</AdminContactLink>
												</AdminContainer>
												<ChatMessageContainer>
													<MessageCircle size={16} />
													<IconText>צ</IconText>
												</ChatMessageContainer>
											</AdminContactRow>
										))}
									</AdminContactsList>
								</AdminContactsContent>
							</AdminContactsBox>
						)}
						<Actions>
							<ButtonRow>
								<SecondaryButton onClick={navigateToChat}>
									לערוץ תמיכה
								</SecondaryButton>
								<PrimaryButton onClick={navigateToHomePage}>
									חזרה למסך הבית
								</PrimaryButton>
							</ButtonRow>
							<SupportNote>צוות התמיכה זמין עבורך 24/7</SupportNote>
						</Actions>
					</ContentContainer>
				</Card>
			</Overlay>
		)
	)
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: var(--z-dropdown);
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.15s ease;
`

const Card = styled.div`
  background: var(--background-area);
  width: 1890px;
  height: 990px;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: ${slideUp} 0.2s ease;
  direction: rtl;
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;
`

const ErrorCodeDisplay = styled.div`
  font-size: 300px;
  font-weight: 700;
  line-height: 1;
  background: linear-gradient(180deg, var(--Colors-Base-Blue-10, #001D66) -95.14%, var(--Colors-Base-Neutral-1, #FFF) 201.73%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const ErrorText = styled.div`
  font-size: var(--fs-heading-2);
  font-weight: 400;
  line-height: 38px;
`

const ErrorTitle = styled.p`
  font-weight: 500;
  color: var(--sea-ink);
`

const ErrorDescription = styled.p`
  color: var(--text-color-2);
`

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
`

const ButtonRow = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
`

const PrimaryButton = styled.button`
  padding: 7px 20px;
  border-radius: 8px;
  border: none;
  background: var(--foreground);
  color: var(--background);
  font-size: 19px;
  font-weight: 400;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`

const SecondaryButton = styled.button`
  padding: 7px 20px;
  border-radius: 8px;
  border: none;
  background: rgba(0, 0, 0, 0.04);
  color: var(--sea-ink);
  font-size: 19px;
  font-weight: 400;
  cursor: pointer;

  &:hover {
    background: var(--button-hover);
  }

  &:active {
    background: var(--button-active);
  }
`

const SupportNote = styled.p`
  font-size: var(--fs-base);
  color: var(--text-color-400);
  margin: 0;
`

const AdminContactsBox = styled.div`
  display: flex;
  gap: 4px;
  background: rgba(0, 0, 0, 0.04);
  padding: 4px;
  border-radius: 4px;
  align-items: flex-start;
`

const AdminContactsContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 4px;
`

const AdminContactsTitle = styled.p`
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-2);
  text-align: start;
  margin: 0;
`

const ChatMessageContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 3px var(--active-color); 
  border-radius: 50%;

  &:hover {
    cursor: pointer;
  }
`

const IconText = styled.span`
  position: absolute;
`

const AdminContactsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 325px;
  max-height: 90px;
  padding: 4px;
  align-items: flex-start;
  min-width: 0;
  overflow-y: auto;
  direction: ltr;
`

const AdminContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`

const AdminContactRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
  align-self: stretch;
  direction: rtl;
  `

const AdminDot = styled.span`
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--card-border);
  flex-shrink: 0;
  `

const AdminContactLink = styled.button`
  color: var(--active-color);
  font-size: var(--fs-btn);
  line-height: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
`
