import styled from "@emotion/styled"
import { xor } from "lodash"
import { Search } from "lucide-react"
import { type ReactNode, useState } from "react"
import { Checkbox } from "../ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { EmptyCardState } from "./EmptyCardState"

interface FilterOption<T extends string | number> {
	value: T
	label: string
	icon?: ReactNode
}

interface FilterDropdownProps<T extends string | number> {
	options: FilterOption<T>[]
	activeValues: T[]
	onApply: (values: T[]) => void
	onOpenChange?: (open: boolean) => void
	searchable?: boolean
	searchPlaceholder?: string
	emptyTitle?: string
	emptyDescription?: string
	children: ReactNode
}

function FilterDropdown<T extends string | number>({
	options,
	activeValues,
	onApply,
	onOpenChange,
	searchable = false,
	searchPlaceholder = "חפש...",
	emptyTitle,
	emptyDescription,
	children,
}: FilterDropdownProps<T>) {
	const [open, setOpen] = useState(false)
	const [search, setSearch] = useState("")
	const [pendingValues, setPendingValues] = useState<T[]>(activeValues)

	const isEmpty = options.length === 0

	const filteredOptions = search
		? options.filter((option) =>
				option.label.toLowerCase().includes(search.toLowerCase()),
			)
		: options

	function handleOpenChange(nextOpen: boolean) {
		if (nextOpen) {
			setPendingValues(activeValues)
			setSearch("")
		}
		setOpen(nextOpen)
		onOpenChange?.(nextOpen)
	}

	function handleToggle(value: T) {
		setPendingValues((prev) => xor(prev, [value]))
	}

	function handleApply() {
		onApply(pendingValues)
		setOpen(false)
		onOpenChange?.(false)
	}

	function handleReset() {
		setPendingValues([])
	}

	return (
		<Popover open={open} onOpenChange={handleOpenChange}>
			<PopoverTrigger asChild>{children}</PopoverTrigger>

			<StyledPopoverContent align="start" sideOffset={4}>
				{searchable && !isEmpty && (
					<SearchRow>
						<SearchWrapper>
							<Search opacity={0.5} size={14} />
							<SearchField
								placeholder={searchPlaceholder}
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</SearchWrapper>
					</SearchRow>
				)}

				{isEmpty ? (
					<EmptyMessage>לא נמצאו ערכים המתאימים לסנן זה</EmptyMessage>
				) : (
					<OptionsList>
						{filteredOptions.length === 0 && emptyTitle ? (
							<EmptyCardState
								title={emptyTitle}
								description={emptyDescription}
							/>
						) : (
							filteredOptions.map((option) => (
								<OptionItem
									key={option.value}
									onClick={() => handleToggle(option.value)}
								>
									<OptionRow>
										<Checkbox
											checked={pendingValues.includes(option.value)}
											onCheckedChange={() => handleToggle(option.value)}
											onClick={(e) => e.stopPropagation()}
										/>
										{option.icon}
										<OptionLabel>{option.label}</OptionLabel>
									</OptionRow>
								</OptionItem>
							))
						)}
					</OptionsList>
				)}
				<Footer>
					<ApplyButton onClick={handleApply}>
						החל
						{(isEmpty || pendingValues.length > 0) &&
							` (${pendingValues.length})`}
					</ApplyButton>
					<ResetButton
						type="button"
						disabled={pendingValues.length === 0}
						onClick={handleReset}
					>
						איפוס
					</ResetButton>
				</Footer>
			</StyledPopoverContent>
		</Popover>
	)
}

export { FilterDropdown }
export type { FilterOption }

// ─── Styled ─────────────────────────────────────────────────────────────────

const StyledPopoverContent = styled(PopoverContent)`
  direction: rtl;
  width: 248px;
  padding: 0;
  gap: 0;
  border-radius: 6px;
  box-shadow: var(--boxShadowSecondary);
`

const SearchRow = styled.div`
  direction: rtl;
  display: flex;
  padding: 7px 8px;
  border-bottom: 1px solid var(--line);
`

const SearchWrapper = styled.div`
  direction: rtl;
  display: flex;
  flex: 1;
  align-items: center;
  gap: 4px;
  height: 32px;
  padding-inline-start: 11px;
  border: 1px solid var(--card-border);
  border-radius: 6px;

  &:focus-within {
    border-color: var(--button-color-hover);
  }
`

const SearchField = styled.input`
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-2);
  text-align: right;
  direction: rtl;

  &::placeholder {
    color: var(--Text-color-text-placeholder);
  }
`

const EmptyMessage = styled.div`
  direction: rtl;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  margin: 8px;
  padding: 5px 12px;
  border-radius: 4px;
  text-align: center;
  font-size: var(--fs-btn);
  line-height: 22px;
  color: rgba(0, 0, 0, 0.45);
`

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  max-height: 220px;
  overflow-y: scroll;
  direction: ltr;
`

const OptionItem = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 32px;
  padding: 0 12px;
  border: none;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;

  &:hover {
    background: var(--link-bg-hover);
  }
`

const OptionRow = styled.div`
  direction: rtl;
  display: flex;
  align-items: center;
  align-self: flex-end;
  gap: 8px;
  width: 100%;
`

const OptionLabel = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
  font-size: var(--fs-btn);
  line-height: 22px;
  color: var(--text-color-2);
`

const Footer = styled.div`
  direction: ltr;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 8px;
  border-top: 1px solid var(--line);
`

const ApplyButton = styled.button`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding: 0 7px;
  border: none;
  border-radius: 4px;
  background: linear-gradient(165deg, var(--purple-start) 0%, var(--purple-end) 100%);
  color: var(--primary-foreground);
  font-size: var(--fs-btn);
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.9;
  }
`

const ResetButton = styled.button`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding: 0 7px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--sea-ink-soft);
  font-size: var(--fs-btn);
  cursor: pointer;

  &:disabled {
    color: var(--Text-color-text-placeholder);
    cursor: default;
  }

  &:hover:not(:disabled) {
    background: var(--link-bg-hover);
  }
`
