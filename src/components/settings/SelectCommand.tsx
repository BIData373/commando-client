import styled from "@emotion/styled"
import { useListPikuds } from "src/api/pikud/pikud"
import { TEST_IDS } from "src/consts/test-ids"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select"

// const COMMAND_OPTIONS = [
// 	"פיקוד צפון",
// 	"פיקוד מרכז",
// 	"פיקוד דרום",
// 	"פיקוד העורף",
// 	"פיקוד העומק",
// 	"מטכ״ל",
// ] as const

interface SelectCommandProps {
	value?: number
	onChange(value: number): void
	placeholder?: string
}

export function SelectCommand({
	value,
	onChange,
	placeholder,
}: SelectCommandProps) {
	const { data: pikuds } = useListPikuds()

	function handleChange(value: string) {
		onChange(Number(value))
	}

	return (
		<Select value={value ? String(value) : ""} onValueChange={handleChange}>
			<StyledSelectTrigger data-testid={TEST_IDS.shared.commandSelectTrigger}>
				<SelectValue placeholder={placeholder ?? "בחר פיקוד"} />
			</StyledSelectTrigger>
			<StyledSelectContent position="popper" side="bottom">
				{pikuds?.map(({ id, name }) => (
					<StyledSelectItem
						key={id}
						data-testid={TEST_IDS.shared.commandSelectOption}
						data-entity-id={id}
						value={String(id)}
					>
						{name}
					</StyledSelectItem>
				))}
			</StyledSelectContent>
		</Select>
	)
}

const StyledSelectTrigger = styled(SelectTrigger)`
    width: 100%;
    flex-direction: row-reverse;
    background: var(--background);
`

const StyledSelectContent = styled(SelectContent)`
  & [data-slot="select-scroll-up-button"],
  & [data-slot="select-scroll-down-button"] {
    display: none;
  }
`

const StyledSelectItem = styled(SelectItem)`
    flex-direction: row-reverse;
`
