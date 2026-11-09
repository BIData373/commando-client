export const WORKSPACE_STATUS_EDITABLE_DISABLED =
	"כדי לשנות הרשאה זו, יש להפעיל הרשאת עדכון סטטוס בסביבה."

export const ASSIGNEE_STATUS_EDITABLE_DISABLED =
	"כדי לשנות הרשאה זו, יש להפעיל הרשאת עדכון סטטוס ל’אחראי’."

export function getUserStatusEditableDisabledReason(
	workspaceEnabled: boolean,
	assigneeEnabled: boolean,
): string | undefined {
	if (!workspaceEnabled) {
		return WORKSPACE_STATUS_EDITABLE_DISABLED
	}

	if (!assigneeEnabled) {
		return ASSIGNEE_STATUS_EDITABLE_DISABLED
	}

	return undefined
}
