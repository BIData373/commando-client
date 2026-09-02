import styled from "@emotion/styled"
import type { AnyFieldApi } from "@tanstack/form-core"
import { Calendar as CalendarIcon, ChevronDown, Paperclip } from "lucide-react"
import { useState } from "react"
import type { SourceDto } from "src/api/model"
import { useListSources } from "src/api/source/source"
import type { DatePickerValue } from "src/utils/date-utils"
import { formatDate, formatDateShort } from "../../functions/date-utils"
import DatePicker, { CalendarMode } from "../shared/DatePicker"
import { FormField } from "../shared/FormField"
import HighlightMatch from "../shared/HighlightMatch"
import {
	Popover,
	PopoverAnchor,
	PopoverContent,
	PopoverTrigger,
} from "../ui/popover"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip"

export interface SourceFieldValidation {
	name?: AnyFieldApi
	date?: AnyFieldApi
}

interface SourceFieldProps {
	workspaceId: number
	source: string
	sourceDate: Date | null
	linkedSource: SourceDto | null
	onSourceSelect: (name: string, discussion?: SourceDto | null) => void
	onDateSelect: (date: Date | undefined) => void
	label?: string
	uniqueNames?: boolean
	fields?: SourceFieldValidation
	required?: boolean
	hideDateLabel?: boolean
}

export default function SourceField({
	workspaceId,
	source,
	sourceDate,
	linkedSource,
	onSourceSelect,
	onDateSelect,
	label,
	uniqueNames = false,
	fields,
	required = false,
	hideDateLabel = false,
}: SourceFieldProps) {
	const [sourceQuery, setSourceQuery] = useState(source)
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const [isDateOpen, setIsDateOpen] = useState(false)
	const isSourceLinked = linkedSource !== null

	const { data: sources = [] } = useListSources({ workspaceId })

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const value = e.target.value
		setSourceQuery(value)
		onSourceSelect(value, null)
		if (!isDropdownOpen) setIsDropdownOpen(true)
	}
	function handleSelect(discussion: SourceDto) {
		setSourceQuery(discussion.name)
		setIsDropdownOpen(false)
		onSourceSelect(discussion.name, discussion)
	}

	function handleCreateNew() {
		setIsDropdownOpen(false)
		onSourceSelect(sourceQuery)
	}

	const selectedDate = sourceDate ?? undefined

	const allFiltered = sources.filter((d) => d.name.includes(sourceQuery))
	const filteredDiscussions = uniqueNames
		? allFiltered.filter(
				(d, i, arr) => arr.findIndex((x) => x.name === d.name) === i,
			)
		: allFiltered

	function openDropdown() {
		setIsDropdownOpen(true)
	}

	function handleInputBlur() {
		setTimeout(() => setIsDropdownOpen(false), 200)
	}

	function handleOptionMouseDown(e: React.MouseEvent, discussion: SourceDto) {
		e.preventDefault()
		handleSelect(discussion)
	}

	function handleCreateNewMouseDown(e: React.MouseEvent) {
		e.preventDefault()
		handleCreateNew()
	}

	function handleDateSelect(value: DatePickerValue | undefined) {
		const date = value instanceof Date ? value : undefined
		onDateSelect(date)
		setIsDateOpen(false)
	}

	return (
		<SourceDateRow>
			<SourceFormItem>
				<FormField required={required} field={fields?.name} label={label}>
					<Popover
						open={
							isDropdownOpen &&
							(!!sourceQuery || filteredDiscussions.length > 0)
						}
					>
						<PopoverAnchor asChild>
							<SourceInputBox
								onClick={openDropdown}
								$error={!!fields?.name?.state.meta.errors.length}
							>
								<SourceChevron size={16} />
								<SourceInputField
									value={sourceQuery}
									onChange={handleInputChange}
									onFocus={openDropdown}
									onBlur={handleInputBlur}
									placeholder='לדוגמה: חתמ"צ שבועי'
									dir="rtl"
								/>
								{linkedSource && !!linkedSource?.attachmentKey && (
									<Paperclip size={16} />
								)}
							</SourceInputBox>
						</PopoverAnchor>
						<SourceDropdown
							sideOffset={4}
							align="start"
							onOpenAutoFocus={(e) => e.preventDefault()}
							onWheel={(e) => e.stopPropagation()}
						>
							{filteredDiscussions.length > 0 && (
								<>
									<DropdownGroupTitle>מקורות קיימים</DropdownGroupTitle>
									{filteredDiscussions.map((d) => (
										<SourceOption
											key={uniqueNames ? d.name : d.id}
											onMouseDown={(e) => handleOptionMouseDown(e, d)}
										>
											{!uniqueNames && d.date && (
												<SourceOptionDate>
													{formatDateShort(d.date)}
												</SourceOptionDate>
											)}
											<SourceOptionName>
												{sourceQuery ? (
													<HighlightMatch text={d.name} query={sourceQuery} />
												) : (
													d.name
												)}
											</SourceOptionName>
										</SourceOption>
									))}
								</>
							)}
							{sourceQuery && (
								<>
									<DropdownDivider />
									<CreateNewOption onMouseDown={handleCreateNewMouseDown}>
										<CreateNewText>
											<HighlightedText>{sourceQuery}</HighlightedText>
											{" (חדש)"}
										</CreateNewText>
									</CreateNewOption>
								</>
							)}
						</SourceDropdown>
					</Popover>
				</FormField>
			</SourceFormItem>
			<DateFormItem $alignEnd={hideDateLabel}>
				<FormField
					field={fields?.date}
					label={hideDateLabel ? "" : "תאריך"}
					required={required}
				>
					<Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<PopoverTrigger asChild>
										<DatePickerButton
											$disabled={isSourceLinked}
											$error={!!fields?.date?.state.meta.errors.length}
										>
											<CalendarIcon size={18} />
											<DatePickerText $hasValue={!!sourceDate}>
												{sourceDate ? formatDate(sourceDate) : "בחר תאריך"}
											</DatePickerText>
										</DatePickerButton>
									</PopoverTrigger>
								</TooltipTrigger>
								{isSourceLinked && (
									<TooltipContent side="top" sideOffset={8}>
										לא ניתן לשנות תאריך של מקור קיים
									</TooltipContent>
								)}
							</Tooltip>
						</TooltipProvider>
						{!isSourceLinked && (
							<DatePopoverContent align="start" sideOffset={4}>
								<DatePicker
									mode={CalendarMode.Single}
									selected={selectedDate}
									onSelect={handleDateSelect}
									showWeekNumber={false}
								/>
							</DatePopoverContent>
						)}
					</Popover>
				</FormField>
			</DateFormItem>
		</SourceDateRow>
	)
}

