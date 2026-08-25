import styled from "@emotion/styled"
import { useForm, useStore } from "@tanstack/react-form"
import { CircleHelp, X } from "lucide-react"
import { useState } from "react"
import type { CreateWorkspaceRequestDto } from "src/api/model"
import type { IMesibaIcon } from "src/hooks/useMesiba"
import { formatMesibaIcon } from "src/utils/icon-utils"
import {
	DATA_COUNTER_CLASS,
	NAME_MAX_LENGTH,
	type WorkspaceDetailsErrors,
} from "src/utils/workspace-utils"
import { IconDropdown } from "../settings/IconDropdown"
import { SelectCommand } from "../settings/SelectCommand"
import { FormField } from "../shared/FormField"
import { Input } from "../ui/input"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip"
import { StepFooter } from "./StepFooter"

const REQUIRED_ERROR_MESSAGE = "שדה חובה"

interface NewWorkspaceDetailsProps {
	serverErrors: WorkspaceDetailsErrors
	showErrors: boolean
	initialValues: CreateWorkspaceRequestDto
	setFormValues(values: CreateWorkspaceRequestDto): void
	onNext(): void
	onClear(): void
}

export function NewWorkspaceDetailsForm({
	serverErrors,
	showErrors,
	initialValues,
	setFormValues,
	onNext,
	onClear,
}: NewWorkspaceDetailsProps) {
	const [iconSearch, setIconSearch] = useState(initialValues.icon ?? "")

	const form = useForm({
		defaultValues: initialValues,
	})
	const values = useStore(form.store, (s) => s.values)

	const errors: WorkspaceDetailsErrors = {
		title: !values.title.trim() ? REQUIRED_ERROR_MESSAGE : serverErrors.title,
		urlName: !values.urlName ? REQUIRED_ERROR_MESSAGE : serverErrors.urlName,
		pikudId: !values.pikudId ? REQUIRED_ERROR_MESSAGE : undefined,
	}

	function updateField(...[key, value]: Parameters<typeof form.setFieldValue>) {
		form.setFieldValue(key, value)
		setFormValues({ ...values, [key]: value })
	}

	function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
		updateField("title", e.target.value.slice(0, NAME_MAX_LENGTH))
	}

	function handleUrlNameChange(e: React.ChangeEvent<HTMLInputElement>) {
		updateField("urlName", e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))
	}

	function handlePikudChange(value: number) {
		updateField("pikudId", value)
	}

	function handleIconSelect(icon: IMesibaIcon) {
		setIconSearch(icon.heb_name)
		updateField("icon", icon.iconName)
	}

	function handleIconClear() {
		setIconSearch("")
		updateField("icon", null)
	}

	function handleIconSearchChange(value: string) {
		setIconSearch(value)
	}

	function handleIconSearchClear() {
		setIconSearch("")
	}

	function handleImageNotFound(e: React.SyntheticEvent<HTMLImageElement>) {
		e.currentTarget.onerror = null
		e.currentTarget.src = "/workspace-icon.png"
	}

	return (
		<Root>
			<FormField
				label="שם הסביבה"
				required
				error={showErrors ? errors.title : undefined}
			>
				<InputWrapper>
					<StyledInput
						value={values.title}
						onChange={handleTitleChange}
						placeholder="למשל 'לשכת אלוף פד&quot;ם'"
						maxLength={NAME_MAX_LENGTH}
					/>
					<CharCounter
						$atLimit={values.title.length >= NAME_MAX_LENGTH}
						className={DATA_COUNTER_CLASS}
					>
						{values.title.length}/{NAME_MAX_LENGTH}
					</CharCounter>
				</InputWrapper>
			</FormField>

			<UrlNameField>
				<UrlNameLabelRow>
					<RequiredMark>*</RequiredMark>
					<LabelText>שם לתצוגה בדפדפן-באנגלית ללא רווחים</LabelText>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<InfoButton type="button">
									<CircleHelp size={16} />
								</InfoButton>
							</TooltipTrigger>
							<TooltipContent side="top">
								<p>
									שם זה ישמש כזיהוי ייחודי בכתובת ה-URL. השתמש באותיות ומספרים
									בלבד, ללא רווחים.
								</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</UrlNameLabelRow>
				<StyledInput
					value={values.urlName}
					onChange={handleUrlNameChange}
					placeholder='למשל "lishkat_padam"'
				/>
				{showErrors && errors.urlName && (
					<ErrorText>{errors.urlName}</ErrorText>
				)}
			</UrlNameField>

			<FormField
				label="שיוך פיקודי"
				required
				error={showErrors ? errors.pikudId : undefined}
			>
				<SelectCommand
					value={values.pikudId}
					onChange={handlePikudChange}
					placeholder="חפש יחידה"
				/>
			</FormField>

			<FormField label="סמל">
				<IconDropdown
					value={iconSearch}
					onChange={handleIconSearchChange}
					onClear={handleIconSearchClear}
					onSelect={handleIconSelect}
					placeholder="חפש יחידה"
				/>
				<IconPreview>
					{values.icon ? (
						<>
							<IconClearButton type="button" onClick={handleIconClear}>
								<X size={16} />
							</IconClearButton>
							<IconImg
								src={formatMesibaIcon(values.icon)}
								onError={handleImageNotFound}
							/>
						</>
					) : (
						<IconPlaceholderWrapper>
							<IconPlaceholderMain>כאן יופיע הסמל שנבחר</IconPlaceholderMain>
							<IconPlaceholderSub>
								כלל הסמלים נמשכים ממאגר מסיב&quot;ה
							</IconPlaceholderSub>
						</IconPlaceholderWrapper>
					)}
				</IconPreview>
			</FormField>

			<StepFooter
				primaryLabel="המשך"
				onPrimary={onNext}
				secondaryLabel="נקה טופס"
				onSecondary={onClear}
			/>
		</Root>
	)
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  gap: 16px;
  width: 100%;
