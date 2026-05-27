import type { AssigneeDto } from "src/api/model";
import { mockAssignees } from "src/mocks/data";

export const MOCK_ASSIGNEES: Record<number, AssigneeDto> = {
	1: mockAssignees[0],
	2: mockAssignees[1],
	3: mockAssignees[2],
	4: mockAssignees[3],
	5: mockAssignees[4],
	6: mockAssignees[5],
	7: mockAssignees[6],
};