const LabelText = styled.span`
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
`

const SourceDateRow = styled.div`
  direction: rtl;
  display: flex;
  gap: 20px;
  align-items: flex-start;
  width: 100%;
`

const SourceFormItem = styled.div`
  direction: ltr;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex: 1;
  min-width: 0;
  align-self: flex-end;
`

const DateFormItem = styled.div<{ $alignEnd?: boolean }>`
  direction: ltr;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  align-self: ${({ $alignEnd }) => ($alignEnd ? "flex-end" : "flex-start")};
  width: 160px;
  flex-shrink: 0;
`

const SourceInputBox = styled.div<{ $error?: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  padding-inline: 11px;
  background: var(--background);
  border: 1px solid ${({ $error }) => ($error ? "var(--Components-Form-Component-labelRequiredMarkColor)" : "var(--card-border)")};
  border-radius: 8px;
  gap: 4px;
  cursor: text;
  direction: ltr;

  &:focus-within {
    border-color: ${({ $error }) => ($error ? "var(--Components-Form-Component-labelRequiredMarkColor)" : "var(--button-color-hover)")};
    box-shadow: 0 0 0 2px ${({ $error }) => ($error ? "rgba(255, 77, 79, 0.1)" : "rgba(5, 145, 255, 0.1)")};
  }
`

const SourceChevron = styled(ChevronDown)`
  color: var(--Text-color-text-placeholder);
  flex-shrink: 0;
`

const SourceInputField = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--fs-base);
  font-weight: 400;
  line-height: 24px;
  color: var(--text-color-2);
  min-width: 0;

  &::placeholder {
    color: var(--Text-color-text-placeholder);
  }
`

const SourceDropdown = styled(PopoverContent)`
  width: var(--radix-popover-trigger-width);
  z-index: var(--z-dropdown);
  max-height: 176px;
  overflow-y: auto;
  padding: 4px;
  border-radius: 8px;
  animation: none !important;
  gap: 0;
`

const DropdownGroupTitle = styled.div`
  padding: 5px 12px;
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-400);
  text-align: start;
`

const DropdownDivider = styled.div`
  height: 1px;
  background: var(--line);
  margin-block: 4px;
`

const SourceOption = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 32px;
  padding-inline: 12px;
  padding-block: 5px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  direction: ltr;

  &:hover {
    background: var(--link-bg-hover);
  }
`

const SourceOptionName = styled.span`
  flex: 1;
  font-size: var(--fs-btn);
  line-height: 22px;
  color: var(--text-color-2);
  text-align: end;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const HighlightedText = styled.span`
  font-weight: 700;
`

const SourceOptionDate = styled.span`
  flex-shrink: 0;
  font-size: var(--fs-sm);
  line-height: 20px;
  color: var(--text-color-400);
`

const CreateNewOption = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 32px;
  padding-inline: 12px;
  padding-block: 5px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  font-size: var(--fs-btn);
  color: var(--text-color-2);

  &:hover {
    background: var(--link-bg-hover);
  }
`

const CreateNewText = styled.span`
  line-height: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: start;
`

const DatePickerButton = styled.button<{
	$disabled?: boolean
	$error?: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  width: 160px;
  height: 40px;
  padding-inline: 12px;
  background: var(--background);
  border: 1px solid ${({ $error }) => ($error ? "var(--Components-Form-Component-labelRequiredMarkColor)" : "var(--card-border)")};
  border-radius: 6px;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  color: var(--text-color-400);
  flex-shrink: 0;

  &:hover {
    border-color: ${({ $disabled, $error }) => ($disabled ? "var(--card-border)" : $error ? "var(--Components-Form-Component-labelRequiredMarkColor)" : "var(--button-color-hover)")};
  }
`

const DatePickerText = styled.span<{ $hasValue: boolean }>`
  flex: auto;
  text-align: right;
  font-size: var(--fs-base);
  font-weight: 400;
  line-height: 24px;
  color: ${({ $hasValue }) => ($hasValue ? "var(--text-color-2)" : "var(--Text-color-text-placeholder)")};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const DatePopoverContent = styled(PopoverContent)`
  width: auto;
  padding: 0;
  z-index: var(--z-dropdown);
`
