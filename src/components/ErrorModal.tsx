import { keyframes } from "@emotion/react"
import styled from "@emotion/styled"
import { useNavigate, useParams } from "@tanstack/react-router"
import { MessageCircle } from "lucide-react"
import { PermissionDtoType } from "src/api/model"
import { useListPermissions } from "src/api/permission/permission"
import { useErrorModal } from "src/providers/ErrorModalProvider"
import { useWorkspace } from "src/providers/WorkspaceProvider"

interface ErrorContent {
  title: string
  description: string
}

const ERROR_CONTENT: Record<number, ErrorContent> = {
  400: {
    title: "משהו השתבש בתקשורת",
    description:
      "כדאי לנסות שוב בעוד מספר רגעים אם הבעיה נמשכת, פנו אלינו לעזרה",
  },
  403: {
    title: "נראה שאין לך הרשאות לפה",
    description: "לקבלת הרשאות פנה למנהל הסביבה ובמידת הצורך ניתן לפנות אלינו",
  },
  404: {
    title: "אופס, נראה שהעמוד שחיפשת לא נמצא",
    description: "ייתכן שהוא הוסר, הועבר או שהקישור שגוי",
  },
  500: {
    title: "משהו השתבש בתקשורת",
    description:
      "כדאי לנסות שוב בעוד מספר רגעים אם הבעיה נמשכת, פנו אלינו לעזרה",
  },
}

export function ErrorModal() {
  const navigate = useNavigate()

  const error = useErrorModal()

  const { urlName } = useParams({ strict: false })

  const {
    workspace: { id: workspaceId },
  } = useWorkspace()

  const { data: usersPermissions = [] } = useListPermissions(
    { workspaceId },
    {
      query: {
        enabled: error?.errorCode === 403 && !!urlName,
      },
    },
  )

  const admins = usersPermissions.filter(
    ({ type }) => type === PermissionDtoType.MANAGER,
  )

  function handleClose() {
    error?.setErrorCode(null)
  }

  function navigateToHomePage() {
    error?.setErrorCode(null)
    navigate({ to: "/" })
  }

  function navigateToChat() {
    error?.setErrorCode(null)
    // TODO: CHAT link
    window.open("https://chatLink")
  }

  const content = error?.errorCode ? ERROR_CONTENT[error.errorCode] : null

  return (
    content &&
    error?.errorCode && (
      <Overlay onClick={handleClose}>
        <Card onClick={(e) => e.stopPropagation()}>
          <ContentContainer>
            <ErrorCode>{error.errorCode}</ErrorCode>
            <ErrorText>
              <ErrorTitle>{content.title}</ErrorTitle>
              <ErrorDescription>{content.description}</ErrorDescription>
            </ErrorText>
            {error.errorCode === 403 && admins.length > 0 && (
              <AdminContactsBox>
                <AdminContactsContent>
                  <AdminContactsTitle>
                    פנו בצ'אט המבצעי לקבלת הרשאות
                  </AdminContactsTitle>
                  <AdminContactsList>
                    {admins.map(({ user }) => (
                      <AdminContactRow key={user.id}>
                        <AdminDot />
                        <AdminContactLink onClick={navigateToChat}>
                          {user.info?.name}
                          {user.info?.upn}
                        </AdminContactLink>
                        <MessageCircle size={15} />
                      </AdminContactRow>
                    ))}
                  </AdminContactsList>
                </AdminContactsContent>
                <AdminSeparator />
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

const ErrorCode = styled.div`
  font-size: 300px;
  font-weight: 700;
  line-height: 1;
  background: linear-gradient(180deg, var(--Colors-Base-Blue-10, #001D66) -95.14%, var(--Colors-Base-Neutral-1, #FFF) 201.73%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const ErrorText = styled.p`
  font-size: 30px;
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
  font-size: 16px;
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
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-2);
  text-align: end;
  margin: 0;
`

const AdminContactsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const AdminContactRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
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
  font-size: 14px;
  line-height: 22px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
`

const AdminSeparator = styled.div`
  width: 2px;
  height: 22px;
  background: var(--card-border);
  border-radius: 25px;
  align-self: center;
  flex-shrink: 0;
`
