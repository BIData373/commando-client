import styled from "@emotion/styled"
import { useForm } from "@tanstack/react-form"
import { useStore } from "@tanstack/react-store"
import { Check } from "lucide-react"
import { useEffect, useState } from "react"
import type { MirageUserDto } from "src/api/model"
import {
	getListWorkspaceRequestsQueryKey,
	useCreateWorkspaceRequest,
} from "src/api/workspace-requests/workspace-requests"
import { useCurrentUser } from "src/hooks/useCurrentUser"
import type { IMesibaIcon } from "src/hooks/useMesiba"
import { invalidateQueries } from "src/queryClient"
import { isUrlNameExist, isWorkspaceExist } from "src/utils/error-utils"
import { concatName } from "src/utils/user-utils"
import logoWithText from "../../assets/logo-with-text-dark.png"
import quickPage from "../../assets/quick_page.svg"
import requestSentImg from "../../assets/request_sent.svg"
import { ModalContent } from "../shared/ModalContent"
import { PrimaryButton } from "../shared/PrimaryButton"
import { StepOne } from "./StepOne"
import { StepTwo } from "./StepTwo"

enum Steps {
	WorkspaceDetails = 1,
	AdminSettings = 2,
	Success = 3,
}

interface NewWorkspaceValues {
	title: string
	urlName: string
	pikudId: number | undefined
	icon: string | null
}

interface StepOneErrors {
	title?: string
	urlName?: string
	pikudId?: string
}

interface StepButtonAction {
	label: string
	onClick(): void
}

interface NewWorkspaceModalProps {
	onClose(): void
}

