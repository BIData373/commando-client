import styled from "@emotion/styled";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { QuickFilter } from "src/utils/filterUtils";
import type { DirectiveStatus } from "src/utils/statusUtils";

interface IViewInstruction {
	urlName: string;
	tabFilter?: QuickFilter;
	statusFilter?: DirectiveStatus;
}

export const ViewMoreInstructions = ({
	urlName,
	tabFilter,
	statusFilter,
}: IViewInstruction) => {
	const navigate = useNavigate();

	function handleViewMore() {
		navigate({
			to: "/workspace/$urlName/tasks",
			params: { urlName },
			search: { view: "TABLE", tabFilter, statusFilter },
		});
	}

	return (
		<ViewMoreButton onClick={handleViewMore}>
			צפה בעוד הנחיות
			<ChevronLeft size={16} />
		</ViewMoreButton>
	);
};

const ViewMoreButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 15px;
  font-size: 14px;
  color: var(--foreground);
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  align-self: flex-end;

  &:hover {
    background: var(--chip-bg);
  }
`;
