import { keyframes } from "@emotion/react"
import styled from "@emotion/styled"
import { useNavigate, useParams } from "@tanstack/react-router"
import { PermissionType } from "src/api/model"
import { useListPermissions } from "src/api/permission/permission"
import { useListWorkspaces } from "src/api/workspace/workspace"
import biData from "src/assets/bidata.svg"
import error403 from "src/assets/error_403.svg"
import error404 from "src/assets/error_404.svg"
import error500 from "src/assets/error_500.svg"
import logoSvg from "src/assets/logo-with-text.svg"
import { ModalContent } from "src/components/shared/ModalContent"
import { Dialog } from "src/components/ui/dialog"
import { useErrorModal } from "src/providers/ErrorModalProvider"
import { CHAT_CHANNEL_URL } from "src/utils/env-utils"
import { ErrorCode, isErrorCode } from "src/utils/error-utils"
import { navigateToUserChat } from "src/utils/user-utils"

interface ErrorContent {
	title: string
	description: string
	errorImage: string
}

const ERROR_CONTENT: Record<ErrorCode, ErrorContent> = {
	[ErrorCode.BAD_REQUEST]: {
		title: "משהו השתבש בתקשורת",
		description:
			"כדאי לנסות שוב בעוד מספר רגעים אם הבעיה נמשכת, פנו אלינו לעזרה",
		errorImage: error500,
	},
	[ErrorCode.UNAUTHORIZED]: {
		title: "נראה שאין לך הרשאות לפה",
		description: "לקבלת הרשאות פנה למנהל הסביבה",
		errorImage: error403,
	},
	[ErrorCode.NOT_FOUND]: {
		title: "נראה שהעמוד שחיפשת לא נמצא",
		description: "ייתכן שהוא הוסר, הועבר או שהקישור שגוי",
		errorImage: error404,
	},
	[ErrorCode.SERVER_ERROR]: {
		title: "משהו השתבש בתקשורת",
		description:
			"כדאי לנסות שוב בעוד מספר רגעים אם הבעיה נמשכת, פנו אלינו לעזרה",
		errorImage: error500,
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

	async function navigateToHomePage() {
		await navigate({ to: "/" })
		setErrorCode(null)
	}

	function navigateToChat() {
		window.open(CHAT_CHANNEL_URL)
	}

	const content = errorCode
		? ERROR_CONTENT[
				isErrorCode(errorCode)
					? (errorCode as ErrorCode)
					: ErrorCode.SERVER_ERROR
			]
		: null

	return (
		<Dialog open={!!content} onOpenChange={(open) => !open && handleClose()}>
			<FullScreenPanel closable={false} showCloseButton={false}>
				<PageHeader>
					<Logo src={logoSvg} />
					<Logo src={biData} />
				</PageHeader>
				<MainContent>
					<TextColumn>
						<TextBlock>
							<ErrorTitle>{content?.title}</ErrorTitle>
							<ErrorDescription>{content?.description}</ErrorDescription>
						</TextBlock>
						{errorCode === ErrorCode.UNAUTHORIZED && admins.length > 0 && (
							<AdminContactsContent>
								<AdminContactsTitle>
									פנו בצ'אט המבצעי לקבלת הרשאות
								</AdminContactsTitle>
								<AdminContactsList>
									{admins.map(({ user }, index) => (
										<AdminContactRow key={user.id}>
											<AdminContactLink
												onClick={() => navigateToUserChat(user)}
											>
												{user.info?.name} {user.info?.upn}{" "}
												{index + 1 < admins.length && "|"}
											</AdminContactLink>
										</AdminContactRow>
									))}
								</AdminContactsList>
							</AdminContactsContent>
						)}
						<ButtonsRow>
							<SecondaryButton onClick={navigateToChat}>
								לערוץ תמיכה
							</SecondaryButton>
							<PrimaryButton onClick={navigateToHomePage}>
								חזרה למסך הבית
							</PrimaryButton>
						</ButtonsRow>
					</TextColumn>
					<ImageColumn>
						<ErrorImage src={content?.errorImage} />
						<ErrorCodeDisplay>{errorCode}</ErrorCodeDisplay>
					</ImageColumn>
				</MainContent>
			</FullScreenPanel>
		</Dialog>
	)
}

const slideUp = keyframes`
  from { opacity: 0; transform: translate(-50%, calc(-50% + 16px)); }
  to { opacity: 1; transform: translate(-50%, -50%); }
`

const FullScreenPanel = styled(ModalContent)`
  background: var(--background-area);
  width: 100vw;
  height: 100vh;
  border-radius: 0;
  border: none;
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 0.2s ease;
  direction: rtl;
`

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 49px 92px 0;
`

const Logo = styled.img`
  height: 64px;
`

const MainContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 160px;
`

const ImageColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`

const ErrorImage = styled.img`
  width: 236px;
  height: auto;
`

const ErrorCodeDisplay = styled.div`
  font-size: 180px;
  font-weight: 700;
  line-height: 1;
  background: linear-gradient(180deg, var(--Colors-Base-Blue-10, #001D66) -95.14%, var(--Colors-Base-Neutral-1, #FFF) 201.73%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const TextColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 48px;
  width: 672px;
`

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`

const ErrorTitle = styled.p`
  font-size: var(--fs-heading-1);
  font-weight: 500;
  line-height: 46px;
  color: var(--sea-ink);
  width: 100%;
  margin: 0;
`

const ErrorDescription = styled.p`
  font-size: var(--fs-heading-2);
  font-weight: 400;
  line-height: 38px;
  color: var(--sea-ink-soft);
  width: 100%;
  margin: 0;
`

const ButtonsRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  align-self: flex-start;
`

const PrimaryButton = styled.button`
  padding: 5px 20px;
  border-radius: 10px;
  border: none;
  background: var(--foreground);
  color: var(--background);
  font-size: var(--fs-xl);
  font-weight: 400;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    opacity: 0.9;
  }
`

const SecondaryButton = styled.button`
  padding: 5px 20px;
  border-radius: 10px;
  border: none;
  background: var(--Components-Dropdown-Global-controlItemBgHover);
  color: var(--sea-ink);
  font-size: var(--fs-xl);
  font-weight: 400;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: var(--button-hover);
  }
`

const AdminContactsContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  gap: 4px;
`

const AdminContactsTitle = styled.p`
  font-size: var(--fs-xl);
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-2);
  text-align: start;
  margin: 0;
`

const AdminContactsList = styled.div`
  display: flex;
  align-self: flex-start;
  flex-direction: row-reverse;
  flex-wrap: wrap ;
  gap: 12px;
  max-width: 400px;
  max-height: 135px;
  padding: 4px;
  align-items: flex-start;
  justify-content: end;
  min-width: 0;
  overflow-y: auto;
  direction: ltr;
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

const AdminContactLink = styled.button`
  color: var(--active-color);
  font-size: var(--fs-xl);
  line-height: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
`
