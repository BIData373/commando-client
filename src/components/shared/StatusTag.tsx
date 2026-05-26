import styled from "@emotion/styled";
import { DirectiveStatus, statusColors } from "src/utils/statusUtils";

export const STATUS_LABELS: Record<DirectiveStatus, string> = {
	[DirectiveStatus.NOT_STARTED]: "טרם בוצע",
	[DirectiveStatus.IN_PROGRESS]: "בעבודה",
	[DirectiveStatus.COMPLETED]: "בוצע",
};

interface StatusTagProps {
	status: DirectiveStatus;
	interactive?: boolean;
}

export function StatusTag({ status, interactive }: StatusTagProps) {
	return (
		<Tag $status={status} $interactive={interactive}>
			{STATUS_LABELS[status]}
		</Tag>
	);
}

const Tag = styled.span<{ $status: DirectiveStatus; $interactive?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  padding: 1px 8px;
  border-radius: 999px;
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
  cursor: ${({ $interactive }) => ($interactive ? "pointer" : "default")};
  ${({ $status }) => {
		const { fontColor, bgColor } = statusColors[$status];
		return `
      background: ${bgColor};
      color: ${fontColor};
    `;
	}}

  :focus-visible {
    outline: none;
  }
`;
