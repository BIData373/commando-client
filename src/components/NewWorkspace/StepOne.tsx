import styled from "@emotion/styled"
import { CircleHelp, X } from "lucide-react"
import type { IMesibaIcon } from "src/hooks/useMesiba"
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

const NAME_MAX_LENGTH = 50
const DATA_COUNTER_CLASS = "data-char-counter"

interface StepOneErrors {
	title?: string
	urlName?: string
	pikudId?: string
}

interface StepOneProps {
	title: string
	urlName: string
	pikudId: number | undefined
	icon: string | null
	iconSearch: string
	showErrors: boolean
	errors: StepOneErrors
	onTitleChange(value: string): void
	onUrlNameChange(value: string): void
	onPikudChange(value: number): void
	onIconSelect(icon: IMesibaIcon): void
	onIconSearchChange(value: string): void
	onIconClear(): void
	onIconSearchClear(): void
}

export function StepOne({
	title,
	urlName,
	pikudId,
	icon,
	iconSearch,
	showErrors,
	errors,
	onTitleChange,
	onUrlNameChange,
	onPikudChange,
	onIconSelect,
	onIconSearchChange,
	onIconClear,
	onIconSearchClear,
}: StepOneProps) {
	function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
		onTitleChange(e.target.value.slice(0, NAME_MAX_LENGTH))
	}

	function handleUrlNameChange(e: React.ChangeEvent<HTMLInputElement>) {
		const sanitized = e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, "")
		onUrlNameChange(sanitized)
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
						value={title}
						onChange={handleTitleChange}
						placeholder="למשל ‘לשכת אלוף פד”ם’"
						maxLength={NAME_MAX_LENGTH}
					/>
					<CharCounter
						$atLimit={title.length >= NAME_MAX_LENGTH}
						className={DATA_COUNTER_CLASS}
					>
						{title.length}/{NAME_MAX_LENGTH}
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
									שם זה ישמש כזיהוי ייחודי בכתובת ה-URL. השתמש באותיות גדולות
									ומספרים בלבד, ללא רווחים.
								</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</UrlNameLabelRow>
				<StyledInput
					value={urlName}
					onChange={handleUrlNameChange}
					placeholder="למשל ”LISHKAT_PADAM”"
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
					value={pikudId}
					onChange={onPikudChange}
					placeHolder="חפש יחידה"
				/>
			</FormField>

			<FormField label="סמל">
				<IconDropdown
					value={iconSearch}
					onChange={onIconSearchChange}
					onClear={onIconSearchClear}
					onSelect={onIconSelect}
					placeHolder="חפש יחידה"
				/>
				<IconPreview>
					{icon ? (
						<>
							<IconClearButton type="button" onClick={onIconClear}>
								<X size={16} />
							</IconClearButton>
							<IconImg
								src={formatMesibaIcon(icon)}
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
  color: var(--color-error, #ef4444);
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
  gap: 4px;;
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
