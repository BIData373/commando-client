import styled from "@emotion/styled"
import { Search, X } from "lucide-react"
import { Popover as PopoverPrimitive } from "radix-ui"
import type { ReactNode } from "react"
import { useRef, useState } from "react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"
import { Spinner } from "../ui/spinner"

interface SearchDropdownProps<T> {
	items: T[]
	renderItem: (item: T) => ReactNode
	onSelect: (item: T) => void
	value: string
	onChange: (value: string) => void
	placeholder?: string
	isLoading?: boolean
	onClear?: () => void
	selectedItem?: T
	getItemKey: (item: T) => string | number
}

export function SearchDropdown<T>({
	items,
	renderItem,
	onSelect,
	value,
	onChange,
	placeholder,
	isLoading,
	onClear,
	selectedItem,
	getItemKey,
}: SearchDropdownProps<T>) {
	const [isOpen, setIsOpen] = useState(false)
	const [isFocused, setIsFocused] = useState(false)
	const wheelCleanupRef = useRef<(() => void) | null>(null)

	function handleContentRef(el: HTMLDivElement | null) {
		wheelCleanupRef.current?.()
		wheelCleanupRef.current = null
		if (!el) return
		const stop = (e: WheelEvent) => e.stopPropagation()
		el.addEventListener("wheel", stop)
		wheelCleanupRef.current = () => el.removeEventListener("wheel", stop)
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		onChange(e.target.value)
		setIsOpen(e.target.value.trim().length > 0)
	}

	function handleFocus() {
		setIsFocused(true)
	}

	function handleBlur() {
		setIsOpen(false)
		setIsFocused(false)
	}

	function handleSelect(item: T) {
		onSelect(item)
		setIsOpen(false)
	}

	function handleClear() {
		onClear?.()
		setIsOpen(false)
	}

	function handleRootClick(e: React.MouseEvent) {
		e.preventDefault()
	}

	return (
		<PopoverPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
			<PopoverPrimitive.Trigger asChild>
				<Root onClick={handleRootClick}>
					<StyledInputGroup onFocus={handleFocus}>
						<InputGroupAddon align="inline-start">
							{isLoading && isFocused ? <Spinner /> : <Search size={16} />}
						</InputGroupAddon>
						{selectedItem ? (
							<SelectedDisplay>
								{renderItem(selectedItem)}
								<X size={16} cursor="pointer" onMouseDown={handleClear} />
							</SelectedDisplay>
						) : (
							<>
								<InputGroupInput
									value={value}
									onChange={handleChange}
									onBlur={handleBlur}
									placeholder={placeholder}
								/>
								{onClear && value.length > 0 && (
									<InputGroupAddon align="inline-end">
										<X size={16} cursor="pointer" onMouseDown={handleClear} />
									</InputGroupAddon>
								)}
							</>
						)}
					</StyledInputGroup>
				</Root>
			</PopoverPrimitive.Trigger>
			{items.length > 0 && (
				<PopoverPrimitive.Portal>
					<DropdownContent
						ref={handleContentRef}
						align="start"
						sideOffset={4}
						onOpenAutoFocus={(e: Event) => e.preventDefault()}
						onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
					>
						{items.map((item) => (
							<DropdownItem
								key={getItemKey(item)}
								onMouseDown={() => handleSelect(item)}
							>
								{renderItem(item)}
							</DropdownItem>
						))}
					</DropdownContent>
				</PopoverPrimitive.Portal>
			)}
		</PopoverPrimitive.Root>
	)
}

const Root = styled.div`
  width: 100%;
`

const StyledInputGroup = styled(InputGroup)`
  background: var(--background);
`

const DropdownContent = styled(PopoverPrimitive.Content)`
  width: var(--radix-popover-trigger-width);
  background: var(--background);
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 4px 0;
  z-index: 1000;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  max-height: 240px;
  overflow-y: auto;
  overscroll-behavior: contain;
`

const SelectedDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  flex: 1;
  min-width: 0;
`

const DropdownItem = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  direction: rtl;

  &:hover {
    background: var(--link-bg-hover);
  }
`
