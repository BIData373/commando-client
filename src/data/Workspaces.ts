export interface Workspace {
	urlName: string
	displayName: string
	description: string
	memberCount: number
}

export const PLACEHOLDER_WORKSPACES: Workspace[] = [
	{
		urlName: "alpha-unit",
		displayName: "יחידה אלפא",
		description: "ניהול משימות יחידת אלפא",
		memberCount: 12,
	},
	{
		urlName: "bravo-unit",
		displayName: "יחידה ברבו",
		description: "מטה ותיאום מבצעי",
		memberCount: 8,
	},
	{
		urlName: "charlie-unit",
		displayName: "יחידה צ'רלי",
		description: "לוגיסטיקה ותמיכה",
		memberCount: 15,
	},
	{
		urlName: "command-hq",
		displayName: "מפקדה",
		description: "מטה פיקוד עליון",
		memberCount: 5,
	},
]
