export enum DirectiveStatus {
	NOT_STARTED = "not_started",
	IN_PROGRESS = "in_progress",
	COMPLETED = "completed",
}

export const statusColors = {
	[DirectiveStatus.NOT_STARTED]: {
		fontColor: "var(--status-pending)",
		bgColor: "var(--status-pending-bg)",
	},
	[DirectiveStatus.IN_PROGRESS]: {
		fontColor: "var(--status-progress)",
		bgColor: "var(--status-progress-bg)",
	},
	[DirectiveStatus.COMPLETED]: {
		fontColor: "var(--status-done)",
		bgColor: "var(--status-done-bg)",
	},
};