`

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;

  &:hover .${DATA_COUNTER_CLASS},
  &:focus-within .${DATA_COUNTER_CLASS} {
    opacity: 1;
  }
`

const StyledInput = styled(Input)`
  background: var(--background);
  width: 100%;
`

const CharCounter = styled.span<{ $atLimit: boolean }>`
  font-size: var(--fs-sm);
  color: ${({ $atLimit }) => ($atLimit ? "var(--color-danger)" : "var(--sea-ink-soft)")};
  text-align: end;
  opacity: 0;
  transition: opacity 0.15s;
`

const UrlNameField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  direction: rtl;
  align-items: flex-start;
`

const UrlNameLabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const RequiredMark = styled.span`
  color: var(--Components-Form-Component-labelRequiredMarkColor);
  font-size: var(--fs-btn);
`

const LabelText = styled.span`
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
`

const InfoButton = styled.button`
  display: flex;
  align-items: center;
  color: var(--sea-ink-soft);
  background: none;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: var(--sea-ink);
  }
`

const ErrorText = styled.span`
  font-size: 13px;
  color: var(--Error-color-error);
  line-height: 18px;
`

const IconPreview = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--card-border);
  border-radius: 6px;
  padding: 36px 10px;
  gap: 4px;
  height: 138px;
  width: 100%;
`

const IconImg = styled.img`
  width: 80px;
  object-fit: contain;
`

const IconPlaceholderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`

const IconPlaceholderMain = styled.span`
  font-size: var(--fs-base);
  color: var(--sea-ink-soft);
  font-weight: 600;
  opacity: 0.6;
`

const IconPlaceholderSub = styled.span`
  font-size: var(--fs-btn);
  color: var(--sea-ink-soft);
  opacity: 0.6;
`

const IconClearButton = styled.button`
  position: absolute;
  inset-block-start: 8px;
  inset-inline-end: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: transparent;
  color: var(--sea-ink-soft);
  cursor: pointer;

  &:hover {
    background: var(--link-bg-hover);
    color: var(--sea-ink);
  }
`
