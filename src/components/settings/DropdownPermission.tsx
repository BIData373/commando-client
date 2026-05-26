import styled from "@emotion/styled";
import { ChevronDown } from "lucide-react";
import { UserRole } from "src/types";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const roleNames: Record<UserRole, string> = {
	[UserRole.ADMIN]: "ניהול",
	[UserRole.VIEWER]: "צפייה",
};

interface SelectDropdownPermissionProps {
	value: UserRole;
	ghost?: boolean;
	disabled?: boolean;
	onChange?(role: UserRole): void;
}

export function DropdownPermission({
	value,
	ghost,
	disabled,
	onChange,
}: SelectDropdownPermissionProps) {
	function onSelectPermission(value: string) {
		onChange?.(value as UserRole);
	}

	return (
		<DropdownMenu>
			<RoleTrigger $ghost={ghost} disabled={disabled} $enabled={!disabled}>
				{roleNames[value]}
				<ChevronDown size={16} />
			</RoleTrigger>
			<StyledDropdownMenuContent>
				{Object.entries(roleNames).map(([key, value]) => (
					<StyledDropdownMenuItem
						key={key}
						onSelect={() => onSelectPermission(key)}
					>
						{value}
					</StyledDropdownMenuItem>
				))}
			</StyledDropdownMenuContent>
		</DropdownMenu>
	);
}

const RoleTrigger = styled(DropdownMenuTrigger)<{
	$ghost?: boolean;
	$enabled: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 3px 16px;
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: 400;
  color: ${({ $enabled }) => ($enabled ? "rgba(0, 0, 0, 0.65);" : "rgba(0, 0, 0, 0.25);")};
  cursor: ${({ $enabled }) => ($enabled ? "pointer" : "default")};

   ${({ $ghost }) =>
			$ghost &&
			`
    border-radius: 6px;
    border: 1px solid var(--card-border);
    background: rgba(0, 0, 0, 0.04);
  `}

  ${({ $ghost }) =>
		!$ghost &&
		`
    &:hover {
        color: var(--button-color-hover)
    }
  `}
`

const StyledDropdownMenuContent = styled(DropdownMenuContent)`
    display: flex;
    min-width: 0;
    flex-direction: column;
    direction: rtl;
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
    border-radius: 6px;
`;

const StyledDropdownMenuItem = styled(DropdownMenuItem)`
    &:hover {
      color: #1677FF;
      background: #e2eeff;
    }
`;
