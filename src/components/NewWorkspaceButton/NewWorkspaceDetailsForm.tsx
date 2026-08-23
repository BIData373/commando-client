import styled from "@emotion/styled"
import { useForm, useStore } from "@tanstack/react-form"
import { CircleHelp, X } from "lucide-react"
import { useState } from "react"
import type { IMesibaIcon } from "src/hooks/useMesiba"
import { DATA_COUNTER_CLASS, NAME_MAX_LENGTH } from "src/utils/const-utils"
import { formatMesibaIcon } from "src/utils/icon-utils"
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

interface NewWorkspaceDetailsErrors {
	title?: string
	urlName?: string
	pikudId?: string
}

export interface NewWorkspaceDetailsValues {
	title: string
	urlName: string
	pikudId: number | undefined
	icon: string | null
}

interface NewWorkspaceDetailsProps {
	serverErrors: NewWorkspaceDetailsErrors
	showErrors: boolean
	initialValues: NewWorkspaceDetailsValues
	setFormValues(values: NewWorkspaceDetailsValues): void
}

export function NewWorkspaceDetailsForm({
	serverErrors,
	showErrors,
	initialValues,
	setFormValues,
}: NewWorkspaceDetailsProps) {
	const [iconSearch, setIconSearch] = useState(initialValues.icon ?? "")

	const form = useForm({
		defaultValues: initialValues,
	})
	const values = useStore(form.store, (s) => s.values)

	const errors: NewWorkspaceDetailsErrors = {
		title: !values.title.trim() ? "שדה חובה" : serverErrors.title,
		urlName: !values.urlName ? "שדה חובה" : serverErrors.urlName,
		pikudId: !values.pikudId ? "שדה חובה" : undefined,
	}

	function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const title = e.target.value.slice(0, NAME_MAX_LENGTH)
		form.setFieldValue("title", title)
		setFormValues({ ...values, title })
	}

	function handleUrlNameChange(e: React.ChangeEvent<HTMLInputElement>) {
		const urlName = e.target.value.replace(/[^a-zA-Z0-9_]/g, "")
		form.setFieldValue("urlName", urlName)
		setFormValues({ ...values, urlName })
	}

	function handlePikudChange(value: number) {
		form.setFieldValue("pikudId", value)
		setFormValues({ ...values, pikudId: value })
	}

	function handleIconSelect(icon: IMesibaIcon) {
		form.setFieldValue("icon", icon.iconName)
		setIconSearch(icon.heb_name)
		setFormValues({ ...values, icon: icon.iconName })
	}

	function handleIconClear() {
		form.setFieldValue("icon", null)
		setIconSearch("")
		setFormValues({ ...values, icon: null })
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
		</Root>
	)
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
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
