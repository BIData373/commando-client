import styled from "@emotion/styled"
import { ChevronDown, Tag, X } from "lucide-react"
import { useRef, useState } from "react"
import { useListTags } from "src/api/tag/tag"
import HighlightMatch from "../shared/HighlightMatch"
import { Popover, PopoverAnchor, PopoverContent } from "../ui/popover"

// ─── Types ───────────────────────────────────────────────────────────────────

interface TagFieldProps {
	workspaceId: number
	tags: string[]
	lockedTags: string[]
	onTagSelect: (tag: string) => void
	onTagRemove: (tag: string) => void
}

// ─── Component ───────────────────────────────────────────────────────────────

function TagField({
	workspaceId,
	tags,
	lockedTags,
	onTagSelect,
	onTagRemove,
}: TagFieldProps) {
	const [tagQuery, setTagQuery] = useState("")
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)

	const { data: availableTags = [] } = useListTags({ workspaceId })

	const filteredTags = availableTags.filter(
		(tag) => tag.name.includes(tagQuery) && !tags.includes(tag.name),
	)

	const isNewTag =
		tagQuery.trim() !== "" &&
		!availableTags.some(({ name }) => name === tagQuery.trim())
	const showDropdown = isDropdownOpen && (filteredTags.length > 0 || isNewTag)

	function handleSelect(tag: string) {
		onTagSelect(tag)
		setTagQuery("")
	}

	function handleCreateNew() {
		if (tagQuery.trim() && !tags.includes(tagQuery.trim())) {
			onTagSelect(tagQuery.trim())
		}
		setTagQuery("")
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter") {
			e.preventDefault()
			if (tagQuery.trim()) {
				const existing = filteredTags.find(
					({ name }) => name === tagQuery.trim(),
				)
				if (existing) {
					handleSelect(existing.name)
				} else {
					handleCreateNew()
				}
			}
		}
	}

	function handleRemoveTag(e: React.MouseEvent, tag: string) {
		e.preventDefault()
		onTagRemove(tag)
	}

	function handleSelectMouseDown(e: React.MouseEvent, tag: string) {
		e.preventDefault()
		handleSelect(tag)
	}

	function handleCreateNewMouseDown(e: React.MouseEvent) {
		e.preventDefault()
		handleCreateNew()
	}

	function handleInputBoxClick() {
		inputRef.current?.focus()
		setIsDropdownOpen(true)
	}

	function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
		setTagQuery(e.target.value)
		if (!isDropdownOpen) setIsDropdownOpen(true)
	}

	function handleFocus() {
		setIsDropdownOpen(true)
	}

	function handleBlur() {
		setTimeout(() => setIsDropdownOpen(false), 200)
	}

	return (
		<FormItem>
			<FormLabelRow>
				<LabelText>תגיות</LabelText>
			</FormLabelRow>
			<Popover open={showDropdown}>
				<TagFieldWrapper>
					<PopoverAnchor asChild>
						<TagInputBox onClick={handleInputBoxClick}>
							<StyledChevronDown size={16} />
							<InputContent>
								{tags.map((tag) => (
									<TagChip key={tag}>
										<TagText>{tag}</TagText>
										{!lockedTags.includes(tag) && (
											<TagRemoveButton
												onMouseDown={(e) => handleRemoveTag(e, tag)}
											>
												<X size={12} />
											</TagRemoveButton>
										)}
									</TagChip>
								))}
								<TagInputField
									ref={inputRef}
									value={tagQuery}
									onChange={handleQueryChange}
									onFocus={handleFocus}
									onBlur={handleBlur}
									onKeyDown={handleKeyDown}
									placeholder={
										tags.length === 0
											? "מאמץ/מבצע/קטגוריה (לדוג': 'שאגת הארי' , הגנה במרחב)"
											: ""
									}
									dir="rtl"
								/>
							</InputContent>
							{tags.length === 0 && <StyledTag size={16} />}
						</TagInputBox>
					</PopoverAnchor>
				</TagFieldWrapper>
				<TagDropdown
					sideOffset={4}
					align="start"
					onOpenAutoFocus={(e) => e.preventDefault()}
					onWheel={(e) => e.stopPropagation()}
				>
					{filteredTags.length > 0 && (
						<SuggestionsHeader>הצעות</SuggestionsHeader>
					)}
					{filteredTags.map(({ name }) => (
						<TagOption
							key={name}
							onMouseDown={(e) => handleSelectMouseDown(e, name)}
						>
							<TagOptionText>
								{tagQuery ? (
									<HighlightMatch text={name} query={tagQuery} />
								) : (
									name
								)}
							</TagOptionText>
						</TagOption>
					))}
					{isNewTag && (
						<>
							{filteredTags.length > 0 && <Divider />}
							<TagOption onMouseDown={handleCreateNewMouseDown}>
								<HighlightedText>{tagQuery}</HighlightedText>
								<span> (חדש)</span>
							</TagOption>
						</>
					)}
				</TagDropdown>
			</Popover>
		</FormItem>
	)
}

export default TagField

// ─── Styled ─────────────────────────────────────────────────────────────────

const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
`

const FormLabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0px;
  padding-block-end: 8px;
  width: 100%;
`

const LabelText = styled.span`
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-2);
  white-space: nowrap;
`

const TagFieldWrapper = styled.div`
position: relative;
width: 100%;
`

const TagInputBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  padding-inline: 11px;
  background: var(--background);
  border: 1px solid var(--card-border);
  border-radius: 8px;
  gap: 4px;
  cursor: text;

  &:focus-within {
    border-color: var(--active-color);
    box-shadow: var(--shadow-textarea-focus);
  }
`

const InputContent = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 40px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-block: 2px;
  min-width: 0;
  direction: rtl;
`

const TagInputField = styled.input`
  direction: rtl;
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--fs-base);
  font-weight: 400;
  line-height: 18px;
  color: var(--text-color-2);
  min-width: 60px;
  text-align: start;

  &::placeholder {
    color: var(--Text-color-text-placeholder);
  }
`

const TagChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 1px 8px;
  background: var(--card-background);
  border-radius: 4px;
  flex-shrink: 0;
`

const TagText = styled.span`
  font-size: var(--fs-sm);
  font-weight: 400;
  line-height: 20px;
  color: var(--text-color-2);
  white-space: nowrap;
`

const TagRemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--text-color-400);
  padding: 0;

  &:hover {
    color: var(--text-color-2);
  }
`

const TagDropdown = styled(PopoverContent)`
  width: var(--radix-popover-trigger-width);
  z-index: var(--z-dropdown);
  max-height: 150px;
  overflow-y: auto;
  padding: 4px;
  border-radius: 8px;
  direction: rtl;
  animation: none !important;
  gap: 0;
`

const SuggestionsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 32px;
  padding-inline: 12px;
  padding-block: 5px;
  font-size: var(--fs-btn);
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color-400);
  white-space: nowrap;
`

const TagOption = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 32px;
  padding-inline: 12px;
  padding-block: 5px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  direction: rtl;
  font-size: var(--fs-btn);
  line-height: 22px;
  color: var(--text-color-2);
  flex-shrink: 0;

  &:hover {
    background: var(--link-bg-hover);
  }
`

const TagOptionText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const HighlightedText = styled.span`
  font-weight: 700;
`

const StyledChevronDown = styled(ChevronDown)`
  color: var(--Text-color-text-placeholder);
`
const StyledTag = styled(Tag)`
  color: var(--Text-color-text-placeholder);
`
const Divider = styled.div`
  height: 1px;
  background: var(--line);
  margin-block: 4px;
`
