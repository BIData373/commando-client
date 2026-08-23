import { type IMesibaIcon, useSearchMesibaIcons } from "src/hooks/useMesiba"
import { MesibaIcon } from "./MesibaIcon"
import { SearchDropdown } from "./SearchDropdown"

interface IconDropdownProps {
	value: string
	onSelect(icon: IMesibaIcon): void
	onChange(value: string): void
	onClear(): void
	selectedItem?: IMesibaIcon
	placeholder?: string
}

export function IconDropdown({
	value,
	onSelect,
	onChange,
	onClear,
	selectedItem,
	placeholder,
}: IconDropdownProps) {
	const { data: icons = [], isFetching } = useSearchMesibaIcons(value)

	return (
		<SearchDropdown<IMesibaIcon>
			items={icons}
			value={value}
			onChange={onChange}
			onSelect={onSelect}
			onClear={onClear}
			isLoading={isFetching}
			placeholder={placeholder ?? "חפש סמל"}
			selectedItem={selectedItem}
			renderItem={(item) => <MesibaIcon icon={item} />}
			getItemKey={({ id }) => id}
		/>
	)
}
