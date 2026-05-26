export interface DiscussionSource {
	id: number
	name: string
	date: string
	tags: string[]
	hasAttachment: boolean
}

export const MOCK_DISCUSSIONS: DiscussionSource[] = [
	{
		id: 1,
		name: "חרבות ברזל",
		date: "14/02/2025",
		tags: ["ביטחון"],
		hasAttachment: false,
	},
	{
		id: 2,
		name: "חרבות ברזל",
		date: "22/02/2025",
		tags: ["ביטחון", "מבצעים"],
		hasAttachment: true,
	},
	{
		id: 3,
		name: 'חתמ"צ חודשי',
		date: "22/02/2025",
		tags: ["אימון"],
		hasAttachment: false,
	},
	{
		id: 4,
		name: 'קפ"ק 1- שגאת הארי',
		date: "22/03/2026",
		tags: ["דיווח", "שבועי"],
		hasAttachment: false,
	},
	{
		id: 5,
		name: 'קפ"ק 2 - מרכבות גדעון',
		date: "28/03/2025",
		tags: ["לוגיסטיקה"],
		hasAttachment: false,
	},
]
