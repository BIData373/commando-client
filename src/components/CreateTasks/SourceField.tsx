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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip"

// ─── Types ───────────────────────────────────────────────────────────────────

interface SourceFieldProps {
	workspaceId: number
	source: string
	sourceDate: Date | null
	linkedSource: SourceDto | null
	onSourceSelect: (name: string, discussion?: SourceDto | null) => void
	onDateSelect: (date: Date | undefined) => void
	label?: string
	uniqueNames?: boolean
	dateField?: AnyFieldApi
	required?: boolean
}

// ─── Component ───────────────────────────────────────────────────────────────

function SourceField({
	workspaceId,
	source,
	sourceDate,
	linkedSource,
	onSourceSelect,
	onDateSelect,
	label = "מקור",
	uniqueNames = false,
	dateField,
	required = false,
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
				<FormField label={label} required={required}>
					<SourceFieldWrapper>
						<SourceInputBox onFocus={openDropdown}>
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
						{isDropdownOpen &&
							(sourceQuery || filteredDiscussions.length > 0) && (
								<DropdownMenu>
									{filteredDiscussions.length > 0 && (
										<>
											<DropdownGroupTitle>מקורות קיימים</DropdownGroupTitle>
											{filteredDiscussions.map((d) => (
												<SourceOption
													key={uniqueNames ? d.name : d.id}
													onMouseDown={(e) => handleOptionMouseDown(e, d)}
												>
													{!uniqueNames && (
														<SourceOptionDate>
															{formatDateShort(d.date)}
														</SourceOptionDate>
													)}
													<SourceOptionName>
														{sourceQuery ? (
															<HighlightMatch
																text={d.name}
																query={sourceQuery}
															/>
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
								</DropdownMenu>
							)}
					</SourceFieldWrapper>
				</FormField>
			</SourceFormItem>
			<DateFormItem>
				<FormField field={dateField} label="תאריך" required={required}>
					<Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<PopoverTrigger asChild>
										<DatePickerButton
											$disabled={isSourceLinked}
											$error={!!dateField?.state.meta.errors.length}
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
								/>
							</DatePopoverContent>
						)}
					</Popover>
				</FormField>
			</DateFormItem>
		</SourceDateRow>
	)
}

export default SourceField

// ─── Styled ─────────────────────────────────────────────────────────────────

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
`

const DateFormItem = styled.div`
  direction: ltr;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 160px;
  flex-shrink: 0;
`

const SourceFieldWrapper = styled.div`
  direction: ltr;
  position: relative;
  width: 100%;
`

const SourceInputBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  padding-inline: 11px;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  gap: 4px;
  cursor: text;

  &:focus-within {
    border-color: #4096ff;
    box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
  }
`

const SourceChevron = styled(ChevronDown)`
  color: rgba(0, 0, 0, 0.25);
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
  color: rgba(0, 0, 0, 0.88);
  min-width: 0;

  &::placeholder {
    color: rgba(0, 0, 0, 0.25);
  }
`

const DropdownMenu = styled.div`
  position: absolute;
  inset-block-start: calc(100% + 4px);
  inset-inline: 0;
  z-index: 40;
  background: white;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow:
    0px 6px 16px rgba(0, 0, 0, 0.08),
    0px 3px 6px rgba(0, 0, 0, 0.12),
    0px 9px 28px rgba(0, 0, 0, 0.05);
  max-height: 176px;
  overflow-y: auto;
  padding: 4px;
`

const DropdownGroupTitle = styled.div`
  padding: 5px 12px;
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.45);
  text-align: end;
`

const DropdownDivider = styled.div`
  height: 1px;
  background: #f0f0f0;
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

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`

const SourceOptionName = styled.span`
  flex: 1;
  font-size: var(--fs-btn);
  line-height: 22px;
  color: rgba(0, 0, 0, 0.88);
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
  color: rgba(0, 0, 0, 0.45);
`

const CreateNewOption = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 32px;
  padding-inline: 12px;
  padding-block: 5px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  font-size: var(--fs-btn);
  color: rgba(0, 0, 0, 0.88);

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`

const CreateNewText = styled.span`
  line-height: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: end;
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
  background: white;
  border: 1px solid ${({ $error }) => ($error ? "#ff4d4f" : "#d9d9d9")};
  border-radius: 6px;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  color: rgba(0, 0, 0, 0.45);
  flex-shrink: 0;

  &:hover {
    border-color: ${({ $disabled, $error }) => ($disabled ? "#d9d9d9" : $error ? "#ff4d4f" : "#4096ff")};
  }
`

const DatePickerText = styled.span<{ $hasValue: boolean }>`
  flex: auto;
  text-align: right;
  font-size: var(--fs-base);
  font-weight: 400;
  line-height: 24px;
  color: ${({ $hasValue }) => ($hasValue ? "rgba(0, 0, 0, 0.88)" : "rgba(0, 0, 0, 0.25)")};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const DatePopoverContent = styled(PopoverContent)`
  width: auto;
  padding: 0;
  z-index: var(--z-dropdown);
`
