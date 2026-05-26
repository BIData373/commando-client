import styled from "@emotion/styled";
import { ChevronDown } from "lucide-react";
import AssigneePicker from "../shared/AssigneePicker";
import AssigneeRowList from "../shared/AssigneeRow";

// ─── Types ───────────────────────────────────────────────────────────────────

interface AssigneeFieldProps {
	selectedAssignees: number[];
	directiveTitle: string;
	onToggle: (id: number) => void;
	onRemove: (id: number) => void;
	onDetailChange: (id: number, value: string) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

function AssigneeField({
	selectedAssignees,
	directiveTitle,
	onToggle,
	onRemove,
	onDetailChange,
}: AssigneeFieldProps) {
	return (
		<>
			<AssigneeSection>
				<FormLabelRow>
					<LabelText>אחראי</LabelText>
				</FormLabelRow>

				<AssigneePicker
					selectedAssignees={selectedAssignees}
					onToggle={onToggle}
					closeOnFirstSelect
					trigger={({ search, onSearchChange }) => (
						<SelectTriggerButton type="button">
							<SelectChevron size={12} />
							<SearchInput
								value={search}
								onChange={onSearchChange}
								placeholder="בחירה"
								dir="rtl"
							/>
						</SelectTriggerButton>
					)}
				/>

				{selectedAssignees.length === 0 ? (
					<EmptyAssigneesBox>
						<EmptyText>לא נבחרו אחראים. אנא בחר מהרשימה</EmptyText>
					</EmptyAssigneesBox>
				) : (
					<AssigneeRowList
						assigneeIds={selectedAssignees}
						directiveTitle={directiveTitle}
						showDetail={selectedAssignees.length > 1}
						detailPlaceholder="פירוט נוסף לאחראי"
						onDetailChange={onDetailChange}
						onRemove={onRemove}
					/>
				)}
			</AssigneeSection>

			{/* <CreateAssigneeDialog
        open={isCreateAssigneeOpen}
        onOpenChange={setIsCreateAssigneeOpen}
      /> */}
		</>
	);
}

export default AssigneeField;

// ─── Styled Components ──────────────────────────────────────────────────────

const AssigneeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
  width: 100%;
`;

const FormLabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  padding-block-end: 8px;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  white-space: nowrap;
`;

const LabelText = styled.span`
  color: rgba(0, 0, 0, 0.88);
`;

const SelectTriggerButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  padding-inline: 12px;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
  position: relative;

  &:hover {
    border-color: #4096ff;
  }
`;
const SelectChevron = styled(ChevronDown)`
  position: absolute;
  inset-inline-start: 12px;
  inset-block-start: 50%;
  transform: translateY(-50%);
  color: rgba(0, 0, 0, 0.25);
`;

const SearchInput = styled.input`
  flex: 1;
  font-size: 16px;
  font-weight: 400;
  line-height: 40px;
  text-align: right;
  color: rgba(0, 0, 0, 0.88);
  border: none;
  outline: none;
  background: transparent;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &::placeholder {
    color: rgba(0, 0, 0, 0.25);
  }
`;
const EmptyAssigneesBox = styled.div`
  width: 100%;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyText = styled.span`
  font-size: 16px;
  font-weight: 400;
  line-height: 40px;
  color: rgba(0, 0, 0, 0.25);
  text-align: center;
`;