export function NewWorkspaceModal({ onClose }: NewWorkspaceModalProps) {
	const currentUser = useCurrentUser()
	const [step, setStep] = useState<Steps>(Steps.WorkspaceDetails)
	const [iconSearch, setIconSearch] = useState("")
	const [step1Attempted, setStep1Attempted] = useState(false)
	const [managers, setManagers] = useState<MirageUserDto[]>([])
	const [managerSearch, setManagerSearch] = useState("")
	const [selectedManagerUser, setSelectedManagerUser] =
		useState<MirageUserDto | null>(null)
	const [createdRequestId, setCreatedRequestId] = useState<number | null>(null)
	const [serverErrors, setServerErrors] = useState<StepOneErrors>({})

	const { mutateAsync: createWorkspaceRequest } = useCreateWorkspaceRequest()

	useEffect(() => {
		setManagers([{ upn: currentUser.upn, info: currentUser.info ?? null }])
	}, [currentUser])

	const form = useForm({
		defaultValues: {
			title: "",
			urlName: "",
			pikudId: undefined,
			icon: null,
		} as NewWorkspaceValues,
		onSubmit: async ({ value }) => {
			await createWorkspaceRequest(
				{
					data: {
						title: value.title,
						urlName: value.urlName,
						pikudId: value.pikudId!,
						icon: value.icon,
						managers: managers.map((m) => m.upn),
					},
				},
				{
					onError: (error) => {
						setServerErrors({
							title: isWorkspaceExist(error)
								? "שם סביבה זה כבר קיים"
								: undefined,
							urlName: isUrlNameExist(error) ? "הנתיב הזה כבר קיים" : undefined,
						})
						setStep1Attempted(true)
						setStep(Steps.WorkspaceDetails)
					},
					onSuccess: (data) => {
						invalidateQueries([getListWorkspaceRequestsQueryKey()])
						setCreatedRequestId(data.id)
						setStep(Steps.Success)
					},
				},
			)
		},
	})

	const values = useStore(form.store, (s) => s.values)

	const step1Errors: StepOneErrors = {
		title: !values.title.trim() ? "שדה חובה" : serverErrors.title,
		urlName: !values.urlName ? "שדה חובה" : serverErrors.urlName,
		pikudId: !values.pikudId ? "שדה חובה" : undefined,
	}

	const isCurrentStepWorkspaceDetails = step === Steps.WorkspaceDetails

	const primaryButtonAction: Record<Steps, StepButtonAction> = {
		[Steps.WorkspaceDetails]: { label: "המשך", onClick: handleNext },
		[Steps.AdminSettings]: { label: "שלח בקשה", onClick: form.handleSubmit },
		[Steps.Success]: { label: "מעולה, תודה", onClick: handleSuccess },
	}

	const action = primaryButtonAction[step]

	function handleNext() {
		setStep1Attempted(true)
		const isValid =
			!step1Errors.title && !step1Errors.urlName && !step1Errors.pikudId
		if (isValid) setStep(Steps.AdminSettings)
	}

	function handleSuccess() {
		onClose()
	}

	function handleClear() {
		form.reset()
		setIconSearch("")
		setStep1Attempted(false)
		setManagers(managers.slice(0, 1))
		setManagerSearch("")
		setSelectedManagerUser(null)
	}

	function handleAddManager() {
		if (!selectedManagerUser) return
		if (managers.some((m) => m.upn === selectedManagerUser.upn)) return
		setManagers((prev) => [...prev, selectedManagerUser])
		setManagerSearch("")
		setSelectedManagerUser(null)
	}

	function handleRemoveManager(upn: string) {
		setManagers((prev) => prev.filter((m) => m.upn !== upn))
	}

	function handleManagerSearchClear() {
		setManagerSearch("")
		setSelectedManagerUser(null)
	}

	function handleGoToStep1() {
		setStep(Steps.WorkspaceDetails)
		setStep1Attempted(false)
	}

	function handleTitleChange(value: string) {
		form.setFieldValue("title", value)
		if (serverErrors.title)
			setServerErrors((prev) => ({ ...prev, title: undefined }))
	}

	function handleUrlNameChange(value: string) {
		form.setFieldValue("urlName", value)
		if (serverErrors.urlName)
			setServerErrors((prev) => ({ ...prev, urlName: undefined }))
	}

	function handlePikudChange(value: number) {
		form.setFieldValue("pikudId", value)
	}

	function handleIconSelect(icon: IMesibaIcon) {
		form.setFieldValue("icon", icon.iconName)
		setIconSearch(icon.heb_name)
	}

	function handleIconClear() {
		form.setFieldValue("icon", null)
		setIconSearch("")
	}

	function handleIconSearchChange(value: string) {
		setIconSearch(value)
	}

	function handleIconSearchClear() {
		setIconSearch("")
	}

	function handleManagerSelect(manager: MirageUserDto | null) {
		setSelectedManagerUser(manager)
		if (manager) {
			setManagerSearch(concatName(manager))
		}
	}

	return (
		<ModalContent headerPadding={0} showCloseButton={false}>
			<Panel>
				<FormPanel>
					<FormPanelInner>
						<ModalTitle>בקשה לפתיחת סביבה חדשה</ModalTitle>

						<StepsRow>
							<StepItem>
								<StepLabel $active>פרטי הסביבה</StepLabel>
								{!isCurrentStepWorkspaceDetails ? (
									<StepCircleCompleted
										onClick={
											step === Steps.AdminSettings ? handleGoToStep1 : undefined
										}
										$clickable={step === Steps.AdminSettings}
									>
										<Check size={12} />
									</StepCircleCompleted>
								) : (
									<StepCircleActive>1</StepCircleActive>
								)}
							</StepItem>

							<StepTail $completed={!isCurrentStepWorkspaceDetails} />

							<StepItem>
								<StepLabel $active={!isCurrentStepWorkspaceDetails}>
									הגדרות מנהלים
								</StepLabel>
								{step === Steps.Success ? (
									<StepCircleCompleted $clickable={false}>
										<Check size={12} />
									</StepCircleCompleted>
								) : (
									<StepCircle $active={step === Steps.AdminSettings}>
										2
									</StepCircle>
								)}
							</StepItem>
						</StepsRow>

						<FormBody>
							<FormBodyContent>
								{step === Steps.Success ? (
									<SuccessBody>
										<SuccessImg src={requestSentImg} alt="" />
										<SuccessTitle>הבקשה נשלחה בהצלחה</SuccessTitle>
										<SuccessSubtitle>
											נעדכן בצ'אט המבצעי ברגע שהיא תאושר
										</SuccessSubtitle>
										<RequestId>מספר בקשה: {createdRequestId}</RequestId>
									</SuccessBody>
								) : isCurrentStepWorkspaceDetails ? (
									<StepOne
										title={values.title}
										urlName={values.urlName}
										pikudId={values.pikudId}
										icon={values.icon}
										iconSearch={iconSearch}
										showErrors={step1Attempted}
										errors={step1Errors}
										onTitleChange={handleTitleChange}
										onUrlNameChange={handleUrlNameChange}
										onPikudChange={handlePikudChange}
										onIconSelect={handleIconSelect}
										onIconSearchChange={handleIconSearchChange}
										onIconClear={handleIconClear}
										onIconSearchClear={handleIconSearchClear}
									/>
								) : (
									<StepTwo
										managers={managers}
										search={managerSearch}
										selectedUser={selectedManagerUser}
										onSearchChange={setManagerSearch}
										onSearchClear={handleManagerSearchClear}
										onUserSelect={handleManagerSelect}
										onAdd={handleAddManager}
										onRemove={handleRemoveManager}
									/>
								)}
							</FormBodyContent>
						</FormBody>

						<BottomSection>
							{step === Steps.AdminSettings && (
								<StepTwoFootnote>
									*ניתן לשנות או לעדכן את מנהלי הסביבה בכל עת דרך הגדרות הסביבה
								</StepTwoFootnote>
							)}
							<Footer>
								{step !== Steps.Success && (
									<ClearButton
										onClick={
											isCurrentStepWorkspaceDetails
												? handleClear
												: handleGoToStep1
										}
									>
										{isCurrentStepWorkspaceDetails ? "נקה טופס" : "חזור"}
									</ClearButton>
								)}
								<PrimaryButton
									height={30}
									title={action.label}
									type="button"
									onClick={action.onClick}
								/>
							</Footer>
						</BottomSection>
					</FormPanelInner>
				</FormPanel>

				<BrandingPanel>
					<LogoHeader>
						<LogoImg src={logoWithText} />
						<BrandingSubtitle>מערכת לניהול הנחיות</BrandingSubtitle>
					</LogoHeader>
					<ScreenshotGroup>
						<Rectangle />
						<ScreenshotImg src={quickPage} />
					</ScreenshotGroup>

					<CloseButton type="button" onClick={onClose}>
						✕
					</CloseButton>
				</BrandingPanel>
			</Panel>
		</ModalContent>
	)
}

