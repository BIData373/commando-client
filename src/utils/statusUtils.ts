export enum DirectiveStatus {
	NOT_STARTED = "not_started",
	IN_PROGRESS = "in_progress",
	COMPLETED = "completed",
}

export const statusColors = {
	[DirectiveStatus.NOT_STARTED]: {
		fontColor: "var(--Colors-Base-Volcano-6)",
		bgColor: "var(--Colors-Base-Volcano-1)",
	},
	[DirectiveStatus.IN_PROGRESS]: {
		fontColor: "var(--Colors-Base-Geekblue-6)",
		bgColor: "var(--Colors-Base-Geekblue-1)",
	},
	[DirectiveStatus.COMPLETED]: {
		fontColor: "var(--Colors-Base-Green-6)",
		bgColor: "var(--Colors-Base-Green-1)",
	},
};
