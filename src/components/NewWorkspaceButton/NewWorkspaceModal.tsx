import styled from "@emotion/styled"
import { useForm, useStore } from "@tanstack/react-form"
import { Check } from "lucide-react"
import React, { type ReactNode, useEffect, useState } from "react"
import type { CreateWorkspaceRequestDto, MirageUserDto } from "src/api/model"
import { CreateWorkspaceRequestErrorDtoMessage } from "src/api/model"
import {
	getListWorkspaceRequestsQueryKey,
	useCreateWorkspaceRequest,
} from "src/api/workspace-requests/workspace-requests"
import { Dialog } from "src/components/ui/dialog"
import { useCurrentUser } from "src/hooks/useCurrentUser"
import { invalidateQueries } from "src/queryClient"
import { hasError } from "src/utils/error-utils"
import type { WorkspaceDetailsErrors } from "src/utils/workspace-utils"
import logoWithText from "../../assets/logo-with-text-dark.png"
import quickPage from "../../assets/quick_page.svg"
import requestSentImg from "../../assets/request_sent.svg"
import { ModalContent } from "../shared/ModalContent"
import { NewWorkspaceDetailsForm } from "./NewWorkspaceDetailsForm"
import { NewWorkspaceManagersForm } from "./NewWorkspaceManagersForm"
import { StepFooter } from "./StepFooter"

enum Steps {
	Details = 1,
	Managers = 2,
	Success = 3,
}

interface StepConfig {
	key: Steps
	label: string
}

const VISIBLE_STEPS: StepConfig[] = [
	{ key: Steps.Details, label: "פרטי הסביבה" },
	{ key: Steps.Managers, label: "הגדרות מנהלים" },
]

const REQUEST_ERROR_MESSAGES: Record<
	keyof WorkspaceDetailsErrors,
	{ code: CreateWorkspaceRequestErrorDtoMessage; message: string }
> = {
	title: {
		code: CreateWorkspaceRequestErrorDtoMessage["title-exists"],
		message: "שם סביבה זה כבר קיים",
	},
	urlName: {
		code: CreateWorkspaceRequestErrorDtoMessage["urlname-exists"],
		message: "הנתיב הזה כבר קיים",
	},
	pikudId: {
		code: CreateWorkspaceRequestErrorDtoMessage["pikud-not-found"],
		message: "הפיקוד לא נמצא",
	},
}

interface NewWorkspaceModalProps {
	onClose(): void
}

export function NewWorkspaceModal({ onClose }: NewWorkspaceModalProps) {
	const currentUser = useCurrentUser()
	const [step, setStep] = useState<Steps>(Steps.Details)
	const [serverErrors, setServerErrors] = useState<WorkspaceDetailsErrors>({})
	const [showErrors, setShowErrors] = useState(false)
	const [createdRequestId, setCreatedRequestId] = useState<number | null>(null)
	const [managers, setManagers] = useState<MirageUserDto[]>([])

	const { mutateAsync: createWorkspaceRequest } = useCreateWorkspaceRequest()

	useEffect(() => {
		setManagers([{ upn: currentUser.upn, info: currentUser.info ?? null }])
	}, [currentUser])

	const form = useForm({
		defaultValues: {
			title: "",
			urlName: "",
			pikudId: 0,
			icon: null,
		} as CreateWorkspaceRequestDto,
	})
	const values = useStore(form.store, (s) => s.values)

	function setFormValues(values: CreateWorkspaceRequestDto) {
		form.setFieldValue("title", values.title)
		form.setFieldValue("urlName", values.urlName)
		form.setFieldValue("pikudId", values.pikudId)
		form.setFieldValue("icon", values.icon)
	}

	async function handleStep2Submit(managers: MirageUserDto[]) {
		const { title, urlName, pikudId, icon } = form.state.values
		await createWorkspaceRequest(
			{
				data: {
					title,
					urlName,
					pikudId,
					icon,
					managers: managers.map((m) => m.upn),
				},
			},
			{
				onError: (error) => {
					setServerErrors(
						Object.fromEntries(
							Object.entries(REQUEST_ERROR_MESSAGES)
								.filter(([, { code }]) => hasError(error, code))
								.map(([field, { message }]) => [field, message]),
						),
					)
					setShowErrors(true)
					setStep(Steps.Details)
				},
				onSuccess: (data) => {
					invalidateQueries([getListWorkspaceRequestsQueryKey()])
					setCreatedRequestId(data.id)
					setStep(Steps.Success)
				},
			},
		)
	}
	function handleClear() {
		form.reset()
		setServerErrors({})
		setShowErrors(false)
		setManagers(managers.slice(0, 1))
	}

	function handleNext() {
		if (!values.title.trim() || !values.urlName || !values.pikudId) {
			setShowErrors(true)
			return
		}
		setStep(Steps.Managers)
	}

	function handleGoToStep1() {
		setStep(Steps.Details)
	}

	function handleSuccess() {
		onClose()
	}

	const stepContent: Record<Steps, ReactNode> = {
		[Steps.Details]: (
			<NewWorkspaceDetailsForm
				serverErrors={serverErrors}
				showErrors={showErrors}
				initialValues={values}
				setFormValues={setFormValues}
				onNext={handleNext}
				onClear={handleClear}
			/>
		),
		[Steps.Managers]: (
			<NewWorkspaceManagersForm
				initialManagers={managers}
				onBack={handleGoToStep1}
				onSubmit={handleStep2Submit}
				onManagersChange={setManagers}
			/>
		),
		[Steps.Success]: (
			<SuccessBody>
				<SuccessTitle>הבקשה נשלחה בהצלחה</SuccessTitle>
				<SuccessSubtitle>נעדכן בצ'אט המבצעי ברגע שהיא תאושר</SuccessSubtitle>
				<RequestId>מספר בקשה: {createdRequestId}</RequestId>
				<SuccessImg src={requestSentImg} />
			</SuccessBody>
		),
	}

	const stepFooter: Partial<Record<Steps, ReactNode>> = {
		[Steps.Success]: (
			<StepFooter primaryLabel="מעולה, תודה" onPrimary={handleSuccess} />
		),
	}

	return (
		<Dialog open onOpenChange={onClose}>
			<ModalContent headerPadding={0} showCloseButton={false}>
				<Panel>
					<FormPanel>
						<FormPanelInner>
							<ModalTitle>בקשה לפתיחת סביבה חדשה</ModalTitle>

							<StepsRow>
								{VISIBLE_STEPS.map(({ key, label }, i) => (
									<React.Fragment key={key}>
										<StepItem>
											<StepLabel $active={step >= key}>{label}</StepLabel>
											{step > key ? (
												<StepCircleCompleted>
													<Check size={12} />
												</StepCircleCompleted>
											) : (
												<StepCircle $active={step === key}>{key}</StepCircle>
											)}
										</StepItem>
										{i < VISIBLE_STEPS.length - 1 && (
											<StepTail $completed={step > key} />
										)}
									</React.Fragment>
								))}
							</StepsRow>

							<FormBody>
								<FormBodyContent>{stepContent[step]}</FormBodyContent>
							</FormBody>

							{stepFooter[step]}
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
		</Dialog>
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

const StepCircleCompleted = styled.div`
  ${stepCircleBase}
  background: #e2e2ff;
  color: var(--Active-Step);
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
  min-height: 0;
`

const FormBodyContent = styled.div`
  display: flex;
  flex-direction: column;
  direction: rtl;
  flex: 1;
  min-height: 0;
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
