import styled from "@emotion/styled";
import { ChevronUp } from "lucide-react";
import AssigneeRowList from "../shared/AssigneeRow";

// ─── Types ──────────────────────────────────────────────────────────────────

interface AssigneeExpansionPanelProps {
	assigneeIds: number[];
	directiveTitle: string;
	assigneeDetails: Record<number, string>;
	onDetailChange: (assigneeId: number, value: string) => void;
	onRemoveAssignee: (assigneeId: number) => void;
	onCollapse: () => void;
}

// ─── Component ──────────────────────────────────────────────────────────────

function AssigneeExpansionPanel({
	assigneeIds,
	directiveTitle,
	assigneeDetails,
	onDetailChange,
	onRemoveAssignee,
	onCollapse,
}: AssigneeExpansionPanelProps) {
	return (
		<PanelContainer>
			<PanelHeader>
				<CollapseCell onClick={onCollapse}>
					<ChevronUp size={16} />
				</CollapseCell>
				<DetailHeaderCell>פירוט</DetailHeaderCell>
				<AssigneeHeaderCell>שם האחראי</AssigneeHeaderCell>
			</PanelHeader>

			<RowsWrapper>
				<AssigneeRowList
					assigneeIds={assigneeIds}
					directiveTitle={directiveTitle}
					assigneeDetails={assigneeDetails}
					onDetailChange={onDetailChange}
					onRemove={onRemoveAssignee}
				/>
			</RowsWrapper>
		</PanelContainer>
	);
}

export default AssigneeExpansionPanel;

// ─── Styled Components ──────────────────────────────────────────────────────

const PanelContainer = styled.div`
  direction: ltr;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding-block-end: 8px;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5px;
  padding: 0.5px;
`;

const CollapseCell = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 62px;
  height: 100%;
  padding: 12px;
  background: var(--colors-base-neutral-3);
  border: none;
  cursor: pointer;
  color: var(--text-color);
  flex-shrink: 0;

  &:hover {
    color: var(--text-color-2);
  }
`;

const DetailHeaderCell = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 4px 12px;
  background: var(--colors-base-neutral-3);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--text-color);
  white-space: nowrap;
`;

const AssigneeHeaderCell = styled.div`
  width: 218px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 4px 12px;
  padding-inline-end: 64px;
  background: var(--colors-base-neutral-3);
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  color: var(--text-color);
  white-space: nowrap;
  flex-shrink: 0;
`;

const RowsWrapper = styled.div`
  padding-inline: 24px;
`;
