import styled from "@emotion/styled"
import { useForm } from "@tanstack/react-form"
import { useNavigate } from "@tanstack/react-router"
import { useStore } from "@tanstack/react-store"
import { Check } from "lucide-react"
import { useState } from "react"
import {
	getGetPermittedWorkspacesQueryKey,
	getListWorkspacesQueryKey,
	useCreateWorkspace,
} from "src/api/workspace/workspace"
import type { IMesibaIcon } from "src/hooks/useMesiba"
import { invalidateQueries } from "src/queryClient"
import logoWithText from "../../assets/logo-with-text-dark.png"
import quickPage from "../../assets/quick_page.svg"
import { ModalContent } from "../shared/ModalContent"
import { PrimaryButton } from "../shared/PrimaryButton"
import { Button } from "../ui/button"
import { StepOne } from "./StepOne"

enum Steps {
	WorkspaceDetails = 1,
	AdminSettings = 2,
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

interface NewWorkspaceModalProps {
	onClose(): void
}

export function NewWorkspaceModal({ onClose }: NewWorkspaceModalProps) {
	const navigate = useNavigate()
	const [step, setStep] = useState<Steps>(Steps.WorkspaceDetails)
	const [iconSearch, setIconSearch] = useState("")
	const [step1Attempted, setStep1Attempted] = useState(false)

	const { mutateAsync: createWorkspace, isPending } = useCreateWorkspace({
		mutation: {
			onSuccess(data) {
				invalidateQueries([
					getListWorkspacesQueryKey(),
					getGetPermittedWorkspacesQueryKey(),
				])
				navigate({
					to: "/workspace/$urlName",
					params: { urlName: data.urlName },
				})
			},
		},
	})

	const form = useForm({
		defaultValues: {
			title: "",
			urlName: "",
			pikudId: undefined,
			icon: null,
		} as NewWorkspaceValues,
		onSubmit: async ({ value }) => {
			await createWorkspace({
				data: {
					title: value.title,
					urlName: value.urlName,
					pikudId: value.pikudId!,
					icon: value.icon,
				},
			})
		},
	})

	const values = useStore(form.store, (s) => s.values)

	const step1Errors: StepOneErrors = {
		title: !values.title.trim() ? "שדה חובה" : undefined,
		urlName: !values.urlName
			? "שדה חובה"
			: !/^[A-Z0-9_]+$/.test(values.urlName)
				? "שם לחיצוג חייב להיות באנגלית גדולות ללא רווחים"
				: undefined,
		pikudId: values.pikudId === undefined ? "שדה חובה" : undefined,
	}

	function handleNext() {
		setStep1Attempted(true)
		const isValid =
			!step1Errors.title && !step1Errors.urlName && !step1Errors.pikudId
		if (isValid) setStep(Steps.AdminSettings)
	}

	function handleClear() {
		form.reset()
		setIconSearch("")
		setStep(Steps.WorkspaceDetails)
		setStep1Attempted(false)
	}

	function handleGoToStep1() {
		setStep(Steps.WorkspaceDetails)
	}

	function handleTitleChange(value: string) {
		form.setFieldValue("title", value)
	}

	function handleUrlNameChange(value: string) {
		form.setFieldValue("urlName", value)
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

	return (
		<ModalContent showCloseButton={false}>
			<Panel>
				<FormPanel>
					<FormPanelInner>
						<ModalTitle>בקשה לפתיחת סביבה חדשה</ModalTitle>

						<StepsRow>
							<StepItem>
								<StepLabel $active>פרטי הסביבה</StepLabel>
								{step === Steps.AdminSettings ? (
									<StepCircleCompleted onClick={handleGoToStep1}>
										<Check size={12} />
									</StepCircleCompleted>
								) : (
									<StepCircleActive>1</StepCircleActive>
								)}
							</StepItem>

							<StepTail $completed={step === Steps.AdminSettings} />

							<StepItem>
								<StepLabel $active={step === Steps.AdminSettings}>
									הגדרות מנהלים
								</StepLabel>
								<StepCircle $active={step === Steps.AdminSettings}>
									2
								</StepCircle>
							</StepItem>
						</StepsRow>

						<FormBody>
							{step === Steps.WorkspaceDetails ? (
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
								<StepTwoPlaceholder>
									<PlaceholderText>הגדרות מנהלים - בקרוב</PlaceholderText>
								</StepTwoPlaceholder>
							)}
						</FormBody>

						<Footer>
							<ClearButton type="button" onClick={handleClear}>
								נקה טופס
							</ClearButton>
							{step === Steps.WorkspaceDetails ? (
								<PrimaryButton
									height={25}
									title="המשך"
									type="button"
									onClick={handleNext}
								/>
							) : (
								<PrimaryButton
									title={isPending ? "שומר..." : "שמור"}
									type="button"
									onClick={form.handleSubmit}
									disabled={isPending}
								/>
							)}
						</Footer>
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
  background: #FAFAFA;
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
  border-top: 2.404px solid #3633FF;
  border-right: 2.404px solid #3633FF;
  border-bottom: 4.807px solid #3633FF;
  border-left: 2.404px solid #3633FF;
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
  overflow-y: auto;
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
  background: #6866ff;
  color: white;
`

const StepCircleCompleted = styled.div`
  ${stepCircleBase}
  background: #e2e2ff;
  color: #6866ff;
  cursor: pointer;
`

const StepCircle = styled.div<{ $active: boolean }>`
  ${stepCircleBase}
  background: ${({ $active }) => ($active ? "#6866ff" : "rgba(0, 0, 0, 0.06)")};
  color: ${({ $active }) => ($active ? "white" : "rgba(0, 0, 0, 0.45)")};
`

const StepLabel = styled.span<{ $active: boolean }>`
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: ${({ $active }) => ($active ? "var(--sea-ink)" : "rgba(0, 0, 0, 0.45)")};
  white-space: nowrap;
`

const StepTail = styled.div<{ $completed: boolean }>`
  flex: 1;
  height: 1px;
  border-block-start: 1px ${({ $completed }) => ($completed ? "solid #6866ff" : "dashed var(--line)")};
`

const FormBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const StepTwoPlaceholder = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
`

const PlaceholderText = styled.span`
  font-size: var(--fs-base);
  color: var(--sea-ink-soft);
`

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  padding-block-start: 8px;
  margin-block-start: 8px;
`

const ClearButton = styled.button`
display: flex;
padding: 0 15px;
flex-direction: column;
justify-content: center;
align-items: center;
gap: 8px;
border-radius: 6px;
border:  1px solid  #D9D9D9;
background:  #FFF;

box-shadow: 0 rgba(0, 0, 0, 0.02);
  color: var(--sea-ink-soft);
`
