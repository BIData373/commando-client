import styled from "@emotion/styled";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

const COMMAND_OPTIONS = [
	"פיקוד צפון",
	"פיקוד מרכז",
	"פיקוד דרום",
	"פיקוד העורף",
	"פיקוד העומק",
	"מטכ״ל",
] as const;

interface SelectCommandProps {
	command: string;
	onChange(value: string): void;
}

export function SelectCommand({ command, onChange }: SelectCommandProps) {
	return (
		<Select value={command} onValueChange={onChange}>
			<StyledSelectTrigger>
				<SelectValue placeholder="בחר פיקוד" />
			</StyledSelectTrigger>
			<StyledSelectContent position="popper" side="bottom">
				{COMMAND_OPTIONS.map((option) => (
					<StyledSelectItem key={option} value={option}>
						{option}
					</StyledSelectItem>
				))}
			</StyledSelectContent>
		</Select>
	);
}

const StyledSelectTrigger = styled(SelectTrigger)`
    width: 100%;
    flex-direction: row-reverse;
    background: var(--background);
`;

const StyledSelectContent = styled(SelectContent)`
  & [data-slot="select-scroll-up-button"],
  & [data-slot="select-scroll-down-button"] {
    display: none;
  }
`;

const StyledSelectItem = styled(SelectItem)`
    flex-direction: row-reverse;
`;