const Panel = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: row;
  width: 1015px;
  height: 745px;
  gap: 32px;
  overflow: hidden;
  border-radius: 8px;
`

const BrandingPanel = styled.div`
  align-self: stretch;
  flex-shrink: 0;
  background: var(--background-area);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 64px;
  padding: 0 48px;
`

const ScreenshotGroup = styled.div`
  position: relative;
  width: 391px;
  height: 285px;
`

const Rectangle = styled.div`
  position: absolute;
  inset-block-start: 66.78px;
  inset-inline-start: 0;
  width: 391px;
  height: 218px;
  border-radius: 6.41px;
  border-top: 2.404px solid var(--Rectangle);
  border-right: 2.404px solid var(--Rectangle);
  border-bottom: 4.807px solid var(--Rectangle);
  border-left: 2.404px solid var(--Rectangle);
`

const LogoHeader = styled.div`
  display: flex;
  flex-direction: column;
`

const LogoImg = styled.img`
  width: 160px;
  object-fit: contain;
`

const BrandingSubtitle = styled.span`
  font-size: var(--fs-xl);
  color: var(--foreground);
  direction: rtl;
`

const ScreenshotImg = styled.img`
  position: absolute;
  width: 400px;
  height: 280px;
  border-radius: 4px 4px 0 0;
  object-fit: cover;
  object-position: top;
`

const FormPanel = styled.div`
  flex: 1;
  align-self: stretch;
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--background);
  direction: rtl;
`

const CloseButton = styled.button`
  position: absolute;
  inset-block-start: 12px;
  inset-inline-end: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: transparent;
  color: var(--sea-ink-soft);
  cursor: pointer;
  font-size: 14px;
  z-index: 1;

  &:hover {
    background: var(--link-bg-hover);
    color: var(--sea-ink);
  }
`

const FormPanelInner = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  flex: 1;
  padding: 48px 32px;
  gap: 32px;
  min-height: 0;
`

const ModalTitle = styled.h2`
  font-size: var(--fs-heading-3);
  font-weight: 600;
  text-align: center;
  color: var(--sea-ink);
  margin: 0;
`

const StepsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
`

const StepItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`

const stepCircleBase = `
  width: 24px;
  height: 24px;
  border-radius: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  flex-shrink: 0;
`

const StepCircleActive = styled.div`
  ${stepCircleBase}
  background: var(--Active-Step);
  color: var(--background);
`

const StepCircleCompleted = styled.div<{ $clickable: boolean }>`
  ${stepCircleBase}
  background: #e2e2ff;
  color: var(--Active-Step);
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
`

const StepCircle = styled.div<{ $active: boolean }>`
  ${stepCircleBase}
  background: ${({ $active }) => ($active ? "var(--Active-Step)" : "var(--button-hover)")};
  color: ${({ $active }) => ($active ? "white" : "var(--text-color-400)")};
`

const StepLabel = styled.span<{ $active: boolean }>`
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: ${({ $active }) => ($active ? "var(--sea-ink)" : "var(--text-color-400)")};
  white-space: nowrap;
`

const StepTail = styled.div<{ $completed: boolean }>`
  flex: 1;
  height: 1px;
  border-block-start: 1px ${({ $completed }) => ($completed ? "solid var(--Active-Step)" : "dashed var(--line)")};
`

const FormBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 5px;
  direction: ltr;
  overflow-y: auto;
`

const FormBodyContent = styled.div`
  direction: rtl;
  display: flex;
  flex-direction: column;
  flex: 1;
`

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  flex-shrink: 0;
`

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 16px;
`

const StepTwoFootnote = styled.p`
  font-size: var(--fs-sm);
  color: var(--sea-ink-soft);
  margin: 0;
`

const ClearButton = styled.button`
  padding: 3px 15px;
  gap: 8px;
  border-radius: 6px;
  border:  1px solid  var(--card-border);
  cursor: pointer;

  :hover {
	background: var(--button-hover);
  }

  :active {
	background: var(--button-active);
  }
`

const SuccessBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;
`

const SuccessImg = styled.img`
  width: 120px;
`

const SuccessTitle = styled.h3`
  font-size: var(--fs-heading-3);
  font-weight: 500;
  color: var(--sea-ink);
  margin: 0;
`

const SuccessSubtitle = styled.p`
  font-size: var(--fs-base);
  color: var(--sea-ink-soft);
  margin: 0;
`

const RequestId = styled.p`
  font-size: var(--fs-xl);
  color: var(--sea-ink-soft);
  margin: 0;
`
